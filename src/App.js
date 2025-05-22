// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
// Import existing components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
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
// Import subscription context
import { useSubscription } from './contexts/SubscriptionContext';
// Import the new WorkoutsPage component
import WorkoutsPage from './pages/WorkoutsPage';
import SafetyGuidelines from './pages/safety/Guidelines';
import FAQ from './pages/FAQ';
import Help from './pages/Help';
// Import the new AITrainingDashboard component
import AITrainingDashboard from './components/training/AITrainingDashboard';
// Import HealthHub component
import HealthHub from './pages/health/HealthHub';

// Import AppProviders as named import
import { AppProviders } from './providers/AppProviders';

// Protected route component
const ProtectedRoute = ({ children, requiredTier }) => {
  const { isAuthenticated, loading } = useAuth();
  const { hasTierAccess, subscription } = useSubscription();
  const location = useLocation();
  const navigate = useNavigate();

  console.log('ProtectedRoute rendering for path:', location.pathname);
  console.log('Auth state:', { isAuthenticated, loading });
  console.log('Subscription state:', { subscription, requiredTier });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      navigate('/login', { state: { from: location } });
    } else if (!loading && isAuthenticated && requiredTier && !hasTierAccess(requiredTier)) {
      console.log('Insufficient subscription tier, redirecting to upgrade');
      navigate('/upgrade', { state: { from: location } });
    }
  }, [isAuthenticated, loading, location, navigate, requiredTier, hasTierAccess]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredTier && !hasTierAccess(requiredTier)) {
    return null;
  }

  console.log('Authenticated and has required tier, rendering protected content');
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
                <ProtectedRoute requiredTier="premium">
                  <PremiumContent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/content/elite" 
              element={
                <ProtectedRoute requiredTier="elite">
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
            
            {/* Device Connection Page */}
            <Route 
              path="/safety/devices" 
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
                <ProtectedRoute requiredTier="elite">
                  <AITrainingDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Health Hub Page */}
            <Route 
              path="/elite/health-hub" 
              element={
                <ProtectedRoute requiredTier="elite">
                  <HealthHub />
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