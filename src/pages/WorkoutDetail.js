// src/pages/WorkoutDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../components/LoadingSpinner';

const fetchWorkout = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock workout data based on ID
  const mockWorkout = {
    id: parseInt(id),
    title: `Workout ${id}`,
    description: `This is a detailed description for workout ${id}. It includes a series of exercises designed for seniors to improve strength, balance, and flexibility.`,
    duration: '25 min',
    level: parseInt(id) > 3 ? 'Intermediate' : 'Beginner',
    category: 'Strength',
    exercises: [
      { id: 1, name: 'Chair Squats', sets: 3, reps: 10, duration: null },
      { id: 2, name: 'Seated Arm Raises', sets: 2, reps: 12, duration: null },
      { id: 3, name: 'Gentle Stretches', sets: null, reps: null, duration: '5 min' },
    ]
  };
  
  return mockWorkout;
};

const WorkoutDetail = () => {
  const { id } = useParams();
  
  // Updated to use the v5 object syntax
  const { data: workout, isLoading, error } = useQuery({
    queryKey: ['workout', id],
    queryFn: () => fetchWorkout(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (note: cacheTime is now gcTime in v5)
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="pt-6">
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            <p>Failed to load workout details. Please try again.</p>
            <Link to="/dashboard" className="mt-4 inline-block text-blue-600">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="pt-6">
        <Link to="/dashboard" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">{workout.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {workout.duration}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {workout.level}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              {workout.category}
            </span>
          </div>
          
          <p className="text-gray-700 mb-6">
            {workout.description}
          </p>
          
          <h2 className="text-xl font-semibold mb-4">Exercises</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exercise
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sets
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reps/Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workout.exercises.map((exercise) => (
                  <tr key={exercise.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{exercise.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{exercise.sets || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {exercise.reps ? `${exercise.reps} reps` : exercise.duration}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Start Workout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;