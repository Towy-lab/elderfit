// src/pages/subscription/PremiumContent.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext.js';
import TierContentManager from '../../components/subscription/TierContentManager.js';
import { TieredEmergencyContact } from '../../components/safety/TieredEmergencyContact.js';
import { TieredPainTracker } from '../../components/safety/TieredPainTracker.js';
import { Activity, Video, Calendar, Users, BookOpen, Award } from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext.js';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.js';
import { Button } from '../../components/ui/button.js';
import { Badge } from '../../components/ui/badge.js';
import { Progress } from '../../components/ui/progress.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs.js';
import { Shield, Smartphone, Heart, Brain, TrendingUp, Clock, Target, Star, Crown, Zap, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Users as UsersIcon, Award as AwardIcon, Calendar as CalendarIcon, ArrowRight, Home, Menu, User, LogOut, Settings as SettingsIcon, Home as HomeIcon, Activity as ActivityIcon, Shield as ShieldIcon, Heart as HeartIcon, BookOpen as BookOpenIcon, HelpCircle } from 'lucide-react';

const PremiumContent = () => {
  const { subscription, formatTierName, hasAccess } = useSubscription();
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
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    videoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  });
  
  // Premium workout library
  const premiumWorkouts = [
    {
      id: 'workout_premium_1',
      name: 'Joint-Friendly Strength Training',
      duration: 25,
      level: 'Intermediate',
      focusArea: 'Full Body',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    {
      id: 'workout_premium_2',
      name: 'Balance & Coordination',
      duration: 20,
      level: 'Beginner',
      focusArea: 'Balance',
      imageUrl: 'https://images.unsplash.com/photo-1616279969862-90f1a57a0b75?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    {
      id: 'workout_premium_3',
      name: 'Cardio for Seniors',
      duration: 30,
      level: 'Intermediate',
      focusArea: 'Heart Health',
      imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    {
      id: 'workout_premium_4',
      name: 'Flexibility & Mobility',
      duration: 25,
      level: 'All Levels',
      focusArea: 'Flexibility',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    }
  ];
  
  // Workout level color mapping
  const levelColors = [
    { level: 'Beginner', color: 'bg-green-600', text: 'text-green-600' },
    { level: 'Intermediate', color: 'bg-blue-600', text: 'text-blue-600' },
    { level: 'Advanced', color: 'bg-red-600', text: 'text-red-600' },
    { level: 'All Levels', color: 'bg-purple-600', text: 'text-purple-600' }
  ];
  
  // Function to get button color based on workout level
  const getLevelButtonColor = (level) => {
    switch(level) {
      case 'Beginner':
        return 'bg-green-600 hover:bg-green-700';
      case 'Intermediate':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'Advanced':
        return 'bg-red-600 hover:bg-red-700';
      case 'All Levels':
        return 'bg-purple-600 hover:bg-purple-700';
      default:
        return 'bg-indigo-600 hover:bg-indigo-700';
    }
  };

  // Function to get appropriate image URL
  const getWorkoutImage = (workout) => {
    if (workout.imageUrl && (workout.imageUrl.startsWith('http') || workout.imageUrl.startsWith('https'))) {
      return workout.imageUrl;
    }
    const imageMap = {
      'Full Body': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=500&q=60',
      'Balance': 'https://images.unsplash.com/photo-1616279969862-90f1a57a0b75?auto=format&fit=crop&w=500&q=60',
      'Heart Health': 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=500&q=60',
      'Flexibility': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=500&q=60'
    };
    return imageMap[workout.focusArea] || 'https://images.unsplash.com/photo-1520080816484-0e41b8536b2f?auto=format&fit=crop&w=500&q=60';
  };

  const { 
    workoutHistory = [], 
    streak = 0, 
    lastWorkout = null,
    isLoading = false,
    error = null
  } = useProgress() || {};

  // Calculate total minutes exercised
  const totalMinutes = workoutHistory.reduce((total, workout) => total + (workout.duration || 0), 0);
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  // Check if we have real progress data
  const hasRealProgress = workoutHistory.length > 0 && 
    workoutHistory.some(w => 
      w.completedAt && 
      w.exercisesCompleted?.length > 0 &&
      w.duration > 0
    );

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
          
          {/* Difficulty Level Color Key */}
          <div className="bg-white p-4 rounded-md mb-6 shadow-sm border border-gray-200">
            <h3 className="font-medium mb-2">Difficulty Level Key:</h3>
            <div className="flex flex-wrap gap-4">
              {levelColors.map(({ level, color, text }) => (
                <div key={level} className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${color} mr-2`}></div>
                  <span className={`text-sm ${text} font-medium`}>{level}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                <img 
                  src={getWorkoutImage(selectedWorkout)} 
                  alt={`${selectedWorkout.name} video thumbnail`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
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
                  <button className={`px-4 py-2 ${getLevelButtonColor(selectedWorkout.level)} text-white rounded-md`}>
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
                    className={`p-3 border rounded-lg cursor-pointer flex items-center ${
                      selectedWorkout.id === workout.id 
                        ? 'border-indigo-300 bg-indigo-50' 
                        : 'border-gray-200 hover:border-indigo-200'
                    }`}
                    onClick={() => setSelectedWorkout({...workout, videoUrl: workout.imageUrl})}
                  >
                    <div className="w-16 h-16 mr-3 flex-shrink-0 rounded overflow-hidden">
                      <img 
                        src={getWorkoutImage(workout)} 
                        alt={workout.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{workout.name}</h4>
                        <span className="text-sm text-gray-600">
                          {workout.duration} min
                        </span>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          workout.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                          workout.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                          workout.level === 'Advanced' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {workout.level}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                          {workout.focusArea}
                        </span>
                      </div>
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
                <img 
                  src="https://images.unsplash.com/photo-1585167156134-d7c7ee4c9267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                  alt="Article on Joint Health" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-medium text-indigo-600 mb-1 block">HEALTH</span>
                <h3 className="font-medium text-lg mb-2">Understanding Joint Health & Mobility</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Learn about how to maintain healthy joints and improve mobility as you age.
                </p>
                <Link to="/education/joint-health" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                  Read Article →
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 bg-gray-200 relative">
                <img 
                  src="https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                  alt="Article on Nutrition" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-medium text-indigo-600 mb-1 block">NUTRITION</span>
                <h3 className="font-medium text-lg mb-2">Nutrition Guidelines for Active Seniors</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Dietary recommendations to support your fitness journey and overall health.
                </p>
                <Link to="/education/senior-nutrition" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                  Read Article →
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 bg-gray-200 relative">
                <img 
                  src="https://images.unsplash.com/photo-1521804106135-dfb8c96814b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                  alt="Article on Sleep" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-medium text-indigo-600 mb-1 block">WELLNESS</span>
                <h3 className="font-medium text-lg mb-2">Importance of Sleep & Recovery</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Why quality sleep is crucial for fitness results and overall wellbeing.
                </p>
                <Link to="/education/sleep-recovery" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                  Read Article →
                </Link>
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
            {isLoading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-4">
                {error}
              </div>
            ) : !hasRealProgress ? (
              <div className="text-center p-4">
                <p className="text-gray-500">Complete your first workout to start tracking your progress!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium text-indigo-800 mb-1">Total Workouts</p>
                    <p className="text-3xl font-bold text-indigo-900">{workoutHistory.length}</p>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium text-indigo-800 mb-1">Minutes Active</p>
                    <p className="text-3xl font-bold text-indigo-900">{totalMinutes}</p>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium text-indigo-800 mb-1">Current Streak</p>
                    <p className="text-3xl font-bold text-indigo-900">{streak} days</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Monthly Activity</h3>
                  <div className="h-64 border rounded-lg p-4 bg-gray-50 flex items-center justify-center">
                    <div className="text-gray-400">Activity Chart Visualization</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
        
        {/* Elite Upgrade Prompt */}
        {!hasAccess('elite') && (
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