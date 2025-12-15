import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      const playersCollection = collection(db, 'players');
      const q = query(playersCollection, orderBy('points', 'desc'));
      const playersSnapshot = await getDocs(q);
      const playersList = playersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlayers(playersList);
      setIsLoading(false);
    };

    fetchPlayers();
  }, []);

  if (isLoading) {
    return <p>Laddar poängtavla...</p>;
  }

  return (
    <div>
      <h1>Poängtavla</h1>
      <ol>
        {players.map((player, index) => (
          <li key={player.id}>
            <span>{index + 1}. {player.name}</span>
            <span> - {player.points} poäng</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
