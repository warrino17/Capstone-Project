import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CharacterCard.css'

function CharacterCard() {
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);
  const { characterId } = useParams();

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/characters/${characterId}`, {
          headers: {
            'x-access-tokens': localStorage.getItem('token')
          }
        });
        setCharacter(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCharacter();
  }, [characterId]);


  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!character) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="CharacterCard">
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
  );
}

export default CharacterCard;



