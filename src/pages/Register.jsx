import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import './Auth.css';

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "players", user.uid), {
        uid: user.uid,
        name,
        email,
        points: 0,
        completedChallenges: [],
        role: "player",
      });

      navigate("/");
    } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
            setError("E-postadressen används redan.");
        } else if (err.code === 'auth/weak-password') {
            setError("Lösenordet måste vara minst 6 tecken långt.");
        } else {
            setError("Kunde inte registrera. Försök igen.");
        }
        console.error(err);
    }
  };

  return (
    <div className="auth-container">
        <div className="auth-form-wrapper">
            <h1>Registrera dig</h1>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                <label htmlFor="name">Namn</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                </div>
                <div className="form-group">
                <label htmlFor="email">E-post</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div>
                <div className="form-group">
                <label htmlFor="password">Lösenord</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn btn-primary btn-block">Registrera</button>
            </form>
             <p className="auth-switch-text">
                Har du redan ett konto? <Link to="/login">Logga in</Link>
            </p>
        </div>
    </div>
  );
}

export default Register;
