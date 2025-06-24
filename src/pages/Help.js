import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Search, BookOpen, Video, MessageCircle, Phone, Mail, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext.js';

const Help = () => {
  const { subscription } = useSubscription();
  const isElite = subscription?.tier === 'elite';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">ElderFit Help Center</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">Your Dashboard</h3>
              <p className="mt-1">Your dashboard is your personal fitness hub where you can find recommended workouts, track your progress, and access your favorite exercises.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Finding Workouts</h3>
              <p className="mt-1">Browse recommended workouts on your dashboard or explore the exercise library to create your own routine. Click on any workout card to view details.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Tracking Progress</h3>
              <p className="mt-1">Your progress is automatically tracked as you complete workouts. View your achievements, streaks, and improvements on the Progress section of your dashboard.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Using ElderFit Features</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">Workout Details</h3>
              <p className="mt-1">Each workout shows a list of exercises with instructions. Follow along at your own pace, and mark exercises as complete as you go.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Exercise Library</h3>
              <p className="mt-1">Browse our comprehensive library of senior-friendly exercises, filtering by difficulty, equipment needed, or specific body areas.</p>
            </div>
            
            {isElite && (
              <div>
                <h3 className="font-medium text-lg">Video Demonstrations</h3>
                <p className="mt-1">Premium and Elite members have access to video demonstrations for proper form and technique for each exercise.</p>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="font-medium text-lg text-purple-800">AI-Powered Training Features</h3>
              {isElite ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-lg">Personalized AI Training</h4>
                    <p className="mt-1">Access your personalized AI training dashboard for smart workout recommendations. The AI system:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                      <li>Analyzes your workout history and progress</li>
                      <li>Adapts exercises to your fitness level and goals</li>
                      <li>Provides modifications based on your health conditions</li>
                      <li>Adjusts intensity based on your performance</li>
                    </ul>
                    <Link to="/elite/ai-training" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                      Go to AI Training →
                    </Link>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-lg">Motion Analysis</h4>
                    <p className="mt-1">Get real-time feedback on your exercise form using our AI motion analysis feature:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                      <li>Real-time form correction and guidance</li>
                      <li>Safety alerts for improper movements</li>
                      <li>Progress tracking for form improvement</li>
                      <li>Personalized tips for better technique</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-gray-600">
                    Upgrade to Elite tier to unlock our advanced AI-powered training features, including:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                    <li>Personalized AI workout recommendations</li>
                    <li>Real-time motion analysis and form feedback</li>
                    <li>Adaptive training that learns from your progress</li>
                  </ul>
                  <Link 
                    to="/subscription/plans" 
                    className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                  >
                    Upgrade to Elite
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Account Management</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">Updating Your Profile</h3>
              <p className="mt-1">Keep your information current by updating your profile. This helps us provide more personalized workout recommendations.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Subscription Management</h3>
              <p className="mt-1">Manage your subscription tier from your profile settings. You can upgrade, downgrade, or update payment information at any time.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Password & Security</h3>
              <p className="mt-1">Change your password or update security settings through the Account Settings page.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-md">
          <h3 className="font-bold">Need More Help?</h3>
          <p className="mt-1">If you have any questions or need assistance, our support team is here to help!</p>
          <Link to="/contact" className="inline-block mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Contact Support
          </Link>
        </div>
        
        <div className="text-center">
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Help;