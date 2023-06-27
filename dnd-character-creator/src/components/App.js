import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './Navbar';
import Home from './Home';
import UserAuthentication from './UserAuthentication';
import UserProfile from './UserProfile';
import CharacterCreator from './CharacterCreator';
import SharedCharacters from './SharedCharacters';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/*" element={<UserAuthentication />} />
        <Route path="/profile/*" element={<UserProfile />} />
        <Route path="/create-character" element={<CharacterCreator />} />
        <Route path="/shared-characters/*" element={<SharedCharacters />} />
      </Routes>
    </Router>
  );
}

export default App;

