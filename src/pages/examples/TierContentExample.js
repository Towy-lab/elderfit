// src/pages/examples/TierContentExample.js
import React from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext.js';
import TierContentManager from '../../components/subscription/TierContentManager.js';
import AchievementTracker from '../../components/AchievementTracker.js';
import { Activity, FileText, Video, Calendar, Users, Award } from 'lucide-react';

const TierContentExample = () => {
  const { subscription, formatTierName } = useSubscription();
  const currentTier = subscription?.tier || 'basic';
  
  // Mock user data for examples
  const userData = {
    totalWorkouts: 15,
    badges: ['first_workout', 'week_streak'],
    goalsCompleted: 5,
    currentStreak: 3,
    streakData: [
      { date: '2023-01-01', completed: true },
      { date: '2023-01-02', completed: true },
      { date: '2023-01-03', completed: true },
    ],
    weeklyGoals: [
      { id: 1, title: 'Complete 3 workouts', progress: 2, target: 3 },
      { id: 2, title: 'Stretch for 10 minutes daily', progress: 4, target: 7 }
    ]
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Content Manager Examples</h1>
      
      {/* Current Subscription Banner */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Current Subscription: <span className="text-indigo-600">{formatTierName(currentTier)}</span>
        </h2>
        <p className="text-gray-600">
          This page demonstrates how content is organized and displayed based on your subscription tier.
        </p>
      </div>
      
      {/* Grid of Feature Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Basic Tier Feature - Available to all */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-100 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="text-green-600 mr-2" size={20} />
              <h3 className="font-semibold text-green-800">Basic Workouts</h3>
            </div>
            <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded">
              Basic
            </span>
          </div>
          <div className="p-4">
            <TierContentManager requiredTier="basic">
              <p className="mb-3">Access to beginner-friendly workouts designed for seniors.</p>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  5 foundational workout routines
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic exercise demonstrations
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Simple progress tracking
                </li>
              </ul>
            </TierContentManager>
          </div>
        </div>
        
        {/* Premium Tier Feature */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-100 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Video className="text-indigo-600 mr-2" size={20} />
              <h3 className="font-semibold text-indigo-800">Video Lessons</h3>
            </div>
            <span className="bg-indigo-200 text-indigo-800 text-xs px-2 py-1 rounded">
              Premium
            </span>
          </div>
          <div className="p-4">
            <TierContentManager 
              requiredTier="premium"
              featureName="video library"
              preview={true}
              previewContent={
                <div className="p-2">
                  <div className="rounded bg-gray-200 h-32 mb-4 flex items-center justify-center">
                    <Video size={32} className="text-gray-400" />
                  </div>
                  <h4 className="font-medium mb-1">Gentle Morning Routine</h4>
                  <p className="text-sm text-gray-500">10 minute video • Beginner level</p>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="border border-gray-200 rounded p-3">
                  <h4 className="font-medium mb-1">Gentle Morning Routine</h4>
                  <p className="text-sm text-gray-500 mb-2">10 minute video • Beginner level</p>
                  <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                    <p className="text-gray-500">Video Player</p>
                  </div>
                </div>
                
                <p className="text-sm">
                  Access our complete library of professionally-made video lessons designed specifically for seniors.
                </p>
              </div>
            </TierContentManager>
          </div>
        </div>
        
        {/* Elite Tier Feature */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-purple-100 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Users className="text-purple-600 mr-2" size={20} />
              <h3 className="font-semibold text-purple-800">Professional Support</h3>
            </div>
            <span className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded">
              Elite
            </span>
          </div>
          <div className="p-4">
            <TierContentManager 
              requiredTier="elite"
              featureName="professional consultation"
              fallbackMessage="Upgrade to Elite to get personalized support from certified fitness professionals."
            >
              <div className="space-y-4">
                <p>Schedule one-on-one consultations with our certified fitness professionals who specialize in senior fitness.</p>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2 text-purple-800">Available Appointments</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center p-2 bg-white rounded border border-purple-100">
                      <div>
                        <p className="font-medium">Sarah Johnson, PT</p>
                        <p className="text-sm text-gray-500">Balance & Mobility Specialist</p>
                      </div>
                      <button className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm">
                        Book
                      </button>
                    </li>
                    <li className="flex justify-between items-center p-2 bg-white rounded border border-purple-100">
                      <div>
                        <p className="font-medium">Robert Chen, PT</p>
                        <p className="text-sm text-gray-500">Strength Training Coach</p>
                      </div>
                      <button className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm">
                        Book
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </TierContentManager>
          </div>
        </div>
        
        {/* More Premium Features */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-100 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="text-indigo-600 mr-2" size={20} />
              <h3 className="font-semibold text-indigo-800">Workout Calendar</h3>
            </div>
            <span className="bg-indigo-200 text-indigo-800 text-xs px-2 py-1 rounded">
              Premium
            </span>
          </div>
          <div className="p-4">
            <TierContentManager 
              requiredTier="premium"
              featureName="workout calendar"
            >
              <div className="space-y-4">
                <p>Plan and schedule your workouts with our interactive calendar.</p>
                <div className="border border-gray-200 rounded">
                  <div className="bg-gray-50 p-2 border-b border-gray-200 flex justify-between items-center">
                    <span>April 2025</span>
                    <div className="flex space-x-2">
                      <button className="p-1 rounded hover:bg-gray-200">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button className="p-1 rounded hover:bg-gray-200">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <div key={i} className="text-center p-2 bg-white text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                    {[...Array(30)].map((_, i) => (
                      <div key={i} className="p-2 bg-white h-14 text-sm">
                        <span className="font-medium">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TierContentManager>
          </div>
        </div>
        
        {/* Basic Feature with Achievement Tracker Preview */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-100 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Award className="text-green-600 mr-2" size={20} />
              <h3 className="font-semibold text-green-800">Achievement Tracker</h3>
            </div>
            <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded">
              Basic
            </span>
          </div>
          <div className="p-4">
            <TierContentManager requiredTier="basic">
              <div className="space-y-4">
                <p>Track your workout achievements and progress.</p>
                <div className="border border-gray-200 rounded p-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm font-medium mb-1">Total Workouts</p>
                      <p className="text-xl font-bold">{userData.totalWorkouts}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm font-medium mb-1">Current Streak</p>
                      <p className="text-xl font-bold">{userData.currentStreak} days</p>
                    </div>
                  </div>
                </div>
              </div>
            </TierContentManager>
          </div>
        </div>
        
        {/* Elite Feature - Custom Routines */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-purple-100 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="text-purple-600 mr-2" size={20} />
              <h3 className="font-semibold text-purple-800">Custom Routines</h3>
            </div>
            <span className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded">
              Elite
            </span>
          </div>
          <div className="p-4">
            <TierContentManager 
              requiredTier="elite"
              featureName="custom routine builder"
            >
              <div className="space-y-4">
                <p>Create customized workout routines with professional guidance.</p>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Your Custom Routines</h4>
                  <ul className="space-y-2">
                    <li className="p-3 bg-white rounded border border-purple-100 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Morning Flexibility</p>
                        <p className="text-sm text-gray-500">15 min • Created with Dr. Williams</p>
                      </div>
                      <button className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm">
                        Start
                      </button>
                    </li>
                    <li className="p-3 bg-white rounded border border-purple-100 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Balance Improvement</p>
                        <p className="text-sm text-gray-500">20 min • Created with Sarah J.</p>
                      </div>
                      <button className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm">
                        Start
                      </button>
                    </li>
                  </ul>
                  <button className="mt-3 w-full py-2 bg-white border border-purple-300 rounded-md text-purple-700 font-medium">
                    Create New Routine
                  </button>
                </div>
              </div>
            </TierContentManager>
          </div>
        </div>
      </div>
      
      {/* Full Achievement Tracker Example (Premium) */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-indigo-100 p-4">
          <div className="flex items-center">
            <Award className="text-indigo-600 mr-2" size={20} />
            <h3 className="font-semibold text-indigo-800">Full Achievement Tracker</h3>
          </div>
          <p className="text-sm text-indigo-700 mt-1">Complete achievement tracking with detailed statistics and progress visualizations.</p>
        </div>
        <div className="p-6">
          <TierContentManager 
            requiredTier="premium"
            featureName="detailed achievement tracking"
            preview={true}
            previewContent={<div className="h-64 bg-gray-100 rounded-lg"></div>}
          >
            <AchievementTracker userData={userData} />
          </TierContentManager>
        </div>
      </div>
    </div>
  );
};

export default TierContentExample;