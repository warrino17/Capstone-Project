import React, { useState, useContext } from 'react';
import UserContext from './UserContext';
import axios from 'axios';
import './CharacterForm.css';

function CharacterForm() {
  const { user, setUserCharacters } = useContext(UserContext);

  const [name, setName] = useState('');
  const [race, setRace] = useState('');
  const [profession, setProfession] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [strength, setStrength] = useState(8);
  const [dexterity, setDexterity] = useState(8);
  const [constitution, setConstitution] = useState(8);
  const [intelligence, setIntelligence] = useState(8);
  const [wisdom, setWisdom] = useState(8);
  const [charisma, setCharisma] = useState(8);

  const handleSubmit = async event => {
    event.preventDefault();
    const character = {
      name,
      race,
      profession,
      age,
      weight,
      strength,
      dexterity,
      constitution,
      intelligence,
      wisdom,
      charisma,
      email: user.email,
    };

    try {
      const response = await axios.post('http://localhost:5000/characters', character, {  
        headers: {
          'x-access-tokens': localStorage.getItem('token'),
        },
      });


      setUserCharacters(prevCharacters => [...prevCharacters, response.data]);
    } catch (error) {
      console.error('There was an error creating the character!', error);
    }
  };

  const handleStatChange = (e, setter) => {
    const stat = parseInt(e.target.value, 10);
    if (stat < 8) setter(8);
    else if (stat > 17) setter(17);
    else setter(stat);
  };

  const rollDice = (setter) => {
    setter(Math.floor(Math.random() * 10) + 8);
  };


  return (
    <div className="character-form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label>
          Race:
          <input type="text" value={race} onChange={e => setRace(e.target.value)} />
        </label>
        <label>
          Profession:
          <input type="text" value={profession} onChange={e => setProfession(e.target.value)} />
        </label>
        <label>
          Age:
          <input type="number" min="1" value={age} onChange={e => setAge(e.target.value)} />
        </label>
        <label>
          Weight:
          <input type="number" min="1" value={weight} onChange={e => setWeight(e.target.value)} />
        </label>
        <label>
          Strength:
          <input type="number" min="8" max="17" value={strength} onChange={e => handleStatChange(e, setStrength)} />
          <button type="button" onClick={() => rollDice(setStrength)}>🎲</button>
        </label>
        <label>
          Dexterity:
          <input type="number" min="8" max="17" value={dexterity} onChange={e => handleStatChange(e, setDexterity)} />
          <button type="button" onClick={() => rollDice(setDexterity)}>🎲</button>
        </label>
        <label>
          Constitution:
          <input type="number" min="8" max="17" value={constitution} onChange={e => handleStatChange(e, setConstitution)} />
          <button type="button" onClick={() => rollDice(setConstitution)}>🎲</button>
        </label>
        <label>
          Intelligence:
          <input type="number" min="8" max="17" value={intelligence} onChange={e => handleStatChange(e, setIntelligence)} />
          <button type="button" onClick={() => rollDice(setIntelligence)}>🎲</button>
        </label>
        <label>
          Wisdom:
          <input type="number" min="8" max="17" value={wisdom} onChange={e => handleStatChange(e, setWisdom)} />
          <button type="button" onClick={() => rollDice(setWisdom)}>🎲</button>
        </label>
        <label>
          Charisma:
          <input type="number" min="8" max="17" value={charisma} onChange={e => handleStatChange(e, setCharisma)} />
          <button type="button" onClick={() => rollDice(setCharisma)}>🎲</button>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default CharacterForm;
