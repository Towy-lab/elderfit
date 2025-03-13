// src/pages/subscription/BasicSuccessPage.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

const BasicSuccessPage = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { refreshSubscription } = useSubscription();
  
  // Refresh user data and redirect after a delay
  useEffect(() => {
    const updateUserAndRedirect = async () => {
      try {
        // Refresh data to get updated subscription info
        await refreshUser();
        await refreshSubscription();
        
        // Redirect to dashboard after 5 seconds
        const timer = setTimeout(() => {
          navigate('/dashboard');
        }, 5000);
        
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    };
    
    updateUserAndRedirect();
  }, [navigate, refreshUser, refreshSubscription]);
  
  return (
    <div className="basic-success-page text-center p-5">
      <div className="success-icon mb-4">
        <i className="fa fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
      </div>
      
      <h1>Welcome to ElderFit Secrets!</h1>
      <h2>Your Basic plan is now active</h2>
      
      <div className="card my-4">
        <div className="card-body">
          <h3>Your Free Basic Plan Includes:</h3>
          <ul className="list-unstyled mt-3">
            <li className="mb-2">
              <i className="fas fa-check text-success me-2"></i> Access to basic workout routines
            </li>
            <li className="mb-2">
              <i className="fas fa-check text-success me-2"></i> Exercise library with step-by-step instructions
            </li>
            <li className="mb-2">
              <i className="fas fa-check text-success me-2"></i> Progress tracking for up to 5 workouts
            </li>
            <li className="mb-2">
              <i className="fas fa-check text-success me-2"></i> Simple workout calendar
            </li>
            <li className="mb-2">
              <i className="fas fa-check text-success me-2"></i> Basic safety guidelines
            </li>
          </ul>
        </div>
      </div>
      
      <p>You will be redirected to the dashboard in a few seconds...</p>
      
      <div className="mt-4">
        <Link to="/dashboard" className="btn btn-primary me-3">
          Go to Dashboard Now
        </Link>
        <Link to="/subscription/plans" className="btn btn-outline-primary">
          Explore Premium Plans
        </Link>
      </div>
    </div>
  );
};

export default BasicSuccessPage;