import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import './MyProfile.css';

const MyProfile = () => {
  const { currentUser } = useAuth();
  const [player, setPlayer] = useState(null);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [playerDocRef, setPlayerDocRef] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (currentUser) {
        try {
          const playerDocRef = doc(db, "players", currentUser.uid);
          setPlayerDocRef(playerDocRef);
          const docSnap = await getDoc(playerDocRef);
          if (docSnap.exists()) {
            const playerData = docSnap.data();
            setPlayer(playerData);
            setName(playerData.name);
          } else {
            setError('Kunde inte hitta din spelarprofil.');
          }
        } catch (err) {
          console.error(err);
          setError('Något gick fel vid hämtning av din profil.');
        }
      } else {
        setError('Du verkar inte vara inloggad.');
      }
      setIsLoading(false);
    };

    fetchPlayerData();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Namn får inte vara tomt.');
      setIsLoading(false);
      return;
    }

    if (!playerDocRef) {
        setError('Kunde inte hitta din spelarprofil.');
        setIsLoading(false);
        return;
    }

    try {
      await updateDoc(playerDocRef, { name });
      setSuccess('Din profil har uppdaterats!');
      // Update player state to reflect name change immediately
      setPlayer(prev => ({...prev, name}));
    } catch (e) {
      console.error("Error updating document: ", e);
      setError('Kunde inte uppdatera profilen. Försök igen senare.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !player) {
    return <div className="page-container"><p>Laddar din profil...</p></div>;
  }

  if (error) {
    return <div className="page-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="page-container">
      <h1>Min Profil</h1>
      <div className="profile-grid">
        <div className="profile-info-card">
            <h3>Profilinformation</h3>
            {player && (
                <div className="profile-info">
                    <div className="info-item"><strong>Poäng:</strong> <span>{player.points}</span></div>
                    <div className="info-item"><strong>Roll:</strong> <span>{player.role}</span></div>
                    <div className="info-item"><strong>Email:</strong> <span>{player.email}</span></div>
                </div>
            )}
        </div>
        <div className="profile-edit-card">
            <h3>Redigera Profil</h3>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                <label htmlFor="name">Namn:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                </div>
                {success && <p className="success-message">{success}</p>}
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn btn-primary btn-block" disabled={isLoading || !currentUser}>
                {isLoading ? 'Sparar...' : 'Spara ändringar'}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
