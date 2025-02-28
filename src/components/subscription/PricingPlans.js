import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

const PricingPlans = () => {
  const { currentUser } = useAuth();
  const { userSubscription } = useSubscription();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  
  // Handle subscription actions
  const handleSubscriptionAction = (tier) => {
    if (!currentUser) {
      navigate('/login', { state: { redirectTo: `/subscription/${tier}` } });
      return;
    }
    
    if (tier === 'basic') {
      navigate('/subscription/free-signup-success');
    } else {
      navigate(`/subscription/${tier}`);
    }
  };
  
  // Feature lists for each tier
  const basicFeatures = [
    '5 beginner-friendly workout routines',
    'Basic exercise demonstrations',
    'Simple progress tracking',
    'Safety guidelines',
    'Weekly goals (limited customization)',
  ];
  
  const premiumFeatures = [
    '30+ specialized workout routines',
    'Personalized recommendations',
    'Advanced progress tracking & analytics',
    'Workout calendar & scheduling',
    'Rest day planning & recovery guidance',
    'Pain tracking & safety recommendations',
    'Basic community features'
  ];
  
  const eliteFeatures = [
    'All Premium features',
    '50+ specialized workout routines',
    'One-on-one professional support',
    'Family profiles management',
    'Advanced safety features',
    'Priority professional consultations',
    'Full community access with exclusive content',
    'Custom routine builder with professional guidance'
  ];
  
  // Annual pricing with discount
  const premiumMonthly = 9.99;
  const premiumAnnual = 99.99; // ~17% savings
  const eliteMonthly = 19.99;
  const eliteAnnual = 199.99; // ~17% savings
  
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Choose Your ElderFit Subscription</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Select the plan that fits your fitness journey. Upgrade or downgrade anytime.
          </p>
          
          {/* Billing cycle toggle */}
          <div className="mt-6 inline-flex items-center border border-gray-200 rounded-lg p-1 bg-white">
            <button
              className={`px-4 py-2 rounded-md ${
                billingCycle === 'monthly' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                billingCycle === 'annual' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setBillingCycle('annual')}
            >
              Annual
              <span className="ml-1 text-xs bg-green-100 text-green-800 py-0.5 px-1.5 rounded">
                Save ~17%
              </span>
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">Basic</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">Free</span>
                <span className="ml-1 text-gray-500">/forever</span>
              </div>
              <p className="mt-2 text-gray-600">
                Get started with beginner-friendly workouts
              </p>
            </div>
            <div className="px-6 pb-6">
              <ul className="space-y-3">
                {basicFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscriptionAction('basic')}
                className={`mt-6 w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
                  ${userSubscription === 'basic' ? 'cursor-default opacity-70' : ''}`}
                disabled={userSubscription === 'basic'}
              >
                {userSubscription === 'basic' ? 'Current Plan' : 'Start Free'}
              </button>
            </div>
          </div>
          
          {/* Premium Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-indigo-200 transform scale-105 z-10">
            <div className="bg-indigo-500 py-1.5 text-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-white">
                Most Popular
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">Premium</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  ${billingCycle === 'monthly' ? premiumMonthly : (premiumAnnual / 12).toFixed(2)}
                </span>
                <span className="ml-1 text-gray-500">/month</span>
              </div>
              <p className="mt-2 text-gray-600">
                {billingCycle === 'annual' && (
                  <span className="block text-green-600 font-medium">
                    ${premiumAnnual} billed annually
                  </span>
                )}
                Personalized workouts and advanced tracking
              </p>
            </div>
            <div className="px-6 pb-6">
              <ul className="space-y-3">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscriptionAction('premium')}
                className={`mt-6 w-full py-2 px-4 rounded-md text-sm font-medium text-white
                  ${userSubscription === 'premium' 
                    ? 'bg-indigo-400 cursor-default' 
                    : 'bg-indigo-600 hover:bg-indigo-700'}`}
                disabled={userSubscription === 'premium'}
              >
                {userSubscription === 'premium' 
                  ? 'Current Plan' 
                  : userSubscription === 'elite'
                    ? 'Downgrade to Premium'
                    : 'Upgrade to Premium'}
              </button>
            </div>
          </div>
          
          {/* Elite Plan */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">Elite</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  ${billingCycle === 'monthly' ? eliteMonthly : (eliteAnnual / 12).toFixed(2)}
                </span>
                <span className="ml-1 text-gray-500">/month</span>
              </div>
              <p className="mt-2 text-gray-600">
                {billingCycle === 'annual' && (
                  <span className="block text-green-600 font-medium">
                    ${eliteAnnual} billed annually
                  </span>
                )}
                Professional support and premium content
              </p>
            </div>
            <div className="px-6 pb-6">
              <ul className="space-y-3">
                {eliteFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscriptionAction('elite')}
                className={`mt-6 w-full py-2 px-4 rounded-md text-sm font-medium text-white
                  ${userSubscription === 'elite' 
                    ? 'bg-purple-400 cursor-default' 
                    : 'bg-purple-600 hover:bg-purple-700'}`}
                disabled={userSubscription === 'elite'}
              >
                {userSubscription === 'elite' ? 'Current Plan' : 'Upgrade to Elite'}
              </button>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900">Can I switch plans later?</h4>
              <p className="mt-2 text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be applied immediately.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900">Is there a free trial for Premium or Elite?</h4>
              <p className="mt-2 text-gray-600">
                We offer a 7-day free trial for both our Premium and Elite plans. You can cancel anytime during the trial period.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900">What happens if I downgrade my plan?</h4>
              <p className="mt-2 text-gray-600">
                You'll continue to have access to your current plan until the end of your billing cycle. 
                After that, you'll be switched to your new plan.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900">How do the professional consultations work?</h4>
              <p className="mt-2 text-gray-600">
                With the Elite plan, you can book one-on-one video consultations with our certified fitness 
                professionals who specialize in senior fitness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;