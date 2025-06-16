import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import PricingPlans from './PricingPlans';

const SubscriptionUpgradePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subscription, formatTierName } = useSubscription();
  
  // Get the required level and redirect path from location state
  const requiredLevel = location.state?.requiredTier || 'basic';
  const redirectPath = location.state?.from || '/dashboard';
  const message = location.state?.message || 'Upgrade your subscription to access premium content.';
  
  // Get current subscription info
  const currentPlan = formatTierName(subscription?.tier || 'basic');
  const requiredPlan = formatTierName(requiredLevel);
  
  // Check if user is on Elite tier
  const isElite = subscription?.tier === 'elite';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isElite ? (
          // Elite tier message
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              You're Already on Our Best Plan!
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              You're currently subscribed to our Elite tier, which includes all features.
            </p>
            <div className="mt-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          // Regular upgrade message
          <>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-indigo-100 rounded-full">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Upgrade Your Subscription
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                {message}
              </p>
            </div>
            
            <div className="mt-4 p-4 bg-amber-50 rounded-md max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4">
                <div className="mb-4 sm:mb-0">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                    Access Required
                  </span>
                </div>
                <p className="text-sm text-amber-700">
                  {!subscription?.hasSubscription 
                    ? `You need a ${requiredPlan} subscription to access this content.` 
                    : `Your current ${currentPlan} plan doesn't include access to ${requiredPlan} features.`}
                </p>
              </div>
            </div>
            
            {subscription?.hasSubscription && (
              <div className="mt-6 text-center text-gray-600">
                <p>
                  Current subscription: <span className="font-semibold">{currentPlan}</span>
                  {subscription.currentPeriodEnd && (
                    <span> (renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()})</span>
                  )}
                </p>
              </div>
            )}
            
            <div className="mt-8">
              <PricingPlans />
            </div>
            
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate(redirectPath)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Maybe Later
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionUpgradePage;