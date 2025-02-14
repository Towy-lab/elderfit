import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';

const WorkoutCard = ({ workout, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all"
      onClick={onClick}
    >
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{workout.name}</h3>
        <p className="text-gray-600 mb-4">{workout.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="flex items-center text-gray-500">
            <Clock size={16} className="mr-1" />
            {Math.round(workout.duration / 60)} min
          </span>
          <span className="flex items-center text-primary font-medium">
            Start <ChevronRight size={16} />
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {workout.exercises.map((exercise, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 bg-gray-100 rounded-full"
            >
              {exercise.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard;