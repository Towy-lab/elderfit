import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock login functionality (replace with actual authentication)
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, mock a successful login
      if (email && password) {
        const mockUser = {
          uid: '123456',
          email: email,
          displayName: email.split('@')[0],
          photoURL: null,
        };

        // Save user to localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        setCurrentUser(mockUser);
        return mockUser;
      } else {
        throw new Error('Email and password are required');
      }
    } catch (err) {
      setError(err.message || 'Failed to log in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mock registration functionality
  const register = async (email, password, displayName) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, mock a successful registration
      if (email && password) {
        const mockUser = {
          uid: '123456',
          email: email,
          displayName: displayName || email.split('@')[0],
          photoURL: null,
        };

        // Save user to localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        setCurrentUser(mockUser);
        return mockUser;
      } else {
        throw new Error('Email and password are required');
      }
    } catch (err) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout functionality
  const logout = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear user from localStorage
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
    } catch (err) {
      setError('Failed to log out');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      // Update user in localStorage
      const updatedUser = {
        ...currentUser,
        ...updates
      };
      
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError('Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;