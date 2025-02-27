import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SubscriptionContext } from '../context/SubscriptionContext';

const Dashboard = () => {
  const { subscriptionStatus, hasAccess } = useContext(SubscriptionContext);
  
  // Sample user for demo
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User' };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
      <p className="text-gray-600 mb-8">Your fitness journey dashboard</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Current Plan</p>
              <p className="font-bold text-lg">{subscriptionStatus === 'none' ? 'No Plan' : subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)}</p>
            </div>
            <div>
              <p className="text-gray-600">Workouts Completed</p>
              <p className="font-bold text-lg">0</p>
            </div>
            <div>
              <p className="text-gray-600">Fitness Score</p>
              <p className="font-bold text-lg">N/A</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Workout</h2>
          {subscriptionStatus === 'none' ? (
            <div>
              <p className="text-gray-600 mb-4">Subscribe to access personalized workouts.</p>
              <Link 
                to="/subscription" 
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded"
              >
                View Plans
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">Your daily workout is ready!</p>
              <Link 
                to="/dashboard/basic" 
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Start Workout
              </Link>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Nutrition Tips</h2>
          {hasAccess('premium') ? (
            <div>
              <p className="text-gray-600 mb-4">Your personalized nutrition plan is available.</p>
              <Link 
                to="/dashboard/premium" 
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded"
              >
                View Nutrition Plan
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">Upgrade to Premium for personalized nutrition plans.</p>
              <Link 
                to="/subscription" 
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Upgrade Now
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-indigo-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Explore ElderFit Secrets</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/dashboard/basic" 
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold mb-2">Workouts</h3>
            <p className="text-gray-600 text-sm">Access senior-friendly exercise routines</p>
          </Link>
          
          <Link 
            to={hasAccess('premium') ? "/dashboard/premium" : "/subscription"} 
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold mb-2">Nutrition</h3>
            <p className="text-gray-600 text-sm">Healthy eating plans for seniors</p>
          </Link>
          
          <Link 
            to={hasAccess('premium') ? "/dashboard/premium" : "/subscription"} 
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-600 text-sm">Monitor your fitness journey</p>
          </Link>
          
          <Link 
            to={hasAccess('elite') ? "/dashboard/elite" : "/subscription"} 
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold mb-2">Elite Resources</h3>
            <p className="text-gray-600 text-sm">Exclusive content for elite members</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;