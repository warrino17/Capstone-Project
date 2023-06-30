import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import SharedCharacters from './SharedCharacters';
import CharacterForm from './CharacterForm';
import UserProfile from './UserProfile';
import UserContext from './UserContext';
import axios from 'axios'
import CharacterList from './CharacterList';
import CharacterCard from './CharacterCard';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userCharacters, setUserCharacters] = useState([])
  

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

  
  

  const handleLogin = async (user, token) => {
  // Save user and token in localStorage and state
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  setUser(user);
  setToken(token);
  setIsLoggedIn(true);

  // Fetch characters from server
  try {
    const response = await axios.get(`http://localhost:5000/characters`, {
      headers: {
        'x-access-tokens': token,
      },
    });


    if (response.data && Array.isArray(response.data)) {
      setUserCharacters(response.data);
      
    } else {
      console.error('Received invalid response from server when fetching characters:', response);
    }
  } catch (error) {
    console.error('There was an error fetching the characters:', error);
  }
};

  useEffect(() => {
}, [userCharacters]);




    const handleLogout = () => {
      setIsLoggedIn(false);
      setUserCharacters([]); // Clean up user characters
    };
    

  return (
    <Router>
      <UserContext.Provider value={{ token, setToken, user, setUser, handleLogin, handleLogout, isLoggedIn, setIsLoggedIn, userCharacters, setUserCharacters }}>
        <Navbar isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/library/*" element={<SharedCharacters />} />
          <Route path="/create" element={<CharacterForm />} />
          <Route path="/profile/*" element={<UserProfile />} />
          {/* <Route path="/" element={<CharacterList />} /> */}
          <Route path="/characters/:characterId" element={<CharacterCard />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;





