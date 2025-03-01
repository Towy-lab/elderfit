import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';

const DashboardGuide = () => {
  const [dismissed, setDismissed] = useState(false);
  const [showFullGuide, setShowFullGuide] = useState(false);
  const { user } = useAuth();
  const { tier } = useSubscription();
  
  // Check local storage to see if the user has previously dismissed the guide
  useEffect(() => {
    const guideDismissed = localStorage.getItem('dashboardGuideDismissed');
    if (guideDismissed === 'true') {
      setDismissed(true);
    }
  }, []);
  
  const handleDismiss = () => {
    localStorage.setItem('dashboardGuideDismissed', 'true');
    setDismissed(true);
  };
  
  const resetGuide = () => {
    localStorage.removeItem('dashboardGuideDismissed');
    setDismissed(false);
    setShowFullGuide(true);
  };
  
  if (dismissed) {
    return (
      <button 
        className="text-blue-500 text-sm underline mt-2 mb-4"
        onClick={resetGuide}
      >
        Show Dashboard Guide
      </button>
    );
  }
  
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-xl text-blue-800">Welcome to Your ElderFit Dashboard, {user?.firstName || 'Friend'}!</h3>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={handleDismiss}
          aria-label="Dismiss guide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="mt-2">
        <p className="mb-3">This is your personal fitness hub. Here's how to get started:</p>
        
        {!showFullGuide ? (
          <button 
            className="text-blue-600 underline mb-3"
            onClick={() => setShowFullGuide(true)}
          >
            Show me how to use the dashboard
          </button>
        ) : (
          <ol className="list-decimal pl-5 space-y-2 mb-3">
            <li><strong>Recommended Workouts:</strong> Start with one of our personalized workout recommendations below. Simply click on any workout card to view details.</li>
            <li><strong>Track Your Progress:</strong> Your workout streak and achievements are displayed in the Progress section.</li>
            <li><strong>Explore Exercises:</strong> Browse our exercise library to learn new movements tailored for seniors.</li>
            {tier === 'basic' && (
              <li><strong>Upgrade Your Experience:</strong> Consider upgrading to Premium or Elite to unlock additional features like personalized routines and video demonstrations.</li>
            )}
          </ol>
        )}
        
        {tier === 'basic' && (
          <p className="text-blue-800 font-semibold">You're currently on the Basic plan. Upgrade to access more personalized content!</p>
        )}
        
        {tier === 'premium' && (
          <p className="text-blue-800 font-semibold">You're on the Premium plan! Explore your enhanced features like video demonstrations and saved routines.</p>
        )}
        
        {tier === 'elite' && (
          <p className="text-blue-800 font-semibold">You're on the Elite plan! Don't forget to schedule your monthly consultation with a fitness professional.</p>
        )}
        
        <div className="mt-3 flex space-x-3">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={handleDismiss}
          >
            Got it!
          </button>
          <button 
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded"
            onClick={() => window.location.href = '/help'}
          >
            View Full Help Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardGuide;