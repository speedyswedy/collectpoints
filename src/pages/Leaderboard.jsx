import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import './Leaderboard.css';

const BallIcon = ({ className }) => (
    <svg className={`ball-icon ${className}`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm.38,16.55,0,0-.76,0v-4.3l-3.35-1.9a.33.33,0,0,1-.17-.28V8.33a.34.34,0,0,1,.17-.29L11.62,6.1l.38-.22.38.22,3.35,1.94a.34.34,0,0,1,.17.29v3.74a.33.33,0,0,1-.17.28l-3.35,1.9Zm-2.21-6.1,1.83,1.06,1.83-1.06V9.71L12.38,8.65,10.55,9.71Z"/>
    </svg>
);

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      try {
        const playersCollection = collection(db, 'players');
        const q = query(playersCollection, orderBy('points', 'desc'));
        const playersSnapshot = await getDocs(q);
        const playersList = playersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlayers(playersList);
      } catch (error) {
        console.error("Kunde inte ladda topplistan: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const getRankContent = (index) => {
    if (index === 0) return <BallIcon className="gold" />;
    if (index === 1) return <BallIcon className="silver" />;
    if (index === 2) return <BallIcon className="bronze" />;
    return <span className="rank-number">{index + 1}</span>;
  };

  if (isLoading) {
    return <div className="page-container"><p>Laddar poängtavla...</p></div>;
  }

  return (
    <div className="page-container">
      <h1>Poängtavla</h1>
      <div className="leaderboard-container">
        {players.length > 0 ? (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="rank">Rank</th>
                <th>Spelare</th>
                <th className="points">Poäng</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={player.id}>
                  <td className="rank">{getRankContent(index)}</td>
                  <td className="player-name">{player.name}</td>
                  <td className="points">{player.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-leaderboard">
            <p>Poängtavlan är tom för tillfället.</p>
            <p>Slutför utmaningar för att börja samla poäng!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
