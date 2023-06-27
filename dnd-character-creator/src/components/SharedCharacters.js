import React from 'react';
import { Route, Routes } from 'react-router-dom';

import CharacterCard from './CharacterCard';

function SharedCharacters() {
  return (
    <Routes>
      <Route path=":characterId" element={<CharacterCard />} />
    </Routes>
  );
}

export default SharedCharacters;
