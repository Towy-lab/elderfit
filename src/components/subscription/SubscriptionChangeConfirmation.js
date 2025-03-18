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
  const { calculateProration, formatTierName, formatDate } = useSubscription();
  
  const [prorationDetails, setProrationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Format currency
  const formatCurrency = (amount, currency = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  };
  
  // Determine if this is an upgrade or downgrade
  const isUpgrade = () => {
    const tierLevels = { 'basic': 0, 'premium': 1, 'elite': 2 };
    return tierLevels[newTier] > tierLevels[currentTier];
  };
  
  // Determine change type
  const changeType = isUpgrade() ? 'upgrade' : 'downgrade';
  
  // Get proration details when component mounts
  useEffect(() => {
    const getProrationDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Only calculate proration for non-basic plans
        if (newTier !== 'basic') {
          const result = await calculateProration(newTier, interval);
          if (result.success) {
            setProrationDetails(result.prorationDetails);
          } else {
            setError(result.error);
          }
        } else {
          // For basic plan, no immediate charge
          setProrationDetails({
            immediateCharge: 0,
            nextBillingAmount: 0,
            currency: 'usd',
            nextBillingDate: null
          });
        }
      } catch (err) {
        setError('Failed to calculate price change');
      } finally {
        setLoading(false);
      }
    };
    
    getProrationDetails();
  }, [newTier, interval]);
  
  const handleConfirm = () => {
    onConfirm({
      tier: newTier,
      interval,
      proration: prorationDetails
    });
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">
        {isUpgrade() ? 'Upgrade to' : 'Change to'} {formatTierName(newTier)}
      </h3>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : (
        <div className="space-y-4">
          {/* Current plan */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Current plan:</span>
            <span className="font-medium">{formatTierName(currentTier)}</span>
          </div>
          
          {/* New plan */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">New plan:</span>
            <span className="font-medium">{formatTierName(newTier)}</span>
          </div>
          
          {prorationDetails && (
            <>
              {newTier !== 'basic' && (
                <>
                  {/* Immediate charge/credit */}
                  <div className="flex justify-between items-center border-t pt-4">
                    <span className="text-gray-600">
                      {prorationDetails.immediateCharge > 0 ? 'Immediate charge:' : 'Credit applied:'}
                    </span>
                    <span className={`font-medium ${prorationDetails.immediateCharge > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(Math.abs(prorationDetails.immediateCharge), prorationDetails.currency)}
                    </span>
                  </div>
                  
                  {/* Next billing amount */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Next billing amount:</span>
                    <span className="font-medium">
                      {formatCurrency(prorationDetails.nextBillingAmount, prorationDetails.currency)}
                    </span>
                  </div>
                  
                  {/* Next billing date */}
                  {prorationDetails.nextBillingDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Next billing date:</span>
                      <span className="font-medium">{formatDate(prorationDetails.nextBillingDate)}</span>
                    </div>
                  )}
                </>
              )}
              
              {newTier === 'basic' && (
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-gray-600">
                    Your paid subscription will continue until the end of your current billing period.
                    After that, you'll be automatically moved to the free Basic plan.
                  </p>
                </div>
              )}
            </>
          )}
          
          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-500 mb-4">
              {newTier === 'basic' 
                ? "Your plan will be downgraded to Basic (free) at the end of your current billing period."
                : isUpgrade() 
                  ? "You'll be charged immediately for the prorated amount and have access to your new plan right away."
                  : "Your plan will be changed immediately. Any credit will be applied to your next bill."}
            </p>
            
            <div className="flex space-x-4 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-md text-white ${
                  isUpgrade() 
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : newTier === 'basic'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Confirm {changeType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionChangeConfirmation;