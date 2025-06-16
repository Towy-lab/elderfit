import React, { useState } from 'react';
import { 
  Layout, 
  Plus,
  Save,
  Clock,
  Dumbbell,
  GripVertical,
  Trash2,
  Copy
} from 'lucide-react';
import { useScheduling } from '../../contexts/SchedulingContext';

const RoutineBuilder = () => {
  const { routines, createRoutine, updateRoutine, deleteRoutine } = useScheduling();
  const [showNewRoutine, setShowNewRoutine] = useState(false);
  const [newRoutine, setNewRoutine] = useState({
    name: '',
    description: '',
    type: 'strength',
    exercises: [],
    duration: 30,
    difficulty: 'beginner'
  });

  const exerciseTypes = {
    strength: ['Seated Row', 'Chair Squats', 'Wall Push-ups', 'Arm Curls'],
    mobility: ['Shoulder Circles', 'Hip Rotations', 'Ankle Mobility', 'Neck Stretches'],
    balance: ['Single Leg Stand', 'Heel-to-Toe Walk', 'Side Leg Raises', 'Toe Stands'],
    stretching: ['Hamstring Stretch', 'Chest Stretch', 'Calf Stretch', 'Back Stretch']
  };

  const addExerciseToRoutine = (exercise) => {
    setNewRoutine(prev => ({
      ...prev,
      exercises: [...prev.exercises, {
        name: exercise,
        sets: 3,
        reps: 10,
        restTime: 60,
        id: Date.now()
      }]
    }));
  };

  const removeExercise = (exerciseId) => {
    setNewRoutine(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  const updateExercise = (exerciseId, updates) => {
    setNewRoutine(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      )
    }));
  };

  const handleSaveRoutine = () => {
    if (!newRoutine.name) return;
    createRoutine(newRoutine);
    setNewRoutine({
      name: '',
      description: '',
      type: 'strength',
      exercises: [],
      duration: 30,
      difficulty: 'beginner'
    });
    setShowNewRoutine(false);
  };

  const duplicateRoutine = (routine) => {
    createRoutine({
      ...routine,
      name: `${routine.name} (Copy)`,
      id: undefined
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layout className="text-blue-500" />
            Routine Builder
          </h2>
          <p className="text-gray-600 mt-1">
            Create and manage your workout routines
          </p>
        </div>
      </div>

      {/* Existing Routines */}
      <div className="space-y-4 mb-6">
        {routines.map(routine => (
          <div 
            key={routine.id}
            className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium">{routine.name}</h3>
                <p className="text-sm text-gray-600">{routine.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => duplicateRoutine(routine)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => deleteRoutine(routine.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{routine.duration} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Dumbbell size={16} />
                <span className="capitalize">{routine.type}</span>
              </div>
            </div>

            <div className="space-y-2">
              {routine.exercises.map((exercise) => (
                <div 
                  key={exercise.id}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-md"
                >
                  <GripVertical size={16} className="text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-sm text-gray-600">
                      {exercise.sets} sets × {exercise.reps} reps
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create New Routine */}
      {!showNewRoutine ? (
        <button
          onClick={() => setShowNewRoutine(true)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg w-full justify-center text-gray-600 hover:border-blue-500 hover:text-blue-500"
        >
          <Plus size={20} />
          Create New Routine
        </button>
      ) : (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Routine Name
            </label>
            <input
              type="text"
              value={newRoutine.name}
              onChange={(e) => setNewRoutine(prev => ({
                ...prev,
                name: e.target.value
              }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newRoutine.description}
              onChange={(e) => setNewRoutine(prev => ({
                ...prev,
                description: e.target.value
              }))}
              className="w-full p-2 border rounded-md h-24 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={newRoutine.type}
                onChange={(e) => setNewRoutine(prev => ({
                  ...prev,
                  type: e.target.value
                }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="strength">Strength</option>
                <option value="mobility">Mobility</option>
                <option value="balance">Balance</option>
                <option value="stretching">Stretching</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                value={newRoutine.difficulty}
                onChange={(e) => setNewRoutine(prev => ({
                  ...prev,
                  difficulty: e.target.value
                }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Exercise Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Exercises
            </label>
            <div className="grid grid-cols-2 gap-2">
              {exerciseTypes[newRoutine.type].map((exercise) => (
                <button
                  key={exercise}
                  type="button"
                  onClick={() => addExerciseToRoutine(exercise)}
                  className="p-2 text-left hover:bg-blue-50 rounded-md text-sm"
                >
                  {exercise}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Exercises */}
          <div className="space-y-2">
            {newRoutine.exercises.map((exercise) => (
              <div 
                key={exercise.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <GripVertical className="text-gray-400 cursor-move" />
                <div className="flex-1">
                  <p className="font-medium">{exercise.name}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      type="number"
                      value={exercise.sets}
                      onChange={(e) => updateExercise(exercise.id, {
                        sets: parseInt(e.target.value) || 1
                      })}
                      className="w-16 p-1 border rounded"
                      placeholder="Sets"
                      min="1"
                    />
                    <input
                      type="number"
                      value={exercise.reps}
                      onChange={(e) => updateExercise(exercise.id, {
                        reps: parseInt(e.target.value) || 1
                      })}
                      className="w-16 p-1 border rounded"
                      placeholder="Reps"
                      min="1"
                    />
                    <input
                      type="number"
                      value={exercise.restTime}
                      onChange={(e) => updateExercise(exercise.id, {
                        restTime: parseInt(e.target.value) || 0
                      })}
                      className="w-20 p-1 border rounded"
                      placeholder="Rest (s)"
                      min="0"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeExercise(exercise.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNewRoutine(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveRoutine}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <Save size={16} />
              Save Routine
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RoutineBuilder;