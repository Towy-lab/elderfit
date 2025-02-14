import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, TrendingUp } from 'lucide-react';

const WorkoutHistory = () => {
  const navigate = useNavigate();

  // Mock workout history - replace with real data
  const workoutHistory = [
    {
      id: 1,
      name: 'Morning Mobility',
      completedAt: '2025-02-12T08:30:00',
      duration: 15,
      exercises: ['Chair Squats', 'Arm Circles', 'Ankle Rotations']
    },
    // Add more workout history entries
  ];

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Workout History</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp size={16} />
          <span>Last 30 days</span>
        </div>
      </div>

      <div className="space-y-4">
        {workoutHistory.map(workout => (
          <div
            key={workout.id}
            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer"
            onClick={() => navigate(`/workout/${workout.id}`)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{workout.name}</h3>
              <span className="text-sm text-gray-500">
                <Clock size={16} className="inline mr-1" />
                {workout.duration} min
              </span>
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              <Calendar size={16} className="inline mr-1" />
              {formatDate(workout.completedAt)}
            </div>

            <div className="flex flex-wrap gap-2">
              {workout.exercises.map((exercise, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-white rounded-full"
                >
                  {exercise}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {workoutHistory.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
          <p>No workout history yet.</p>
          <button
            onClick={() => navigate('/workouts')}
            className="mt-4 text-primary hover:text-primary-dark"
          >
            Start a Workout
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;