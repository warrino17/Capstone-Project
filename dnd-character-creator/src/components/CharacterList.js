import React, { useContext } from 'react';
import UserContext from './UserContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CharacterList.css';

function CharacterList({ userCharacters }) {
  const { user, setUserCharacters } = useContext(UserContext);
  const handleDelete = async (characterId) => {
    try {
      await axios.delete(`http://localhost:5000/characters/${characterId}`, {
        headers: {
          'x-access-tokens': localStorage.getItem('token')
        }
      });
      setUserCharacters((prevCharacters) =>
        prevCharacters.filter((character) => character.id !== characterId)
      );
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };

  return (
    <div className="characterListContainer">
      <h1>Your Characters</h1>
      {userCharacters ? (
        userCharacters.length > 0 ? (
          userCharacters.map((character) => (
            <div key={character.id + character.intelligence} className="characterItem">
              <div className="characterInfo">
                <h2>
                  <Link to={`/characters/${character.id}`}>{character.name}</Link>
                </h2>
              </div>
              <button className="deleteButton" onClick={() => handleDelete(character.id)}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>You don't have any characters yet!</p>
        )
      ) : (
        <p>Loading characters...</p>
      )}
    </div>
  );
}

export default CharacterList;
