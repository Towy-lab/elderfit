// src/components/subscription/SubscriptionChangeConfirmation.js
import React, { useState, useEffect } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';

const SubscriptionChangeConfirmation = ({ 
  newTier, 
  currentTier, 
  interval = 'month',
  onCancel, 
  onConfirm 
}) => {
  const { formatTierName, calculateProration } = useSubscription();
  const [priceInfo, setPriceInfo] = useState({
    loading: true,
    immediate: 0,
    next: 0,
    currency: 'usd',
    error: null,
    isDowngrade: false
  });
  
  // Format currency values
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'usd'
    }).format(amount);
  };
  
  // Get pricing information when the component mounts
  useEffect(() => {
    const getProrationDetails = async () => {
      try {
        // Special case for any downgrade - use simplified display without API call
        if (
          (currentTier === 'elite' && (newTier === 'premium' || newTier === 'basic')) ||
          (currentTier === 'premium' && newTier === 'basic')
        ) {
          console.log(`Special case: ${currentTier} to ${newTier} downgrade`);
          setPriceInfo({
            loading: false,
            immediate: 0,
            next: newTier === 'premium' ? 9.99 : 0, // Use the appropriate price
            currency: 'usd',
            isDowngrade: true
          });
          return;
        }
        
        // Get proration details from API
        const result = await calculateProration(newTier, interval);
        if (result.success) {
          setPriceInfo({
            loading: false,
            immediate: result.prorationDetails.immediateCharge,
            next: result.prorationDetails.nextBillingAmount,
            currency: result.prorationDetails.currency,
            isDowngrade: result.prorationDetails.isDowngrade || false
          });
        } else {
          setPriceInfo(prev => ({
            ...prev,
            loading: false,
            error: result.error || 'Failed to calculate price changes'
          }));
        }
      } catch (error) {
        console.error('Error calculating proration:', error);
        setPriceInfo(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to calculate price changes'
        }));
      }
    };
    
    getProrationDetails();
  }, [newTier, currentTier, interval, calculateProration]);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ tier: newTier, interval });
  };
  
  // Format tier type for display
  const changeType = currentTier === 'basic' || (currentTier === 'premium' && newTier === 'elite')
    ? 'upgrade'
    : 'downgrade';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold mb-2">
          {changeType === 'upgrade' ? 'Upgrade' : 'Downgrade'} Confirmation
        </h2>
        <p className="text-gray-600">
          Please review your subscription change before confirming.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {/* Change Details */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Change Details</h3>
          
          <div className="bg-gray-50 rounded-md p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Current Plan:</span>
              <span className="font-medium">{formatTierName(currentTier)}</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">New Plan:</span>
              <span className="font-medium">{formatTierName(newTier)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Billing Cycle:</span>
              <span className="font-medium">{interval === 'year' ? 'Annual' : 'Monthly'}</span>
            </div>
          </div>
        </div>
        
        {/* Price change information */}
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          {priceInfo.loading ? (
            <p className="text-center">Calculating price changes...</p>
          ) : priceInfo.error ? (
            <p className="text-red-600">{priceInfo.error}</p>
          ) : priceInfo.isDowngrade ? (
            <div>
              <p className="text-gray-700">
                You will be downgraded to {formatTierName(newTier)} at the end of your current billing period.
                There will be no immediate charge, and your next billing amount will be
                {` ${formatCurrency(priceInfo.next, priceInfo.currency)}`}.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-2">
                <span className="text-gray-600">Immediate charge:</span>
                <span className="ml-2 font-medium">
                  {formatCurrency(priceInfo.immediate, priceInfo.currency)}
                </span>
              </div>
              
              <div>
                <span className="text-gray-600">Next billing amount:</span>
                <span className="ml-2 font-medium">
                  {formatCurrency(priceInfo.next, priceInfo.currency)}
                  {interval === 'month' ? '/month' : '/year'}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-white ${
              changeType === 'upgrade' 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Confirm {changeType === 'upgrade' ? 'Upgrade' : 'Downgrade'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionChangeConfirmation;