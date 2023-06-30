import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import UserContext from './UserContext';
import axios from 'axios';
import './UserProfile.css';
import CharacterList from './CharacterList';
import CharacterCard from './CharacterCard';
import CharacterForm from './CharacterForm';

function UserProfile() {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser, setToken, userCharacters } = useContext(UserContext);
  //const [characters, setCharacters] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // const setUserCharacters = (characters) => {
  //   setCharacters(characters);
  // };

  // useEffect(() => {
  //   const fetchCharacters = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:5000/characters', {  
  //         headers: {
  //           'x-access-tokens': localStorage.getItem('token'),
  //         },
  //       });
  //       //setCharacters(response.data);
  //     } catch (error) {
  //       if (error.response && error.response.status === 401) {
  //         handleLogout();  // If the token is expired or invalid, logout
  //       } else {
  //         setErrorMessage('There was an issue fetching your characters.');
  //       }
  //     }
  //   };

  //   fetchCharacters();
  // }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    navigate('/');
  };

  return (
    <UserContext.Provider value={{  }}>
      <div className="userProfileContainer">
        {errorMessage && <p>{errorMessage}</p>}
        <button className="logoutButton" onClick={handleLogout}>Logout</button>
        <Routes>
          <Route path="/" element={
            userCharacters.length > 0 ? (
              <CharacterList userCharacters={userCharacters} />
            ) : (
              <p>You have no characters. Create one?</p>
            )
          }/>
          <Route path="character/new" element={<CharacterForm />} />
          <Route path="character/:id" element={<CharacterCard />} />
        </Routes>
      </div>
    </UserContext.Provider>
  );
}

export default UserProfile;


