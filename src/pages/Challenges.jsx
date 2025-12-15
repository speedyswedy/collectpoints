import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { collection, query, orderBy, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment, deleteDoc } from "firebase/firestore";
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import './Challenges.css';

const Tabs = ({ activeTab, setActiveTab, counts }) => (
  <div className="tabs-container">
    <button 
      className={`tab-btn ${activeTab === 'remaining' ? 'active' : ''}`}
      onClick={() => setActiveTab('remaining')}
    >
      Utmaningar Kvar ({counts.remaining})
    </button>
    <button 
      className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
      onClick={() => setActiveTab('completed')}
    >
      Slutförda ({counts.completed})
    </button>
  </div>
);

const ChallengeList = ({ challenges, completedChallenges, onComplete, onEdit, onDelete, userRole, currentUser }) => (
    <ul className="challenge-list">
        {challenges.map(challenge => (
          <li key={challenge.id} className="challenge-item">
            <div className="challenge-header">
                <h3>{challenge.title}</h3>
                <span className="challenge-points">{challenge.points} poäng</span>
            </div>
            <p>{challenge.description}</p>
            <div className="challenge-actions">
              {currentUser && (
                <button 
                    onClick={() => onComplete(challenge)} 
                    className={`btn ${completedChallenges.includes(challenge.id) ? 'btn-secondary' : 'btn-primary'}`}
                >
                    {completedChallenges.includes(challenge.id) ? 'Ångra' : 'Slutför'}
                </button>
              )}
              {userRole === 'admin' && (
                <>
                  <button onClick={() => onEdit(challenge.id)} className="btn">Redigera</button>
                  <button onClick={() => onDelete(challenge.id)} className="btn btn-danger">Ta bort</button>
                </>
              )}
            </div>
          </li>
        ))}
    </ul>
);

const Challenges = () => {
  const { currentUser, userRole } = useAuth();
  const [allChallenges, setAllChallenges] = useState([]);
  const [playerCompletedIds, setPlayerCompletedIds] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('remaining'); // 'remaining' or 'completed'

  const fetchChallengesAndPlayerData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const challengesQuery = query(collection(db, 'challenges'), orderBy('title'));
      const challengesSnapshot = await getDocs(challengesQuery);
      const challengesList = challengesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllChallenges(challengesList);

      if (currentUser) {
        const playerDocRef = doc(db, 'players', currentUser.uid);
        const playerDocSnap = await getDoc(playerDocRef);
        if (playerDocSnap.exists()) {
          setPlayerCompletedIds(playerDocSnap.data().completedChallenges || []);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Kunde inte ladda utmaningarna. Kontrollera din anslutning och försök igen.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchChallengesAndPlayerData();
  }, [fetchChallengesAndPlayerData]);

  const handleCompleteChallenge = async (challenge) => {
    if (!currentUser) {
      setError('Du måste logga in för att kunna slutföra utmaningar!');
      return;
    }

    const isCompleted = playerCompletedIds.includes(challenge.id);
    const newCompletedIds = isCompleted
      ? playerCompletedIds.filter(id => id !== challenge.id)
      : [...playerCompletedIds, challenge.id];
    setPlayerCompletedIds(newCompletedIds);

    try {
      const playerDocRef = doc(db, 'players', currentUser.uid);
      await updateDoc(playerDocRef, {
        completedChallenges: isCompleted ? arrayRemove(challenge.id) : arrayUnion(challenge.id),
        points: isCompleted ? increment(-challenge.points) : increment(challenge.points)
      });
    } catch (err) {
      console.error(err);
      setError('Kunde inte uppdatera din framgång. Försök igen.');
      setPlayerCompletedIds(playerCompletedIds); // Revert optimistic update
    }
  };

  const handleDeleteClick = (challengeId) => {
    setChallengeToDelete(challengeId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (challengeToDelete) {
      try {
        await deleteDoc(doc(db, 'challenges', challengeToDelete));
        setAllChallenges(prev => prev.filter(c => c.id !== challengeToDelete));
      } catch (error) {
        console.error("Fel vid borttagning av utmaning: ", error);
        setError('Det gick inte att ta bort utmaningen. Försök igen.');
      } finally {
        setIsModalOpen(false);
        setChallengeToDelete(null);
      }
    }
  };

  const remainingChallenges = currentUser ? allChallenges.filter(c => !playerCompletedIds.includes(c.id)) : allChallenges;
  const completedChallenges = allChallenges.filter(c => playerCompletedIds.includes(c.id));

  if (isLoading) {
    return <div className="page-container"><p>Laddar utmaningar...</p></div>;
  }

  return (
    <div className="page-container">
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Bekräfta borttagning"
      >
        Är du säker på att du vill ta bort den här utmaningen? Detta kan inte ångras.
      </ConfirmModal>

      <h1>Utmaningar</h1>
      {!currentUser && <p className="text-center"><strong>Obs:</strong> Du måste <Link to="/login">logga in</Link> för att kunna spara dina framsteg.</p>}
      {error && <p className="error-message">{error}</p>}

      {currentUser && (
          <Tabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            counts={{ remaining: remainingChallenges.length, completed: completedChallenges.length }}
          />
      )}

      { (activeTab === 'remaining' || !currentUser) && (
         remainingChallenges.length > 0 ? (
            <ChallengeList 
                challenges={remainingChallenges}
                completedChallenges={playerCompletedIds}
                onComplete={handleCompleteChallenge}
                onEdit={(id) => navigate(`/edit-challenge/${id}`)}
                onDelete={handleDeleteClick}
                userRole={userRole}
                currentUser={currentUser}
            />
        ) : (
            <div className="text-center empty-state-container">
                <h3>Grymt jobbat!</h3>
                <p>Du har slutfört alla tillgängliga utmaningar. Håll utkik efter nya!</p>
            </div>
        )
      )}

      { activeTab === 'completed' && currentUser && (
        completedChallenges.length > 0 ? (
            <ChallengeList 
                challenges={completedChallenges}
                completedChallenges={playerCompletedIds}
                onComplete={handleCompleteChallenge}
                onEdit={(id) => navigate(`/edit-challenge/${id}`)}
                onDelete={handleDeleteClick}
                userRole={userRole}
                currentUser={currentUser}
            />
        ) : (
            <div className="text-center empty-state-container">
                <p>Du har inte slutfört några utmaningar än. Kämpa på!</p>
            </div>
        )
      )}

    </div>
  );
};

export default Challenges;
