import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from "firebase/firestore";

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [playerId, setPlayerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallengesAndPlayerData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Hämta utmaningar
        const challengesCollection = collection(db, 'challenges');
        const challengesSnapshot = await getDocs(challengesCollection);
        const challengesList = challengesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChallenges(challengesList);

        // Hämta spelardata
        const storedPlayerId = localStorage.getItem('playerId');
        if (storedPlayerId) {
          setPlayerId(storedPlayerId);
          const playerDocRef = doc(db, 'players', storedPlayerId);
          const playerDocSnap = await getDoc(playerDocRef);
          if (playerDocSnap.exists()) {
            setCompletedChallenges(playerDocSnap.data().completedChallenges || []);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Kunde inte ladda utmaningarna. Kontrollera din anslutning och försök igen.');
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchChallengesAndPlayerData();
  }, []);

  const handleCompleteChallenge = async (challenge) => {
    if (!playerId) {
      setError('Du måste registrera dig för att kunna slutföra utmaningar!');
      return;
    }

    // Optimistisk uppdatering av UI
    const isCompleted = completedChallenges.includes(challenge.id);
    const newCompletedChallenges = isCompleted
      ? completedChallenges.filter(id => id !== challenge.id)
      : [...completedChallenges, challenge.id];
    setCompletedChallenges(newCompletedChallenges);

    try {
      const playerDocRef = doc(db, 'players', playerId);
      if (isCompleted) {
        // Ångra slutförd utmaning
        await updateDoc(playerDocRef, {
          completedChallenges: arrayRemove(challenge.id),
          points: increment(-challenge.points)
        });
      } else {
        // Slutför utmaning
        await updateDoc(playerDocRef, {
          completedChallenges: arrayUnion(challenge.id),
          points: increment(challenge.points)
        });
      }
    } catch (err) {
      console.error(err);
      setError('Kunde inte uppdatera din framgång. Försök igen.');
      // Återställ UI vid fel
      setCompletedChallenges(completedChallenges);
    }
  };

  if (isLoading) {
    return <p>Laddar utmaningar...</p>;
  }

  return (
    <div>
      <h1>Utmaningar</h1>
      {!playerId && <p><strong>Obs:</strong> Du måste <a href="/register">registrera dig</a> för att kunna spara dina framsteg.</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {challenges.map(challenge => (
          <li key={challenge.id}>
            <h3>{challenge.title} ({challenge.points} poäng)</h3>
            <p>{challenge.description}</p>
            <button onClick={() => handleCompleteChallenge(challenge)} disabled={!playerId}>
              {completedChallenges.includes(challenge.id) ? 'Ångra' : 'Slutför'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Challenges;
