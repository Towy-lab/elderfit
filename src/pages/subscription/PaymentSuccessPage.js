// src/pages/subscription/PaymentSuccessPage.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

const LoadingSpinner = () => (
  <div className="spinner-border text-primary" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
);

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { refreshSubscription, subscription, formatTierName } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get the session ID from URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const sessionId = searchParams.get('session_id');
        
        if (!sessionId) {
          setError('Invalid payment session');
          setLoading(false);
          return;
        }
        
        // Refresh to get updated subscription info
        await refreshUser();
        await refreshSubscription();
      } catch (error) {
        console.error('Error verifying payment:', error);
        setError('Failed to verify payment. Please contact support.');
      } finally {
        setLoading(false);
      }
    };
    
    verifyPayment();
  }, [location, refreshUser, refreshSubscription]);
  
  // Redirect to dashboard after 5 seconds
  useEffect(() => {
    if (!loading && !error) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [loading, error, navigate]);
  
  if (loading) {
    return (
      <div className="payment-success-page text-center p-5">
        <LoadingSpinner />
        <p className="mt-3">Verifying your payment...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="payment-error-page text-center p-5">
        <div className="alert alert-danger">
          <h2>Payment Verification Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate('/subscription/plans')}
            className="btn btn-primary mt-3"
          >
            Back to Subscription Plans
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="payment-success-page text-center p-5">
      <div className="success-icon mb-4">
        <i className="fa fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
      </div>
      
      <h1>Thank You!</h1>
      <h2>Your payment was successful</h2>
      
      <div className="card my-4">
        <div className="card-body">
          <h3>Subscription Details</h3>
          <p>
            <strong>Plan: </strong> 
            {formatTierName(subscription?.tier)}
          </p>
          <p>
            <strong>Status: </strong>
            <span className="badge bg-success">Active</span>
          </p>
        </div>
      </div>
      
      <p>You will be redirected to the dashboard in a few seconds...</p>
      
      <Link
        to="/dashboard"
        className="btn btn-primary mt-3"
      >
        Go to Dashboard Now
      </Link>
    </div>
  );
};

export default PaymentSuccessPage;