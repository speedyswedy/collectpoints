import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-text">
          <h1>Välkommen till <br/><span>JuleChallenge 2024</span></h1>
          <p>
            Anta roliga utmaningar, samla poäng och tävla mot dina lagkamrater i Mossens BK F10/F11. 
            Logga in eller registrera dig för att börja!
          </p>
          <div className="hero-buttons">
            {!currentUser ? (
              <>
                <Link to="/login" className="btn btn-primary">Logga In</Link>
                <Link to="/register" className="btn btn-secondary">Registrera</Link>
              </>
            ) : (
              <Link to="/challenges" className="btn btn-primary">Se Utmaningar</Link>
            )}
          </div>
        </div>
        <div className="hero-image-container">
            <img src="https://assets.app.veo.co/crests/mossens-bk/mossen.jpg" alt="Mossen BK Logo" className="hero-image" />
        </div>
      </div>
    </div>
  );
};

export default Home;
