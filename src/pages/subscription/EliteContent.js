import React from 'react';

const EliteContent = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">Elite Member Exclusive Content</h1>
        <p className="opacity-80">Thank you for being an Elite member. Access your exclusive resources below.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Personal Fitness Coach</h2>
          <p className="text-gray-600 mb-4">
            Schedule your next consultation with our senior fitness specialists.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-medium mb-2">Your Coach</h3>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <p className="font-bold">Sarah Johnson</p>
                <p className="text-sm text-gray-600">Senior Fitness Specialist</p>
              </div>
            </div>
          </div>
          
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full">
            Schedule Consultation
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Equipment Recommendations</h2>
          <p className="text-gray-600 mb-4">
            Personalized equipment suggestions based on your fitness goals.
          </p>
          
          <div className="space-y-4 mb-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center border-b pb-4">
                <div className="w-16 h-16 bg-gray-200 flex-shrink-0 mr-4"></div>
                <div>
                  <p className="font-bold">Recommended Item #{item}</p>
                  <p className="text-sm text-gray-600">Description of why this item is recommended for you</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full">
            View All Recommendations
          </button>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Exclusive Elite Video Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Video Thumbnail</span>
            </div>
            <div className="p-4">
              <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mb-2">ELITE ONLY</span>
              <h3 className="font-bold text-lg mb-1">Exclusive Video #{item}</h3>
              <p className="text-gray-600 text-sm mb-3">
                Special workout and wellness content only available to Elite members.
              </p>
              <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700">
                Watch Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EliteContent;