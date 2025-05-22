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
      const savedUser = localStorage.getItem('user');
      
      if (!token) {
        console.log('No token found, user is not authenticated');
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      // If we have saved user data, use it immediately
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Ensure user ID is present
          if (parsedUser._id) {
            console.log('Found saved user data with ID:', parsedUser._id);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            console.log('Saved user data missing ID, will verify with server');
          }
        } catch (err) {
          console.error('Error parsing saved user data:', err);
        }
      }
      
      // Verify token with backend
      try {
        console.log('Token found, verifying with server...');
        const userData = await getCurrentUser();
        console.log('User authenticated:', userData);
        
        // Ensure profile object exists and user ID is present
        const userWithProfile = {
          ...userData,
          profile: userData.profile || {},
          _id: userData._id || userData.id // Try both _id and id
        };
        
        if (!userWithProfile._id) {
          console.error('Auth check failed: No user ID in response');
          throw new Error('Invalid user data received');
        }
        
        // Set user data first
        setUser(userWithProfile);
        
        // Update saved user data
        const currentUser = {
          ...userWithProfile,
          token: token
        };
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        // Set authenticated state after user data is set
        setIsAuthenticated(true);
        
        console.log('Auth check successful, user data set:', { 
          userId: userWithProfile._id,
          userData: userWithProfile 
        });
      } catch (err) {
        console.error('Token verification failed:', err);
        // Only remove token if it's an authentication error
        if (err.response && err.response.status === 401) {
          console.log('Removing invalid token');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
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
      localStorage.removeItem('user');
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
      
      // Ensure profile object exists and user ID is present
      const userWithProfile = {
        ...data.user,
        profile: data.user.profile || {},
        _id: data.user._id || data.user.id, // Try both _id and id
        firstName: data.user.firstName || data.user.profile?.firstName || data.user.name?.split(' ')[0] || null,
        lastName: data.user.lastName || data.user.profile?.lastName || data.user.name?.split(' ').slice(1).join(' ') || null
      };
      
      if (!userWithProfile._id) {
        console.error('Login failed: No user ID in response');
        setError('Login failed: Invalid user data received');
        return { success: false, error: 'Login failed: Invalid user data received' };
      }
      
      // Set user data first
      setUser(userWithProfile);
      
      // Save complete user data to localStorage
      const currentUser = {
        ...userWithProfile,
        token: data.token
      };
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      // Set authenticated state after user data is set
      setIsAuthenticated(true);
      
      console.log('Login successful, user data set:', { 
        userId: userWithProfile._id,
        firstName: userWithProfile.firstName,
        lastName: userWithProfile.lastName,
        userData: userWithProfile 
      });
      
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
  const logout = async () => {
    try {
      console.log('Logging out user');
      
      // If we have user data, ensure it's saved to the server
      if (user) {
        try {
          // Save any pending profile changes
          await updateUserProfile({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profile: user.profile
          });
          console.log('Profile changes saved before logout');
        } catch (err) {
          console.error('Error saving profile before logout:', err);
          // Continue with logout even if save fails
        }
      }
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear state
      setUser(null);
      setIsAuthenticated(false);
      
      // Navigate to login page after logout
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear everything even if there's an error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Format the profile data
      const formattedData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        profile: {
          fitnessLevel: profileData.profile?.fitnessLevel || 'beginner',
          goals: profileData.profile?.goals || [],
          healthConditions: profileData.profile?.healthConditions || [],
          equipment: profileData.profile?.equipment || [],
          height: profileData.profile?.height || null,
          weight: profileData.profile?.weight || null
        }
      };
      
      console.log('Sending formatted profile data:', formattedData);
      
      // Use the dedicated API function for profile updates
      const response = await updateUserProfile(formattedData);
      
      if (!response || !response.user) {
        throw new Error('Invalid response from server');
      }
      
      console.log('Received updated user data:', response);
      
      // Update user state with the complete user data from the response
      setUser(response.user);
      
      // Store the updated user data in localStorage to persist it
      const currentUser = {
        ...response.user,
        token: localStorage.getItem('token')
      };
      localStorage.setItem('user', JSON.stringify(currentUser));
      
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