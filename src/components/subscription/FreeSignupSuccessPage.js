import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubscriptionContext } from '../../context/SubscriptionContext.js';

const FreeSignupSuccessPage = () => {
  const navigate = useNavigate();
  const { subscriptionStatus } = useContext(SubscriptionContext);
  
  // Get user from localStorage
  const user = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user')) 
    : null;
  
  // If user is not logged in or doesn't have basic subscription, redirect
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (subscriptionStatus !== 'basic' && subscriptionStatus !== 'premium' && subscriptionStatus !== 'elite') {
      navigate('/subscription');
    }
  }, [user, subscriptionStatus, navigate]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-100 rounded-full">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome to ElderFit Secrets!</h2>
          <p className="mt-4 text-gray-600">
            Your free Basic membership has been activated. You now have access to beginner workouts, 
            nutrition guides, progress tracking, and our community forum.
          </p>
          
          <div className="mt-8 p-6 bg-indigo-50 rounded-lg">
            <h3 className="text-lg font-medium text-indigo-900">Check Your Email</h3>
            <p className="mt-2 text-indigo-700">
              We've sent you a welcome email with important tips to get started on your fitness journey.
              Don't forget to check your inbox!
            </p>
          </div>
          
          <div className="mt-10 max-w-xl mx-auto">
            <h3 className="text-lg font-medium text-gray-900">What's Next?</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600">
                    1
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Complete your profile</span> to get personalized workout recommendations
                </p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600">
                    2
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Take the fitness assessment</span> to establish your baseline
                </p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600">
                    3
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Try your first workout</span> designed specifically for seniors
                </p>
              </li>
            </ul>
          </div>
          
          <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate('/dashboard/basic')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Start Your First Workout
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Want more personalized guidance and advanced features? 
              <button 
                onClick={() => navigate('/subscription')}
                className="ml-1 text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Check out our Premium plans
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeSignupSuccessPage;