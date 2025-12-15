import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Register from './pages/Register';
import Challenges from './pages/Challenges';
import Leaderboard from './pages/Leaderboard';
import MyProfile from './pages/MyProfile';
import CreateChallenge from './pages/CreateChallenge'; // Importera CreateChallenge

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/create-challenge" element={<CreateChallenge />} /> {/* Lägg till route för CreateChallenge */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
