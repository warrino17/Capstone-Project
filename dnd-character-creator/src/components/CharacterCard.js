import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CharacterCard() {
  const [character, setCharacter] = useState(null);
  const { characterId } = useParams();

  useEffect(() => {
    const fetchCharacter = async () => {
      const response = await axios.get(`http://localhost:5000/characters/${characterId}`);
      setCharacter(response.data);
    };

    fetchCharacter();
  }, [characterId]);

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{character.name}</h1>
      {/* Add any other character details you want to display here */}
    </div>
  );
}

export default CharacterCard;


