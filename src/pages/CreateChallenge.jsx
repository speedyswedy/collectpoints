import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function CreateChallenge() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title || !description || points <= 0) {
      setError("Alla fält måste fyllas i och poängen måste vara större än 0.");
      return;
    }

    try {
      await addDoc(collection(db, "challenges"), {
        title,
        description,
        points: Number(points),
      });
      navigate("/challenges");
    } catch (err) {
      console.error("Error adding document: ", err);
      setError("Kunde inte spara utmaningen. Försök igen.");
    }
  };

  return (
    <div className="container">
      <h2>Skapa Ny Utmaning</h2>
      <form onSubmit={handleSubmit} className="card">
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
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="button">
          Spara Utmaning
        </button>
      </form>
    </div>
  );
}

export default CreateChallenge;
