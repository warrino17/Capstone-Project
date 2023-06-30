import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SharedCharacters.css';

function SharedCharacters() {
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/all`, {
          headers: {
            'x-access-tokens': localStorage.getItem('token'),
          },
        });

        setCharacters(response.data.characters);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCharacters();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!characters.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="SharedCharacters">
      {characters.map(character => (
        <div key={character.id} className="CharacterCard">
          <h1>{character.name}</h1>
          <p>Race: {character.race}</p>
          <p>Profession: {character.profession}</p>
          <p>Age: {character.age}</p>
          <p>Weight: {character.weight}</p>
          <p>Strength: {character.strength}</p>
          <p>Dexterity: {character.dexterity}</p>
          <p>Constitution: {character.constitution}</p>
          <p>Intelligence: {character.intelligence}</p>
          <p>Wisdom: {character.wisdom}</p>
          <p>Charisma: {character.charisma}</p>
        </div>
      ))}
    </div>
  );
}

export default SharedCharacters;



