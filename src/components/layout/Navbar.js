// src/components/layout/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            ElderFit
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-500">
              Home
            </Link>
            <Link to="/exercises" className="text-gray-700 hover:text-blue-500">
              Exercises
            </Link>
            <Link to="/workouts" className="text-gray-700 hover:text-blue-500">
              Workouts
            </Link>
            <Link to="/progress" className="text-gray-700 hover:text-blue-500">
              Progress
            </Link>
            <Link to="/login" className="flex items-center text-gray-700 hover:text-blue-500">
              <User size={18} className="mr-1" />
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-blue-500 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-500 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/exercises" 
                className="text-gray-700 hover:text-blue-500 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Exercises
              </Link>
              <Link 
                to="/workouts" 
                className="text-gray-700 hover:text-blue-500 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Workouts
              </Link>
              <Link 
                to="/progress" 
                className="text-gray-700 hover:text-blue-500 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Progress
              </Link>
              <Link 
                to="/login" 
                className="flex items-center text-gray-700 hover:text-blue-500 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={18} className="mr-1" />
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;