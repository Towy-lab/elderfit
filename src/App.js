// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
// Import existing components
import Navbar from './components/layout/Navbar.js';
import Footer from './components/layout/Footer.js';
import LoadingSpinner from './components/common/LoadingSpinner.js';
import Home from './pages/Home.js';
import Dashboard from './pages/Dashboard.js';
import Login from './pages/auth/Login.js';
import Register from './pages/auth/Register.js';
import Profile from './pages/account/ProfilePage.js';
import Settings from './pages/Settings.js';
import NotFound from './pages/NotFound.js';
// Import subscription-related components
import PaymentSuccessPage from './pages/subscription/PaymentSuccessPage.js';
import PaymentCancelPage from './pages/subscription/PaymentCancelPage.js';
import BasicSuccessPage from './pages/subscription/BasicSuccessPage.js';
import SubscriptionUpgradePage from './pages/subscription/SubscriptionUpgradePage.js';
import PricingPlans from './components/subscription/PricingPlans.js';
import SubscriptionManagement from './components/subscription/SubscriptionManagement.js';
// Import tier-specific content pages
import BasicContent from './pages/subscription/BasicContent.js';
import PremiumContent from './pages/subscription/PremiumContent.js';
import EliteContent from './pages/subscription/EliteContent.js';
// Import safety-related pages
import SafetyFeaturesPage from './pages/SafetyFeaturesPage.js';
import SafetyGuidelines from './pages/safety/Guidelines.js';
import EmergencyProcedures from './pages/EmergencyProcedures.js';
import SafetyFAQ from './pages/SafetyFAQ.js';
// Import auth context
import { useAuth, AuthProvider } from './contexts/AuthContext.js';
// Import subscription context
import { useSubscription, SubscriptionProvider } from './contexts/SubscriptionContext.js';
// Import safety context
import { SafetyProvider } from './contexts/SafetyContext.js';
// Import the new WorkoutsPage component
import WorkoutsPage from './pages/WorkoutsPage.js';
import FAQ from './pages/FAQ.js';
import Help from './pages/Help.js';
import Contact from './pages/Contact.js';
// Import the new AITrainingDashboard component
import AITrainingDashboard from './components/training/AITrainingDashboard.js';
// Import HealthHub component
import HealthHub from './pages/health/HealthHub.js';
// Import HealthProvider
import { HealthProvider } from './contexts/HealthContext.js';
import DeviceConnection from './pages/devices/DeviceConnection.js';
import EducationalContent from './pages/education/EducationalContent.js';
import JointHealthArticle from './pages/education/JointHealthArticle.js';
import SeniorNutritionArticle from './pages/education/SeniorNutritionArticle.js';
import SleepRecoveryArticle from './pages/education/SleepRecoveryArticle.js';

// Import AppProviders as named import
import { AppProviders } from './providers/AppProviders.js';
import ProtectedRoute from './components/ProtectedRoute.js';

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
      <HealthProvider>
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
              
              {/* Settings Page */}
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
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
              
              {/* Emergency Procedures Page (public) */}
              <Route path="/safety/emergency" element={<EmergencyProcedures />} />
              
              {/* Safety FAQ Page (public) */}
              <Route path="/safety/faq" element={<SafetyFAQ />} />
              
              {/* FAQ Page (public) */}
              <Route path="/faq" element={<FAQ />} />
              
              {/* Help Page (public) */}
              <Route path="/help" element={<Help />} />
              
              {/* Contact Page (public) */}
              <Route path="/contact" element={<Contact />} />
              
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
              
              {/* Device Connection Page */}
              <Route path="/devices/connect" element={<DeviceConnection />} />
              
              {/* Educational Content Routes */}
              <Route 
                path="/education" 
                element={
                  <ProtectedRoute requiredTier="premium">
                    <EducationalContent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/education/joint-health" 
                element={
                  <ProtectedRoute requiredTier="premium">
                    <JointHealthArticle />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/education/senior-nutrition" 
                element={
                  <ProtectedRoute requiredTier="premium">
                    <SeniorNutritionArticle />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/education/sleep-recovery" 
                element={
                  <ProtectedRoute requiredTier="premium">
                    <SleepRecoveryArticle />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HealthProvider>
    </AppProviders>
  );
}

export default App;