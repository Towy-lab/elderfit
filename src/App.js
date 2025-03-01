import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AppProviders from './providers/AppProviders';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SubscriptionRoute from './components/subscription/SubscriptionRoute';

// Pages
import MarketingHome from './pages/MarketingHome';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import WorkoutDetail from './pages/WorkoutDetail';
import Help from './pages/Help';
import BasicContent from './pages/subscription/BasicContent';
import PremiumContent from './pages/subscription/PremiumContent';
import EliteContent from './pages/subscription/EliteContent';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <AppProviders>
      <div className="flex flex-col min-h-screen">
        {/* Only show Navbar on non-home pages */}
        {!isHomePage && <Navbar />}
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<MarketingHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workout/:id" 
              element={
                <ProtectedRoute>
                  <WorkoutDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/help" 
              element={
                <ProtectedRoute>
                  <Help />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/basic" 
              element={
                <ProtectedRoute>
                  <BasicContent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/premium" 
              element={
                <SubscriptionRoute requiredTier="premium">
                  <PremiumContent />
                </SubscriptionRoute>
              } 
            />
            <Route 
              path="/elite" 
              element={
                <SubscriptionRoute requiredTier="elite">
                  <EliteContent />
                </SubscriptionRoute>
              } 
            />
            <Route path="*" element={
              <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
                <p className="mb-8">Sorry, the page you're looking for doesn't exist.</p>
                <a 
                  href="/" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                >
                  Return Home
                </a>
              </div>
            } />
          </Routes>
        </main>
        
        {/* Only show Footer on non-home pages */}
        {!isHomePage && <Footer />}
      </div>
    </AppProviders>
  );
}

export default App;