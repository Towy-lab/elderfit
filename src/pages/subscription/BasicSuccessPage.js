// src/pages/subscription/BasicSuccessPage.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, Activity } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext.js';

const BasicSuccessPage = () => {
  const { refreshSubscription } = useSubscription();
  
  // Refresh subscription data on page load
  useEffect(() => {
    refreshSubscription();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Success Banner */}
          <div className="bg-blue-600 py-8 px-6 text-white text-center">
            <div className="mb-4 flex justify-center">
              <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Basic Plan!</h1>
            <p className="text-xl opacity-90">Your free subscription is now active</p>
          </div>
          
          {/* Plan Details */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">Basic Plan</h2>
              <p className="text-gray-600">Essential fitness tools for healthy aging</p>
            </div>
            
            {/* Plan Features */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-medium mb-4">Your Basic Plan Includes:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2">5 beginner-friendly workout routines</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2">Basic exercise demonstrations</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2">Simple progress tracking</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2">Safety guidelines</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2">Weekly goals (limited customization)</span>
                </li>
              </ul>
            </div>
            
            {/* Upgrade Section */}
            <div className="bg-indigo-50 rounded-lg p-6 mb-8 border border-indigo-100">
              <h3 className="text-lg font-medium mb-2">Ready for More?</h3>
              <p className="text-gray-700 mb-4">
                Upgrade to Premium or Elite to unlock personalized workout plans, advanced tracking, 
                professional guidance, and more!
              </p>
              <Link
                to="/subscription/plans"
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                View Premium Plans
              </Link>
            </div>
            
            {/* Next Steps */}
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Thank you for joining ElderFit Secrets. Start your fitness journey today!
              </p>
              
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicSuccessPage;