// src/pages/subscription/BasicContent.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import TierContentManager from '../../components/subscription/TierContentManager';
import { Activity, Award, BookOpen, Calendar } from 'lucide-react';

// Basic Tier Content Page
const BasicContent = () => {
  const { formatTierName, hasTierAccess } = useSubscription();
  
  // Sample user data for the basic tier
  const userData = {
    totalWorkouts: 8,
    currentStreak: 2,
    badges: ["first_workout"],
    goalsCompleted: 3
  };
  
  // Function to get exercise image based on type
  const getExerciseImage = (name) => {
    const imageMap = {
      'Seated Chair Stretch': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=500&q=60',
      'Standing Balance Practice': 'https://images.unsplash.com/photo-1559888292-3c849f058cdf?auto=format&fit=crop&w=500&q=60',
      'Gentle Arm Strength': 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=500&q=60',
      'Ankle Mobility': 'https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?auto=format&fit=crop&w=500&q=60',
      'Breathing & Relaxation': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=500&q=60',
    };
    return imageMap[name] || 'https://images.unsplash.com/photo-1520080816484-0e41b8536b2f?auto=format&fit=crop&w=500&q=60';
  };
  
  // Sample exercises
  const basicExercises = [
    {
      id: 'ex_001',
      name: 'Seated Chair Stretch',
      duration: 10,
      level: 'Beginner',
      description: 'A gentle stretch routine you can do while seated.'
    },
    {
      id: 'ex_002',
      name: 'Standing Balance Practice',
      duration: 15,
      level: 'Beginner',
      description: 'Simple exercises to improve balance and stability.'
    },
    {
      id: 'ex_003',
      name: 'Gentle Arm Strength',
      duration: 12,
      level: 'Beginner',
      description: 'Build upper body strength with these gentle movements.'
    },
    {
      id: 'ex_004',
      name: 'Ankle Mobility',
      duration: 8,
      level: 'Beginner',
      description: 'Improve ankle flexibility and prevent falls.'
    },
    {
      id: 'ex_005',
      name: 'Breathing & Relaxation',
      duration: 10,
      level: 'Beginner',
      description: 'Techniques to promote relaxation and proper breathing.'
    }
  ];
  
  // Workout level color mapping
  const levelColors = [
    { level: 'Beginner', color: 'bg-green-600', text: 'text-green-600' },
    { level: 'Intermediate', color: 'bg-blue-600', text: 'text-blue-600' },
    { level: 'Advanced', color: 'bg-red-600', text: 'text-red-600' },
    { level: 'All Levels', color: 'bg-purple-600', text: 'text-purple-600' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-green-50 rounded-lg p-6 border border-green-200 mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Basic Tier Content</h1>
        <p className="text-green-700">
          Welcome to the {formatTierName('basic')} tier! Here you'll find all the content available to you.
        </p>
      </div>
      
      {/* Basic Workouts Section */}
      <section className="mb-10">
        <div className="flex items-center mb-4">
          <Activity size={24} className="text-green-600 mr-2" />
          <h2 className="text-2xl font-semibold">Beginner Workouts</h2>
        </div>
        
        {/* Difficulty Level Color Key */}
        <div className="bg-white p-4 rounded-md mb-4 shadow-sm border border-gray-200">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {basicExercises.map(exercise => (
            <div key={exercise.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="h-40 bg-gray-200 relative">
                <img 
                  src={getExerciseImage(exercise.name)} 
                  alt={exercise.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1">{exercise.name}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                    {exercise.duration} minutes
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                    {exercise.level}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>
                <button className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Start Workout
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Premium Tier Preview */}
        <TierContentManager
          requiredTier="premium"
          featureName="additional workouts"
          preview={true}
          previewContent={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Joint-Friendly Strength",
                  level: "Intermediate",
                  duration: 20,
                  image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                },
                {
                  name: "Balance & Coordination",
                  level: "Intermediate",
                  duration: 25,
                  image: "https://images.unsplash.com/photo-1559888292-3c849f058cdf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                },
                {
                  name: "Core Strength",
                  level: "Intermediate",
                  duration: 30,
                  image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="h-40 bg-gray-300 relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-gray-800 bg-opacity-75 text-white px-3 py-1 rounded-md">Premium</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.duration} minutes • {item.level}</p>
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <div className="bg-white rounded-lg shadow-md p-6 border border-indigo-100">
            <h3 className="text-xl font-medium text-indigo-800 mb-3">Premium Workouts</h3>
            <p className="text-gray-700 mb-4">
              Access our extensive library of over 30 premium workouts designed specifically for seniors at all fitness levels.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border border-indigo-200 rounded-lg">
                <h4 className="font-medium text-indigo-700">Personalized Recommendations</h4>
                <p className="text-sm text-gray-600">Get workout suggestions based on your preferences and goals</p>
              </div>
              <div className="p-3 border border-indigo-200 rounded-lg">
                <h4 className="font-medium text-indigo-700">HD Video Instructions</h4>
                <p className="text-sm text-gray-600">Follow along with clear, professional video guidance</p>
              </div>
            </div>
          </div>
        </TierContentManager>
      </section>
      
      {/* Progress Tracking Section */}
      <section className="mb-10">
        <div className="flex items-center mb-4">
          <Award size={24} className="text-green-600 mr-2" />
          <h2 className="text-2xl font-semibold">Your Progress</h2>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-1">Total Workouts</p>
              <p className="text-3xl font-bold text-green-900">{userData.totalWorkouts}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-1">Current Streak</p>
              <p className="text-3xl font-bold text-green-900">{userData.currentStreak} days</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-medium mb-3">Weekly Goals</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Complete 3 workouts</span>
                  <span>2/3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '66%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Exercise 5 days this week</span>
                  <span>3/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Premium Progress Preview */}
        <div className="mt-6">
          <TierContentManager
            requiredTier="premium"
            featureName="advanced progress tracking"
          >
            <div className="bg-white rounded-lg shadow-md p-6 border border-indigo-100">
              <h3 className="text-xl font-medium text-indigo-800 mb-3">Advanced Progress Tracking</h3>
              <p className="text-gray-700 mb-4">
                Premium members get detailed progress analytics, milestone tracking, and personalized insights.
              </p>
              <div className="h-48 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center justify-center">
                <span className="text-indigo-500">Interactive Progress Charts</span>
              </div>
            </div>
          </TierContentManager>
        </div>
      </section>
      
      {/* Education Section */}
      <section className="mb-10">
        <div className="flex items-center mb-4">
          <BookOpen size={24} className="text-green-600 mr-2" />
          <h2 className="text-2xl font-semibold">Educational Resources</h2>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="font-medium mb-4">Getting Started</h3>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded p-4 hover:border-green-300 cursor-pointer transition-colors">
              <h4 className="font-medium mb-2">
                Safety Guidelines for Seniors
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                Learn the basics to get started safely with ElderFit.
              </p>
              <Link
                to="/safety/guidelines"
                className="text-green-600 hover:text-green-800 font-medium text-sm inline-block"
              >
                Read More →
              </Link>
            </div>
            
            <div className="border border-gray-200 rounded p-4 hover:border-green-300 cursor-pointer transition-colors">
              <h4 className="font-medium mb-2">
                Warm-Up Importance
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                Why warming up is essential, especially for seniors.
              </p>
              <Link
                to="/subscription/plans"
                className="text-green-600 hover:text-green-800 font-medium text-sm inline-block"
              >
                Upgrade to Access →
              </Link>
            </div>
            
            <div className="border border-gray-200 rounded p-4 hover:border-green-300 cursor-pointer transition-colors">
              <h4 className="font-medium mb-2">
                Understanding Exercise Intensity
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                How to gauge and adjust your exercise intensity for safe progress.
              </p>
              <Link
                to="/subscription/plans"
                className="text-green-600 hover:text-green-800 font-medium text-sm inline-block"
              >
                Upgrade to Access →
              </Link>
            </div>
          </div>
          
          {/* Premium Education Preview */}
          <div className="mt-6">
            <TierContentManager
              requiredTier="premium"
              featureName="premium educational content"
            >
              <div className="bg-white rounded-lg shadow-md p-6 border border-indigo-100">
                <h3 className="text-xl font-medium text-indigo-800 mb-3">Premium Educational Content</h3>
                <p className="text-gray-700 mb-4">
                  Get access to our full library of in-depth articles, video tutorials, and expert advice.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border border-indigo-200 rounded-lg">
                    <h4 className="font-medium text-indigo-700">Expert Webinars</h4>
                    <p className="text-sm text-gray-600">Monthly live sessions with fitness experts</p>
                  </div>
                  <div className="p-3 border border-indigo-200 rounded-lg">
                    <h4 className="font-medium text-indigo-700">Downloadable Guides</h4>
                    <p className="text-sm text-gray-600">Comprehensive fitness resources to keep</p>
                  </div>
                </div>
              </div>
            </TierContentManager>
          </div>
        </div>
      </section>
      
      {/* Calendar Section - Premium Preview */}
      <section className="mb-10">
        <div className="flex items-center mb-4">
          <Calendar size={24} className="text-green-600 mr-2" />
          <h2 className="text-2xl font-semibold">Workout Calendar</h2>
        </div>
        
        <TierContentManager
          requiredTier="premium"
          featureName="workout calendar"
          preview={true}
          previewContent={
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 opacity-70">
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
          }
        >
          <div className="bg-white rounded-lg shadow-md p-6 border border-indigo-100">
            <h3 className="text-xl font-medium text-indigo-800 mb-3">Premium Workout Calendar</h3>
            <p className="text-gray-700 mb-4">
              Plan and schedule your workouts with our interactive calendar. Set reminders, track completion, and visualize your consistency.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border border-indigo-200 rounded-lg">
                <h4 className="font-medium text-indigo-700">Schedule Workouts</h4>
                <p className="text-sm text-gray-600">Plan your exercise routine in advance</p>
              </div>
              <div className="p-3 border border-indigo-200 rounded-lg">
                <h4 className="font-medium text-indigo-700">Custom Reminders</h4>
                <p className="text-sm text-gray-600">Get notifications for upcoming workouts</p>
              </div>
            </div>
          </div>
        </TierContentManager>
      </section>
      
      {/* Upgrade Section */}
      <section className="mb-10">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-indigo-800 mb-3">Ready for more?</h2>
          <p className="text-indigo-700 mb-4">
            Upgrade to Premium or Elite to unlock additional workouts, advanced tracking, and more premium features.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-indigo-200">
              <h3 className="font-medium text-indigo-700 mb-2">Premium Plan</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span className="text-gray-700">30+ specialized workout routines</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span className="text-gray-700">HD video demonstrations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span className="text-gray-700">Personalized recommendations</span>
                </li>
              </ul>
              <p className="font-medium text-indigo-800 mb-2">$9.99/month</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <h3 className="font-medium text-purple-700 mb-2">Elite Plan</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span className="text-gray-700">All Premium features</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span className="text-gray-700">AI-powered personalized training</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span className="text-gray-700">Custom workout plans</span>
                </li>
              </ul>
              <p className="font-medium text-purple-800 mb-2">$19.99/month</p>
            </div>
          </div>
          
          <Link
            to="/subscription/plans"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            View Premium Plans
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BasicContent;