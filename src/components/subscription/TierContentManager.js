// src/components/subscription/TierContentManager.js
import React from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Link } from 'react-router-dom';
import { LockIcon } from 'lucide-react';

/**
 * TierContentManager - A component to manage content visibility based on subscription tier
 * 
 * @param {Object} props
 * @param {string} props.requiredTier - Minimum tier required to access content ('basic', 'premium', 'elite')
 * @param {React.ReactNode} props.children - The content to display if user has access
 * @param {string} props.fallbackMessage - Custom message to show if user doesn't have access
 * @param {boolean} props.preview - If true, shows a preview of the locked content with an upgrade prompt
 * @param {string} props.featureName - Name of the feature (for the upgrade message)
 * @param {React.ReactNode} props.previewContent - Content to show in preview mode
 */
const TierContentManager = ({ 
  requiredTier, 
  children, 
  fallbackMessage,
  preview = false,
  featureName = "feature",
  previewContent = null
}) => {
  const { hasAccess, formatTierName } = useSubscription();
  
  // If preview mode is enabled, show preview content
  if (preview) {
    return (
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-medium text-gray-800 mb-3">
            {formatTierName(requiredTier)} Content Preview
          </h3>
          <p className="text-gray-700 mb-4">
            Upgrade to {formatTierName(requiredTier)} to access {featureName}.
          </p>
          {previewContent}
          <div className="mt-4">
            <Link
              to="/subscription/plans"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Upgrade to {formatTierName(requiredTier)}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Check if user has access to the required tier
  if (!hasAccess(requiredTier)) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-medium text-gray-800 mb-3">
          {formatTierName(requiredTier)} Access Required
        </h3>
        <p className="text-gray-700 mb-4">
          You need a {formatTierName(requiredTier)} subscription to access {featureName}.
        </p>
        <Link
          to="/subscription/plans"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Upgrade to {formatTierName(requiredTier)}
        </Link>
      </div>
    );
  }
  
  // If user has access, render the children
  return children;
};

export default TierContentManager;