import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './Auth.css';

function CreateChallenge() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(10);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      setError("Du måste vara inloggad för att skapa en utmaning.");
      return;
    }

    if (!title.trim() || !description.trim() || !points || points <= 0) {
      setError("Alla fält måste fyllas i och poäng måste vara ett positivt tal.");
      return;
    }

    try {
      await addDoc(collection(db, "challenges"), {
        title,
        description,
        points: Number(points),
        createdBy: currentUser.uid,
      });
      navigate("/challenges");
    } catch (err) {
      console.error("Error adding document: ", err);
      setError("Kunde inte spara utmaningen. Försök igen.");
    }
  };

  return (
    <div className="auth-container">
        <div className="auth-form-wrapper">
            <h1>Skapa Ny Utmaning</h1>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="title">Titel</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Beskrivning</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="points">Poäng</label>
                    <input
                        type="number"
                        id="points"
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        required
                        min="1"
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn btn-primary btn-block" disabled={!currentUser}>
                Skapa Utmaning
                </button>
            </form>
        </div>
    </div>
  );
}

export default CreateChallenge;
