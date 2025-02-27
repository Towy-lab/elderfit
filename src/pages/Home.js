// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Award, Clock, Shield, ArrowRight, Check, Star, Users, Heart } from 'lucide-react';

const Home = () => {
  const [email, setEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('user') !== null;
  const user = isLoggedIn ? JSON.parse(localStorage.getItem('user')) : null;
  
  // Determine subscription status for demo
  const subscriptionStatus = localStorage.getItem('subscription') || 'none';
  
  // Set page title based on route
  useEffect(() => {
    document.title = location.pathname === '/dashboard' 
      ? 'Dashboard | ElderFit Secrets' 
      : 'ElderFit Secrets';
  }, [location]);
  
  // Simple hasAccess function
  const hasAccess = (level) => {
    if (level === 'basic') return true;
    if (level === 'premium' && (subscriptionStatus === 'premium' || subscriptionStatus === 'elite')) return true;
    if (level === 'elite' && subscriptionStatus === 'elite') return true;
    return false;
  };
  
  // Handle email signup
  const handleSignup = (e) => {
    e.preventDefault();
    // Store email in localStorage for demo purposes
    localStorage.setItem('signupEmail', email);
    navigate('/register');
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('subscription');
    navigate('/login');
  };
  
  // Detect if we're on the dashboard route
  const isDashboard = location.pathname === '/dashboard';
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Simple Navbar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                  ElderFit<span className="text-gray-700">Secrets</span>
                </Link>
              </div>
              {isLoggedIn && (
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/dashboard"
                    className={`${
                      isDashboard 
                        ? 'border-blue-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/subscription"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Plans
                  </Link>
                  {subscriptionStatus !== 'none' && (
                    <Link
                      to="/dashboard/basic"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Workouts
                    </Link>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center">
              {isLoggedIn ? (
                <div className="flex items-center">
                  {/* Subscription badge */}
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-4 ${
                      subscriptionStatus === 'elite' 
                        ? 'bg-purple-100 text-purple-800' 
                        : subscriptionStatus === 'premium' 
                          ? 'bg-indigo-100 text-indigo-800' 
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {subscriptionStatus === 'none' ? 'Basic' : subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)}
                  </span>
                  
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium mr-2">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline-block text-sm text-gray-700 mr-2">{user.name || 'User'}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link to="/login" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Log In
                  </Link>
                  <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard Preview (If we're on dashboard route or logged in on home) */}
      {(isDashboard || (isLoggedIn && location.pathname === '/')) && (
        <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'User'}!</h1>
          <p className="text-gray-600 mb-8">Your fitness journey dashboard</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Current Plan</p>
                  <p className="font-bold text-lg">
                    {subscriptionStatus === 'none' ? 'Basic' : subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Workouts Completed</p>
                  <p className="font-bold text-lg">0</p>
                </div>
                <div>
                  <p className="text-gray-600">Fitness Score</p>
                  <p className="font-bold text-lg">N/A</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Today's Workout</h2>
              {subscriptionStatus === 'none' ? (
                <div>
                  <p className="text-gray-600 mb-4">Subscribe to access personalized workouts.</p>
                  <Link 
                    to="/subscription" 
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    View Plans
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">Your daily workout is ready!</p>
                  <Link 
                    to="/dashboard/basic" 
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Start Workout
                  </Link>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Nutrition Tips</h2>
              {hasAccess('premium') ? (
                <div>
                  <p className="text-gray-600 mb-4">Your personalized nutrition plan is available.</p>
                  <Link 
                    to="/dashboard/premium" 
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    View Nutrition Plan
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">Upgrade to Premium for personalized nutrition plans.</p>
                  <Link 
                    to="/subscription" 
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Upgrade Now
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Explore ElderFit Secrets</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link 
                to="/dashboard/basic" 
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">Workouts</h3>
                <p className="text-gray-600 text-sm">Access senior-friendly exercise routines</p>
              </Link>
              
              <Link 
                to={hasAccess('premium') ? "/dashboard/premium" : "/subscription"} 
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">Nutrition</h3>
                <p className="text-gray-600 text-sm">Healthy eating plans for seniors</p>
              </Link>
              
              <Link 
                to={hasAccess('premium') ? "/dashboard/premium" : "/subscription"} 
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">Progress Tracking</h3>
                <p className="text-gray-600 text-sm">Monitor your fitness journey</p>
              </Link>
              
              <Link 
                to={hasAccess('elite') ? "/dashboard/elite" : "/subscription"} 
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">Elite Resources</h3>
                <p className="text-gray-600 text-sm">Exclusive content for elite members</p>
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* Only show marketing sections on home page for non-logged in users */}
      {(location.pathname === '/' && !isLoggedIn) && (
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg overflow-hidden shadow-xl mb-12 mx-4 md:mx-8 lg:mx-auto lg:max-w-7xl mt-6">
            <div className="container mx-auto px-6 py-16 md:flex md:items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Supporting Fitness For Healthy Aging
                </h1>
                <p className="text-lg md:text-xl mb-8">
                  Gentle exercises, personalized routines, and senior-focused workouts that help you stay active and independent.
                </p>
                
                <div className="space-y-6">
                  <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="px-4 py-3 rounded-lg text-gray-800 w-full sm:w-64"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button 
                      type="submit"
                      className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium shadow-md transition-all"
                    >
                      Start Free
                    </button>
                  </form>
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-300" />
                    <span className="text-sm">No credit card required for basic plan</span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <Link to="/login" className="text-white underline hover:text-blue-100">
                      Already a member? Log in
                    </Link>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white bg-opacity-10 rounded-lg h-64 flex items-center justify-center border border-white border-opacity-20">
                  Senior couple exercising image
                </div>
              </div>
            </div>
          </section>

          {/* Subscription Tiers */}
          <section className="mb-12 mx-4 md:mx-8 lg:mx-auto lg:max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-6">Choose Your Fitness Journey</h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
              Our plans are designed to meet you where you are in your fitness journey, with options for every level of commitment and goal.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Basic</h3>
                  <p className="text-3xl font-bold mb-2">Free</p>
                  <p className="text-gray-600 mb-6">Perfect for beginners</p>
                  
                  <ul className="space-y-3 mb-6">
                    {[
                      'Access to basic workout library',
                      'Simple exercise tutorials',
                      'General fitness content',
                      'Community access',
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-auto">
                    <Link
                      to="/register"
                      className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg font-medium transition-colors"
                    >
                      Get Started Free
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Premium Plan */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200 transform scale-105 relative transition-all hover:shadow-xl">
                <div className="absolute top-0 right-0 bg-blue-600 text-white py-1 px-4 rounded-bl-lg text-sm font-medium">
                  Most Popular
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Premium</h3>
                  <p className="text-3xl font-bold mb-2">$9.99<span className="text-base font-normal">/month</span></p>
                  <p className="text-gray-600 mb-6">For consistent progress</p>
                  
                  <ul className="space-y-3 mb-6">
                    {[
                      'Everything in Basic',
                      'Personalized workout plans',
                      'Nutrition guidance',
                      'Progress tracking',
                      'Email support',
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-auto">
                    <Link
                      to="/register"
                      className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg font-medium transition-colors"
                    >
                      Try Premium
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Elite Plan */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Elite</h3>
                  <p className="text-3xl font-bold mb-2">$19.99<span className="text-base font-normal">/month</span></p>
                  <p className="text-gray-600 mb-6">For optimal results</p>
                  
                  <ul className="space-y-3 mb-6">
                    {[
                      'Everything in Premium',
                      'One-on-one coaching',
                      'Advanced workout routines',
                      'Video consultations',
                      'Specialized programs',
                      'Priority support',
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-auto">
                    <Link
                      to="/register"
                      className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg font-medium transition-colors"
                    >
                      Try Elite
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-12 mx-4 md:mx-8 lg:mx-auto lg:max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose ElderFit Secrets?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:transform hover:scale-105">
                <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
                  <Shield size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Safe & Low-Impact</h3>
                <p className="text-gray-600">
                  All exercises are designed with safety in mind, focusing on gentle movements and proper form.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:transform hover:scale-105">
                <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
                  <Award size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Expert Guidance</h3>
                <p className="text-gray-600">
                  Developed by physical therapists and fitness professionals specializing in senior health.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:transform hover:scale-105">
                <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
                  <Clock size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">At Your Own Pace</h3>
                <p className="text-gray-600">
                  Flexible routines that adapt to your needs, allowing you to progress at a comfortable rate.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 text-center mb-12 mx-4 md:mx-8 lg:mx-auto lg:max-w-7xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Fitness Journey?</h2>
            <p className="text-xl mb-6">Join thousands of seniors improving their health and mobility with ElderFit Secrets.</p>
            <Link to="/register" className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-lg shadow-md transition-all inline-block">
              Sign Up Now
            </Link>
          </section>
        </>
      )}
      
      {/* Simple Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">ElderFit</h3>
              <p className="text-gray-300">
                Personalized fitness for healthy aging, designed with seniors in mind.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
                {isLoggedIn && (
                  <li><Link to="/dashboard/basic" className="text-gray-300 hover:text-white">Workouts</Link></li>
                )}
                <li><Link to="/subscription" className="text-gray-300 hover:text-white">Subscription Plans</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Email: support@elderfitsecrets.com</li>
                <li>Phone: (555) 123-4567</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© 2025 ElderFit Secrets. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;