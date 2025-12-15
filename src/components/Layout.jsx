import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Layout = ({ children }) => {
  const [playerId, setPlayerId] = useState(null);

  useEffect(() => {
    // Funktion för att uppdatera state från localStorage
    const updatePlayerId = () => {
      const storedPlayerId = localStorage.getItem('playerId');
      setPlayerId(storedPlayerId);
    };

    updatePlayerId(); // Kör direkt vid montering

    // Lyssna på custom event när playerId ändras (t.ex. vid registrering/utloggning)
    window.addEventListener('playerIdChanged', updatePlayerId);

    // Lyssna på storage event för synkning mellan flikar
    window.addEventListener('storage', updatePlayerId);

    return () => {
      window.removeEventListener('playerIdChanged', updatePlayerId);
      window.removeEventListener('storage', updatePlayerId);
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
              <li>
                <NavLink to="/my-profile">Min Sida</NavLink>
              </li>
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
