import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Challenges from './pages/Challenges';
import Leaderboard from './pages/Leaderboard';
import MyProfile from './pages/MyProfile';
import CreateChallenge from './pages/CreateChallenge';
import EditChallenge from './pages/EditChallenge';

import './pages/Auth.css';
import './pages/Challenges.css';
import './pages/Leaderboard.css';
import './pages/MyProfile.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/create-challenge" element={<CreateChallenge />} />
            <Route path="/edit-challenge/:challengeId" element={<EditChallenge />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
