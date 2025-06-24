import express from 'express';
import authMiddleware from '../middleware/auth.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const router = express.Router();

// Helper function to check if user has real workout data
const hasRealWorkoutData = (user) => {
  // Check if any workout history exists and has real data
  const hasWorkoutHistory = user.workoutHistory && 
    Array.isArray(user.workoutHistory) && 
    user.workoutHistory.length > 0 &&
    user.workoutHistory.some(workout => 
      workout.completedAt && 
      workout.exercisesCompleted && 
      workout.exercisesCompleted.length > 0 &&
      workout.duration > 0
    );

  // Check if any workouts exist and have real data
  const hasWorkouts = user.workouts && 
    Array.isArray(user.workouts) && 
    user.workouts.length > 0 &&
    user.workouts.some(workout => 
      workout.completedAt && 
      workout.exercisesCompleted && 
      workout.exercisesCompleted.length > 0 &&
      workout.duration > 0
    );

  // Check if streak and totalWorkouts are real values
  const hasRealStats = (
    (user.streak > 0 && user.lastWorkout && hasWorkoutHistory) ||
    (user.totalWorkouts > 0 && hasWorkoutHistory)
  );

  return hasWorkoutHistory || hasWorkouts || hasRealStats;
};

// Get user's progress data
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching progress data for user:', req.user.id);
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has any real workout data
    if (!hasRealWorkoutData(user)) {
      console.log('No real workout data found for user:', req.user.id);
      return res.json({
        workouts: [],
        streak: 0,
        lastWorkout: null,
        totalWorkouts: 0,
        workoutHistory: [],
        achievements: []
      });
    }

    // Get progress data from user document, ensuring we only return real data
    const validWorkouts = user.workouts?.filter(w => 
      w.completedAt && 
      w.exercisesCompleted?.length > 0 &&
      w.duration > 0
    ) || [];

    const validHistory = user.workoutHistory?.filter(w => 
      w.completedAt && 
      w.exercisesCompleted?.length > 0 &&
      w.duration > 0
    ) || [];

    // Only return streak and totalWorkouts if they're backed by real data
    const progressData = {
      workouts: validWorkouts,
      streak: validHistory.length > 0 && user.streak > 0 ? user.streak : 0,
      lastWorkout: validHistory.length > 0 && user.lastWorkout ? user.lastWorkout : null,
      totalWorkouts: validHistory.length,
      workoutHistory: validHistory,
      achievements: user.achievements?.filter(a => a.earnedAt) || []
    };

    console.log('Progress data retrieved:', progressData);
    res.json(progressData);
  } catch (error) {
    console.error('Error fetching progress data:', error);
    res.status(500).json({ error: 'Failed to fetch progress data' });
  }
});

// Save workout progress
router.post('/workout', authMiddleware, async (req, res) => {
  try {
    console.log('Saving workout progress for user:', req.user.id);
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    const { workoutId, exercisesCompleted, duration } = req.body;
    console.log('Workout data:', { workoutId, exercisesCompleted, duration });

    // Validate workout data
    if (!workoutId || !exercisesCompleted || !Array.isArray(exercisesCompleted) || exercisesCompleted.length === 0) {
      return res.status(400).json({ error: 'Invalid workout data' });
    }

    // Create workout record
    const workoutRecord = {
      id: workoutId,
      completedAt: new Date(),
      exercisesCompleted,
      duration
    };

    // Update user's workout history
    if (!user.workoutHistory) {
      user.workoutHistory = [];
    }
    user.workoutHistory.unshift(workoutRecord);

    // Update streak
    const lastWorkout = user.lastWorkout ? new Date(user.lastWorkout) : null;
    const now = new Date();
    const daysSinceLastWorkout = lastWorkout ? 
      Math.floor((now - lastWorkout) / (1000 * 60 * 60 * 24)) : null;

    if (!lastWorkout || daysSinceLastWorkout === 1) {
      user.streak = (user.streak || 0) + 1;
    } else if (daysSinceLastWorkout > 1) {
      user.streak = 1;
    }

    // Update last workout and total workouts
    user.lastWorkout = now;
    user.totalWorkouts = user.workoutHistory.length;

    // Save changes
    await user.save();
    console.log('Workout progress saved successfully');

    res.json({
      success: true,
      progress: {
        streak: user.streak || 0,
        lastWorkout: user.lastWorkout || null,
        totalWorkouts: user.totalWorkouts || 0
      }
    });
  } catch (error) {
    console.error('Error saving workout progress:', error);
    res.status(500).json({ error: 'Failed to save workout progress' });
  }
});

// Get workout history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching workout history for user:', req.user.id);
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has any real workout data
    if (!hasRealWorkoutData(user)) {
      console.log('No real workout data found for user:', req.user.id);
      return res.json({
        history: [],
        totalWorkouts: 0
      });
    }

    // Filter out any invalid workout records
    const validHistory = user.workoutHistory?.filter(w => 
      w.completedAt && 
      w.exercisesCompleted && 
      w.exercisesCompleted.length > 0 &&
      w.duration > 0
    ) || [];

    const history = {
      history: validHistory,
      totalWorkouts: validHistory.length
    };
    console.log('Workout history retrieved:', history);

    res.json(history);
  } catch (error) {
    console.error('Error fetching workout history:', error);
    res.status(500).json({ error: 'Failed to fetch workout history' });
  }
});

export default router; 