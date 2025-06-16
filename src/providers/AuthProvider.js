// src/providers/AuthProvider.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import { loginUser, registerUser, getCurrentUser, updateUserProfile } from '../services/api';

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (savedUser && token) {
        const parsedUser = JSON.parse(savedUser);
        // Verify token is still present and matches
        if (parsedUser.token === token) {
          return parsedUser;
        }
      }
      return null;
    } catch (err) {
      console.error('Error parsing saved user:', err);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token;
  });
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsAuthenticated(false);
          setUser(null);
          setError(null);
          return;
        }

        // Verify token with backend
        const userData = await getCurrentUser();
        
        if (!userData || !userData._id) {
          throw new Error('Invalid user data received');
        }

        // Ensure profile object exists and user ID is present
        const userWithProfile = {
          ...userData,
          profile: userData.profile || {},
          _id: userData._id || userData.id,
          subscription: userData.subscription || {
            tier: 'basic',
            status: 'active',
            isFree: true
          }
        };

        // Set user data
        setUser(userWithProfile);
        
        // Update saved user data
        const currentUser = {
          ...userWithProfile,
          token: token
        };
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        // Set authenticated state
        setIsAuthenticated(true);
        setError(null);
        
      } catch (err) {
        console.error('Auth verification failed:', err);
        // Only clear data if it's an auth error
        if (err.message === 'Authentication failed. Please login again.') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
          setError('Authentication failed. Please login again.');
        } else {
          // For other errors, keep the user logged in but show the error
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Check authentication status function
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setError(null);
        return;
      }
      
      // Verify token with backend
      const userData = await getCurrentUser();
      
      if (!userData || !userData._id) {
        throw new Error('Invalid user data received');
      }
      
      // Ensure profile object exists and user ID is present
      const userWithProfile = {
        ...userData,
        profile: userData.profile || {},
        _id: userData._id || userData.id,
        subscription: userData.subscription || {
          tier: 'basic',
          status: 'active',
          isFree: true
        }
      };
      
      // Set user data
      setUser(userWithProfile);
      
      // Update saved user data
      const currentUser = {
        ...userWithProfile,
        token: token
      };
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      // Set authenticated state
      setIsAuthenticated(true);
      setError(null);
      
    } catch (err) {
      console.error('Auth check failed:', err);
      // Only clear data if it's an auth error
      if (err.message === 'Authentication failed. Please login again.') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        setError('Authentication failed. Please login again.');
      } else {
        // For other errors, keep the user logged in but show the error
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await loginUser(email, password);
      
      if (!data || !data.token) {
        throw new Error('Login failed: No token received');
      }
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      // Ensure profile object exists and user ID is present
      const userWithProfile = {
        ...data.user,
        profile: data.user.profile || {},
        _id: data.user._id || data.user.id,
        firstName: data.user.firstName || data.user.name?.split(' ')[0] || 'Friend',
        lastName: data.user.lastName || data.user.name?.split(' ').slice(1).join(' ') || '',
        subscription: data.user.subscription || {
          tier: 'basic',
          status: 'active',
          isFree: true
        }
      };
      
      if (!userWithProfile._id) {
        throw new Error('Login failed: Invalid user data received');
      }
      
      // Set user data
      setUser(userWithProfile);
      
      // Save complete user data to localStorage
      const currentUser = {
        ...userWithProfile,
        token: data.token
      };
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      // Set authenticated state
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await registerUser(userData);
      
      if (!data || !data.token) {
        throw new Error('Registration failed: No token received');
      }
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      // Ensure profile object exists and user ID is present
      const userWithProfile = {
        ...data.user,
        profile: data.user.profile || {},
        _id: data.user._id || data.user.id,
        subscription: data.user.subscription || {
          tier: 'basic',
          status: 'active',
          isFree: true
        }
      };
      
      // Set user data
      setUser(userWithProfile);
      
      // Save complete user data to localStorage
      const currentUser = {
        ...userWithProfile,
        token: data.token
      };
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      // Set authenticated state
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    navigate('/login');
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await updateUserProfile(profileData);
      
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
      
      setUser(updatedUser);
      
      // Update localStorage
      const currentUser = {
        ...updatedUser,
        token: localStorage.getItem('token')
      };
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      return { success: true };
    } catch (err) {
      console.error('Profile update failed:', err);
      setError(err.message || 'Profile update failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser();
      
      if (!userData || !userData._id) {
        throw new Error('User refresh failed: Invalid data received');
      }
      
      // Update user state
      const updatedUser = {
        ...user,
        ...userData,
        profile: {
          ...user.profile,
          ...userData.profile
        }
      };
      
      setUser(updatedUser);
      
      // Update localStorage
      const currentUser = {
        ...updatedUser,
        token: localStorage.getItem('token')
      };
      localStorage.setItem('user', JSON.stringify(currentUser));
      
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
    checkAuthStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};