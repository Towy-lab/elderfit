// src/pages/WorkoutDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const WorkoutDetail = () => {
  const { id } = useParams();
  
  const { data: workout, isLoading, error } = useQuery({
    queryKey: ['workout', id],
    queryFn: async () => {
      // Replace with your actual API call
      return {
        name: 'Full Body Workout',
        duration: '30 minutes',
        difficulty: 'Intermediate',
        exercises: [
          {
            name: 'Chair Squats',
            sets: 3,
            reps: 10,
            notes: 'Use chair for support if needed'
          },
          {
            name: 'Standing Push-ups',
            sets: 2,
            reps: 12,
            notes: 'Perform against wall'
          }
        ]
      };
    }
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error loading workout</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{workout.name}</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="font-medium">Duration</h2>
            <p className="text-gray-700">{workout.duration}</p>
          </div>
          <div>
            <h2 className="font-medium">Difficulty</h2>
            <p className="text-gray-700">{workout.difficulty}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Exercises</h2>
        <div className="space-y-4">
          {workout.exercises.map((exercise, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <h3 className="font-medium">{exercise.name}</h3>
              <p className="text-gray-700">
                {exercise.sets} sets × {exercise.reps} reps
              </p>
              {exercise.notes && (
                <p className="text-sm text-gray-600 mt-1">{exercise.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;