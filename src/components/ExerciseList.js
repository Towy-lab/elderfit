// src/components/ExerciseList.js
import React from 'react';
import { useAuth } from '../providers/AuthProvider';
import { Link } from 'react-router-dom';

export const ExerciseList = () => {
  const { user, logout } = useAuth();

  // Example exercise data - replace with your actual data later
  const exercises = [
    { id: 1, name: 'Gentle Chair Yoga', difficulty: 'Easy' },
    { id: 2, name: 'Basic Stretching', difficulty: 'Easy' },
    { id: 3, name: 'Walking Exercise', difficulty: 'Moderate' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Exercise List</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise) => (
            <div 
              key={exercise.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900">{exercise.name}</h3>
              <p className="text-gray-600 mt-2">Difficulty: {exercise.difficulty}</p>
              <Link
                to={`/exercises/${exercise.id}`}
                className="mt-4 inline-block text-blue-600 hover:text-blue-800"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>

        <Link
          to="/"
          className="mt-8 inline-block text-blue-600 hover:text-blue-800"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};