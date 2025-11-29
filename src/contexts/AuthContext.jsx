import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // This is where we simulate a user. 
  // Set 'user' to { name: "Test" } to test logged-in mode later.
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(false);

  const value = { user, loading, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};