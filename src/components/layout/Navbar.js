import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { tier } = useSubscription();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    closeMenu();
  };
  
  return (
    <nav className="bg-blue-600 text-white shadow-md mb-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <span className="text-2xl font-bold">ElderFit</span>
            <span className="ml-1 text-sm bg-yellow-500 text-blue-900 px-2 py-1 rounded-md font-semibold">Secrets</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200 transition-colors">Dashboard</Link>
                <Link to="/help" className="hover:text-blue-200 transition-colors">Help</Link>
                
                {/* Subscription-specific links */}
                {tier === 'basic' && (
                  <Link to="/basic" className="hover:text-blue-200 transition-colors">Basic Content</Link>
                )}
                
                {tier === 'premium' && (
                  <>
                    <Link to="/premium" className="hover:text-blue-200 transition-colors">Premium Content</Link>
                  </>
                )}
                
                {tier === 'elite' && (
                  <>
                    <Link to="/premium" className="hover:text-blue-200 transition-colors">Premium Content</Link>
                    <Link to="/elite" className="hover:text-blue-200 transition-colors">Elite Content</Link>
                  </>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition-colors">Login</Link>
                <Link 
                  to="/register"
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-blue-500">
            <div className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded" onClick={closeMenu}>Dashboard</Link>
                  <Link to="/help" className="hover:bg-blue-700 px-3 py-2 rounded" onClick={closeMenu}>Help</Link>
                  
                  {/* Subscription-specific links */}
                  {tier === 'basic' && (
                    <Link to="/basic" className="hover:bg-blue-700 px-3 py-2 rounded" onClick={closeMenu}>Basic Content</Link>
                  )}
                  
                  {tier === 'premium' && (
                    <Link to="/premium" className="hover:bg-blue-700 px-3 py-2 rounded" onClick={closeMenu}>Premium Content</Link>
                  )}
                  
                  {tier === 'elite' && (
                    <>
                      <Link to="/premium" className="hover:bg-blue-700 px-3 py-2 rounded" onClick={closeMenu}>Premium Content</Link>
                      <Link to="/elite" className="hover:bg-blue-700 px-3 py-2 rounded" onClick={closeMenu}>Elite Content</Link>
                    </>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded" onClick={closeMenu}>Login</Link>
                  <Link 
                    to="/register"
                    className="bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;