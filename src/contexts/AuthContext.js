// src/contexts/AuthContext.js - Modified to log redirects
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, getCurrentUser, updateUserProfile } from '../services/api';

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

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check for token and load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Error loading user:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { token, user: userData } = await loginUser(email, password);
      localStorage.setItem('token', token);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const { token, user: newUser } = await registerUser(userData);
      localStorage.setItem('token', token);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Update profile function
  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);
      const response = await updateUserProfile(updates);
      
      if (!response || !response.user) {
        throw new Error('Profile update failed: Invalid response');
      }
      
      // Update user state with new data
      const updatedUser = {
        ...user,
        ...response.user,
        profile: {
          ...user.profile,
          ...response.user.profile
        }
      };
      
      // Update user state
      setUser(updatedUser);
      
      // Update localStorage
      const currentUser = {
        ...updatedUser,
        token: localStorage.getItem('token')
      };
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      // Return the updated user data
      return response;
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getCurrentUser();
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message || 'Failed to refresh user data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;