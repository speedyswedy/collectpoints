import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Layout = ({ children }) => {
  const [playerId, setPlayerId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const updatePlayerIdAndRole = async () => {
      const storedPlayerId = localStorage.getItem('playerId');
      setPlayerId(storedPlayerId);

      if (storedPlayerId) {
        const docRef = doc(db, 'players', storedPlayerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
        } else {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };

    updatePlayerIdAndRole();

    window.addEventListener('playerIdChanged', updatePlayerIdAndRole);
    window.addEventListener('storage', updatePlayerIdAndRole);

    return () => {
      window.removeEventListener('playerIdChanged', updatePlayerIdAndRole);
      window.removeEventListener('storage', updatePlayerIdAndRole);
    };
  }, []);

  return (
    <div>
      <header>
        <h1>Mossen F10/F11 JuleChallenge</h1>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Hem</NavLink>
            </li>
            {!playerId && (
              <li>
                <NavLink to="/register">Registrera</NavLink>
              </li>
            )}
            <li>
              <NavLink to="/challenges">Utmaningar</NavLink>
            </li>
            <li>
              <NavLink to="/leaderboard">Poängtavla</NavLink>
            </li>
            {playerId && (
              <>
                <li>
                  <NavLink to="/my-profile">Min Sida</NavLink>
                </li>
                {userRole === 'admin' && (
                  <li>
                    <NavLink to="/create-challenge">Skapa Utmaning</NavLink>
                  </li>
                )}
              </>
            )}
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>Skapad för Mossens BK F10/F11</p>
      </footer>
    </div>
  );
};

export default Layout;