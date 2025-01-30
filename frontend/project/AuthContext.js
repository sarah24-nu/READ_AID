// AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const logIn = () => {
    setIsAuthenticated(true);
    setIsGuest(false);
  };

  const logInAsGuest = () => {
    setIsAuthenticated(true);
    setIsGuest(true);
  };

  const logOut = () => {
    setIsAuthenticated(false);
    setIsGuest(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isGuest,
        logIn,
        logInAsGuest,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
