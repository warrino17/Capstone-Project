import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isLoggedIn }) {
  return (
    <nav className="navbar">
      <img 
        src="https://pbs.twimg.com/profile_images/1544033437413146625/6CpTvxWw_400x400.jpg" 
        alt="Logo" 
        className="navbar-logo"
      /> 
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/library" className="nav-link">Library</Link>
      <Link to="/create" className="nav-link">Create</Link>
      <Link to="/register" className="nav-link">Register</Link>
      {isLoggedIn ? (
        <Link to="/profile" className="nav-link">Profile</Link>
      ) : (
        <Link to="/login" className="nav-link">Login</Link>
      )}
    </nav>
  );
}

export default Navbar;
