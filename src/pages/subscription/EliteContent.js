// src/pages/subscription/EliteContent.js (updated with Tailwind)
import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import FeatureGate from '../../components/subscription/FeatureGate';
import { Users, Video, Shield } from 'lucide-react';

const EliteContent = () => {
  const { formatTierName } = useSubscription();
  
  return (
    <FeatureGate requiredTier="elite">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200 mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Elite Content</h1>
          <p className="text-purple-700">
            Welcome to your {formatTierName('elite')} tier! Enjoy our most comprehensive fitness resources with professional guidance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="bg-purple-600 py-3 px-4">
              <h3 className="text-lg font-semibold text-white">One-on-One Coaching</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-700 mb-4">Schedule virtual coaching sessions with our senior fitness specialists.</p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span className="text-gray-700">Personalized attention</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span className="text-gray-700">Custom workout plans</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span className="text-gray-700">Form correction and guidance</span>
                </li>
              </ul>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <Link to="/coaching" className="w-full block text-center py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                Schedule Session
              </Link>
            </div>
          </div>
          
          {/* Add other features in similar styling... */}
        </div>
        
        {/* Continue with other sections... */}
      </div>
    </FeatureGate>
  );
};

export default EliteContent;