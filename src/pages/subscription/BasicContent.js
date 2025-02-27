import React from 'react';
import { Link } from 'react-router-dom';

const BasicContent = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Basic Workouts</h1>
      <p className="text-gray-600 mb-8">Senior-friendly workout routines to keep you active and healthy</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Workout Image</span>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">Beginner Workout #{item}</h3>
              <p className="text-gray-600 mb-4">A gentle workout designed specifically for seniors to improve mobility and strength.</p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                Start Workout
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-indigo-50 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Want More Advanced Workouts?</h2>
        <p className="mb-4">Upgrade to Premium for access to specialized routines and personalized plans.</p>
        <Link 
          to="/subscription" 
          className="inline-block bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Upgrade Now
        </Link>
      </div>
    </div>
  );
};

export default BasicContent;