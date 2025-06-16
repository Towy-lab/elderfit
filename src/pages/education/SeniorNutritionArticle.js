import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2 } from 'lucide-react';

const SeniorNutritionArticle = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/education" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Educational Resources
        </Link>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Image Section */}
          <div className="relative h-[400px] w-full">
            <img 
              src="https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
              alt="Senior Nutrition" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-3 py-1 bg-indigo-600 rounded-full text-sm font-medium">NUTRITION</span>
                <div className="flex items-center text-sm">
                  <Clock size={16} className="mr-1" />
                  <span>10 min read</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar size={16} className="mr-1" />
                  <span>Updated: March 2024</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4">Nutrition Guidelines for Active Seniors</h1>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <div className="flex justify-end mb-6">
                <button className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
                  <Share2 size={20} className="mr-2" />
                  Share Article
                </button>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Importance of Proper Nutrition</h2>
              <p className="text-gray-700 leading-relaxed">
                As we age, our nutritional needs change. Proper nutrition becomes even more crucial for maintaining 
                energy levels, supporting muscle health, and promoting overall wellbeing. This guide will help you 
                understand how to optimize your diet for an active lifestyle.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Nutritional Needs for Active Seniors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="font-bold text-indigo-900 mb-2">Protein</h3>
                  <p className="text-gray-700">Essential for maintaining muscle mass and strength. Aim for 1.2-1.5g of protein per kg of body weight daily.</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="font-bold text-indigo-900 mb-2">Calcium and Vitamin D</h3>
                  <p className="text-gray-700">Critical for bone health and preventing osteoporosis.</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="font-bold text-indigo-900 mb-2">Fiber</h3>
                  <p className="text-gray-700">Important for digestive health and maintaining a healthy weight.</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="font-bold text-indigo-900 mb-2">Hydration</h3>
                  <p className="text-gray-700">Stay well-hydrated, especially during exercise.</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Meal Planning Tips</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Eat Regular Meals</h3>
                    <p className="text-gray-700">Maintain consistent meal times to support energy levels throughout the day.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Include Protein in Every Meal</h3>
                    <p className="text-gray-700">Good sources include lean meats, fish, eggs, dairy, legumes, and plant-based proteins.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Focus on Whole Foods</h3>
                    <p className="text-gray-700">Choose minimally processed foods rich in nutrients.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Stay Hydrated</h3>
                    <p className="text-gray-700">Drink water throughout the day, not just during meals.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Pre and Post-Workout Nutrition</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                  <h3 className="font-bold text-green-900 mb-4">Before Exercise</h3>
                  <ul className="space-y-2">
                    {[
                      'Light, easily digestible meal 1-2 hours before',
                      'Include complex carbohydrates',
                      'Stay hydrated'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full mr-3"></span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-4">After Exercise</h3>
                  <ul className="space-y-2">
                    {[
                      'Protein-rich meal within 30 minutes',
                      'Replenish fluids',
                      'Include some carbohydrates'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full mr-3"></span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Nutritional Challenges</h2>
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6">
                <ul className="space-y-2">
                  {[
                    'Decreased appetite',
                    'Changes in taste and smell',
                    'Difficulty chewing or swallowing',
                    'Medication interactions'
                  ].map((challenge, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-2 h-2 mt-2 bg-yellow-500 rounded-full mr-3"></span>
                      <span className="text-gray-700">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-12 p-6 bg-indigo-50 rounded-lg border border-indigo-100">
                <h3 className="text-xl font-bold text-indigo-900 mb-4">Remember</h3>
                <p className="text-indigo-700 leading-relaxed">
                  Everyone's nutritional needs are unique. Consult with a healthcare provider or registered dietitian 
                  to create a personalized nutrition plan that supports your active lifestyle and addresses any 
                  specific health concerns.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default SeniorNutritionArticle; 