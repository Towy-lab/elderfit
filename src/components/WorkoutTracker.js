import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Check, Volume2, VolumeX } from 'lucide-react';
import { useExercises } from '../contexts/ExerciseContext';

const WorkoutTracker = ({ workout, onComplete }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [startTime, setStartTime] = useState(null);
  
  const { addWorkoutToHistory } = useExercises();

  // Sound effects
  const playSound = useCallback((type) => {
    if (!isSoundEnabled) return;
    
    const sounds = {
      start: [440, 100],
      complete: [523.25, 200],
      rest: [349.23, 100],
      warning: [293.66, 300]
    };
    
    const [frequency, duration] = sounds[type];
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = frequency;
    oscillator.start();
    
    setTimeout(() => {
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.1);
      setTimeout(() => oscillator.stop(), 100);
    }, duration);
  }, [isSoundEnabled]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            playSound(isResting ? 'start' : 'complete');
            if (isResting) {
              setIsResting(false);
              setTimeLeft(workout.exercises[currentExercise].duration);
            } else {
              handleSetComplete();
            }
            return 0;
          }
          if (time === 4) {
            playSound('warning');
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isResting, currentExercise, workout.exercises, playSound]);

  const handleSetComplete = () => {
    const exercise = workout.exercises[currentExercise];
    
    setCompletedExercises(prev => [
      ...prev,
      {
        exerciseId: exercise.id,
        name: exercise.name,
        sets: currentSet,
        reps: exercise.reps
      }
    ]);

    if (currentSet < exercise.sets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setTimeLeft(30);
      playSound('rest');
    } else {
      if (currentExercise < workout.exercises.length - 1) {
        setCurrentExercise(prev => prev + 1);
        setCurrentSet(1);
        setIsResting(true);
        setTimeLeft(60);
        playSound('rest');
      } else {
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);
        addWorkoutToHistory(workout.id, completedExercises, duration);
        onComplete && onComplete();
        playSound('complete');
      }
    }
  };

  useEffect(() => {
    if (!startTime && isActive) {
      setStartTime(Date.now());
    }
  }, [isActive, startTime]);

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
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${getProgress()}%` }}
          role="progressbar"
          aria-valuenow={getProgress()}
          aria-valuemin="0"
          aria-valuemax="100"
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
        <div className="text-4xl font-bold mb-2" role="timer" aria-live="polite">
          {formatTime(timeLeft)}
        </div>
        <div className="text-gray-600">
          {isResting ? 'Rest Time' : 'Working Time'}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            setIsActive(!isActive);
            if (!isActive) playSound('start');
          }}
          className="p-4 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          aria-label={isActive ? "Pause workout" : "Start workout"}
        >
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={() => {
            setIsActive(false);
            setTimeLeft(getCurrentExercise().duration);
          }}
          className="p-4 rounded-full bg-gray-100 hover:bg-gray-200"
          aria-label="Reset timer"
        >
          <RotateCcw size={24} />
        </button>
        <button
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className="p-4 rounded-full bg-gray-100 hover:bg-gray-200"
          aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
        >
          {isSoundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
        {!isResting && (
          <button
            onClick={handleSetComplete}
            className="p-4 rounded-full bg-green-500 text-white hover:bg-green-600"
            aria-label="Complete current set"
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
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : index < currentExercise
                  ? 'bg-gray-100'
                  : 'bg-white border border-gray-200'
              }`}
              role="listitem"
              aria-current={index === currentExercise ? "true" : "false"}
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