// src/providers/AuthProvider.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import { api, loginUser, registerUser, getCurrentUser } from '../services/api';

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No token found, user is not authenticated');
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        // Verify token with backend
        try {
          console.log('Token found, verifying with server...');
          const userData = await getCurrentUser();
          console.log('User authenticated:', userData);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          console.log('Token verification failed:', err);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setError('Authentication failed. Please login again.');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // Clear invalid token
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setError('Authentication failed. Please login again.');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('Attempting login with:', { email, password: '***' });
      
      // Use dedicated login function
      const data = await loginUser(email, password);
      
      console.log('Login response:', data);
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      // Set user data
      setUser(data.user);
      setIsAuthenticated(true);
      
      console.log('Login successful, will navigate to dashboard');
      // Explicitly navigate to dashboard
      navigate('/dashboard');
      
      return { success: true };
    } catch (err) {
      console.error('Login failed:', err);
      
      let errorMessage = 'Login failed. Please try again.';
      if (err.response && err.response.data) {
        console.error('Error response:', err.response.data);
        errorMessage = err.response.data.error || errorMessage;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function - updated to not navigate directly to dashboard
  // src/providers/AuthProvider.js (partial)
const register = async (userData) => {
  try {
    setLoading(true);
    console.log('Registering user:', { ...userData, password: '***' });
    
    // Use dedicated register function from api.js
    const data = await registerUser(userData);
    
    console.log('Registration response:', data);
    
    // We return success but don't navigate or save token
    // This will let the Registration component handle the redirect flow
    return { success: true };
    
  } catch (err) {
    console.error('Registration failed:', err);
    
    let errorMessage = 'Registration failed. Please try again.';
    if (err.response && err.response.data) {
      console.error('Error response:', err.response.data);
      errorMessage = err.response.data.error || errorMessage;
    }
    
    setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};

  // Logout function
  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    // Navigate to login page after logout
    navigate('/login');
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await api.put('/users/profile', profileData);
      setUser(response.data);
      return { success: true };
    } catch (err) {
      console.error('Profile update failed:', err);
      
      let errorMessage = 'Profile update failed. Please try again.';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.error || errorMessage;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      return { success: true };
    } catch (err) {
      console.error('User refresh failed:', err);
      return { success: false, error: err.message };
    }
  };

  // Create context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};