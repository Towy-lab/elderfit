import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExercises } from '../contexts/ExerciseContext';
import { Clock } from 'lucide-react';

const WorkoutList = () => {
  const navigate = useNavigate();
  const { workouts } = useExercises();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Available Workouts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map(workout => (
          <div
            key={workout.id}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/workout/${workout.id}`)}
          >
            <h3 className="text-xl font-bold mb-2">{workout.name}</h3>
            <p className="text-gray-600 mb-4">{workout.description}</p>
            <div className="flex items-center text-gray-500">
              <Clock size={16} className="mr-1" />
              {Math.round(workout.duration / 60)} minutes
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutList;