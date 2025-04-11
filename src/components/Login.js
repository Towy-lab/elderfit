import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, isAuthenticated } = useAuth();

  // Extract redirect URL from query parameter - using useCallback to memoize
  const getRedirectUrl = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('redirect') || '/dashboard';
  }, [location.search]);

  // Check for success message from registration or other redirect
  useEffect(() => {
    // If already authenticated, redirect to the intended destination
    if (isAuthenticated) {
      const redirectUrl = getRedirectUrl();
      navigate(redirectUrl);
      return;
    }

    // Handle message from state (usually from registration)
    if (location.state?.message) {
      setMessage(location.state.message);
      
      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state, navigate, isAuthenticated, getRedirectUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Pass email and password as separate parameters
      const result = await login(credentials.email, credentials.password);
      
      if (!result.success) {
        setError(result.error || 'Login failed');
      } else {
        // Get the redirect URL and navigate there
        const redirectUrl = getRedirectUrl();
        console.log('Login successful, redirecting to:', redirectUrl);
        navigate(redirectUrl);
      }
    } catch (error) {
      console.error('Login submission error:', error);
      setError('Failed to connect to server');
    }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Sign in to ElderFit</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;