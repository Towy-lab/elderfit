import React from 'react';
import { Link } from 'react-router-dom';

const UpgradeCard = ({ title = "Upgrade Your Plan", description = "Get access to more features with our premium plans." }) => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-blue-800 mb-2">{title}</h3>
      <p className="text-gray-700 mb-4">{description}</p>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/pricing"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          View Plans
        </Link>
        <button
          onClick={() => window.location.href = '/pricing'}
          className="border border-blue-600 text-blue-600 hover:bg-blue-100 font-medium py-2 px-4 rounded transition-colors"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default UpgradeCard;