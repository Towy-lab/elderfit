// src/hooks/useTierContent.js
import { useSubscription } from '../contexts/SubscriptionContext';
import tierConfig, { getTierFeatures, checkTierAccess } from '../config/tierConfig';

/**
 * Custom hook for accessing tier-specific content
 * 
 * This hook makes it easy to work with tier-specific content throughout the app
 * by providing convenient methods to check access, get content, etc.
 */
const useTierContent = () => {
  const { subscription, hasAccess, formatTierName } = useSubscription();
  const currentTier = subscription?.tier || 'basic';
  
  /**
   * Get feature details for a specific category in the user's current tier
   * 
   * @param {string} category - The feature category to query (e.g., 'workouts', 'support')
   * @return {Object|null} Feature details for the user's tier or null if not found
   */
  const getCurrentTierFeatures = (category) => {
    return getTierFeatures(category, currentTier);
  };
  
  /**
   * Check if the user's tier gives them access to a specific feature
   * 
   * @param {string} requiredTier - The minimum tier required for access
   * @return {boolean} Whether the user has access
   */
  const userHasAccess = (requiredTier) => {
    return hasAccess(requiredTier);
  };
  
  /**
   * Get a list of all features that a specific tier has access to
   * 
   * @param {string} tier - The tier to check (defaults to user's current tier)
   * @return {Object} An object containing all features for the specified tier
   */
  const getAllTierFeatures = (tier = currentTier) => {
    const result = {};
    
    Object.keys(tierConfig).forEach(category => {
      if (tierConfig[category][tier]) {
        result[category] = tierConfig[category][tier];
      }
    });
    
    return result;
  };
  
  /**
   * Check if a feature is available in a higher tier
   * 
   * @param {string} category - The feature category
   * @param {string} feature - The specific feature to check for
   * @return {string|null} The tier where this feature is available, or null if not found
   */
  const getFeatureAvailableTier = (category, feature) => {
    // Check each tier from highest to lowest
    const tiers = ['elite', 'premium', 'basic'];
    
    for (const tier of tiers) {
      // Skip tiers above the user's current tier
      if (checkTierAccess(tier, currentTier)) {
        const tierFeatures = getTierFeatures(category, tier);
        
        // Check if this tier has the feature
        if (tierFeatures && tierFeatures.features && 
            tierFeatures.features.some(f => f.toLowerCase().includes(feature.toLowerCase()))) {
          return tier;
        }
      }
    }
    
    return null;
  };
  
  /**
   * Get the total count of features available to the user's current tier
   * 
   * @return {number} Total feature count across all categories
   */
  const getTotalFeatureCount = () => {
    let count = 0;
    const allFeatures = getAllTierFeatures();
    
    Object.keys(allFeatures).forEach(category => {
      if (allFeatures[category].features) {
        count += allFeatures[category].features.length;
      }
    });
    
    return count;
  };
  
  /**
   * Get features that would be unlocked by upgrading to a specified tier
   * 
   * @param {string} targetTier - The tier to compare with current tier
   * @return {Object} New features by category that would be unlocked
   */
  const getUpgradeFeatures = (targetTier) => {
    // If user is already at or above the target tier, return empty
    if (checkTierAccess(targetTier, currentTier)) {
      return {};
    }
    
    const result = {};
    
    Object.keys(tierConfig).forEach(category => {
      // Skip if category doesn't exist for either tier
      if (!tierConfig[category][currentTier] || !tierConfig[category][targetTier]) {
        return;
      }
      
      // Get current and target features
      const currentFeatures = tierConfig[category][currentTier].features || [];
      const targetFeatures = tierConfig[category][targetTier].features || [];
      
      // Find new features in the target tier
      const newFeatures = targetFeatures.filter(
        feature => !currentFeatures.some(
          currentFeature => currentFeature.toLowerCase() === feature.toLowerCase()
        )
      );
      
      // Add to result if there are new features
      if (newFeatures.length > 0) {
        result[category] = {
          title: category.charAt(0).toUpperCase() + category.slice(1),
          features: newFeatures
        };
      }
    });
    
    return result;
  };
  
  return {
    currentTier,
    formatTierName,
    getCurrentTierFeatures,
    userHasAccess,
    getAllTierFeatures,
    getFeatureAvailableTier,
    getTotalFeatureCount,
    getUpgradeFeatures
  };
};

export default useTierContent;