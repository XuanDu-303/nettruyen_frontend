import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentAuth, setCurrentAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const auth = localStorage.getItem('auth');
    const authObject = JSON.parse(auth || '{}');
    const current = authObject.current;
    const authStatus = authObject.isAuthenticated === true;
    setIsAuthenticated(authStatus);
    setCurrentAuth(current);
  }, []);

  return (
    <AuthContext.Provider value={{ currentAuth, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
