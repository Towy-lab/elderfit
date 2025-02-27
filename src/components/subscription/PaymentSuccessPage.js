import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SubscriptionContext } from '../../context/SubscriptionContext.js';

const PaymentSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const [processingMessage, setProcessingMessage] = useState('Finalizing your subscription...');
  const navigate = useNavigate();
  const location = useLocation();
  const { updateSubscriptionAfterPayment, subscriptionStatus } = useContext(SubscriptionContext);

  // Extract session ID from URL query params
  const getSessionId = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('session_id');
  };

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = getSessionId();
        
        if (!sessionId) {
          throw new Error('No session ID found in URL');
        }
        
        setProcessingMessage('Verifying your payment...');
        
        // Wait a moment to ensure Stripe has processed the payment
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Call the context function to update subscription
        const result = await updateSubscriptionAfterPayment(sessionId);
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to verify subscription');
        }
        
        setProcessingMessage('Success! Subscription activated.');
        
        // Wait a moment before redirecting
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Redirect to the appropriate page based on subscription level
        switch (result.data.status) {
          case 'basic':
            navigate('/dashboard/basic');
            break;
          case 'premium':
            navigate('/dashboard/premium');
            break;
          case 'elite':
            navigate('/dashboard/elite');
            break;
          default:
            navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError(err.message);
        setIsProcessing(false);
      }
    };

    verifyPayment();
  }, [location, navigate, updateSubscriptionAfterPayment]);

  // If user navigates here directly without a session ID
  useEffect(() => {
    if (!getSessionId() && subscriptionStatus !== 'none') {
      // Already subscribed, redirect to dashboard
      navigate('/dashboard');
    } else if (!getSessionId()) {
      setError('Invalid payment session. Please try subscribing again.');
      setIsProcessing(false);
    }
  }, [getSessionId, navigate, subscriptionStatus]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-10">
        {isProcessing ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-indigo-100 rounded-full">
              <svg className="w-8 h-8 text-indigo-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{processingMessage}</h2>
            <p className="mt-2 text-gray-600">
              Please don't close this page. We're setting up your subscription.
            </p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/subscription')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="mt-2 text-gray-600">
              Your subscription has been activated. You now have access to all features.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;