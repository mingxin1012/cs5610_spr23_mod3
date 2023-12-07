import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [activeUsername, setActiveUsername] = useState(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem("activeUsername");
    if (savedUsername) {
      setActiveUsername(savedUsername);
    }
  }, []);

  return (
    <UserContext.Provider value={{ activeUsername, setActiveUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
