// src/components/subscription/CheckoutButton.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { loadStripe } from '@stripe/stripe-js';

// Use a mock Stripe key for development
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

const CheckoutButton = ({ tier, interval = 'month', className = '' }) => {
  const navigate = useNavigate();
  const { createCheckoutSession, loading } = useSubscription();
  const [processing, setProcessing] = useState(false);
  
  const handleCheckout = async () => {
    try {
      setProcessing(true);
      
      // Create checkout session
      const result = await createCheckoutSession(tier, interval);
      
      if (!result.success) {
        alert(result.error || 'Failed to start checkout process');
        return;
      }
      
      // If this is a free tier, redirect to success page
      if (result.isFree) {
        navigate('/subscription/success');
        return;
      }
      
      // For paid tiers, redirect to Stripe checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: result.sessionId
      });
      
      if (error) {
        console.error('Error redirecting to checkout:', error);
        alert('Error processing payment. Please try again.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <button
      onClick={handleCheckout}
      disabled={loading || processing}
      className={`px-4 py-2 rounded-md text-white ${
        tier === 'premium' 
          ? 'bg-indigo-600 hover:bg-indigo-700' 
          : 'bg-purple-600 hover:bg-purple-700'
      } ${className}`}
    >
      {processing ? 'Processing...' : 'Subscribe Now'}
    </button>
  );
};

export default CheckoutButton;