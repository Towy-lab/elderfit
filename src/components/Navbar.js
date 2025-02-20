import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Dumbbell, 
  Calendar, 
  Clock, 
  Activity,
  Heart, 
  AlertCircle,
  Menu,
  X,
  User
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navItems = [
    { to: '/', icon: Home, label: 'Home', exact: true },
    { to: '/workouts', icon: Dumbbell, label: 'Workouts' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/routines', icon: Activity, label: 'Routines' },
    { to: '/rest-planner', icon: Clock, label: 'Rest Planner' },
    { to: '/reminders', icon: Clock, label: 'Reminders' }
  ];

  const safetyItems = [
    { to: '/pain-tracker', icon: Heart, label: 'Pain Tracker' },
    { to: '/emergency-contacts', icon: AlertCircle, label: 'Emergency Contacts' },
    { to: '/form-guide', icon: Activity, label: 'Form Guide' }
  ];

  const isActivePath = (path) => {
    if (path === '/' && path === location.pathname) return true;
    if (path !== '/') return location.pathname.startsWith(path);
    return false;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
              <Home size={24} />
              <span>ElderFit</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                  isActivePath(item.to)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}

            <div className="h-6 w-px bg-gray-200" />

            {safetyItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                  isActivePath(item.to)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`block px-3 py-2 rounded-md ${
                  isActivePath(item.to)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}

            <div className="my-2 h-px bg-gray-200" />

            {safetyItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`block px-3 py-2 rounded-md ${
                  isActivePath(item.to)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;