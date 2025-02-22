// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { SubscriptionProvider } from './contexts/SubscriptionContext';

// Import components
import Login from './components/auth/Login';
import PricingPlans from './components/subscription/PricingPlans';
import BookingSystem from './components/professional/BookingSystem';
import SafetyFeatures from './components/premium/SafetyFeatures';
import CommunityFeatures from './components/premium/CommunityFeatures';
import FamilyDashboard from './components/family/FamilyDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Navigation and layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Initialize Stripe - Replace with your publishable key
const stripePromise = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
  : null;

function App() {
  return (
    <SubscriptionProvider>
      <Elements stripe={stripePromise}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/pricing" element={<PricingPlans />} />
              
              {/* Protected Premium routes */}
              <Route
                path="/booking"
                element={
                  <ProtectedRoute requiredPlan="Premium">
                    <BookingSystem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/safety"
                element={
                  <ProtectedRoute requiredPlan="Premium">
                    <SafetyFeatures />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ProtectedRoute requiredPlan="Premium">
                    <CommunityFeatures />
                  </ProtectedRoute>
                }
              />

              {/* Protected Family routes */}
              <Route
                path="/family"
                element={
                  <ProtectedRoute requiredPlan="Family">
                    <FamilyDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Add other routes as needed */}
              <Route path="/success" element={<SubscriptionSuccess />} />
              <Route path="/cancel" element={<SubscriptionCancel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Elements>
    </SubscriptionProvider>
  );
}

// Basic page components
const Home = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-4xl font-bold mb-6">Welcome to ElderFit</h1>
    <p className="text-lg text-gray-600">
      Your personal companion for staying active and healthy.
    </p>
  </div>
);

const SubscriptionSuccess = () => (
  <div className="container mx-auto px-4 py-8 text-center">
    <h1 className="text-4xl font-bold mb-6 text-green-600">Success!</h1>
    <p className="text-lg mb-4">
      Thank you for subscribing to ElderFit. Your subscription is now active.
    </p>
    <a
      href="/dashboard"
      className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md
                hover:bg-blue-700 transition-colors"
    >
      Go to Dashboard
    </a>
  </div>
);

const SubscriptionCancel = () => (
  <div className="container mx-auto px-4 py-8 text-center">
    <h1 className="text-4xl font-bold mb-6">Subscription Cancelled</h1>
    <p className="text-lg mb-4">
      Your subscription process was cancelled. If you have any questions,
      please contact our support team.
    </p>
    <a
      href="/pricing"
      className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md
                hover:bg-blue-700 transition-colors"
    >
      View Plans
    </a>
  </div>
);

const NotFound = () => (
  <div className="container mx-auto px-4 py-8 text-center">
    <h1 className="text-4xl font-bold mb-6">404 - Page Not Found</h1>
    <p className="text-lg mb-4">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <a
      href="/"
      className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md
                hover:bg-blue-700 transition-colors"
    >
      Go Home
    </a>
  </div>
);

export default App;