import React from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';

const PremiumContent = () => {
  const { tier } = useSubscription();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Premium Tier Content</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Premium Video Library</h2>
          <p className="mb-4">
            Access our complete library of exercise videos with detailed instructions from certified senior fitness specialists.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded p-4">
              <h3 className="font-medium mb-2">Balance Improvement Series</h3>
              <p>10 videos demonstrating exercises to improve stability and prevent falls.</p>
              <button className="mt-2 text-blue-600 hover:text-blue-800">Watch Videos</button>
            </div>
            <div className="border border-gray-200 rounded p-4">
              <h3 className="font-medium mb-2">Joint Health Workouts</h3>
              <p>8 specialized routines designed to maintain and improve joint mobility.</p>
              <button className="mt-2 text-blue-600 hover:text-blue-800">Watch Videos</button>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Personalized Workout Plans</h2>
          <p className="mb-4">
            Our system creates customized workout plans based on your fitness level, goals, and any mobility limitations.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Your Custom Plan</h3>
            <p className="mb-3">Complete your fitness profile to receive your personalized workout plan.</p>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              onClick={() => alert('This would take you to the profile completion form')}
            >
              Complete Profile
            </button>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Premium Resources</h2>
          <ul className="divide-y divide-gray-200">
            <li className="py-3">
              <a href="#" className="flex justify-between items-center">
                <span>Nutrition Guide for Seniors</span>
                <span className="text-blue-600">Download PDF</span>
              </a>
            </li>
            <li className="py-3">
              <a href="#" className="flex justify-between items-center">
                <span>Sleep Improvement Techniques</span>
                <span className="text-blue-600">Download PDF</span>
              </a>
            </li>
            <li className="py-3">
              <a href="#" className="flex justify-between items-center">
                <span>Mobility Assessment Guide</span>
                <span className="text-blue-600">Download PDF</span>
              </a>
            </li>
          </ul>
        </div>
        
        {/* Upgrade Banner (only for Premium, not Elite) */}
        {tier === 'premium' && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
            <h3 className="font-bold text-lg text-blue-800 mb-2">Upgrade to Elite</h3>
            <p className="mb-3">
              Get personalized coaching, one-on-one consultations, and advanced content with our Elite tier.
            </p>
            <div>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-3"
                onClick={() => alert('This would open the upgrade flow')}
              >
                Upgrade to Elite
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumContent;