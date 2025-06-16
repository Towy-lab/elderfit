import React from 'react';
import { Trophy, Award, Target, Calendar } from 'lucide-react';
import ProgressBadges from './ProgressBadges';
import WorkoutStreak from './WorkoutStreak';
import WeeklyGoals from './WeeklyGoals';

const AchievementTracker = ({ userData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Achievements</h2>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Trophy size={20} />
            <h3 className="font-semibold">Total Workouts</h3>
          </div>
          <p className="text-2xl font-bold">{userData.totalWorkouts || 0}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Award size={20} />
            <h3 className="font-semibold">Badges Earned</h3>
          </div>
          <p className="text-2xl font-bold">{userData.badges?.length || 0}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <Target size={20} />
            <h3 className="font-semibold">Goals Met</h3>
          </div>
          <p className="text-2xl font-bold">{userData.goalsCompleted || 0}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <Calendar size={20} />
            <h3 className="font-semibold">Current Streak</h3>
          </div>
          <p className="text-2xl font-bold">{userData.currentStreak || 0} days</p>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProgressBadges badges={userData.badges} />
        <WorkoutStreak streakData={userData.streakData} />
      </div>

      <WeeklyGoals goals={userData.weeklyGoals} />
    </div>
  );
};

export default AchievementTracker;