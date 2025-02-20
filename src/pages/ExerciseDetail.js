// src/pages/ExerciseDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const ExerciseDetail = () => {
  const { id } = useParams();
  
  const { data: exercise, isLoading, error } = useQuery({
    queryKey: ['exercise', id],
    queryFn: async () => {
      // Replace with your actual API call
      return {
        name: 'Sample Exercise',
        description: 'Exercise description here',
        difficulty: 'Beginner',
        equipment: ['Chair', 'Resistance Band'],
        steps: [
          'Step 1: Starting position',
          'Step 2: Movement description',
          'Step 3: Return to start'
        ]
      };
    }
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error loading exercise</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{exercise.name}</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <p className="text-gray-700">{exercise.description}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Difficulty</h3>
            <p className="text-gray-700">{exercise.difficulty}</p>
          </div>
          <div>
            <h3 className="font-medium">Equipment Needed</h3>
            <ul className="list-disc list-inside text-gray-700">
              {exercise.equipment.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <ol className="list-decimal list-inside space-y-2">
          {exercise.steps.map((step, index) => (
            <li key={index} className="text-gray-700">{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default ExerciseDetail;