import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Register from './pages/Register';
import Challenges from './pages/Challenges';
import Leaderboard from './pages/Leaderboard';
import MyProfile from './pages/MyProfile'; // Importera MyProfile

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/my-profile" element={<MyProfile />} /> {/* Lägg till route för MyProfile */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
