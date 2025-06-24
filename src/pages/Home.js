// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Star, Users, Shield, Heart, Brain, Target, TrendingUp, Play, Crown, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import PricingPlans from '../components/subscription/PricingPlans.js';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section - Blue background to match header */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold sm:text-5xl">
                Fitness Designed for Seniors
              </h1>
              <p className="mt-4 text-xl text-blue-100">
                ElderFit Secrets provides safe, effective workouts tailored specifically 
                for seniors. Stay active, independent, and healthy with our expertly designed 
                exercise programs.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-md">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-md">
                      Start For Free
                    </Link>
                    <Link to="/login" className="btn bg-blue-500 text-white border border-white hover:bg-blue-700 font-medium py-2 px-6 rounded-md">
                      Log In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              {/* Changed to match the yellow background with blue text from the header */}
              <div className="bg-yellow-500 text-blue-900 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-center mb-4">Why ElderFit Secrets?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 text-blue-900 mr-2">✓</span>
                    <span>Exercises designed specifically for senior mobility</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 text-blue-900 mr-2">✓</span>
                    <span>Safety features with emergency contact integration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 text-blue-900 mr-2">✓</span>
                    <span>Progress tracking designed for realistic goals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 text-blue-900 mr-2">✓</span>
                    <span>Family monitoring dashboard for peace of mind</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 text-blue-900 mr-2">✓</span>
                    <span>AI-powered guidance with real-time feedback</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-4">
                <span className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </span>
              </div>
              <h4 className="text-xl font-semibold text-center mb-2">Safe Workouts</h4>
              <p className="text-gray-600">
                Exercises designed with senior safety in mind. Options for all mobility levels with 
                clear instructions and safety tips.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-4">
                <span className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </span>
              </div>
              <h4 className="text-xl font-semibold text-center mb-2">Progress Tracking</h4>
              <p className="text-gray-600">
                Monitor your fitness journey with easy-to-use tracking tools designed specifically 
                for seniors' goals and milestones.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-4">
                <span className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              </div>
              <h4 className="text-xl font-semibold text-center mb-2">Family Connection</h4>
              <p className="text-gray-600">
                Share your activity with family members for support and accountability. Emergency 
                contact integration for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section - Using PricingPlans component */}
      <section id="pricing" className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
          {/* Integrate the PricingPlans component */}
          <PricingPlans isHomePage={true} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Members Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex text-yellow-400 mb-4">
                ★★★★★
              </div>
              <p className="text-gray-600 mb-6">
                "I've tried many exercise programs, but ElderFit Secrets is the first one that truly understands 
                the needs of seniors. I feel stronger and more confident!"
              </p>
              <div className="border-t pt-4">
                <h5 className="font-semibold">Martha J., 72</h5>
                <p className="text-sm text-gray-500">Member for 8 months</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex text-yellow-400 mb-4">
                ★★★★★
              </div>
              <p className="text-gray-600 mb-6">
                "The family dashboard gives my children peace of mind, and I love that I can track my progress. 
                The exercises are perfect for my mobility level."
              </p>
              <div className="border-t pt-4">
                <h5 className="font-semibold">Robert T., 68</h5>
                <p className="text-sm text-gray-500">Member for 1 year</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex text-yellow-400 mb-4">
                ★★★★★
              </div>
              <p className="text-gray-600 mb-6">
                "After my hip replacement, I was afraid to exercise. The safety features and 
                modifications have helped me regain strength without worry."
              </p>
              <div className="border-t pt-4">
                <h5 className="font-semibold">Diane M., 75</h5>
                <p className="text-sm text-gray-500">Member for 6 months</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Your Fitness Journey Today</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Join thousands of seniors improving their strength, balance, and overall health.</p>
          <Link to="/register" className="inline-block py-3 px-8 bg-white text-blue-600 font-bold rounded-md shadow-md hover:bg-blue-50 transition-colors">
            Start For Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;