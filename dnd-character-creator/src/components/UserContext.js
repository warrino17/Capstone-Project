import { createContext } from 'react';

const UserContext = createContext({
  token: null,
  setToken: () => {},
  user: null,
  setUser: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userCharacters: [],
  setUserCharacters: () => {},
});


export default UserContext;
