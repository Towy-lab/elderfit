import React from 'react';
import { Link } from 'react-router-dom';

const PremiumContent = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Premium Nutrition Plans</h1>
      <p className="text-gray-600 mb-8">Personalized nutrition guidance for healthy aging</p>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Personalized Nutrition Plan</h2>
        <div className="mb-4">
          <h3 className="font-medium mb-2">Daily Calorie Target</h3>
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-2xl font-bold text-indigo-600">1,800 calories</p>
            <p className="text-gray-600">Adjusted for your age, weight, and activity level</p>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium mb-2">Recommended Macronutrient Split</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-lg font-bold text-indigo-600">25%</p>
              <p className="text-gray-600">Protein</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-lg font-bold text-indigo-600">50%</p>
              <p className="text-gray-600">Carbohydrates</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-lg font-bold text-indigo-600">25%</p>
              <p className="text-gray-600">Healthy Fats</p>
            </div>
          </div>
        </div>
        
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Download Full Plan (PDF)
        </button>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Weekly Meal Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Meal Plan Image</span>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">Week {item} Meal Plan</h3>
              <p className="text-gray-600 mb-4">
                A complete 7-day meal plan with recipes optimized for senior nutrition needs.
              </p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                View Plan
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-indigo-50 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Upgrade to Elite for Even More</h2>
        <p className="mb-4">Get quarterly fitness assessments and personalized equipment recommendations.</p>
        <Link 
          to="/subscription" 
          className="inline-block bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Upgrade to Elite
        </Link>
      </div>
    </div>
  );
};

export default PremiumContent;