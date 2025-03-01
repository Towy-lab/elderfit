import React from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';

const EliteContent = () => {
  const { tier } = useSubscription();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Elite Tier Content</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Personal Fitness Consultation</h2>
          <p className="mb-4">
            As an Elite member, you have access to monthly one-on-one consultations with a certified fitness professional specializing in senior health.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Your Next Consultation</h3>
            <p className="mb-3">Schedule your personal consultation at a time that works for you.</p>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              onClick={() => alert('This would open the scheduling calendar')}
            >
              Schedule Consultation
            </button>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Elite Video Library</h2>
          <p className="mb-4">
            Exclusive workout videos created by top senior fitness experts, including specialized routines for various health conditions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded p-4">
              <h3 className="font-medium mb-2">Arthritis Management Series</h3>
              <p>Specialized exercises for those managing joint pain and arthritis.</p>
              <button className="mt-2 text-blue-600 hover:text-blue-800">Watch Videos</button>
            </div>
            <div className="border border-gray-200 rounded p-4">
              <h3 className="font-medium mb-2">Post-Rehabilitation Workouts</h3>
              <p>Gentle routines designed for recovery after surgery or injury.</p>
              <button className="mt-2 text-blue-600 hover:text-blue-800">Watch Videos</button>
            </div>
            <div className="border border-gray-200 rounded p-4">
              <h3 className="font-medium mb-2">Cardiac Health Exercises</h3>
              <p>Safe cardiovascular training optimized for heart health.</p>
              <button className="mt-2 text-blue-600 hover:text-blue-800">Watch Videos</button>
            </div>
            <div className="border border-gray-200 rounded p-4">
              <h3 className="font-medium mb-2">Balance & Fall Prevention</h3>
              <p>Advanced techniques to improve stability and confidence.</p>
              <button className="mt-2 text-blue-600 hover:text-blue-800">Watch Videos</button>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Advanced Tracking & Analysis</h2>
          <p className="mb-4">
            Comprehensive progress tracking with detailed analytics and personalized recommendations.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-2">Your Fitness Progress</h3>
            <div className="h-40 bg-gray-200 rounded flex items-center justify-center">
              <p className="text-gray-500">Progress charts and analytics would display here</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded">
              Export Health Data
            </button>
            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded">
              Share With Healthcare Provider
            </button>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Elite Resources</h2>
          <ul className="divide-y divide-gray-200">
            <li className="py-3">
              <a href="#" className="flex justify-between items-center">
                <span>Comprehensive Nutrition Plan</span>
                <span className="text-blue-600">Download PDF</span>
              </a>
            </li>
            <li className="py-3">
              <a href="#" className="flex justify-between items-center">
                <span>Sleep Optimization Guide</span>
                <span className="text-blue-600">Download PDF</span>
              </a>
            </li>
            <li className="py-3">
              <a href="#" className="flex justify-between items-center">
                <span>Stress Management Techniques</span>
                <span className="text-blue-600">Download PDF</span>
              </a>
            </li>
            <li className="py-3">
              <a href="#" className="flex justify-between items-center">
                <span>Home Exercise Environment Setup</span>
                <span className="text-blue-600">Download PDF</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EliteContent;