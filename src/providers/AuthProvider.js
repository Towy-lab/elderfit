// src/providers/AuthProvider.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import { api, loginUser, registerUser, getCurrentUser, updateUserProfile } from '../services/api';

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status function
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
        console.error('Token verification failed:', err);
        // Only remove token if it's an authentication error
        if (err.response && err.response.status === 401) {
          console.log('Removing invalid token');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setError('Authentication failed. Please login again.');
        } else {
          // For other errors (like network issues), keep the token but set unauthenticated
          console.log('Keeping token, but setting unauthenticated due to API error');
          setIsAuthenticated(false);
          setError('Could not verify authentication. Please try again.');
        }
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

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting login with:', { email, password: '***' });
      
      // Use dedicated login function
      const data = await loginUser(email, password);
      
      console.log('Login response:', data);
      
      if (!data || !data.token) {
        console.error('Login failed: No token received');
        setError('Login failed. Please try again.');
        return { success: false, error: 'Login failed: No token received' };
      }
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      // Set user data
      setUser(data.user);
      setIsAuthenticated(true);
      
      console.log('Login successful, user data set');
      
      // Return success, but don't navigate (let the calling component handle navigation)
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
      setError(null);
      
      // Format the profile data
      const formattedData = {
        name: profileData.name,
        email: profileData.email,
        profile: {
          fitnessLevel: profileData.profile.fitnessLevel,
          goals: profileData.profile.goals || [],
          healthConditions: profileData.profile.healthConditions || [],
          equipment: profileData.profile.equipment || []
        }
      };
      
      console.log('Sending formatted profile data:', formattedData);
      
      // Use the dedicated API function for profile updates
      const response = await updateUserProfile(formattedData);
      
      if (!response) {
        throw new Error('No data received from server');
      }
      
      console.log('Received updated user data:', response);
      
      // Update user state with new profile data, preserving existing data
      setUser(prevUser => {
        if (!prevUser) return response.user;
        
        // Get the name from the formatted data since that's what we sent
        const name = formattedData.name;
        const [firstName = '', lastName = ''] = name.split(' ');
        
        // Create the updated user object
        const updatedUser = {
          ...prevUser,
          firstName,
          lastName,
          email: formattedData.email,
          profile: {
            ...prevUser.profile,
            fitnessLevel: formattedData.profile.fitnessLevel,
            goals: formattedData.profile.goals,
            healthConditions: formattedData.profile.healthConditions,
            equipment: formattedData.profile.equipment
          }
        };
        
        console.log('Updated user state:', updatedUser);
        return updatedUser;
      });
      
      return { success: true };
    } catch (err) {
      console.error('Profile update failed:', err);
      
      let errorMessage = 'Profile update failed. Please try again.';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.error || errorMessage;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage); // Throw error to be caught by the component
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
    refreshUser,
    checkAuthStatus // Export this so it can be called from other components
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};