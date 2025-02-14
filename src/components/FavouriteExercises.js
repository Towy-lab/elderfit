import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, Activity } from 'lucide-react';
import { useExercises } from '../contexts/ExerciseContext';

const FavoriteExercises = () => {
  const navigate = useNavigate();
  const { exercises, toggleFavorite } = useExercises();

  // Mock favorite exercises - replace with real data from your context
  const favoriteExercises = [
    {
      id: 1,
      name: 'Chair Squats',
      description: 'Build leg strength with support',
      duration: '5 minutes',
      difficulty: 'beginner'
    },
    // Add more favorite exercises
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Favorite Exercises</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favoriteExercises.map(exercise => (
          <div
            key={exercise.id}
            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer"
            onClick={() => navigate(`/exercise/${exercise.id}`)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{exercise.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(exercise.id);
                }}
                className="text-red-500 hover:text-red-600"
              >
                <Heart fill="currentColor" size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">{exercise.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                {exercise.duration}
              </div>
              <div className="flex items-center gap-1">
                <Activity size={16} />
                <span className="capitalize">{exercise.difficulty}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {favoriteExercises.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <Heart size={48} className="mx-auto mb-4 text-gray-400" />
          <p>You haven't added any favorite exercises yet.</p>
          <button
            onClick={() => navigate('/exercises/all')}
            className="mt-4 text-primary hover:text-primary-dark"
          >
            Browse Exercises
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoriteExercises;