// src/components/subscription/ForceUpdateButton.js
import React, { useState } from 'react';

/**
 * A button to force update subscription when automatic methods fail
 */
const ForceUpdateButton = ({ targetTier = 'premium', onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const handleForceUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch('/api/stripe/manual-subscription-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ tier: targetTier })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(targetTier);
        }
        
        // Auto refresh after successful update
        setTimeout(() => {
          window.location.href = '/dashboard?refresh=' + Date.now();
        }, 2000);
        setError(data.error || 'Update failed');
      }
    } catch (err) {
      setError(err.message || 'Connection error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <button
        onClick={handleForceUpdate}
        disabled={loading || success}
        className={`px-4 py-2 rounded font-medium ${
          success 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-300'
        } flex items-center justify-center min-w-[200px]`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating...
          </>
        ) : success ? (
          <>
            <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Updated Successfully
          </>
        ) : (
          `Force Update to ${targetTier.charAt(0).toUpperCase() + targetTier.slice(1)}`
        )}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">
          Error: {error}
        </p>
      )}
      
      {success && (
        <p className="mt-2 text-sm text-green-600">
          Subscription updated. Redirecting to dashboard...
        </p>
      )}
    </div>
  );
};

export default ForceUpdateButton;