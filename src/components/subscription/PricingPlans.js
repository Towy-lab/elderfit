import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../contexts/SubscriptionContext';

const PricingPlans = ({ isHomePage = false }) => {
  const { isAuthenticated } = useAuth();
  const { 
    subscription, 
    loading, 
    createCheckoutSession, 
    formatTierName 
  } = useSubscription();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Add effect to scroll to top when component mounts
  useEffect(() => {
    if (!isHomePage && location.pathname === '/subscription/plans') {
      window.scrollTo(0, 0);
    }
  }, [isHomePage, location.pathname]);
  
  const [billingCycle, setBillingCycle] = useState('month');
  const [processingTier, setProcessingTier] = useState(null);
  const [error, setError] = useState(null);
  
  // Handle subscription selection - IMPROVED VERSION
  const handleSelectPlan = async (tier) => {
    try {
      setError(null);
      console.log(`Selecting plan: ${tier} with billing cycle: ${billingCycle}`);
      
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        navigate('/login', { 
          state: { 
            redirectTo: '/subscription/plans',
            message: 'Please log in to subscribe to a plan.'
          } 
        });
        return;
      }
      
      // Check if user already has this tier
      if (subscription && subscription.tier === tier) {
        console.log('User already has this tier, redirecting to manage');
        navigate('/subscription/manage');
        return;
      }
      
      // Set processing state
      setProcessingTier(tier);
      
      // Handle basic tier signup
      if (tier === 'basic') {
        console.log('Creating checkout for Basic tier');
        const result = await createCheckoutSession('basic');
        console.log('Basic tier result:', result);
        
        if (result.success) {
          navigate('/subscription/basic-success');
        } else {
          setError(result.error || 'Failed to sign up for Basic plan');
        }
        setProcessingTier(null);
        return;
      }
      
      // Create checkout session for paid tiers
      console.log(`Creating checkout for ${tier} with billing cycle ${billingCycle}`);
      const result = await createCheckoutSession(tier, billingCycle);
      console.log('Checkout result:', result);
      
      if (result.success) {
        if (result.isFree) {
          console.log('Free tier redirect');
          navigate('/subscription/basic-success');
        } else if (result.url) {
          // Use the direct URL if provided (newer approach)
          console.log(`Redirecting to Stripe URL: ${result.url}`);
          window.location.href = result.url;
          return;
        } else if (result.sessionId) {
          // Log before redirect for debugging
          console.log(`Redirecting to Stripe: ${result.sessionId}`);
          
          // Use Stripe.js if available
          if (window.Stripe) {
            const stripe = window.Stripe('pk_test_51R40QxGCjT8uHlI9WQdabIoRw4icN3pWYm7uzGh7BEOiXdbpCIEFrgOBqjrrPHQxJcUwScTYUWwe6dujC9lBoNi300saDYDTse');
            stripe.redirectToCheckout({ sessionId: result.sessionId });
          } else {
            // Use the complete Stripe checkout URL as fallback
            window.location.href = `https://checkout.stripe.com/pay/${result.sessionId}`;
          }
          return;
        }
      } else {
        setError(result.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Plan selection error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setProcessingTier(null);
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
  
  const eliteFeatures = isHomePage ? 
    [
      'All Premium features',
      'AI-powered personalized training',
      'Monthly curated exercise collections',
      'Family profiles management',
      'Advanced safety features',
      'Priority support'
    ] : [
      'All Premium features',
      'Specially selected exercise groups with new collections monthly',
      'AI-powered personalized training',
      'Monthly curated exercise collections',
      'Family profiles management',
      'Advanced safety features',
      'Health device integration',
      'Exclusive content',
      'Custom routine builder with AI guidance'
    ];
  
  // Pricing configuration
  const pricing = {
    premium: {
      month: 9.99,
      year: 99.99 // ~17% savings
    },
    elite: {
      month: 19.99,
      year: 199.99 // ~17% savings
    }
  };
  
  // Calculate savings percentage
  const getSavingsPercentage = (monthlyPrice, yearlyPrice) => {
    const monthlyCostPerYear = monthlyPrice * 12;
    const savings = monthlyCostPerYear - yearlyPrice;
    return Math.round((savings / monthlyCostPerYear) * 100);
  };
  
  // Inline loading spinner
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  const containerClasses = isHomePage
    ? "bg-transparent py-8"  // No background on home page
    : "bg-gray-50 py-12";    // Gray background on dedicated page
  
  return (
    <div className={containerClasses}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {!isHomePage && (
            <h2 className="text-3xl font-bold text-gray-900">Choose Your ElderFit Subscription</h2>
          )}
          
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Select the plan that fits your fitness journey. Upgrade or downgrade anytime.
          </p>
          
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto">
              {error}
            </div>
          )}
          
          {/* Billing cycle toggle */}
          <div className="mt-6 inline-flex items-center border border-gray-200 rounded-lg p-1 bg-white">
            <button
              className={`px-4 py-2 rounded-md ${
                billingCycle === 'month' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setBillingCycle('month')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                billingCycle === 'year' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setBillingCycle('year')}
            >
              Annual
              <span className="ml-1 text-xs bg-green-100 text-green-800 py-0.5 px-1.5 rounded">
                Save {getSavingsPercentage(pricing.premium.month, pricing.premium.year)}%
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
                onClick={() => handleSelectPlan('basic')}
                disabled={processingTier === 'basic' || (subscription && subscription.tier === 'basic')}
                className={`mt-6 w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium 
                  ${subscription && subscription.tier === 'basic' 
                    ? 'bg-gray-100 text-gray-500 cursor-default' 
                    : 'text-gray-700 bg-white hover:bg-gray-50'}`}
              >
                {processingTier === 'basic' 
                  ? 'Processing...' 
                  : subscription && subscription.tier === 'basic' 
                    ? 'Current Plan' 
                    : 'Start Free'}
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
                  ${billingCycle === 'month' ? pricing.premium.month : (pricing.premium.year / 12).toFixed(2)}
                </span>
                <span className="ml-1 text-gray-500">/month</span>
              </div>
              <p className="mt-2 text-gray-600">
                {billingCycle === 'year' && (
                  <span className="block text-green-600 font-medium">
                    ${pricing.premium.year} billed annually
                  </span>
                )}
                Personalized workouts and advanced tracking
              </p>
            </div>
            <div className="px-6 pb-6">
              <ul className="space-y-3">
                {premiumFeatures.slice(0, isHomePage ? 5 : premiumFeatures.length).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSelectPlan('premium')}
                disabled={processingTier === 'premium' || (subscription && subscription.tier === 'premium')}
                className={`mt-6 w-full py-2 px-4 rounded-md text-sm font-medium text-white
                  ${subscription && subscription.tier === 'premium' 
                    ? 'bg-indigo-400 cursor-default' 
                    : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {processingTier === 'premium' 
                  ? 'Processing...' 
                  : subscription && subscription.tier === 'premium' 
                    ? 'Current Plan' 
                    : subscription && subscription.tier === 'elite'
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
                  ${billingCycle === 'month' ? pricing.elite.month : (pricing.elite.year / 12).toFixed(2)}
                </span>
                <span className="ml-1 text-gray-500">/month</span>
              </div>
              <p className="mt-2 text-gray-600">
                {billingCycle === 'year' && (
                  <span className="block text-green-600 font-medium">
                    ${pricing.elite.year} billed annually
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
                onClick={() => handleSelectPlan('elite')}
                disabled={processingTier === 'elite' || (subscription && subscription.tier === 'elite')}
                className={`mt-6 w-full py-2 px-4 rounded-md text-sm font-medium text-white
                  ${subscription && subscription.tier === 'elite' 
                    ? 'bg-purple-400 cursor-default' 
                    : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {processingTier === 'elite' 
                  ? 'Processing...' 
                  : subscription && subscription.tier === 'elite' 
                    ? 'Current Plan' 
                    : 'Upgrade to Elite'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Subscription Management Link */}
        {isAuthenticated && subscription && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">
              Current plan: <span className="font-medium">{formatTierName(subscription.tier)}</span>
            </p>
            <button
              onClick={() => navigate('/subscription/manage')}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Manage your subscription
            </button>
          </div>
        )}
        
        {/* On home page, add a link to full pricing page */}
        {isHomePage && (
          <div className="mt-8 text-center">
            <Link 
              to="/subscription/plans" 
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              See All Plan Details
            </Link>
          </div>
        )}
        
        {/* FAQ Section - Only on full page, not home page */}
        {!isHomePage && (
          <div className="mt-16 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Can I switch plans later?</h4>
                <p className="mt-2 text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, 
                  while downgrades will apply at the end of your current billing period.
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
                <h4 className="text-lg font-medium text-gray-900">How does the AI-powered training work?</h4>
                <p className="mt-2 text-gray-600">
                  Our Elite plan features advanced AI technology that analyzes your fitness data, goals, and progress to provide personalized workout recommendations and real-time form guidance. The system continuously learns from your feedback and performance to optimize your training program. You'll receive automated adjustments to your workouts, recovery recommendations, and access to specialized programs—all powered by our intelligent training system.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingPlans;