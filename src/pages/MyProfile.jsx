import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";

const MyProfile = () => {
  const [player, setPlayer] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [playerId, setPlayerId] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      const storedPlayerId = localStorage.getItem('playerId');
      if (storedPlayerId) {
        setPlayerId(storedPlayerId);
        const playerDocRef = doc(db, 'players', storedPlayerId);
        const playerDocSnap = await getDoc(playerDocRef);
        if (playerDocSnap.exists()) {
          const playerData = playerDocSnap.data();
          setPlayer(playerData);
          setName(playerData.name);
          setEmail(playerData.email);
          setRole(playerData.role);
        } else {
          setError('Kunde inte hitta din spelarprofil.');
        }
      } else {
        setError('Du verkar inte vara registrerad. Gå till Registrera-sidan för att skapa en profil.');
      }
      setIsLoading(false);
    };

    fetchPlayerData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!name || !email) {
      setError('Namn och e-post får inte vara tomma.');
      setIsLoading(false);
      return;
    }

    try {
      const playerDocRef = doc(db, 'players', playerId);
      await updateDoc(playerDocRef, {
        name: name,
        email: email
      });
      setSuccess('Din profil har uppdaterats!');
    } catch (e) {
      console.error("Error updating document: ", e);
      setError('Kunde inte uppdatera profilen. Försök igen senare.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p>Laddar din profil...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h1>Min Profil</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Namn:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">E-post:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Roll:</label>
          <input
            type="text"
            id="role"
            value={role}
            disabled
          />
        </div>
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sparar...' : 'Spara ändringar'}
        </button>
      </form>
    </div>
  );
};

export default MyProfile;
