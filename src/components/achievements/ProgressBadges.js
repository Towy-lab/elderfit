import React from 'react';
import { Award, Lock } from 'lucide-react';

const badgeCategories = {
  BEGINNER: 'bg-green-100 text-green-700 border-green-200',
  INTERMEDIATE: 'bg-blue-100 text-blue-700 border-blue-200',
  ADVANCED: 'bg-purple-100 text-purple-700 border-purple-200',
  ELITE: 'bg-orange-100 text-orange-700 border-orange-200'
};

const ProgressBadges = ({ badges = [] }) => {
  const allBadges = [
    {
      id: 'first-workout',
      name: 'First Step',
      description: 'Complete your first workout',
      category: 'BEGINNER',
      requirement: '1 workout completed'
    },
    {
      id: 'week-streak',
      name: 'Week Warrior',
      description: 'Complete a 7-day streak',
      category: 'BEGINNER',
      requirement: '7 day streak'
    },
    {
      id: 'variety-master',
      name: 'Variety Master',
      description: 'Try 5 different exercises',
      category: 'INTERMEDIATE',
      requirement: '5 different exercises'
    },
    // Add more badge definitions
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Achievement Badges</h3>
      <div className="grid grid-cols-2 gap-4">
        {allBadges.map((badge) => {
          const isEarned = badges.includes(badge.id);
          const categoryStyle = badgeCategories[badge.category];

          return (
            <div
              key={badge.id}
              className={`relative p-4 rounded-lg border ${
                isEarned ? categoryStyle : 'bg-gray-50 text-gray-400 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium mb-1">{badge.name}</h4>
                  <p className="text-sm">
                    {badge.description}
                  </p>
                  <p className="text-sm mt-2 font-medium">
                    {badge.requirement}
                  </p>
                </div>
                {isEarned ? (
                  <Award className="w-8 h-8" />
                ) : (
                  <Lock className="w-6 h-6" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBadges;