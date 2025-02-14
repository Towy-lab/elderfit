import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import ExerciseTimer from './ExerciseTimer';

const WorkoutProgress = ({ workout, onComplete }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [currentSet, setCurrentSet] = useState(1);

  const currentExercise = workout.exercises[currentExerciseIndex];

  const handleExerciseComplete = () => {
    if (currentSet < currentExercise.sets) {
      setCurrentSet(prev => prev + 1);
    } else {
      setCompletedExercises(prev => new Set([...prev, currentExerciseIndex]));
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
      } else {
        onComplete();
      }
    }
  };

  const progress = (completedExercises.size / workout.exercises.length) * 100;

  return (
    <div className="space-y-6">
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div 
          className="h-full bg-green-500 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{currentExercise.name}</h3>
          <span className="text-gray-600">
            Set {currentSet} of {currentExercise.sets}
          </span>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Instructions:</h4>
          <ol className="list-decimal list-inside space-y-2">
            {currentExercise.instructions.map((instruction, i) => (
              <li key={i} className="text-gray-700">{instruction}</li>
            ))}
          </ol>
        </div>

        <ExerciseTimer 
          duration={currentExercise.duration}
          onComplete={handleExerciseComplete}
        />
      </div>

      <div className="space-y-2">
        {workout.exercises.map((exercise, index) => (
          <div 
            key={exercise.id}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              completedExercises.has(index) ? 'bg-green-50' :
              index === currentExerciseIndex ? 'bg-blue-50' :
              'bg-gray-50'
            }`}
          >
            {completedExercises.has(index) ? (
              <CheckCircle className="text-green-500" size={20} />
            ) : index === currentExerciseIndex ? (
              <AlertCircle className="text-blue-500" size={20} />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
            )}
            <span>{exercise.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutProgress;