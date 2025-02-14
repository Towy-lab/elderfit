import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Dumbbell, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
              <Home size={24} />
              <span>ElderFit</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              to="/workouts" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                location.pathname.includes('/workout') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Dumbbell size={20} />
              <span>Workouts</span>
            </Link>
            
            <Link 
              to="/login" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                location.pathname === '/login' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User size={20} />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;