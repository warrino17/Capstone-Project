import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Login from './Login';
import Register from './Register';

function UserAuthentication() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Routes>
  );
}

export default UserAuthentication;
