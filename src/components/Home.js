// src/pages/Home.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Clock, Shield, ArrowRight, Check, Star, Users, Heart, Eye } from 'lucide-react';

const Home = () => {
  const [email, setEmail] = useState('');
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('user') !== null;
  const user = isLoggedIn ? JSON.parse(localStorage.getItem('user')) : null;
  
  // Determine subscription status for demo
  const subscriptionStatus = localStorage.getItem('subscription') || 'none';
  
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
    window.location.href = '/register';
  };
  
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
            </div>
            <div className="flex items-center">
              {isLoggedIn ? (
                <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
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
            
            {isLoggedIn ? (
              <div className="flex flex-wrap gap-4">
                <Link to="/dashboard" className="btn bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium shadow-md transition-all">
                  Go to Dashboard
                </Link>
                <Link to="/exercises" className="btn bg-transparent border-2 border-white hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-all">
                  Explore Exercises
                </Link>
              </div>
            ) : (
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
            )}
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
                  to={isLoggedIn ? "/dashboard/basic" : "/register"}
                  className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg font-medium transition-colors"
                >
                  {isLoggedIn ? 'Access Basic Features' : 'Get Started Free'}
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
                  to={isLoggedIn && hasAccess('premium') ? "/dashboard/premium" : "/subscription"}
                  className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg font-medium transition-colors"
                >
                  {isLoggedIn && hasAccess('premium') ? 'Access Premium Features' : 'Upgrade to Premium'}
                </Link>
              </div>
            </div>
          </div>
          
          {/* Elite Plan */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg relative">
            <div className="absolute top-0 right-0 bg-yellow-500 text-blue-900 py-1 px-4 rounded-bl-lg text-sm font-medium">
              Best Value
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Elite</h3>
              <p className="text-3xl font-bold mb-2">$19.99<span className="text-base font-normal">/month</span></p>
              <p className="text-gray-600 mb-6">For optimal results with AI assistance</p>
              
              <ul className="space-y-3 mb-6">
                {[
                  'Everything in Premium',
                  'AI-powered form analysis',
                  'Real-time safety monitoring',
                  'Personalized progress tracking',
                  'Monthly curated exercise collections',
                  'Advanced workout adaptations',
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
                  to={isLoggedIn && hasAccess('elite') ? "/dashboard/elite" : "/subscription"}
                  className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg font-medium transition-colors"
                >
                  {isLoggedIn && hasAccess('elite') ? 'Access Elite Features' : 'Upgrade to Elite'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
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
              <h3 className="text-xl font-semibold mb-3">AI-Powered Guidance</h3>
              <p className="text-gray-600">
                Advanced AI technology that analyzes your movements and provides real-time feedback, ensuring safe and effective workouts.
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
        </div>
      </section>

      {/* New AI Features Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Elite AI-Powered Features</h2>
          <p className="text-center text-blue-100 mb-12 max-w-3xl mx-auto">
            Experience the future of senior fitness with our advanced AI technology, exclusively available in the Elite plan.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Feature 1 */}
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <div className="inline-block p-4 bg-white bg-opacity-20 rounded-full text-white mb-4">
                <Eye size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Form Analysis</h3>
              <p className="text-blue-100">
                Get instant feedback on your exercise form with our AI-powered camera analysis, helping you maintain proper technique and prevent injuries.
              </p>
            </div>

            {/* AI Feature 2 */}
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <div className="inline-block p-4 bg-white bg-opacity-20 rounded-full text-white mb-4">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Safety Monitoring</h3>
              <p className="text-blue-100">
                Advanced safety monitoring that detects potential risks and provides immediate guidance to ensure your workout remains safe and effective.
              </p>
            </div>

            {/* AI Feature 3 */}
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <div className="inline-block p-4 bg-white bg-opacity-20 rounded-full text-white mb-4">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Monthly Exercise Collections</h3>
              <p className="text-blue-100">
                Access specially curated exercise groups each month, designed to target specific areas of senior fitness and wellness.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/subscription"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold px-8 py-3 rounded-lg text-lg transition-colors"
            >
              Upgrade to Elite
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 text-center mb-12 mx-4 md:mx-8 lg:mx-auto lg:max-w-7xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Fitness Journey?</h2>
        <p className="text-xl mb-6">Join thousands of seniors improving their health and mobility with ElderFit Secrets.</p>
        {isLoggedIn ? (
          <Link to="/dashboard" className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-lg shadow-md transition-all inline-block">
            Go to Dashboard
          </Link>
        ) : (
          <Link to="/register" className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-lg shadow-md transition-all inline-block">
            Sign Up Now
          </Link>
        )}
      </section>
      
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
                <li><Link to="/exercises" className="text-gray-300 hover:text-white">Exercises</Link></li>
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