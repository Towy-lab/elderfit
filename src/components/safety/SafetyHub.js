// src/components/safety/SafetyHub.js
import React from 'react';
import { Shield, Info } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import useTierContent from '../../hooks/useTierContent';
import { Link } from 'react-router-dom';

// Import tiered safety components
import { TieredEmergencyContact } from './TieredEmergencyContact';
import { TieredFormGuidance } from './TieredFormGuidance';
import { TieredPainTracker } from './TieredPainTracker';
import { TieredRestRecommendations } from './TieredRestRecommendations';

/**
 * SafetyHub - Central component for displaying safety features based on subscription tier
 * 
 * @param {Object} props
 * @param {Object} props.exercise - Exercise data for form guidance and pain tracking
 */
const SafetyHub = ({ exercise = {} }) => {
  const { formatTierName } = useSubscription();
  const { currentTier, getUpgradeFeatures } = useTierContent();
  
  // Get features that would be unlocked with an upgrade
  const premiumFeatures = currentTier === 'basic' 
    ? getUpgradeFeatures('premium') 
    : {};
  
  const eliteFeatures = currentTier !== 'elite' 
    ? getUpgradeFeatures('elite') 
    : {};

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-blue-800">Safety Hub</h1>
        </div>
        <p className="text-blue-700">
          Safety is our top priority. Here you'll find tools and resources to help you exercise safely and effectively.
        </p>
        
        {/* Tier Badge */}
        <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white border border-blue-200">
          <span className="text-sm text-blue-700">
            {formatTierName(currentTier)} Plan Features
          </span>
        </div>
      </div>

      {/* Safety Feature Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Emergency Contact Management */}
        <TieredEmergencyContact />
        
        {/* Form Guidance */}
        {exercise && Object.keys(exercise).length > 0 && (
          <TieredFormGuidance exercise={exercise} />
        )}
        
        {/* Rest Recommendations */}
        <TieredRestRecommendations 
          exerciseId={exercise?.id} 
          intensity={exercise?.intensity || 'moderate'} 
        />
        
        {/* Pain Tracker */}
        {exercise && Object.keys(exercise).length > 0 && (
          <TieredPainTracker exerciseId={exercise?.id} />
        )}
      </div>
      
      {/* Upgrade Feature Preview Section */}
      {(Object.keys(premiumFeatures).length > 0 || Object.keys(eliteFeatures).length > 0) && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Info className="text-gray-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">
              Unlock More Safety Features
            </h2>
          </div>
          
          {/* Premium Upgrade Features */}
          {Object.keys(premiumFeatures).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-indigo-700 mb-3">
                Premium Plan Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(premiumFeatures).filter(cat => cat === 'safety' || cat === 'features').map(category => (
                  <div key={category} className="bg-white rounded-lg p-4 border border-indigo-100">
                    <h4 className="font-medium text-indigo-800 mb-2">
                      {premiumFeatures[category].title}
                    </h4>
                    <ul className="space-y-1">
                      {premiumFeatures[category].features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <span className="text-indigo-500 mr-2">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a 
                  href="/subscription/plans" 
                  className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Upgrade to Premium
                </a>
              </div>
            </div>
          )}
          
          {/* Elite Upgrade Features */}
          {Object.keys(eliteFeatures).length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-purple-700 mb-3">
                Elite Plan Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(eliteFeatures).filter(cat => cat === 'safety' || cat === 'features').map(category => (
                  <div key={category} className="bg-white rounded-lg p-4 border border-purple-100">
                    <h4 className="font-medium text-purple-800 mb-2">
                      {eliteFeatures[category].title}
                    </h4>
                    <ul className="space-y-1">
                      {eliteFeatures[category].features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <span className="text-purple-500 mr-2">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a 
                  href="/subscription/plans" 
                  className="inline-block px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Upgrade to Elite
                </a>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* General Safety Resources - Available to all tiers */}
      <div className="bg-green-50 rounded-lg p-6 border border-green-100">
        <h2 className="text-xl font-semibold text-green-800 mb-4">
          General Safety Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/safety/guidelines" 
            className="block p-4 bg-white rounded-lg border border-green-200 hover:border-green-400"
          >
            <h3 className="font-medium text-green-800 mb-2">Safety Guidelines</h3>
            <p className="text-sm text-gray-600">
              Basic guidelines for safe exercise for seniors
            </p>
          </Link>
          <Link 
            to="/safety/emergency" 
            className="block p-4 bg-white rounded-lg border border-green-200 hover:border-green-400"
          >
            <h3 className="font-medium text-green-800 mb-2">Emergency Procedures</h3>
            <p className="text-sm text-gray-600">
              What to do in case of an exercise emergency
            </p>
          </Link>
          <Link 
            to="/safety/faq" 
            className="block p-4 bg-white rounded-lg border border-green-200 hover:border-green-400"
          >
            <h3 className="font-medium text-green-800 mb-2">Safety FAQ</h3>
            <p className="text-sm text-gray-600">
              Answers to common safety questions
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SafetyHub;