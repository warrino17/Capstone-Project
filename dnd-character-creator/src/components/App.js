import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import SharedCharacters from './SharedCharacters';
import CharacterCreator from './CharacterCreator';
import UserProfile from './UserProfile';
import UserContext from './UserContext';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userJSON = localStorage.getItem('user');
    const token = localStorage.getItem('token');
  
    if (userJSON && userJSON !== "undefined" && token) {
      const user = JSON.parse(userJSON);
      setToken(token);
      setUser(user);
      setIsLoggedIn(true);
    }
  }, []);
  
  

  const handleLogin = (user, token) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <UserContext.Provider value={{ token, setToken, user, setUser, isLoggedIn, handleLogin, handleLogout }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/library" element={<SharedCharacters />} />
          <Route path="/create" element={<CharacterCreator />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;





