// src/pages/SafetyFeaturesPage.js
import React, { useState } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useSafety } from '../contexts/SafetyContext';
import SafetyHub from '../components/safety/SafetyHub';
import { Shield, Clipboard, Lock } from 'lucide-react';
import TierContentManager from '../components/subscription/TierContentManager';

const SafetyFeaturesPage = () => {
  const { formatTierName, hasTierAccess } = useSubscription();
  const { getSafetyScore, hasEliteAccess } = useSafety();
  
  // Sample exercise data for the components
  const [selectedExercise, setSelectedExercise] = useState({
    id: 'ex_001',
    name: 'Seated Chair Stretch',
    startingPosition: 'Sit upright in a sturdy chair with your feet flat on the floor, hip-width apart.',
    movement: 'Slowly raise your arms above your head, reaching toward the ceiling. Hold for 5 seconds, then slowly lower your arms back down.',
    intensity: 'low',
    targetMuscles: ['shoulders', 'back'],
    equipmentNeeded: ['chair'],
    durationMinutes: 10
  });
  
  // Sample exercises
  const sampleExercises = [
    {
      id: 'ex_001',
      name: 'Seated Chair Stretch',
      startingPosition: 'Sit upright in a sturdy chair with your feet flat on the floor, hip-width apart.',
      movement: 'Slowly raise your arms above your head, reaching toward the ceiling. Hold for 5 seconds, then slowly lower your arms back down.',
      intensity: 'low',
      targetMuscles: ['shoulders', 'back'],
      equipmentNeeded: ['chair'],
      durationMinutes: 10
    },
    {
      id: 'ex_002',
      name: 'Wall Push-Ups',
      startingPosition: "Stand facing a wall, about arm's length away. Place your palms on the wall at shoulder height and shoulder-width apart.",
      movement: 'Slowly bend your elbows to bring your chest closer to the wall, keeping your body straight from head to heels. Push back to the starting position.',
      intensity: 'moderate',
      targetMuscles: ['chest', 'arms', 'shoulders'],
      equipmentNeeded: [],
      durationMinutes: 15
    },
    {
      id: 'ex_003',
      name: 'Standing Hip Extensions',
      startingPosition: 'Stand behind a chair or countertop, holding it for support. Keep your back straight and shoulders relaxed.',
      movement: 'Keeping your leg straight, lift one leg backward without bending your knee or leaning forward. Hold briefly, then return to starting position.',
      intensity: 'moderate',
      targetMuscles: ['glutes', 'lower back'],
      equipmentNeeded: ['chair'],
      durationMinutes: 12
    }
  ];

  const safetyScore = getSafetyScore();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Safety Features</h1>
        
        {/* Tier Badge */}
        <div className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-200">
          <span className="font-medium">Your Plan:</span>{' '}
          <span className={`
            ${hasTierAccess('elite') ? 'text-purple-600' : 
              hasTierAccess('premium') ? 'text-indigo-600' : 
              'text-green-600'}
          `}>
            {formatTierName(hasTierAccess('elite') ? 'elite' : hasTierAccess('premium') ? 'premium' : 'basic')}
          </span>
        </div>
      </div>
      
      {/* Elite Safety Score - Elite Only Feature */}
      <TierContentManager
        requiredTier="elite"
        featureName="safety score"
      >
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-purple-600" size={24} />
            <h2 className="text-xl font-semibold text-purple-800">Your Safety Score</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-purple-100"></div>
              <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                <span className="text-4xl font-bold text-purple-700">{safetyScore}</span>
              </div>
              <svg className="absolute inset-0" width="128" height="128" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  fill="none"
                  stroke="rgba(147, 51, 234, 0.3)"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  fill="none"
                  stroke="rgb(147, 51, 234)"
                  strokeWidth="8"
                  strokeDasharray="377"
                  strokeDashoffset={377 - (377 * safetyScore) / 100}
                  transform="rotate(-90 64 64)"
                />
              </svg>
            </div>
            
            <div>
              <h3 className="font-medium text-lg text-purple-900">Safety Evaluation</h3>
              <p className="text-purple-700 mb-3">
                {safetyScore >= 90 
                  ? 'Excellent safety practices! Keep up the good work.'
                  : safetyScore >= 70
                  ? 'Good safety profile. There are a few areas you could improve.'
                  : 'Your safety profile needs attention. Review the recommendations below.'}
              </p>
              
              <div className="flex gap-2">
                <a 
                  href="/safety/recommendations" 
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  View Detailed Analysis
                </a>
                <button 
                  className="px-4 py-2 border border-purple-300 text-purple-700 rounded-md hover:bg-purple-50"
                >
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </TierContentManager>
      
      {/* Exercise Selector */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select an Exercise</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleExercises.map(exercise => (
            <div 
              key={exercise.id}
              className={`p-4 rounded-lg border cursor-pointer
                ${selectedExercise.id === exercise.id 
                  ? 'bg-blue-50 border-blue-300' 
                  : 'bg-white border-gray-200 hover:border-blue-300'}
              `}
              onClick={() => setSelectedExercise(exercise)}
            >
              <h3 className="font-medium mb-2">{exercise.name}</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {exercise.durationMinutes} min
                </span>
                <span className={`px-2 py-0.5 rounded-full
                  ${exercise.intensity === 'low' ? 'bg-green-100 text-green-700' :
                    exercise.intensity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'}
                `}>
                  {exercise.intensity.charAt(0).toUpperCase() + exercise.intensity.slice(1)} Intensity
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Safety Hub */}
      <SafetyHub exercise={selectedExercise} />
      
      {/* Additional Safety Resources */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Additional Safety Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Safety Guidelines - Available to all */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Clipboard className="text-gray-600" />
              <h3 className="font-semibold text-lg">General Safety Guidelines</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Essential safety tips and guidelines for effective and safe exercise.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Start with a gentle warm-up</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Stay hydrated during exercise</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Use proper form and technique</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Stop if you feel dizzy or experience sharp pain</span>
              </li>
            </ul>
            <a 
              href="/safety/guidelines" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View all guidelines →
            </a>
          </div>
          
          {/* Premium Safety Assessment - Premium tier feature */}
          <TierContentManager
            requiredTier="premium"
            featureName="personalized safety assessment"
          >
            <div className="bg-white rounded-lg shadow p-6 border border-indigo-100">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-indigo-600" />
                <h3 className="font-semibold text-lg">Your Safety Assessment</h3>
              </div>
              <p className="text-gray-600 mb-4">
                A personalized assessment of your exercise safety profile.
              </p>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Exercise Form</span>
                  <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm font-medium">Good</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Recovery Habits</span>
                  <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm font-medium">Average</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pain Management</span>
                  <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium">Excellent</span>
                </div>
              </div>
              
              <a 
                href="/safety/assessment" 
                className="block w-full py-2 bg-indigo-600 text-white text-center rounded-md hover:bg-indigo-700"
              >
                View Detailed Assessment
              </a>
            </div>
          </TierContentManager>
          
          {/* Basic Tier Upgrade Promo - Show only to basic users */}
          {!hasTierAccess('premium') && (
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <div className="flex items-start gap-3">
                <Lock className="text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Unlock Premium Safety Features</h3>
                  <p className="text-gray-600 mb-4">
                    Upgrade to access personalized safety assessments, detailed form guidance, pain tracking, and more.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">•</span>
                      <span>Personalized form guidance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">•</span>
                      <span>Pain and discomfort tracking</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">•</span>
                      <span>Customized rest recommendations</span>
                    </li>
                  </ul>
                  <a 
                    href="/subscription/plans" 
                    className="block w-full py-2 bg-indigo-600 text-white text-center rounded-md hover:bg-indigo-700"
                  >
                    View Premium Plans
                  </a>
                </div>
              </div>
            </div>
          )}
          
          {/* Elite Tier Upgrade Promo - Show to basic and premium users */}
          {!hasEliteAccess() && (
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <div className="flex items-start gap-3">
                <Lock className="text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Elevate Your Safety with Elite</h3>
                  <p className="text-gray-600 mb-4">
                    Upgrade to Elite for professional safety consultations, advanced safety metrics, and personalized guidance.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>One-on-one safety consultations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>Advanced safety score and analytics</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span>Professional recovery guidance</span>
                    </li>
                  </ul>
                  <a 
                    href="/subscription/plans" 
                    className="block w-full py-2 bg-purple-600 text-white text-center rounded-md hover:bg-purple-700"
                  >
                    Upgrade to Elite
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafetyFeaturesPage;