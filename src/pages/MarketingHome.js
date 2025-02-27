// src/pages/MarketingHome.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Clock, Shield, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MarketingHome = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  
  const handleSignup = (e) => {
    e.preventDefault();
    localStorage.setItem('signupEmail', email);
    navigate('/register');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
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
      
      <Footer />
    </div>
  );
};

export default MarketingHome;