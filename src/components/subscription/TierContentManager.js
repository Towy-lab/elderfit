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
  const { hasTierAccess, formatTierName } = useSubscription();
  
  const hasAccess = hasTierAccess(requiredTier);
  
  // If user has access, show the content
  if (hasAccess) {
    return <>{children}</>;
  }
  
  // If preview mode is enabled, show a preview with upgrade prompt
  if (preview && previewContent) {
    return (
      <div className="relative">
        <div className="filter blur-sm pointer-events-none">
          {previewContent}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50 rounded-lg p-6 text-center">
          <LockIcon size={32} className="text-white mb-2" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Upgrade to {formatTierName(requiredTier)}
          </h3>
          <p className="text-white mb-4">
            Unlock {featureName} and many more {requiredTier === 'elite' ? 'elite' : 'premium'} features!
          </p>
          <Link 
            to="/subscription/plans" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            View Plans
          </Link>
        </div>
      </div>
    );
  }
  
  // Default locked content message
  return (
    <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
      <LockIcon size={24} className="text-gray-400 mx-auto mb-2" />
      <p className="text-gray-600 mb-3">
        {fallbackMessage || `This ${featureName} is available with the ${formatTierName(requiredTier)} plan.`}
      </p>
      <Link 
        to="/subscription/plans" 
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-block"
      >
        Upgrade Now
      </Link>
    </div>
  );
};

export default TierContentManager;