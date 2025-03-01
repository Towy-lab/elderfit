import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Create a custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log("AuthContext initialized", { isAuthenticated, user });
  
  // Check for existing auth on component mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log("Checking for existing authentication");
        // Get user from localStorage
        const storedUser = localStorage.getItem('user');
        console.log("Stored user from localStorage:", storedUser);
        
        if (storedUser) {
          // Parse stored user data
          const userData = JSON.parse(storedUser);
          console.log("Parsed user data:", userData);
          
          // Set user data and auth state
          setUser(userData);
          setIsAuthenticated(true);
          console.log("User authenticated from localStorage");
        } else {
          console.log("No user found in localStorage");
        }
      } catch (error) {
        // Handle any errors (like invalid JSON)
        console.error('Error checking authentication:', error);
        // Clear invalid data
        localStorage.removeItem('user');
      } finally {
        // Set loading to false regardless of outcome
        setIsLoading(false);
        console.log("Auth loading completed");
      }
    };
    
    checkAuth();
  }, []);
  
  // Track authentication state changes
  useEffect(() => {
    console.log("Auth state changed:", { isAuthenticated, user });
  }, [isAuthenticated, user]);
  
  // Register function
  const register = async (firstName, lastName, email, password) => {
    console.log("Register function called with:", { firstName, lastName, email });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create mock user
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      createdAt: new Date().toISOString()
    };
    
    console.log("Registration successful. User data:", newUser);
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(newUser));
    console.log("User saved to localStorage");
    
    // Update state
    setUser(newUser);
    setIsAuthenticated(true);
    console.log("Auth state updated after registration");
    
    return newUser;
  };
  
  // Login function
  const login = async (email, password) => {
    console.log("Login function called with email:", email);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // This is where you would normally validate credentials
    // For demo purposes, we'll just create a mock user
    const mockUser = {
      id: 'user123',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      email,
      createdAt: new Date().toISOString()
    };
    
    console.log("Login successful. User data:", mockUser);
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(mockUser));
    console.log("User saved to localStorage");
    
    // Update state
    setUser(mockUser);
    setIsAuthenticated(true);
    console.log("Auth state updated after login");
    
    return mockUser;
  };
  
  // Logout function
  const logout = () => {
    console.log("Logout function called");
    
    // Remove from localStorage
    localStorage.removeItem('user');
    console.log("User removed from localStorage");
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
    console.log("Auth state reset after logout");
  };
  
  // Value object to be provided to consumers
  const value = {
    user,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;