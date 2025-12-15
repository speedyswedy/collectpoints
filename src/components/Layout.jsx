import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
    setIsMenuOpen(false); // Close menu on logout
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  }

  return (
    <div className="layout">
      <header className="app-header">
        <div className="logo-container">
          <NavLink to="/" onClick={closeMenu}>
            <img src="https://assets.app.veo.co/crests/mossens-bk/mossen.jpg" alt="Mossen BK Logo" className="logo" />
          </NavLink>
          <span className="logo-text">Mossen F10/F11 JuleChallenge</span>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="material-icons">{isMenuOpen ? 'close' : 'menu'}</span>
        </button>

        <nav className={`main-nav ${isMenuOpen ? 'is-open' : ''}`}>
          <NavLink to="/" onClick={closeMenu}>Hem</NavLink>
          <NavLink to="/challenges" onClick={closeMenu}>Utmaningar</NavLink>
          <NavLink to="/leaderboard" onClick={closeMenu}>Poängtavla</NavLink>
          {userRole === 'admin' && (
            <NavLink to="/create-challenge" onClick={closeMenu}>Skapa Utmaning</NavLink>
          )}
           <div className="user-actions-mobile">
              {currentUser ? (
                <>
                  <NavLink to="/my-profile" onClick={closeMenu}>Min Profil</NavLink>
                  <button onClick={handleLogout} className="btn btn-secondary">Logga Ut</button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="btn btn-secondary" onClick={closeMenu}>Logga In</NavLink>
                  <NavLink to="/register" className="btn btn-primary" onClick={closeMenu}>Registrera</NavLink>
                </>
              )}
          </div>
        </nav>

        <div className="user-actions-desktop">
          {currentUser ? (
            <>
              <NavLink to="/my-profile" className="user-link">Min Profil</NavLink>
              <button onClick={handleLogout} className="btn btn-secondary">Logga Ut</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-secondary">Logga In</NavLink>
              <NavLink to="/register" className="btn btn-primary">Registrera</NavLink>
            </>
          )}
        </div>
      </header>
      <main className="main-content">{children}</main>
       <footer className="app-footer">
        <p>&copy; 2024 Mossen BK F10/F11. Alla rättigheter förbehållna.</p>
      </footer>
    </div>
  );
};

export default Layout;
