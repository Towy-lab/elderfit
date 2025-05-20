// src/components/subscription/FeatureGate.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';

/**
 * Feature gating component that only renders children if the user has access to the specified tier.
 * @param {Object} props
 * @param {string} props.requiredTier - The minimum subscription tier required ('basic', 'premium', or 'elite')
 * @param {React.ReactNode} props.children - Content to render if user has access
 * @param {React.ReactNode} props.fallback - Optional custom fallback content if user doesn't have access
 */
const FeatureGate = ({ requiredTier, children, fallback }) => {
  const { hasTierAccess, subscription, loading, formatTierName } = useSubscription();
  
  // If still loading subscription data, show loading state
  if (loading) {
    return <div className="text-center p-3">Loading...</div>;
  }
  
  // If user has access, render the children
  if (hasTierAccess(requiredTier)) {
    return children;
  }
  
  // If custom fallback is provided, render it
  if (fallback) {
    return fallback;
  }
  
  // Default fallback with upgrade prompt
  return (
    <div className="feature-gate-block">
      <div className="card">
        <div className="card-body text-center">
          <h3 className="mb-3">Premium Feature</h3>
          
          <div className="alert alert-info">
            <i className="fas fa-lock me-2"></i> 
            This feature requires the <strong>{formatTierName(requiredTier)}</strong> plan or higher.
          </div>
          
          <p className="mb-4">
            You're currently on the <strong>{formatTierName(subscription?.tier || 'basic')}</strong> plan.
            Upgrade to access this feature and much more!
          </p>
          
          <Link to="/subscription/upgrade" className="btn btn-primary btn-lg">
            Upgrade Now
          </Link>
          
          <div className="mt-3">
            <Link to="/subscription/plans" className="btn btn-link">
              Compare All Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureGate;