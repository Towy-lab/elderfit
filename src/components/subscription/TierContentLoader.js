// src/components/subscription/TierContentLoader.js
import React from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import TierContentManager from './TierContentManager';

const TierContentLoader = ({ 
  contentArray, 
  renderItem,
  emptyMessage = "No content available",
  showPreview = true,
  previewCount = 3
}) => {
  const { hasTierAccess } = useSubscription();
  
  // Filter content for tiers the user has access to
  const accessibleContent = contentArray.filter(item => 
    hasTierAccess(item.tier || 'basic')
  );
  
  // Get preview content from higher tiers
  const previewContent = showPreview ? 
    contentArray
      .filter(item => !hasTierAccess(item.tier || 'basic'))
      .slice(0, previewCount) : 
    [];
  
  return (
    <div>
      {accessibleContent.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessibleContent.map(item => renderItem(item))}
        </div>
      ) : (
        <div className="text-center p-4">{emptyMessage}</div>
      )}
      
      {previewContent.length > 0 && (
        <div className="mt-8">
          <TierContentManager
            requiredTier={previewContent[0].tier}
            featureName={`additional ${previewContent[0].contentType || 'content'}`}
            preview={true}
            previewContent={
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {previewContent.map(item => renderItem({...item, isPreview: true}))}
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default TierContentLoader;