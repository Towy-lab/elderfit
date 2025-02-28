import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../logo.svg';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  // Updated to match the properties provided by SubscriptionContext
  const { userSubscription } = useSubscription();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Define navigation items based on subscription tier
  const getNavigationItems = () => {
    // Common navigation items for all users
    const commonItems = [
      { name: 'Home', path: '/' },
      { name: 'Workouts', path: '/workouts' },
      { name: 'Progress', path: '/progress' },
      { name: 'Safety', path: '/safety' },
    ];
    
    // Premium tier additional items
    const premiumItems = [
      { name: 'Calendar', path: '/calendar' },
      { name: 'Rest Planning', path: '/rest-planning' },
      { name: 'Pain Tracker', path: '/pain-tracker' },
    ];
    
    // Elite tier additional items
    const eliteItems = [
      { name: 'Professional', path: '/professional' },
      { name: 'Family Profiles', path: '/family' },
      { name: 'Custom Routines', path: '/routine-builder' },
    ];
    
    // Build navigation based on subscription tier
    let navItems = [...commonItems];
    
    if (userSubscription === 'premium' || userSubscription === 'elite') {
      navItems = [...navItems, ...premiumItems];
    }
    
    if (userSubscription === 'elite') {
      navItems = [...navItems, ...eliteItems];
    }
    
    return navItems;
  };

  // Upsell items that appear for lower tiers
  const getUpsellItems = () => {
    if (!currentUser) return [];
    
    if (userSubscription === 'basic') {
      return [{ name: '✨ Upgrade to Premium', path: '/subscription/premium', highlight: true }];
    }
    
    if (userSubscription === 'premium') {
      return [{ name: '✨ Upgrade to Elite', path: '/subscription/elite', highlight: true }];
    }
    
    return [];
  };

  const navigationItems = getNavigationItems();
  const upsellItems = getUpsellItems();

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="ElderFit Secrets Logo" className="h-8 w-auto" />
            <span className="ml-2 text-xl font-bold text-indigo-600">ElderFit Secrets</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium ${
                  location.pathname === item.path
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Upsell items */}
            {upsellItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium ${
                  item.highlight
                    ? 'bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* User Menu */}
            {currentUser ? (
              <div className="relative ml-4">
                <Link
                  to="/profile"
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2">
                    {currentUser.displayName?.charAt(0) || 'U'}
                  </div>
                  Profile
                </Link>
              </div>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white pb-4">
            <div className="space-y-1 px-2 pt-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Upsell items */}
              {upsellItems.length > 0 && (
                <div className="border-t border-gray-200 my-2 pt-2">
                  {upsellItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        item.highlight
                          ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* User actions */}
              {currentUser ? (
                <div className="border-t border-gray-200 pt-4 pb-2">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <Link
                    to="/login"
                    className="block w-full px-4 py-2 text-center text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;