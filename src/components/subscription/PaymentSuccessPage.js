// src/pages/subscription/PaymentSuccessPage.js
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfettiExplosion from 'react-confetti-explosion';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const { refreshSubscription, subscription, loading } = useSubscription();
  const [isExploding, setIsExploding] = useState(false);
  const navigate = useNavigate();
  
  // Get session ID from URL
  const sessionId = searchParams.get('session_id');
  
  useEffect(() => {
    // Refresh subscription details to get the latest information
    const fetchData = async () => {
      await refreshSubscription();
      
      // Show confetti after a short delay
      setTimeout(() => {
        setIsExploding(true);
      }, 500);
      
      // Redirect to dashboard after a delay if no subscription is found
      if (!loading && !subscription) {
        setTimeout(() => {
          navigate('/dashboard');
        }, 5000);
      }
    };
    
    fetchData();
  }, []);
  
  // Format tier and subscription details
  const getTierDetails = () => {
    if (!subscription) return {};
    
    let tierName, tierDescription, tierFeatures = [];
    
    switch (subscription.tier) {
      case 'premium':
        tierName = 'Premium';
        tierDescription = 'Personalized fitness journey for healthy aging';
        tierFeatures = [
          'Personalized workout plans',
          'Advanced progress tracking',
          'Video demonstrations',
          'Nutrition guidance',
          'Monthly health reports'
        ];
        break;
      case 'elite':
        tierName = 'Elite';
        tierDescription = 'The ultimate senior fitness experience';
        tierFeatures = [
          'All Premium features',
          'AI-powered personalized training',
          'Custom workout programming',
          'Advanced health analytics',
          'Exclusive content and community'
        ];
        break;
      default:
        tierName = 'Basic';
        tierDescription = 'Essential fitness tools for beginners';
        tierFeatures = [
          'Basic workout routines',
          'Simple progress tracking',
          'Exercise guides'
        ];
    }
    
    return { tierName, tierDescription, tierFeatures };
  };
  
  const { tierName, tierDescription, tierFeatures } = getTierDetails();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Success Banner */}
          <div className="bg-green-600 py-8 px-6 text-white text-center relative">
            {isExploding && <ConfettiExplosion duration={3000} particleCount={100} width={1600} />}
            <div className="mb-4 flex justify-center">
              <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Subscription Successful!</h1>
            <p className="text-xl opacity-90">Your {tierName} plan is now active</p>
          </div>
          
          {/* Subscription Details */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">{tierName} Plan</h2>
              <p className="text-gray-600">{tierDescription}</p>
            </div>
            
            {/* Plan Features */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-medium mb-4">Your {tierName} Plan Includes:</h3>
              <ul className="space-y-3">
                {tierFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Next Steps */}
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Thank you for subscribing to ElderFit Secrets. Your journey to better fitness starts now!
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/dashboard"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/subscription/manage"
                  className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
                >
                  Manage Subscription
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need help or have questions?{' '}
            <Link to="/help" className="text-indigo-600 hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;