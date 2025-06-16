// src/components/subscription/TierContentLoader.js
import React from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import TierContentManager from './TierContentManager';

const TierContentLoader = ({ 
  requiredTier, 
  content, 
  featureName = 'this content',
  preview = false,
  previewContent = null
}) => {
  const { hasAccess } = useSubscription();
  
  // Filter content based on user's access
  const accessibleContent = content.filter(item => hasAccess(item.requiredTier || requiredTier));
  
  return (
    <TierContentManager
      requiredTier={requiredTier}
      featureName={featureName}
      preview={preview}
      previewContent={previewContent}
    >
      {accessibleContent}
    </TierContentManager>
  );
};

export default TierContentLoader;