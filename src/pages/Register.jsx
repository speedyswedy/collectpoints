import React, { useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc } from "firebase/firestore";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registeredPlayer, setRegisteredPlayer] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!name || !email) {
      setError('Namn och e-post är obligatoriska.');
      setIsLoading(false);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "players"), {
        name: name,
        email: email,
        points: 0,
        completedChallenges: [],
        role: 'player' // Automatically assign player role
      });

      // Spara ID i localStorage
      localStorage.setItem('playerId', docRef.id);
      // Skicka händelse för att meddela Layout-komponenten
      window.dispatchEvent(new Event('playerIdChanged'));

      setRegisteredPlayer({ id: docRef.id, name });
      setName('');
      setEmail('');

    } catch (e) {
      console.error("Error adding document: ", e);
      setError('Kunde inte registrera spelaren. Försök igen senare.');
    } finally {
      setIsLoading(false);
    }
  };

  if (registeredPlayer) {
    return (
      <div>
        <h1>Registrering lyckades!</h1>
        <p>Välkommen, {registeredPlayer.name}!</p>
        <p>Ditt unika ID är: <strong>{registeredPlayer.id}</strong></p>
        <p>Appen kommer ihåg dig i den här webbläsaren. Om du byter enhet eller rensar webbläsardata behöver du ange ditt ID manuellt (den funktionen kommer snart).</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Registrera dig</h1>
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registrerar...' : 'Registrera'}
        </button>
      </form>
    </div>
  );
};

export default Register;
