import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  console.log("ProtectedRoute check:", { isAuthenticated, isLoading });
  
  if (isLoading) {
    console.log("Auth is still loading, showing loading state");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  console.log("User is authenticated, rendering protected content");
  return children;
};

export default ProtectedRoute;