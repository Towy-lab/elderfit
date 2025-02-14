import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Play, ChevronLeft, Clock, Activity } from 'lucide-react';
import { getWorkoutDetail } from '../services/api';
import WorkoutProgress from '../components/WorkoutProgress';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);

  const { data: workout, isLoading, error } = useQuery(
    ['workout', id],
    () => getWorkoutDetail(id),
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

  if (error || !workout) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl text-gray-600">Workout not found</h2>
        <button
          onClick={() => navigate('/workouts')}
          className="mt-4 text-blue-500 hover:text-blue-600"
        >
          Return to Workouts
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

      {!isWorkoutStarted ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4">{workout.name}</h1>
          <p className="text-gray-600 text-lg mb-6">{workout.description}</p>

          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={20} />
              <span>{Math.round(workout.duration / 60)} minutes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Activity size={20} />
              <span>{workout.difficulty}</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Exercises</h2>
            <div className="space-y-4">
              {workout.exercises.map((exercise, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{exercise.name}</h3>
                    <p className="text-sm text-gray-600">
                      {exercise.sets} sets × {exercise.reps} reps
                    </p>
                  </div>
                  <span className="text-gray-500">
                    {Math.round(exercise.duration / 60)} min
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsWorkoutStarted(true)}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700"
          >
            <Play size={20} />
            Start Workout
          </button>
        </div>
      ) : (
        <WorkoutProgress 
          workout={workout}
          onComplete={() => {
            // Handle workout completion
            navigate('/workouts');
          }}
        />
      )}
    </div>
  );
};

export default WorkoutDetail;