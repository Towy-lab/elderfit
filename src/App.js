import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth components and route protection
import ProtectedRoute from './components/auth/ProtectedRoute';
import SubscriptionRoute from './components/subscription/SubscriptionRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Main pages
import MarketingHome from './pages/MarketingHome';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Exercise related pages
import ExerciseSelection from './pages/ExerciseSelection';
import ExerciseDetail from './pages/ExerciseDetail';
import WorkoutList from './pages/WorkoutList';
import WorkoutDetail from './pages/WorkoutDetail';

// Subscription pages
import PricingPage from './components/pricing/PricingPage';
import BasicContent from './pages/subscription/BasicContent';
import PremiumContent from './pages/subscription/PremiumContent';
import EliteContent from './pages/subscription/EliteContent';
import FreeSignupSuccessPage from './components/subscription/FreeSignupSuccessPage';
import PaymentSuccessPage from './components/subscription/PaymentSuccessPage';
import PaymentCancelPage from './components/subscription/PaymentCancelPage';
import SubscriptionManagement from './components/subscription/SubscriptionManagement';
import SubscriptionUpgradePage from './components/subscription/SubscriptionUpgradePage';

// Premium features
import WorkoutCalendar from './components/scheduling/WorkoutCalendar';
import RestDayPlanner from './components/scheduling/RestDayPlanner';
import PainTracker from './components/safety/PainTracker';
import CommunityFeatures from './components/premium/CommunityFeatures';

// Elite features
import BookingSystem from './components/professional/BookingSystem';
import FamilyDashboard from './components/family/FamilyDashboard';
import RoutineBuilder from './components/scheduling/RoutineBuilder';
import SafetyFeatures from './components/premium/SafetyFeatures';

// Error handling components
import ErrorBoundary from './components/ErrorBoundary';
import APIErrorBoundary from './components/APIErrorBoundary';

function App() {
  return (
    <AppProviders>
      <ErrorBoundary>
        <APIErrorBoundary>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<MarketingHome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/pricing" element={<PricingPage />} />
                
                {/* Subscription success/cancel routes */}
                <Route path="/subscription/free-signup-success" element={<FreeSignupSuccessPage />} />
                <Route path="/subscription/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/subscription/payment-cancel" element={<PaymentCancelPage />} />
                
                {/* Basic tier routes (requires login) */}
                <Route path="/dashboard" element={
                <ProtectedRoute>
                <Dashboard />
                </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                
                <Route path="/subscription/manage" element={
                  <ProtectedRoute>
                    <SubscriptionManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/subscription/upgrade/:tier" element={
                  <ProtectedRoute>
                    <SubscriptionUpgradePage />
                  </ProtectedRoute>
                } />
                
                {/* Content pages by tier */}
                <Route path="/subscription/basic" element={<BasicContent />} />
                <Route path="/subscription/premium" element={<PremiumContent />} />
                <Route path="/subscription/elite" element={<EliteContent />} />
                
                {/* Workout and Exercise Routes (Basic Tier) */}
                <Route path="/workouts" element={
                  <ProtectedRoute>
                    <WorkoutList />
                  </ProtectedRoute>
                } />
                
                <Route path="/workouts/:id" element={
                  <ProtectedRoute>
                    <WorkoutDetail />
                  </ProtectedRoute>
                } />
                
                <Route path="/exercises" element={
                  <ProtectedRoute>
                    <ExerciseSelection />
                  </ProtectedRoute>
                } />
                
                <Route path="/exercises/:id" element={
                  <ProtectedRoute>
                    <ExerciseDetail />
                  </ProtectedRoute>
                } />
                
                {/* Premium tier routes */}
                <Route path="/calendar" element={
                  <SubscriptionRoute requiredTier="premium">
                    <WorkoutCalendar />
                  </SubscriptionRoute>
                } />
                
                <Route path="/rest-planning" element={
                  <SubscriptionRoute requiredTier="premium">
                    <RestDayPlanner />
                  </SubscriptionRoute>
                } />
                
                <Route path="/pain-tracker" element={
                  <SubscriptionRoute requiredTier="premium">
                    <PainTracker />
                  </SubscriptionRoute>
                } />
                
                <Route path="/community" element={
                  <SubscriptionRoute requiredTier="premium">
                    <CommunityFeatures />
                  </SubscriptionRoute>
                } />
                
                {/* Elite tier routes */}
                <Route path="/professional" element={
                  <SubscriptionRoute requiredTier="elite">
                    <BookingSystem />
                  </SubscriptionRoute>
                } />
                
                <Route path="/professional/booking" element={
                  <SubscriptionRoute requiredTier="elite">
                    <BookingSystem />
                  </SubscriptionRoute>
                } />
                
                <Route path="/family" element={
                  <SubscriptionRoute requiredTier="elite">
                    <FamilyDashboard />
                  </SubscriptionRoute>
                } />
                
                <Route path="/routine-builder" element={
                  <SubscriptionRoute requiredTier="elite">
                    <RoutineBuilder />
                  </SubscriptionRoute>
                } />
                
                <Route path="/safety" element={
                  <SubscriptionRoute requiredTier="elite">
                    <SafetyFeatures />
                  </SubscriptionRoute>
                } />
                
                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </APIErrorBoundary>
      </ErrorBoundary>
    </AppProviders>
  );
}

export default App;