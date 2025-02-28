// src/components/WorkoutProgress.js
import React from 'react';
import { useProgress } from '../contexts/ProgressContext'; // Ensure you're using the hook

const WorkoutProgress = ({ simple = false, detailed = false }) => {
  const { userProgress } = useProgress();
  
  // Check if userProgress or userProgress.exercises is undefined
  if (!userProgress) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">No workout data available yet.</p>
      </div>
    );
  }
  
  // Safely access exercises with default empty array
  const exercises = userProgress.exercises || [];
  const workouts = userProgress.workoutsCompleted || 0;
  const totalMinutes = userProgress.totalMinutes || 0;
  
  // Simple view for basic subscription
  if (simple) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Your Progress Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Workouts</p>
            <p className="text-2xl font-bold text-blue-600">{workouts}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Minutes</p>
            <p className="text-2xl font-bold text-blue-600">{totalMinutes}</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Detailed view for premium/elite subscriptions
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-3">Detailed Progress</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-gray-500 text-sm">Total Workouts</p>
          <p className="text-2xl font-bold text-blue-600">{workouts}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-gray-500 text-sm">Exercise Minutes</p>
          <p className="text-2xl font-bold text-blue-600">{totalMinutes}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-gray-500 text-sm">Avg Session</p>
          <p className="text-2xl font-bold text-blue-600">
            {workouts > 0 ? Math.round(totalMinutes / workouts) : 0} min
          </p>
        </div>
      </div>
      
      {detailed && exercises.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Recent Exercises</h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <ul className="space-y-2">
              {exercises.slice(0, 3).map((exercise, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{exercise.name}</span>
                  <span className="text-gray-500">{exercise.completed} times</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutProgress;