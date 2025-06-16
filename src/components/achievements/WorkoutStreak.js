import React from 'react';
import { Flame } from 'lucide-react';

const WorkoutStreak = ({ streakData = {} }) => {
  const { currentStreak = 0, bestStreak = 0, lastWorkout = null } = streakData;

  // Calculate days since last workout
  const daysSinceLastWorkout = lastWorkout
    ? Math.floor((new Date() - new Date(lastWorkout)) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <Flame className="w-6 h-6 text-orange-500" />
        <h3 className="text-xl font-semibold">Workout Streak</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
          <div>
            <p className="text-sm text-orange-700">Current Streak</p>
            <p className="text-3xl font-bold text-orange-600">{currentStreak} days</p>
          </div>
          <Flame className="w-12 h-12 text-orange-500" />
        </div>

        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm text-blue-700">Best Streak</p>
            <p className="text-3xl font-bold text-blue-600">{bestStreak} days</p>
          </div>
        </div>

        {daysSinceLastWorkout !== null && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {daysSinceLastWorkout === 0
                ? "You've worked out today!"
                : daysSinceLastWorkout === 1
                ? "1 day since last workout"
                : `${daysSinceLastWorkout} days since last workout`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutStreak;