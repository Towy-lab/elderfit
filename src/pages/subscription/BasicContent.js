import React from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';

const BasicContent = () => {
  const { tier } = useSubscription();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Basic Tier Content</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Getting Started with Fitness</h2>
          <p className="mb-4">
            Welcome to ElderFit Secrets! This section contains essential exercises and routines that are perfect for beginners.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded p-4">
              <h3 className="font-medium mb-2">Chair Exercises</h3>
              <p>Simple exercises you can do while seated to improve mobility.</p>
            </div>
            <div className="border border-gray-200 rounded p-4">
              <h3 className="font-medium mb-2">Gentle Stretches</h3>
              <p>Easy stretches to improve flexibility and reduce stiffness.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Weekly Fitness Tips</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Stay hydrated by drinking water before, during, and after exercise.</li>
            <li>Always warm up for 5-10 minutes before starting your workout.</li>
            <li>Listen to your body and rest when needed.</li>
            <li>Consistency is more important than intensity when starting out.</li>
          </ul>
        </div>
        
        {/* Upgrade Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
          <h3 className="font-bold text-lg text-blue-800 mb-2">Upgrade for More Content</h3>
          <p className="mb-3">
            Upgrade to Premium or Elite to access video demonstrations, personalized routines, and more advanced exercises.
          </p>
          <div>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-3"
              onClick={() => alert('This would open the upgrade flow')}
            >
              Upgrade Now
            </button>
            <button 
              className="text-blue-600 hover:text-blue-800 underline"
              onClick={() => alert('This would show a comparison of plans')}
            >
              View Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicContent;