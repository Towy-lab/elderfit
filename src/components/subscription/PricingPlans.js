import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubscriptionContext } from '../../context/SubscriptionContext.js';

const PricingPlans = () => {
  const { setSubscriptionStatus } = useContext(SubscriptionContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const plans = [
    {
      id: 'basic_free',
      name: 'Basic',
      price: 'Free',
      period: 'forever',
      features: [
        'Beginner workout routines',
        'Basic nutrition guides',
        'Progress tracking',
        'Community forum access'
      ],
      isFree: true
    },
    {
      id: 'premium_monthly',
      name: 'Premium',
      price: '$19.99',
      period: 'month',
      features: [
        'All Basic features',
        'Advanced workout routines',
        'Personalized meal plans',
        'Video tutorials',
        'One monthly consultation'
      ],
      stripePriceId: 'price_1234premium', // Replace with your actual Stripe price ID
      highlighted: true
    },
    {
      id: 'elite_yearly',
      name: 'Elite',
      price: '$149.99',
      period: 'year',
      features: [
        'All Premium features',
        'Priority support',
        'Exclusive elite content',
        'Workout equipment recommendations',
        'Quarterly fitness assessments',
        'Save $90 compared to monthly'
      ],
      stripePriceId: 'price_1234elite' // Replace with your actual Stripe price ID
    }
  ];

  const handleSelectPlan = async (plan) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // If the plan is free, handle it differently
      if (plan.isFree) {
        // Call your backend to register the user for the free tier
        const user = localStorage.getItem('user') 
          ? JSON.parse(localStorage.getItem('user')) 
          : null;
          
        if (!user) {
          // Redirect to registration if not logged in
          navigate('/register', { state: { redirectAfter: '/subscription/free-signup-success' } });
          return;
        }
        
        // Register for free plan
        const response = await fetch('/api/register-free-plan', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({ 
            planName: plan.name,
            planId: plan.id
          })
        });

        if (!response.ok) {
          throw new Error('Failed to register for free plan');
        }

        // Get updated subscription status
        const data = await response.json();
        
        // Update subscription in context
        setSubscriptionStatus('basic');
        
        // Store subscription info for fallback
        localStorage.setItem('subscription', JSON.stringify({
          status: 'basic',
          details: {
            planName: 'Basic',
            planLevel: 'basic',
            isFree: true
          }
        }));
        
        // Redirect to success page
        navigate('/subscription/free-signup-success');
        return;
      }
      
      // For paid plans, continue with Stripe checkout
      // Call your backend to create a Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: plan.stripePriceId,
          planName: plan.name,
          planId: plan.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      // Store selected plan in localStorage for reference after payment
      localStorage.setItem('selectedPlan', JSON.stringify(plan));
      
      // Redirect to Stripe checkout
      const stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Subscription error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Choose Your ElderFit Plan
        </h2>
        <p className="mt-4 text-xl text-gray-600">
          Invest in your health with a plan that fits your needs
        </p>
      </div>

      {error && (
        <div className="my-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}. Please try again or contact support.
        </div>
      )}

      <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative p-8 bg-white border rounded-2xl shadow-sm flex flex-col ${
              plan.highlighted ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-300'
            }`}
          >
            {plan.highlighted && (
              <div className="absolute top-0 inset-x-0 transform -translate-y-1/2">
                <div className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide bg-indigo-100 text-indigo-600">
                  Most Popular
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="ml-1 text-xl font-semibold text-gray-500">/{plan.period}</span>
              </div>
            </div>
            
            <ul className="mt-6 space-y-4 flex-grow">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">{feature}</p>
                </li>
              ))}
            </ul>
            
            <div className="mt-8">
              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={isLoading}
                className={`w-full bg-indigo-600 border border-transparent rounded-md py-3 px-5 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Processing...' : `Subscribe to ${plan.name}`}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-base text-gray-500">
          All plans include a 7-day free trial. Cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default PricingPlans;