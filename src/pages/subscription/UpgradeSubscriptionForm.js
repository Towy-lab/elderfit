// src/components/subscription/UpgradeSubscriptionForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { useSubscription } from '../../contexts/SubscriptionContext.js';
import { loadStripe } from '@stripe/stripe-js';

// Use a mock Stripe key for development
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

const UpgradeSubscriptionForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, upgradeSubscription, formatTierName } = useSubscription();
  const [selectedTier, setSelectedTier] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Get current tier or default to basic
  const currentTier = subscription?.tier || 'basic';
  
  // Define available upgrade tiers
  const upgradeTiers = [
    { id: 'premium', name: 'Premium', price: '$9.99/month', features: [
      'Unlimited workout tracking',
      'Personalized exercise recommendations',
      'Access to live weekly guidance sessions',
      'Safety features for exercise modifications',
      'Advanced calendar and scheduling',
      'Email and chat support'
    ]},
    { id: 'elite', name: 'Elite', price: '$14.99/month', features: [
      'One-on-one virtual coaching sessions',
      'Family monitoring dashboard',
      'Emergency contact integration',
      'Advanced health tracking features',
      'Priority customer support',
      'Custom workout plans designed for your needs'
    ]}
  ].filter(tier => {
    // Filter tiers based on current subscription
    const tierRanking = { basic: 0, premium: 1, elite: 2 };
    return tierRanking[tier.id] > tierRanking[currentTier];
  });
  
  // If no upgrades available (already on highest tier)
  if (upgradeTiers.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <h2>You're Already on Our Best Plan!</h2>
          <p>You're currently subscribed to our Elite tier, which includes all features.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTier) {
      alert('Please select a subscription tier');
      return;
    }
    
    try {
      setLoading(true);
      
      // Call API to upgrade subscription
      const result = await upgradeSubscription(selectedTier);
      
      if (!result.success) {
        alert(result.error || 'Failed to upgrade subscription');
        return;
      }
      
      // If this is a free->paid upgrade that requires checkout
      if (result.sessionId) {
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: result.sessionId
        });
        
        if (error) {
          console.error('Error redirecting to checkout:', error);
          alert('Error processing payment. Please try again.');
        }
        return;
      }
      
      // For tier-to-tier upgrade (both paid)
      alert(result.message || 'Subscription upgraded successfully');
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to subscription management page
        navigate('/subscription/manage');
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card">
      <div className="card-header">
        <h2>Upgrade Your Subscription</h2>
      </div>
      <div className="card-body">
        <p className="lead">
          You're currently on the <strong>{formatTierName(currentTier)}</strong> plan.
          Upgrade to access more features!
        </p>
        
        <form onSubmit={handleSubmit} className="subscription-upgrade-form">
          <div className="form-group mb-4">
            <label className="form-label">Select your new plan:</label>
            
            {upgradeTiers.map(tier => (
              <div className="tier-option card mb-3" key={tier.id}>
                <div className="card-body">
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id={`tier-${tier.id}`}
                      name="subscriptionTier"
                      value={tier.id}
                      checked={selectedTier === tier.id}
                      onChange={() => setSelectedTier(tier.id)}
                    />
                    <label className="form-check-label" htmlFor={`tier-${tier.id}`}>
                      <strong>{tier.name}</strong> - {tier.price}
                    </label>
                  </div>
                  
                  <div className="ms-4 mt-2">
                    <strong>Features include:</strong>
                    <ul>
                      {tier.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading || !selectedTier}
            >
              {loading ? 'Processing...' : 'Upgrade Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpgradeSubscriptionForm;