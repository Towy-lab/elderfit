import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Clock, Activity, ChevronLeft, Heart } from 'lucide-react';
import { getExerciseDetail } from '../services/api';
import ExerciseTimer from '../components/ExerciseTimer';
import { useExercises } from '../contexts/ExerciseContext';

const ExerciseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useExercises();
  
  const { data: exercise, isLoading, error } = useQuery(
    ['exercise', id],
    () => getExerciseDetail(id),
    {
      staleTime: 300000,
      cacheTime: 3600000
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl text-gray-600">Exercise not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-500 hover:text-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ChevronLeft size={20} />
        <span>Back</span>
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {exercise.imageUrl && (
          <img
            src={exercise.imageUrl}
            alt={exercise.name}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{exercise.name}</h1>
            <button
              onClick={() => toggleFavorite(exercise.id)}
              className={`p-2 rounded-full ${
                isFavorite(exercise.id) ? 'text-red-500' : 'text-gray-400'
              } hover:bg-gray-100`}
            >
              <Heart fill={isFavorite(exercise.id) ? "currentColor" : "none"} size={24} />
            </button>
          </div>

          <p className="text-gray-600 mb-6">{exercise.description}</p>

          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={20} />
              <span>{Math.round(exercise.duration / 60)} minutes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Activity size={20} />
              <span className="capitalize">{exercise.difficulty}</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {exercise.instructions.map((instruction, index) => (
                <li 
                  key={index}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <span className="font-bold text-blue-500">{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Timer</h2>
            <ExerciseTimer 
              duration={exercise.duration}
              onComplete={() => console.log('Exercise completed!')}
            />
          </div>

          {exercise.tips && exercise.tips.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Tips</h2>
              <ul className="space-y-2">
                {exercise.tips.map((tip, index) => (
                  <li 
                    key={index}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;