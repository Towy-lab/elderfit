import React from 'react';
import { Link } from 'react-router-dom';
import SubscriptionPricingPlans from '../components/subscription/PricingPlans';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const MarketingHome = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Fitness Designed for Seniors</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Discover personalized workouts, expert guidance, and a supportive community 
              to help you stay active, strong, and independent.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link 
                to="/register" 
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold px-8 py-3 rounded-lg text-lg transition-colors"
              >
                Start Your Free Trial
              </Link>
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 border border-white px-8 py-3 rounded-lg text-lg transition-colors"
              >
                Login
              </Link>
            </div>
            <div className="mt-12">
              <form className="max-w-md mx-auto flex flex-col sm:flex-row">
                <input 
                  type="email" 
                  placeholder="Enter your email for updates" 
                  className="flex-grow px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button 
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-r-lg font-semibold transition-colors sm:mt-0 mt-2"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Designed for Your Fitness Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-16 w-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">Tailored Exercises</h3>
                <p className="text-gray-600 text-center">
                  Workouts designed specifically for seniors, focusing on flexibility, balance, and strength.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-16 w-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">Video Instructions</h3>
                <p className="text-gray-600 text-center">
                  Clear video demonstrations and step-by-step guidance for each exercise.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-16 w-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">Track Your Progress</h3>
                <p className="text-gray-600 text-center">
                  Monitor your improvement over time with easy-to-understand progress tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-3 text-gray-800">Choose Your Plan</h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Start with our free Basic plan or upgrade to Premium or Elite for more personalized features.
            </p>
            <SubscriptionPricingPlans />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Our Members Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-700 font-bold">ML</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Margaret L.</h3>
                    <p className="text-gray-500">Age 72</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "I've tried other fitness programs, but none were designed for people my age. ElderFit has exercises I can actually do without pain, and I've seen real improvements in my mobility."
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-700 font-bold">RJ</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Robert J.</h3>
                    <p className="text-gray-500">Age 68</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "After my hip replacement, I was nervous about exercising again. The personalized routines and clear instructions gave me the confidence to get moving safely."
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-700 font-bold">SB</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Susan B.</h3>
                    <p className="text-gray-500">Age 65</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "I love that I can do these workouts in my living room. The Elite membership with personal consultations has been worth every penny for the customized advice."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of seniors who have improved their strength, balance, and quality of life with ElderFit Secrets.
            </p>
            <Link 
              to="/register" 
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold px-8 py-3 rounded-lg text-lg inline-block transition-colors"
            >
              Try For Free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MarketingHome;