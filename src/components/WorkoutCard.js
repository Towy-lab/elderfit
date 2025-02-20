import React from 'react';
import { 
  Clock, 
  ChevronRight, 
  Dumbbell, 
  Calendar,
  BarChart 
} from 'lucide-react';
import { useExercises } from '../contexts/ExerciseContext';

const WorkoutCard = ({ workout, onClick, isLoading = false }) => {
  if (isLoading) {
    return <LoadingCard />;
  }
  const { getWorkoutStats } = useExercises();
  const stats = getWorkoutStats(workout.id);

  const formatDate = (dateString) => {
    if (!dateString) return 'Never completed';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.round(seconds / 60);
    return `${minutes} min`;
  };

  const getDifficultyColor = (exerciseCount) => {
    if (exerciseCount <= 3) return 'bg-green-100 text-green-700';
    if (exerciseCount <= 6) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div 
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
      role="article"
      aria-labelledby={`workout-title-${workout.id}`}
    >
      {/* Card Header */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 
            id={`workout-title-${workout.id}`}
            className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
          >
            {workout.name}
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            getDifficultyColor(workout.exercises.length)
          }`}>
            {workout.exercises.length} exercises
          </span>
        </div>
        
        <p className="text-gray-600 mb-4">
          {workout.description}
        </p>

        {/* Workout Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={16} />
            <span>{formatDuration(workout.duration)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <BarChart size={16} />
            <span>{stats.timesCompleted} completed</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Dumbbell size={16} />
            <span>{workout.exercises.length} exercises</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} />
            <span className="truncate" title={formatDate(stats.lastCompleted)}>
              {formatDate(stats.lastCompleted)}
            </span>
          </div>
        </div>

        {/* Exercise Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {workout.exercises.slice(0, 3).map((exercise, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
            >
              {exercise.name}
            </span>
          ))}
          {workout.exercises.length > 3 && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
              +{workout.exercises.length - 3} more
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onClick}
          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          aria-label={`Start ${workout.name} workout`}
        >
          Start Workout
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Progress Bar (if workout has been completed before) */}
      {stats.timesCompleted > 0 && (
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${Math.min((stats.timesCompleted / 10) * 100, 100)}%` }}
            role="progressbar"
            aria-valuenow={stats.timesCompleted}
            aria-valuemin="0"
            aria-valuemax="10"
            aria-label={`Completed ${stats.timesCompleted} times`}
          />
        </div>
      )}
    </div>
  );
};

export default WorkoutCard;