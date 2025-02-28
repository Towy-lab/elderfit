// src/pages/MarketingHome.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Clock, Shield, Check } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

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
      
      <div className="pt-24 pb-10">
        {/* Hero Section */}
        <section className="bg-blue-600 text-white rounded-lg mb-12 mx-4 md:mx-8 lg:mx-auto lg:max-w-7xl">
          <div className="container mx-auto px-6 py-16 md:flex md:items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl font-bold mb-4">Supporting Fitness For Healthy Aging</h1>
              <p className="text-lg mb-8">Gentle exercises, personalized routines, and senior-focused workouts.</p>
              
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
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium"
                >
                  Start Free
                </button>
              </form>
              
              <div className="mt-4">
                <Link to="/login" className="text-white underline">Already a member? Log in</Link>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-white bg-opacity-10 rounded-lg h-64 flex items-center justify-center">
                Senior couple exercising image
              </div>
            </div>
          </div>
        </section>

        {/* Subscription Tiers */}
        <section className="mb-12 mx-4 md:mx-8 lg:mx-auto lg:max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-6">Choose Your Fitness Journey</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">Basic</h3>
              <p className="text-3xl font-bold mb-2">Free</p>
              <p className="text-gray-600 mb-6">Perfect for beginners</p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1" />
                  <span>Access to basic workout library</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1" />
                  <span>Simple exercise tutorials</span>
                </li>
              </ul>
              
              <Link to="/register" className="block w-full py-3 px-4 bg-blue-600 text-white text-center rounded-lg">
                Get Started Free
              </Link>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200 transform scale-105">
              <div className="absolute top-0 right-0 bg-blue-600 text-white py-1 px-4 rounded-bl-lg text-sm">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Premium</h3>
              <p className="text-3xl font-bold mb-2">$9.99<span className="text-base font-normal">/month</span></p>
              <p className="text-gray-600 mb-6">For consistent progress</p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1" />
                  <span>Everything in Basic</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1" />
                  <span>Personalized workout plans</span>
                </li>
              </ul>
              
              <Link to="/register" className="block w-full py-3 px-4 bg-blue-600 text-white text-center rounded-lg">
                Try Premium
              </Link>
            </div>
            
            {/* Elite Plan */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">Elite</h3>
              <p className="text-3xl font-bold mb-2">$19.99<span className="text-base font-normal">/month</span></p>
              <p className="text-gray-600 mb-6">For optimal results</p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1" />
                  <span>Everything in Premium</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 mt-1" />
                  <span>One-on-one coaching</span>
                </li>
              </ul>
              
              <Link to="/register" className="block w-full py-3 px-4 bg-blue-600 text-white text-center rounded-lg">
                Try Elite
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12 mx-4 md:mx-8 lg:mx-auto lg:max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ElderFit Secrets?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Safe & Low-Impact</h3>
              <p className="text-gray-600">Exercises designed with safety in mind.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Guidance</h3>
              <p className="text-gray-600">Developed by fitness professionals.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">At Your Own Pace</h3>
              <p className="text-gray-600">Flexible routines that adapt to your needs.</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-12 mx-4 md:mx-8 lg:mx-auto lg:max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-10">What Our Members Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                  MJ
                </div>
                <div>
                  <h3 className="font-semibold">Margaret J.</h3>
                  <p className="text-sm text-gray-600">Age 68</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                "ElderFit has transformed my daily routine. I feel stronger and more balanced!"
              </p>
              <div className="flex text-yellow-400">
                ★★★★★
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                  RT
                </div>
                <div>
                  <h3 className="font-semibold">Robert T.</h3>
                  <p className="text-sm text-gray-600">Age 59</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                "The tailored routines gave me confidence to get moving again after knee surgery."
              </p>
              <div className="flex text-yellow-400">
                ★★★★★
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                  SD
                </div>
                <div>
                  <h3 className="font-semibold">Susan D.</h3>
                  <p className="text-sm text-gray-600">Age 65</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                "The Elite plan has been invaluable. My mobility has improved dramatically!"
              </p>
              <div className="flex text-yellow-400">
                ★★★★★
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white rounded-lg p-8 text-center mb-12 mx-4 md:mx-8 lg:mx-auto lg:max-w-7xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Fitness Journey?</h2>
          <p className="text-xl mb-6">Join thousands of seniors improving their health with ElderFit.</p>
          <Link to="/register" className="bg-white text-blue-600 px-8 py-3 text-lg rounded-lg">
            Sign Up Now
          </Link>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default MarketingHome;