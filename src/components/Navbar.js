import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SubscriptionContext } from '../contexts/SubscriptionContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get user from localStorage (this would usually come from your auth context)
  const user = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user')) 
    : null;
  
  // Get subscription info from context
  const { subscription, loading } = useContext(SubscriptionContext);
  
  // Map subscription status to badge color and text
  const getSubscriptionBadge = () => {
    if (!subscription) return { color: 'bg-gray-100 text-gray-800', text: 'Free' };
    
    switch (subscription.tier) {
      case 'elite':
        return { color: 'bg-purple-100 text-purple-800', text: 'Elite' };
      case 'premium':
        return { color: 'bg-indigo-100 text-indigo-800', text: 'Premium' };
      case 'basic':
        return { color: 'bg-blue-100 text-blue-800', text: 'Basic' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: 'Free' };
    }
  };
  
  const subscriptionBadge = getSubscriptionBadge();
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('subscription');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600">
                ElderFit<span className="text-gray-700">Secrets</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/subscription"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Plans
              </Link>
              {subscription?.tier !== 'none' && (
                <>
                  <Link
                    to="/dashboard/basic"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Workouts
                  </Link>
                  {(subscription?.tier === 'premium' || subscription?.tier === 'elite') && (
                    <Link
                      to="/dashboard/premium"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Nutrition
                    </Link>
                  )}
                  {subscription?.tier === 'elite' && (
                    <Link
                      to="/dashboard/elite"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Elite
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <>
                {/* Subscription badge */}
                {!loading && (
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subscriptionBadge.color} mr-4`}
                  >
                    {subscriptionBadge.text}
                  </span>
                )}
                
                {/* Profile dropdown */}
                <div className="ml-3 relative">
                  <div>
                    <button
                      type="button"
                      className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      id="user-menu"
                      aria-expanded="false"
                      aria-haspopup="true"
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    </button>
                  </div>
                  
                  {/* Dropdown menu */}
                  {isProfileMenuOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/profile/subscription"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Manage Subscription
                      </Link>
                      <button
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          handleLogout();
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {/* Menu icon */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* X icon */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="text-gray-500 hover:bg-gray-50 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/subscription"
              className="text-gray-500 hover:bg-gray-50 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Plans
            </Link>
            {subscription?.tier !== 'none' && (
              <>
                <Link
                  to="/dashboard/basic"
                  className="text-gray-500 hover:bg-gray-50 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Workouts
                </Link>
                {(subscription?.tier === 'premium' || subscription?.tier === 'elite') && (
                  <Link
                    to="/dashboard/premium"
                    className="text-gray-500 hover:bg-gray-50 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Nutrition
                  </Link>
                )}
                {subscription?.tier === 'elite' && (
                  <Link
                    to="/dashboard/elite"
                    className="text-gray-500 hover:bg-gray-50 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Elite
                  </Link>
                )}
              </>
            )}
          </div>
          
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
                {!loading && (
                  <span 
                    className={`ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subscriptionBadge.color}`}
                  >
                    {subscriptionBadge.text}
                  </span>
                )}
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Your Profile
                </Link>
                <Link
                  to="/profile/subscription"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Manage Subscription
                </Link>
                <button
                  className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex space-x-4 px-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;