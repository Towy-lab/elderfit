import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SubscriptionContext } from '../../contexts/SubscriptionContext';
import WorkoutCard from '../../components/WorkoutCard';

const BasicContent = () => {
  const { userSubscription } = useContext(SubscriptionContext);
  
  // Sample basic workouts data
  const basicWorkouts = [
    { id: 1, title: 'Gentle Morning Routine', duration: '15 min', level: 'Beginner' },
    { id: 2, title: 'Chair Strength', duration: '20 min', level: 'Beginner' },
    { id: 3, title: 'Balance Basics', duration: '15 min', level: 'Beginner' },
    { id: 4, title: 'Simple Stretching', duration: '10 min', level: 'Beginner' },
    { id: 5, title: 'Walking Warmup', duration: '10 min', level: 'Beginner' },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Basic Workouts</h1>
        {userSubscription === 'basic' && (
          <Link 
            to="/subscription/premium" 
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Upgrade to Premium
          </Link>
        )}
      </div>
      
      {/* Basic workouts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {basicWorkouts.map(workout => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
      
      {/* Premium Preview Section (only show to basic users) */}
      {userSubscription === 'basic' && (
        <div className="mt-12">
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold mb-4">Premium Workouts Preview</h2>
            <p className="text-gray-600 mb-6">
              Upgrade to Premium to unlock these specialized routines and many more!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Preview cards with blur overlay */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                  <Link 
                    to="/subscription/premium" 
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Unlock
                  </Link>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <h3 className="font-semibold">Arthritis Relief Program</h3>
                    <p className="text-sm text-gray-600">30 min • Intermediate</p>
                    <p className="mt-2 text-gray-700">Specialized exercises to improve joint mobility and reduce pain.</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                  <Link 
                    to="/subscription/premium" 
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Unlock
                  </Link>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <h3 className="font-semibold">Balance & Fall Prevention</h3>
                    <p className="text-sm text-gray-600">25 min • Intermediate</p>
                    <p className="mt-2 text-gray-700">Improve stability and confidence with these targeted exercises.</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                  <Link 
                    to="/subscription/premium" 
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Unlock
                  </Link>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <h3 className="font-semibold">Strength for Daily Living</h3>
                    <p className="text-sm text-gray-600">20 min • Intermediate</p>
                    <p className="mt-2 text-gray-700">Build functional strength for everyday activities with ease.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA banner */}
            <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-indigo-800">Ready for more personalized workouts?</h3>
                  <p className="mt-1 text-indigo-600">
                    Premium includes 30+ specialized routines and personalized recommendations.
                  </p>
                </div>
                <Link 
                  to="/subscription/premium" 
                  className="mt-4 md:mt-0 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 inline-block"
                >
                  Upgrade to Premium
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicContent;