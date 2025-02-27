import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SubscriptionContext } from '../../context/SubscriptionContext.js';
import PricingPlans from './PricingPlans';

const SubscriptionUpgradePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subscriptionStatus, subscriptionDetails } = useContext(SubscriptionContext);
  
  // Get the required level and redirect path from location state
  const requiredLevel = location.state?.requiredLevel || 'basic';
  const redirectPath = location.state?.from || '/dashboard';
  
  // Map subscription levels to readable names
  const subscriptionLevelNames = {
    'none': 'No Subscription',
    'basic': 'Basic',
    'premium': 'Premium',
    'elite': 'Elite'
  };
  
  // Get current subscription info
  const currentPlan = subscriptionLevelNames[subscriptionStatus] || 'No Subscription';
  const requiredPlan = subscriptionLevelNames[requiredLevel] || 'Basic';
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-indigo-100 rounded-full">
          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Upgrade Your Subscription
        </h1>
        
        <div className="mt-4 p-4 bg-amber-50 rounded-md max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4">
            <div className="mb-4 sm:mb-0">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                Access Required
              </span>
            </div>
            <p className="text-sm text-amber-700">
              {subscriptionStatus === 'none' 
                ? `You need a ${requiredPlan} subscription to access this content.` 
                : `Your current ${currentPlan} plan doesn't include access to ${requiredPlan} features.`}
            </p>
          </div>
        </div>
        
        {subscriptionDetails && subscriptionDetails.status === 'active' && (
          <div className="mt-6 text-gray-600">
            <p>
              Current subscription: <span className="font-semibold">{currentPlan}</span>
              {subscriptionDetails.currentPeriodEnd && (
                <span> (renews on {new Date(subscriptionDetails.currentPeriodEnd).toLocaleDateString()})</span>
              )}
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Why Upgrade?</h2>
          
          {requiredLevel === 'basic' && (
            <div className="space-y-3">
              <p className="text-gray-600">The Basic plan gives you access to:</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Beginner-friendly workout routines designed for seniors</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Basic nutrition guides for healthy aging</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Progress tracking tools</span>
                </li>
              </ul>
            </div>
          )}
          
          {requiredLevel === 'premium' && (
            <div className="space-y-3">
              <p className="text-gray-600">The Premium plan gives you access to:</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Advanced workout routines tailored for different senior fitness levels</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Personalized meal plans based on your health goals</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Comprehensive video tutorials for each exercise</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Monthly consultation with a certified fitness specialist</span>
                </li>
              </ul>
            </div>
          )}
          
          {requiredLevel === 'elite' && (
            <div className="space-y-3">
              <p className="text-gray-600">The Elite plan gives you access to:</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>All Premium features</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Priority support from our team</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Exclusive content not available in other plans</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Personalized equipment recommendations</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Quarterly fitness assessments with detailed reports</span>
                </li>
              </ul>
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate(redirectPath)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
      
      {/* Include the pricing plans component */}
      <PricingPlans />
    </div>
  );
};

export default SubscriptionUpgradePage;