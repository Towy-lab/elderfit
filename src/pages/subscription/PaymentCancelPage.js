// src/pages/subscription/PaymentCancelPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancelPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Cancel Banner */}
          <div className="bg-gray-600 py-8 px-6 text-white text-center">
            <div className="mb-4 flex justify-center">
              <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
            <p className="text-xl opacity-90">Your subscription was not processed</p>
          </div>
          
          {/* Message Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-4">
                No changes have been made to your account. Your payment was not processed and you have not been charged.
              </p>
              <p className="text-gray-600 mb-8">
                If you encountered any issues or have questions about our subscription plans, please don't hesitate to contact our support team.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/subscription/plans"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  View Plans Again
                </Link>
                <Link
                  to="/dashboard"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
            
            {/* Help Section */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Our support team is here to assist you with any questions about our subscription plans.
              </p>
              <Link
                to="/help"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;