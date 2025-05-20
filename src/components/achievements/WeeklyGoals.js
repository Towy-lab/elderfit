import React from 'react';
import { Target, Check, X } from 'lucide-react';

const WeeklyGoals = ({ goals = [] }) => {
  const defaultGoals = [
    {
      id: 'workouts',
      name: 'Weekly Workouts',
      target: 3,
      current: 0,
      unit: 'workouts'
    },
    {
      id: 'minutes',
      name: 'Exercise Minutes',
      target: 90,
      current: 0,
      unit: 'minutes'
    },
    {
      id: 'strength',
      name: 'Strength Exercises',
      target: 2,
      current: 0,
      unit: 'sessions'
    }
  ];

  const activeGoals = goals.length > 0 ? goals : defaultGoals;

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-semibold">Weekly Goals</h3>
      </div>

      <div className="space-y-6">
        {activeGoals.map((goal) => {
          const progress = calculateProgress(goal.current, goal.target);
          const isComplete = goal.current >= goal.target;

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {isComplete ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Target className="w-5 h-5 text-blue-500" />
                  )}
                  <span className="font-medium">{goal.name}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {goal.current} / {goal.target} {goal.unit}
                </span>
              </div>
              
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isComplete ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyGoals;