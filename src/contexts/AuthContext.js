// src/contexts/AuthContext.js - Modified to log redirects
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the auth context
const AuthContext = createContext({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  login: () => {},
  register: () => {},
  logout: () => {},
  updateProfile: () => {},
  refreshUser: () => {}
});

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;