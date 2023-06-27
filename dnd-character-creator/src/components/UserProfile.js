import React from 'react';
import { Route, Routes } from 'react-router-dom';

import CharacterList from './CharacterList';
import CharacterCard from './CharacterCard';

function UserProfile() {
  return (
    <Routes>
      <Route path="/" element={<CharacterList />} />
      <Route path=":characterId" element={<CharacterCard />} />
    </Routes>
  );
}

export default UserProfile;
