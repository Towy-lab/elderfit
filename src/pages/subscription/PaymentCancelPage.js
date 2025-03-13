// src/pages/subscription/PaymentCancelPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancelPage = () => {
  return (
    <div className="payment-cancel-page text-center p-5">
      <div className="card">
        <div className="card-body">
          <h1 className="mb-4">Payment Cancelled</h1>
          
          <div className="alert alert-info mb-4">
            <p>Your subscription payment was cancelled. No charges have been made.</p>
          </div>
          
          <p className="mb-4">
            You can try again when you're ready or explore our other subscription options.
          </p>
          
          <div className="d-flex justify-content-center gap-3">
            <Link to="/subscription/plans" className="btn btn-primary">
              View Subscription Plans
            </Link>
            <Link to="/dashboard" className="btn btn-outline-secondary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <p>
          Need help with your subscription? <a href="mailto:support@elderfitsecrets.com">Contact our support team</a>
        </p>
      </div>
    </div>
  );
};

export default PaymentCancelPage;