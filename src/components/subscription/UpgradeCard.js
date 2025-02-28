import React from 'react';
import { Link } from 'react-router-dom';

const UpgradeCard = ({ title, description, tier }) => {
  const getBgColor = () => {
    switch (tier) {
      case 'premium':
        return 'bg-indigo-50';
      case 'elite':
        return 'bg-purple-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getButtonColor = () => {
    switch (tier) {
      case 'premium':
        return 'bg-indigo-600 hover:bg-indigo-700';
      case 'elite':
        return 'bg-purple-600 hover:bg-purple-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getTitleColor = () => {
    switch (tier) {
      case 'premium':
        return 'text-indigo-800';
      case 'elite':
        return 'text-purple-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-sm ${getBgColor()} relative overflow-hidden`}>
      {/* Locked feature indicator */}
      <div className="absolute top-3 right-3">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-gray-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
          />
        </svg>
      </div>

      <h3 className={`font-medium text-lg ${getTitleColor()}`}>{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>

      <div className="mt-4">
        <span className="text-sm text-gray-500">Included with {tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
        <Link
          to={`/subscription/${tier}`}
          className={`mt-3 inline-block w-full text-center text-white ${getButtonColor()} px-4 py-2 rounded transition duration-150`}
        >
          Upgrade to {tier.charAt(0).toUpperCase() + tier.slice(1)}
        </Link>
      </div>
    </div>
  );
};

export default UpgradeCard;