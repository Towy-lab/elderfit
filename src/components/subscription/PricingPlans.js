import React, { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { CheckIcon } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

const PricingPlans = () => {
  const stripe = useStripe();
  const { subscription } = useSubscription();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: 0,
      features: [
        'Basic exercises library',
        'Simple activity tracking',
        'Exercise progress logging',
        'Basic exercise reminders'
      ],
      buttonText: 'Current Plan',
      priceId: null
    },
    {
      name: 'Premium',
      price: 9.99,
      features: [
        'Advanced exercise plans',
        'Safety features & monitoring',
        'Fall detection alerts',
        'Health metrics tracking',
        'Virtual trainer sessions',
        'Group classes access',
        'Physical therapist consultations',
        'Wearable device integration'
      ],
      buttonText: 'Upgrade to Premium',
      priceId: 'price_premium_monthly'
    },
    {
      name: 'Family',
      price: 19.99,
      features: [
        'All Premium features',
        'Multiple family profiles',
        'Caregiver access & alerts',
        'Family activity tracking',
        'Shared emergency contacts',
        'Cross-profile monitoring',
        'Family progress reports',
        'Coordinated care features'
      ],
      buttonText: 'Upgrade to Family',
      priceId: 'price_family_monthly'
    }
  ];

  const handleSubscribe = async (priceId) => {
    if (!stripe) {
      setError('Stripe has not been initialized');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
        }),
      });

      const { sessionId } = await response.json();

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your ElderFit Plan
        </h1>
        <p className="text-xl text-gray-600">
          Select the plan that best fits your needs and start your journey to better health
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <p>{error}</p>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white rounded-lg shadow-lg overflow-hidden
                      ${subscription?.plan === plan.name ? 'ring-2 ring-blue-500' : ''}`}
          >
            {subscription?.plan === plan.name && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg">
                Current Plan
              </div>
            )}

            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-500">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.priceId)}
                disabled={loading || !plan.priceId || (subscription?.plan === plan.name)}
                className={`w-full py-3 px-4 rounded-md text-center font-medium
                          ${
                            subscription?.plan === plan.name
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }
                          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                          transition-colors duration-200`}
              >
                {loading ? 'Processing...' : plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;