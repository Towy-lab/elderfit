import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SubscriptionContext } from '../../contexts/SubscriptionContext';
import WorkoutCard from '../../components/WorkoutCard';

const PremiumContent = () => {
  const { userSubscription } = useContext(SubscriptionContext);
  
  // Check if user has access to this content
  if (userSubscription === 'basic') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Premium Content</h1>
        <div className="bg-indigo-50 p-8 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-indigo-800 mb-3">
            This content requires a Premium subscription
          </h2>
          <p className="text-indigo-600 mb-6">
            Upgrade to Premium to access 30+ specialized routines, personalized plans, 
            and advanced tracking features.
          </p>
          <Link 
            to="/subscription/premium" 
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 inline-block"
          >
            Upgrade to Premium
          </Link>
        </div>
      </div>
    );
  }
  
  // Sample premium workouts data
  const premiumWorkouts = [
    { id: 101, title: 'Arthritis Relief Program', duration: '30 min', level: 'Intermediate' },
    { id: 102, title: 'Balance & Fall Prevention', duration: '25 min', level: 'Intermediate' },
    { id: 103, title: 'Strength for Daily Living', duration: '20 min', level: 'Intermediate' },
    { id: 104, title: 'Heart Health Circuit', duration: '25 min', level: 'Intermediate' },
    { id: 105, title: 'Joint Mobility Focus', duration: '20 min', level: 'Intermediate' },
    { id: 106, title: 'Posture Improvement', duration: '15 min', level: 'Intermediate' },
    { id: 107, title: 'Gentle Cardio Boost', duration: '20 min', level: 'Intermediate' },
    { id: 108, title: 'Balance Challenge', duration: '20 min', level: 'Intermediate' },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Premium Workouts</h1>
        {userSubscription === 'premium' && (
          <Link 
            to="/subscription/elite" 
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Upgrade to Elite
          </Link>
        )}
      </div>
      
      {/* Premium workouts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {premiumWorkouts.map(workout => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
      
      {/* Elite Preview Section (only show to premium users) */}
      {userSubscription === 'premium' && (
        <div className="mt-12">
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold mb-4">Elite Exclusive Content</h2>
            <p className="text-gray-600 mb-6">
              Upgrade to Elite for professional support and these exclusive programs!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preview cards with blur overlay */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                  <Link 
                    to="/subscription/elite" 
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    Unlock
                  </Link>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <h3 className="font-semibold">Professional Consultation</h3>
                    <p className="text-sm text-gray-600">One-on-one support</p>
                    <p className="mt-2 text-gray-700">
                      Book personalized sessions with certified fitness professionals
                      specialized in senior fitness.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                  <Link 
                    to="/subscription/elite" 
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    Unlock
                  </Link>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <h3 className="font-semibold">Custom Routine Builder</h3>
                    <p className="text-sm text-gray-600">Personalized Programs</p>
                    <p className="mt-2 text-gray-700">
                      Create completely customized workout routines with professional guidance
                      tailored to your specific needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA banner */}
            <div className="mt-8 bg-purple-50 p-6 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-purple-800">Ready for personalized support?</h3>
                  <p className="mt-1 text-purple-600">
                    Elite includes professional consultations and custom-built routines.
                  </p>
                </div>
                <Link 
                  to="/subscription/elite" 
                  className="mt-4 md:mt-0 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 inline-block"
                >
                  Upgrade to Elite
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumContent;