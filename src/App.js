// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// Import existing components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/account/ProfilePage';
import NotFound from './pages/NotFound';
// Import subscription-related components
import PaymentSuccessPage from './pages/subscription/PaymentSuccessPage';
import PaymentCancelPage from './pages/subscription/PaymentCancelPage';
import BasicSuccessPage from './pages/subscription/BasicSuccessPage';
import SubscriptionUpgradePage from './pages/subscription/SubscriptionUpgradePage';
import PricingPlans from './components/subscription/PricingPlans';
import SubscriptionManagement from './components/subscription/SubscriptionManagement';
// Import tier-specific content pages
import BasicContent from './pages/subscription/BasicContent';
import PremiumContent from './pages/subscription/PremiumContent';
import EliteContent from './pages/subscription/EliteContent';
// Import safety-related pages
import SafetyFeaturesPage from './pages/SafetyFeaturesPage';
// Import auth context
import { useAuth } from './contexts/AuthContext';
// Import the new WorkoutsPage component
import WorkoutsPage from './pages/WorkoutsPage';
import SafetyGuidelines from './pages/safety/Guidelines';
import FAQ from './pages/FAQ';
import Help from './pages/Help';
// Import the new AITrainingDashboard component
import AITrainingDashboard from './components/training/AITrainingDashboard';
import Settings from './pages/Settings';

// Import AppProviders as named import
import { AppProviders } from './providers/AppProviders';

// Protected Route component for React Router v6
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Add logging
  console.log('ProtectedRoute rendering for path:', location.pathname);
  console.log('Auth state:', { isAuthenticated, loading });
  
  // If still loading auth state, show loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render the protected component
  console.log('Authenticated, rendering protected content');
  return children;
};

// Main App component with debugging
function App() {
  const location = useLocation();
  
  // Add effect for scrolling to top on route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Add debug logging for App component
  useEffect(() => {
    console.log('App mounted, current path:', location.pathname);
    
    // Check if we're on the root path and log it
    if (location.pathname === '/') {
      console.log('App is on root path (/)');
    }
  }, [location.pathname]);

  return (
    <AppProviders>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Explicitly define home route with highest priority */}
            <Route index element={<Home />} />
            <Route exact path="/" element={<Home />} />
            
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/subscription/plans" element={<PricingPlans />} />
            <Route path="/subscription/success" element={<PaymentSuccessPage />} />
            <Route path="/subscription/cancel" element={<PaymentCancelPage />} />
            <Route path="/subscription/basic-success" element={<BasicSuccessPage />} />
            
            {/* Redirect old pricing page to new subscription plans page */}
            <Route path="/pricing" element={<Navigate to="/subscription/plans" replace />} />
            
            {/* Protected routes with explicit checks */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/workouts" 
              element={
                <ProtectedRoute>
                  <WorkoutsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/subscription/manage" 
              element={
                <ProtectedRoute>
                  <SubscriptionManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/subscription/upgrade" 
              element={
                <ProtectedRoute>
                  <SubscriptionUpgradePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Tier-specific content routes */}
            <Route 
              path="/content/basic" 
              element={
                <ProtectedRoute>
                  <BasicContent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/content/premium" 
              element={
                <ProtectedRoute>
                  <PremiumContent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/content/elite" 
              element={
                <ProtectedRoute>
                  <EliteContent />
                </ProtectedRoute>
              } 
            />
            
            {/* Safety Features Page */}
            <Route 
              path="/safety" 
              element={
                <ProtectedRoute>
                  <SafetyFeaturesPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Safety Guidelines Page (public) */}
            <Route path="/safety/guidelines" element={<SafetyGuidelines />} />
            
            {/* FAQ Page (public) */}
            <Route path="/faq" element={<FAQ />} />
            
            {/* Help Page (public) */}
            <Route path="/help" element={<Help />} />
            
            {/* AI Training Page */}
            <Route 
              path="/elite/ai-training" 
              element={
                <ProtectedRoute>
                  <AITrainingDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Settings Page - Redirect to profile */}
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Navigate to="/profile" replace />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AppProviders>
  );
}

export default App;