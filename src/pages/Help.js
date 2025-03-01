import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../contexts/SubscriptionContext';

const Help = () => {
  const { tier } = useSubscription();
  
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
            
            {tier !== 'basic' && (
              <div>
                <h3 className="font-medium text-lg">Video Demonstrations</h3>
                <p className="mt-1">Premium and Elite members have access to video demonstrations for proper form and technique for each exercise.</p>
              </div>
            )}
            
            {tier === 'elite' && (
              <div>
                <h3 className="font-medium text-lg">Professional Consultations</h3>
                <p className="mt-1">As an Elite member, you can schedule monthly consultations with a fitness professional. Access this feature from your profile settings.</p>
              </div>
            )}
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