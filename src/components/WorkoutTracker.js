import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';

const WorkoutTracker = ({ workout, onComplete }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            if (isResting) {
              setIsResting(false);
              setTimeLeft(workout.exercises[currentExercise].duration);
            } else {
              handleSetComplete();
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isResting, currentExercise, workout.exercises]);

  const handleSetComplete = () => {
    if (currentSet < workout.exercises[currentExercise].sets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setTimeLeft(30); // 30 seconds rest between sets
    } else {
      if (currentExercise < workout.exercises.length - 1) {
        setCurrentExercise(prev => prev + 1);
        setCurrentSet(1);
        setIsResting(true);
        setTimeLeft(60); // 60 seconds rest between exercises
      } else {
        onComplete && onComplete();
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentExercise = () => workout.exercises[currentExercise];

  const getProgress = () => {
    const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
    const completedSets = workout.exercises.slice(0, currentExercise)
      .reduce((acc, ex) => acc + ex.sets, 0) + (currentSet - 1);
    return (completedSets / totalSets) * 100;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${getProgress()}%` }}
        />
      </div>

      {/* Current Exercise Info */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{getCurrentExercise().name}</h2>
        <div className="flex justify-between text-gray-600">
          <span>Set {currentSet} of {getCurrentExercise().sets}</span>
          <span>{getCurrentExercise().reps} reps</span>
        </div>
      </div>

      {/* Timer */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold mb-2">
          {formatTime(timeLeft)}
        </div>
        <div className="text-gray-600">
          {isResting ? 'Rest Time' : 'Working Time'}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className="p-4 rounded-full bg-primary text-white hover:bg-primary-dark"
        >
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={() => {
            setIsActive(false);
            setTimeLeft(getCurrentExercise().duration);
          }}
          className="p-4 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <RotateCcw size={24} />
        </button>
        {!isResting && (
          <button
            onClick={handleSetComplete}
            className="p-4 rounded-full bg-green-500 text-white hover:bg-green-600"
          >
            <Check size={24} />
          </button>
        )}
      </div>

      {/* Exercise List */}
      <div className="mt-8">
        <h3 className="font-semibold mb-4">Workout Progress</h3>
        <div className="space-y-2">
          {workout.exercises.map((exercise, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                index === currentExercise
                  ? 'bg-primary-light border-l-4 border-primary'
                  : index < currentExercise
                  ? 'bg-gray-100'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={index <= currentExercise ? 'font-medium' : ''}>
                  {exercise.name}
                </span>
                <span className="text-sm text-gray-600">
                  {exercise.sets} × {exercise.reps}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutTracker;