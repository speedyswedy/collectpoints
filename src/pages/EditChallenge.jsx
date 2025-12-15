import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../firebase/firebase';
import './Auth.css';

const EditChallenge = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState({ title: '', description: '', points: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const docRef = doc(db, 'challenges', challengeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setChallenge({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Kunde inte hitta utmaningen.');
        }
      } catch (err) {
        setError('Något gick fel vid hämtning av utmaningen.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenge();
  }, [challengeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChallenge(prev => ({ ...prev, [name]: name === 'points' ? Number(value) : value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'challenges', challenge.id);
      await updateDoc(docRef, {
        title: challenge.title,
        description: challenge.description,
        points: challenge.points
      });
      navigate('/challenges');
    } catch (err) {
      setError('Kunde inte uppdatera utmaningen.');
      console.error(err);
    }
  };

  if (isLoading) return <div className="page-container"><p>Laddar...</p></div>;
  
  return (
    <div className="auth-container">
        <div className="auth-form-wrapper">
            <h1>Redigera Utmaning</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleUpdate} className="auth-form">
                <div className="form-group">
                    <label htmlFor="title">Titel:</label>
                    <input 
                        type="text" 
                        id="title"
                        name="title" 
                        value={challenge.title} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Beskrivning:</label>
                    <textarea 
                        id="description"
                        name="description" 
                        value={challenge.description} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="points">Poäng:</label>
                    <input 
                        type="number" 
                        id="points"
                        name="points" 
                        value={challenge.points} 
                        onChange={handleChange} 
                        min="1"
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Spara Ändringar</button>
            </form>
        </div>
    </div>
  );
};

export default EditChallenge;
