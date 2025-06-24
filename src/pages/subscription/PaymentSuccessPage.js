import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.js';
import { Button } from '../../components/ui/button.js';
import { Badge } from '../../components/ui/badge.js';
import { Progress } from '../../components/ui/progress.js';
import { CheckCircle, ArrowRight, Home, Activity, Crown, Shield, Heart, Brain, Target, TrendingUp, Zap, Star, Users, Calendar, Clock, Award, Play, Settings, Info, AlertTriangle, Check, X, RotateCcw, Pause, BookOpen, Video, Users as UsersIcon, Award as AwardIcon, Calendar as CalendarIcon } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { api } from '../../services/api.js';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const { forceRefreshSubscription, subscription } = useSubscription();
  
  // Extract session ID from URL
  const getSessionId = () => {
    const params = new URLSearchParams(location.search);
    return params.get('session_id');
  };
  
  useEffect(() => {
    const verifySubscription = async () => {
      try {
        setIsProcessing(true);
        setError(null);
        
        // Get session ID
        const sessionId = getSessionId();
        console.log('Payment success - Session ID:', sessionId);
        
        if (!sessionId) {
          setError('No session ID found');
          setIsProcessing(false);
          return;
        }
        
        // Call the direct verification endpoint
        console.log('Verifying session with server...');
        const response = await api.get(`/stripe/verify-session/${sessionId}`);
        console.log('Session verification response:', response.data);
        
        // Refresh subscription data - pass true to bypass throttling
        await forceRefreshSubscription(true);
        
        // Success - redirect to dashboard after a short delay
        setTimeout(() => {
          setIsProcessing(false);
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }, 1000);
      } catch (err) {
        console.error('Error verifying subscription:', err);
        setError('Failed to verify subscription status. Please contact support.');
        setIsProcessing(false);
      }
    };
    
    verifySubscription();
  }, [forceRefreshSubscription, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow text-center">
        {isProcessing ? (
          <>
            <div className="mb-6">
              <div className="mx-auto h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-indigo-600"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Processing Your Subscription
            </h2>
            <p className="text-gray-600 mb-4">
              Please wait while we activate your subscription. This may take a few moments...
            </p>
          </>
        ) : error ? (
          <>
            <div className="text-red-500 mb-6">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Subscription Error
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/subscription/plans')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Subscription Plans
            </button>
          </>
        ) : (
          <>
            <div className="text-green-500 mb-6">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Your subscription has been activated. You now have access to {' '}
              <span className="font-medium text-indigo-600">
                {subscription?.tier ? subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1) : 'Premium'} 
              </span> features.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Redirecting you to your dashboard...
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;