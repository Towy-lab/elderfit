import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';

const Navbar = () => {
  const { subscription } = useSubscription();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">ElderFit</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/pricing"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                Pricing
              </Link>
              
              {subscription?.plan === 'Premium' || subscription?.plan === 'Family' ? (
                <>
                  <Link
                    to="/booking"
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md"
                  >
                    Book Professional
                  </Link>
                  <Link
                    to="/safety"
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md"
                  >
                    Safety
                  </Link>
                  <Link
                    to="/community"
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md"
                  >
                    Community
                  </Link>
                </>
              ) : null}
              
              {subscription?.plan === 'Family' && (
                <Link
                  to="/family"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  Family
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {!subscription ? (
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                Login
              </Link>
            ) : (
              <span className="text-sm text-gray-500">
                {subscription.plan} Plan
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;