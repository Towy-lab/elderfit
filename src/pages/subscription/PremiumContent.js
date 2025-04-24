// src/pages/subscription/PremiumContent.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import TierContentManager from '../../components/subscription/TierContentManager';
import { TieredEmergencyContact } from '../../components/safety/TieredEmergencyContact';
import { TieredPainTracker } from '../../components/safety/TieredPainTracker';
import { Activity, Video, Calendar, Users, BookOpen, Award } from 'lucide-react';

const PremiumContent = () => {
  const { subscription, formatTierName, hasTierAccess } = useSubscription();
  const currentTier = subscription?.tier || 'basic';
  
  // Sample workout data
  const [selectedWorkout, setSelectedWorkout] = useState({
    id: 'workout_premium_1',
    name: 'Joint-Friendly Strength Training',
    duration: 25,
    level: 'Intermediate',
    focusArea: 'Full Body',
    description: 'A gentle but effective strength training routine designed specifically for seniors. This workout focuses on building functional strength while protecting joints and preventing injury.',
    instructor: 'Sarah Johnson',
    imageUrl: '/images/strength-workout.jpg'
  });
  
  // Premium workout library
  const premiumWorkouts = [
    {
      id: 'workout_premium_1',
      name: 'Joint-Friendly Strength Training',
      duration: 25,
      level: 'Intermediate',
      focusArea: 'Full Body',
      imageUrl: '/images/strength-workout.jpg'
    },
    {
      id: 'workout_premium_2',
      name: 'Balance & Coordination',
      duration: 20,
      level: 'Beginner',
      focusArea: 'Balance',
      imageUrl: '/images/balance-workout.jpg'
    },
    {
      id: 'workout_premium_3',
      name: 'Cardio for Seniors',
      duration: 30,
      level: 'Intermediate',
      focusArea: 'Heart Health',
      imageUrl: '/images/cardio-workout.jpg'
    },
    {
      id: 'workout_premium_4',
      name: 'Flexibility & Mobility',
      duration: 25,
      level: 'All Levels',
      focusArea: 'Flexibility',
      imageUrl: '/images/flexibility-workout.jpg'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <TierContentManager requiredTier="premium">
        <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200 mb-8">
          <h1 className="text-3xl font-bold text-indigo-800 mb-2">Premium Content</h1>
          <p className="text-indigo-700">
            Welcome to your {formatTierName('premium')} tier content! Enjoy expanded workout libraries, personalized tracking, and advanced features.
          </p>
        </div>
        
        {/* Premium Workout Library */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Video size={24} className="text-indigo-600 mr-2" />
            <h2 className="text-2xl font-semibold">Premium Workout Library</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  {selectedWorkout.name} Video
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{selectedWorkout.name}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    {selectedWorkout.duration} min
                  </span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    {selectedWorkout.level}
                  </span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    {selectedWorkout.focusArea}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">
                  {selectedWorkout.description || "A premium workout designed for senior fitness."}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Instructor: {selectedWorkout.instructor || "ElderFit Team"}
                  </span>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Start Workout
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Available Premium Workouts</h3>
              <div className="space-y-3">
                {premiumWorkouts.map((workout) => (
                  <div 
                    key={workout.id}
                    className={`p-3 border rounded-lg cursor-pointer ${
                      selectedWorkout.id === workout.id 
                        ? 'border-indigo-300 bg-indigo-50' 
                        : 'border-gray-200 hover:border-indigo-200'
                    }`}
                    onClick={() => setSelectedWorkout(workout)}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{workout.name}</h4>
                      <span className="text-sm text-gray-600">
                        {workout.duration} min
                      </span>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                        {workout.level}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                        {workout.focusArea}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Link 
                  to="/workouts/premium"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View all 30+ Premium workouts →
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Workout Calendar */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Calendar size={24} className="text-indigo-600 mr-2" />
            <h2 className="text-2xl font-semibold">Your Workout Calendar</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-indigo-50 p-3 border-b flex justify-between items-center">
                <button className="p-1 rounded hover:bg-indigo-100">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="font-medium">April 2025</h3>
                <button className="p-1 rounded hover:bg-indigo-100">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-7 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                  <div key={i} className="p-2 border-b border-r font-medium text-sm text-gray-600">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7">
                {[...Array(30)].map((_, i) => {
                  // Sample workout indicators for certain days
                  const hasWorkout = [1, 5, 8, 12, 15, 19, 22, 26, 29].includes(i + 1);
                  return (
                    <div key={i} className="p-2 h-24 border-r border-b relative">
                      <span className="text-sm font-medium">{i + 1}</span>
                      
                      {hasWorkout && (
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="p-1 bg-indigo-100 border border-indigo-200 rounded text-xs text-indigo-800">
                            {i % 3 === 0 ? 'Strength' : i % 3 === 1 ? 'Balance' : 'Flexibility'}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Schedule Workout
              </button>
            </div>
          </div>
        </section>
        
        {/* Pain & Discomfort Tracking */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Activity size={24} className="text-indigo-600 mr-2" />
            <h2 className="text-2xl font-semibold">Pain & Recovery Tracking</h2>
          </div>
          
          <TieredPainTracker exerciseId={selectedWorkout.id} />
        </section>
        
        {/* Emergency Contacts */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Users size={24} className="text-indigo-600 mr-2" />
            <h2 className="text-2xl font-semibold">Emergency Contacts</h2>
          </div>
          
          <TieredEmergencyContact />
        </section>
        
        {/* Educational Content */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <BookOpen size={24} className="text-indigo-600 mr-2" />
            <h2 className="text-2xl font-semibold">Educational Resources</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Article Image
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">Joint Health for Seniors</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Learn how to protect your joints while staying active and building strength.
                </p>
                <a 
                  href="#"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Read Article →
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Article Image
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">Nutrition After 60</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Dietary recommendations to support your exercise routine and overall health.
                </p>
                <a 
                  href="#"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Read Article →
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Article Image
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">Sleep & Recovery</h3>
                <p className="text-gray-600 text-sm mb-3">
                  How quality sleep impacts exercise recovery and overall wellness.
                </p>
                <a 
                  href="#"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Read Article →
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Link 
              to="/education"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Browse All Educational Content →
            </Link>
          </div>
        </section>
        
        {/* Progress Tracking */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Award size={24} className="text-indigo-600 mr-2" />
            <h2 className="text-2xl font-semibold">Progress Analytics</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-indigo-50 rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-indigo-800 mb-1">Total Workouts</p>
                <p className="text-3xl font-bold text-indigo-900">42</p>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-indigo-800 mb-1">Minutes Active</p>
                <p className="text-3xl font-bold text-indigo-900">860</p>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-indigo-800 mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-indigo-900">7 days</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Monthly Activity</h3>
              <div className="h-64 border rounded-lg p-4 bg-gray-50 flex items-center justify-center">
                <div className="text-gray-400">Activity Chart Visualization</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Progress Towards Goals</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Weekly Workouts (3/4)</span>
                    <span className="text-sm text-gray-600">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Monthly Active Minutes (120/150)</span>
                    <span className="text-sm text-gray-600">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Strength Sessions (2/3)</span>
                    <span className="text-sm text-gray-600">67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Elite Upgrade Prompt */}
        {!hasTierAccess('elite') && (
          <section className="mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-lg p-6">
              <div className="md:flex items-center justify-between">
                <div className="md:flex-1 mb-4 md:mb-0 md:mr-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-2">
                    Upgrade to Elite for Even More
                  </h3>
                  <p className="text-purple-700 mb-4">
                    Take your fitness journey to the next level with personalized professional guidance, 
                    one-on-one consultations, and exclusive elite content.
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-purple-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2 text-purple-700">One-on-one professional consultations</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-purple-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2 text-purple-700">Personalized safety score & analytics</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-purple-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2 text-purple-700">Custom workout plans created by professionals</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <Link
                    to="/subscription/plans"
                    className="inline-block px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Upgrade to Elite
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </TierContentManager>
    </div>
  );
};

export default PremiumContent;