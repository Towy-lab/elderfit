// src/components/subscription/SubscriptionManagement.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, Settings, AlertTriangle, CheckCircle, XCircle, ArrowRight, Crown, Shield, Heart } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext.js';
import SubscriptionChangeConfirmation from './SubscriptionChangeConfirmation.js';
import LoadingSpinner from '../common/LoadingSpinner.js';

const SubscriptionManagement = () => {
  const { 
    subscription, 
    loading, 
    refreshSubscription,
    formatTierName, 
    formatDate,
    upgradeSubscription,
    downgradeToBasic,
    downgradeToPremium,
    reactivateSubscription,
    cancelSubscription,
    cancelSubscriptionImmediately,
    getValidUpgradeTiers,
    getValidDowngradeTiers
  } = useSubscription();
  
  const navigate = useNavigate();
  
  const [actionState, setActionState] = useState({
    isChanging: false,
    isConfirming: false,
    changeType: null,
    selectedTier: null,
    selectedInterval: 'month',
    processing: false,
    error: null,
    message: null
  });
  
  // Initialize action buttons based on current subscription
  useEffect(() => {
    if (subscription && !loading) {
      refreshSubscription();
    }
  }, [subscription, loading, refreshSubscription]);
  
  // After successful upgrade/downgrade
  const handleSubscriptionChange = async () => {
    // API calls to change subscription...
    
    // Then refresh user experience
    await refreshSubscription(); // Refresh user data from server
    
    // Navigate to the appropriate content page
    navigate('/content');
  };
  
  // Handle plan change initiation
  const handleChangePlan = (tier, changeType) => {
    setActionState({
      ...actionState,
      isChanging: true,
      changeType: changeType,
      selectedTier: tier,
      error: null,
      message: null
    });
  };
  
  // Handle upgrade/downgrade confirmation
  const handleConfirmChange = async (changeDetails) => {
    const { tier, interval } = changeDetails;
    
    try {
      setActionState({
        ...actionState,
        processing: true,
        error: null,
        message: null
      });
      
      let result;
      
      // Handle different types of subscription changes
      if (tier === 'basic') {
        // Downgrade to basic
        result = await downgradeToBasic();
      } else if (tier === 'premium' && subscription.tier === 'elite') {
        // Special case: Downgrade from Elite to Premium
        result = await downgradeToPremium(interval);
      } else if (actionState.changeType === 'upgrade') {
        // Upgrade to paid tier
        result = await upgradeSubscription(tier, { interval });
      } else {
        // Other downgrades
        result = await upgradeSubscription(tier, { 
          interval,
          prorationBehavior: 'none' // No proration for downgrades
        });
      }
      
      if (result.success) {
        // If we get a sessionId, redirect to Stripe Checkout
        if (result.sessionId) {
          window.location.href = result.url || `https://checkout.stripe.com/pay/${result.sessionId}`;
          return;
        }
        
        // Otherwise show success message and refresh
        setActionState({
          ...actionState,
          isChanging: false,
          isConfirming: false,
          processing: false,
          message: result.message
        });
        
        // Refresh subscription data after successful change
        refreshSubscription();
      } else {
        setActionState({
          ...actionState,
          processing: false,
          error: result.error
        });
      }
    } catch (err) {
      console.error('Error during plan change:', err);
      setActionState({
        ...actionState,
        processing: false,
        error: 'An unexpected error occurred. Please try again.'
      });
    }
  };
  
  // Handle reactivation
  const handleReactivate = async () => {
    try {
      console.log('Starting subscription reactivation...', subscription);
      setActionState({
        ...actionState,
        processing: true,
        error: null,
        message: null
      });
      
      // First, force a refresh to get the latest subscription data
      console.log('Refreshing subscription data before reactivation...');
      await refreshSubscription();
      
      // Now try to reactivate
      console.log('Calling reactivateSubscription API...');
      const result = await reactivateSubscription();
      console.log('Reactivation API response:', result);
      
      if (result.success) {
        console.log('Reactivation successful, refreshing data');
        setActionState({
          ...actionState,
          isChanging: false,
          isConfirming: false,
          processing: false,
          message: result.message
        });
        
        // Refresh subscription data again
        await refreshSubscription();
      } else {
        console.error('Reactivation returned error:', result.error);
        setActionState({
          ...actionState,
          processing: false,
          error: result.error
        });
      }
    } catch (err) {
      console.error('Error during reactivation:', err);
      setActionState({
        ...actionState,
        processing: false,
        error: `Reactivation error: ${err.message}`
      });
    }
  };
  
  // Handle cancellation confirmation
  const handleConfirmCancel = async (immediate = false) => {
    try {
      setActionState({
        ...actionState,
        processing: true,
        error: null,
        message: null
      });
      
      const result = immediate
        ? await cancelSubscriptionImmediately()
        : await cancelSubscription();
      
      if (result.success) {
        setActionState({
          ...actionState,
          isChanging: false,
          isConfirming: false,
          processing: false,
          message: result.message
        });
        
        // Refresh subscription data
        refreshSubscription();
      } else {
        setActionState({
          ...actionState,
          processing: false,
          error: result.error
        });
      }
    } catch (err) {
      console.error('Error during cancellation:', err);
      setActionState({
        ...actionState,
        processing: false,
        error: 'An unexpected error occurred during cancellation. Please try again.'
      });
    }
  };
  
  // Cancel the change operation
  const handleCancelChange = () => {
    setActionState({
      ...actionState,
      isChanging: false,
      isConfirming: false,
      selectedTier: null,
      selectedInterval: 'month'
    });
  };
  
  // Format interval
  const formatInterval = (interval) => {
    return interval === 'year' ? 'Annual' : 'Monthly';
  };
  
  // Check if subscription is active
  const isSubscriptionActive = () => {
    return subscription?.status === 'active' || subscription?.tier === 'basic';
  };
  
  // Get valid upgrade options
  const upgradeOptions = getValidUpgradeTiers();
  const downgradeOptions = getValidDowngradeTiers();
  
  // Loading state
  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  // No subscription found
  if (!subscription) {
    return (
      <div className="p-8 flex flex-col items-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-700">
            You don't have any active subscription. Choose a plan to get started.
          </p>
        </div>
        <button
          onClick={() => navigate('/subscription/plans')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          View Plans
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Your Subscription</h1>
      
      {actionState.error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {actionState.error}
        </div>
      )}
      
      {actionState.message && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {actionState.message}
        </div>
      )}
      
      {actionState.isChanging ? (
        <SubscriptionChangeConfirmation 
          newTier={actionState.selectedTier}
          currentTier={subscription.tier}
          interval={actionState.selectedInterval}
          onCancel={handleCancelChange}
          onConfirm={handleConfirmChange}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Current Subscription */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">{formatTierName(subscription.tier)}</span>
              </div>
              
              {subscription.interval && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Billing:</span>
                  <span className="font-medium">{formatInterval(subscription.interval)}</span>
                </div>
              )}
              
              {subscription.status && subscription.tier !== 'basic' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    subscription.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    {subscription.cancelAtPeriodEnd && " (Cancels at period end)"}
                  </span>
                </div>
              )}
              
              {subscription.currentPeriodEnd && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Period Ends:</span>
                  <span className="font-medium">{formatDate(subscription.currentPeriodEnd)}</span>
                </div>
              )}
            </div>
            
            {/* Cancellation Warning */}
            {subscription.cancelAtPeriodEnd && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-yellow-700">
                  Your subscription is set to cancel at the end of your current billing period 
                  on {formatDate(subscription.currentPeriodEnd)}.
                </p>
                <button
                  onClick={handleReactivate}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  disabled={actionState.processing}
                >
                  {actionState.processing ? 'Processing...' : 'Reactivate Subscription'}
                </button>
              </div>
            )}
          </div>
          
          {/* Subscription Actions */}
          {isSubscriptionActive() && !subscription.cancelAtPeriodEnd && (
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Change Subscription</h3>
              
              {/* Upgrade Options */}
              {upgradeOptions.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-gray-700 font-medium mb-2">Upgrade Options</h4>
                  <div className="flex flex-wrap gap-2">
                    {upgradeOptions.map(tier => (
                      <button
                        key={`upgrade-${tier}`}
                        onClick={() => handleChangePlan(tier, 'upgrade')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Upgrade to {formatTierName(tier)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Downgrade Options */}
              {downgradeOptions.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-gray-700 font-medium mb-2">Downgrade Options</h4>
                  <div className="flex flex-wrap gap-2">
                    {downgradeOptions.map(tier => (
                      <button
                        key={`downgrade-${tier}`}
                        onClick={() => handleChangePlan(tier, 'downgrade')}
                        className={`px-4 py-2 rounded-md text-white ${
                          tier === 'basic' 
                            ? 'bg-gray-600 hover:bg-gray-700' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {tier === 'basic' ? 'Downgrade to Free' : `Downgrade to ${formatTierName(tier)}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Billing Interval Change (only for paid tiers) */}
              {subscription.tier !== 'basic' && subscription.interval && (
                <div className="mb-6">
                  <h4 className="text-gray-700 font-medium mb-2">Billing Interval</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleChangePlan(subscription.tier, 'interval')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      {subscription.interval === 'month' 
                        ? 'Switch to Annual Billing (Save ~17%)' 
                        : 'Switch to Monthly Billing'}
                    </button>
                  </div>
                </div>
              )}
              
              {/* Cancel Subscription */}
              {subscription.tier !== 'basic' && (
                <div className="mt-8 pt-6 border-t">
                  <h4 className="text-gray-700 font-medium mb-2">Cancel Subscription</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setActionState({
                          ...actionState,
                          isConfirming: true,
                          changeType: 'cancel'
                        })
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Cancel at Period End
                    </button>
                    <button
                      onClick={() => {
                        setActionState({
                          ...actionState,
                          isConfirming: true,
                          changeType: 'cancel-immediate'
                        })
                      }}
                      className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                    >
                      Cancel Immediately
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Confirmation Dialogs */}
          {actionState.isConfirming && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                {actionState.changeType === 'cancel' && (
                  <>
                    <h3 className="text-xl font-semibold mb-4">Confirm Cancellation</h3>
                    <p className="mb-6">
                      Your subscription will remain active until the end of your current billing period 
                      on {formatDate(subscription.currentPeriodEnd)}. After that, you'll be downgraded to the free Basic plan.
                    </p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setActionState({ ...actionState, isConfirming: false })}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                        disabled={actionState.processing}
                      >
                        Keep Subscription
                      </button>
                      <button
                        onClick={() => handleConfirmCancel(false)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        disabled={actionState.processing}
                      >
                        {actionState.processing ? 'Processing...' : 'Confirm Cancellation'}
                      </button>
                    </div>
                  </>
                )}
                
                {actionState.changeType === 'cancel-immediate' && (
                  <>
                    <h3 className="text-xl font-semibold mb-4">Confirm Immediate Cancellation</h3>
                    <p className="mb-6">
                      Your subscription will be canceled immediately and you'll be downgraded to the free Basic plan.
                      You may receive a prorated refund for the unused portion of your current billing period.
                    </p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setActionState({ ...actionState, isConfirming: false })}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                        disabled={actionState.processing}
                      >
                        Keep Subscription
                      </button>
                      <button
                        onClick={() => handleConfirmCancel(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        disabled={actionState.processing}
                      >
                        {actionState.processing ? 'Processing...' : 'Confirm Immediate Cancellation'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;