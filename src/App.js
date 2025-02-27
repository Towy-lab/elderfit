
// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SubscriptionProvider } from './context/SubscriptionContext';
// Import the new Marketing Home Component
import MarketingHome from './pages/MarketingHome';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Auth pages
import Login from './pages/auth/Login.js';
import Register from './pages/auth/Register.js';

// Subscription pages
import PricingPlans from './components/subscription/PricingPlans.js';
import PaymentSuccessPage from './components/subscription/PaymentSuccessPage.js';
import PaymentCancelPage from './components/subscription/PaymentCancelPage.js';
import SubscriptionUpgradePage from './components/subscription/SubscriptionUpgradePage.js';
import FreeSignupSuccessPage from './components/subscription/FreeSignupSuccessPage.js';

// User account pages
import ProfilePage from './pages/account/ProfilePage.js';
import SubscriptionManagement from './components/subscription/SubscriptionManagement.js';

// Protected content pages
import Dashboard from './pages/Dashboard.js';
import BasicContent from './pages/subscription/BasicContent.js';
import PremiumContent from './pages/subscription/PremiumContent.js';
import EliteContent from './pages/subscription/EliteContent.js';

// Protected route wrapper
import ProtectedRoute from './components/ProtectedRoute.js';

function App() {
  const isLoggedIn = localStorage.getItem('user') !== null;
  
  return (
    <SubscriptionProvider>
      <div className="flex flex-col min-h-screen">
        {/* Only show Navbar on non-home routes or when logged in */}
        {(isLoggedIn || window.location.pathname !== '/') && <Navbar />}
        
        <main className="flex-grow">
          <Routes>
            {/* Home route - show marketing page for non-logged in users */}
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <MarketingHome />} />
            
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Subscription routes */}
            <Route path="/subscription" element={<PricingPlans />} />
            <Route path="/subscription/success" element={<PaymentSuccessPage />} />
            <Route path="/subscription/cancel" element={<PaymentCancelPage />} />
            <Route path="/subscription/upgrade" element={<SubscriptionUpgradePage />} />
            <Route path="/subscription/free-signup-success" element={<FreeSignupSuccessPage />} />
            
            {/* Account routes - require authentication */}
            <Route element={<ProtectedRoute requiredSubscription="none" />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/subscription" element={<SubscriptionManagement />} />
            </Route>
            
            {/* Subscription content - require specific subscription levels */}
            <Route element={<ProtectedRoute requiredSubscription="basic" />}>
              <Route path="/dashboard/basic" element={<BasicContent />} />
            </Route>
            
            <Route element={<ProtectedRoute requiredSubscription="premium" />}>
              <Route path="/dashboard/premium" element={<PremiumContent />} />
            </Route>
            
            <Route element={<ProtectedRoute requiredSubscription="elite" />}>
              <Route path="/dashboard/elite" element={<EliteContent />} />
            </Route>
            
            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Only show Footer on non-home routes or when logged in */}
        {(isLoggedIn || window.location.pathname !== '/') && <Footer />}
      </div>
    </SubscriptionProvider>
  );
}

export default App;