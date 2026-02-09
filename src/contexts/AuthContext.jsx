import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL, getHeaders } from '@/lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('novaUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  //LOGIN
const signIn = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: getHeaders(), // Folosim funcția ajutătoare
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('novaUser', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: "Nu mă pot conecta la server." };
    }
  };

  //LOGOUT
  const signOut = () => {
    setUser(null);
    localStorage.removeItem('novaUser');
    window.location.href = '/'; // Redirect forțat la home
  };

  // UPDATE
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('novaUser', JSON.stringify(userData));
  };

  const value = { user, loading, signIn, signOut, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};