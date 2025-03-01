// Existing API functions
export const getWorkoutDetail = async (workoutId) => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock workout detail data
  const workoutDetail = {
    id: workoutId,
    title: workoutId === '1' ? 'Gentle Morning Stretch' : 
           workoutId === '2' ? 'Chair Strength Workout' : 'Balance Improvement',
    duration: workoutId === '1' ? 15 : workoutId === '2' ? 20 : 25,
    difficulty: workoutId === '1' ? 'Beginner' : workoutId === '2' ? 'Beginner' : 'Intermediate',
    description: workoutId === '1' 
      ? 'Start your day with these gentle stretches to improve flexibility and mobility.'
      : workoutId === '2'
      ? 'Build strength while seated with this accessible workout.'
      : 'Exercises designed to improve stability and prevent falls.',
    exercises: [
      {
        id: '101',
        name: 'Shoulder Rolls',
        sets: 2,
        reps: 10,
        instructions: 'Roll shoulders forward, then backward in a circular motion.'
      },
      {
        id: '102',
        name: 'Seated Leg Lifts',
        sets: 3,
        reps: 8,
        instructions: 'While seated, extend one leg straight out and hold, then lower and repeat with the other leg.'
      },
      {
        id: '103',
        name: 'Gentle Neck Stretches',
        sets: 2,
        reps: 5,
        instructions: 'Slowly tilt your head to each side, holding for 15 seconds.'
      }
    ]
  };
  
  return workoutDetail;
};

export const getExercises = async (category = null) => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock exercises data
  const exercises = [
    {
      id: '101',
      name: 'Shoulder Rolls',
      category: 'upper body',
      difficulty: 'beginner'
    },
    {
      id: '102',
      name: 'Seated Leg Lifts',
      category: 'lower body',
      difficulty: 'beginner'
    },
    {
      id: '103',
      name: 'Gentle Neck Stretches',
      category: 'upper body',
      difficulty: 'beginner'
    }
  ];
  
  // Filter by category if provided
  if (category) {
    return exercises.filter(exercise => exercise.category === category.toLowerCase());
  }
  
  return exercises;
};

export const getExerciseDetail = async (exerciseId) => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock exercise detail
  const exerciseDetail = {
    id: exerciseId,
    name: exerciseId === '101' ? 'Shoulder Rolls' : 
          exerciseId === '102' ? 'Seated Leg Lifts' : 'Gentle Neck Stretches',
    category: exerciseId === '102' ? 'lower body' : 'upper body',
    difficulty: 'beginner',
    instructions: exerciseId === '101' 
      ? 'Roll shoulders forward, then backward in a circular motion.' 
      : exerciseId === '102'
      ? 'While seated, extend one leg straight out and hold, then lower and repeat with the other leg.'
      : 'Slowly tilt your head to each side, holding for 15 seconds.',
    tips: 'Move slowly and stop if you feel any pain.',
    modifications: 'If you have limited mobility, reduce the range of motion.'
  };
  
  return exerciseDetail;
};

export const toggleFavoriteExercise = async (exerciseId, isFavorite) => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would update the user's favorites in the database
  console.log(`Exercise ${exerciseId} is now ${isFavorite ? 'favorited' : 'unfavorited'}`);
  
  return { success: true };
};

export const saveWorkoutProgress = async (workoutId, completedExercises) => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would save the user's progress to the database
  console.log(`Workout ${workoutId} progress saved:`, completedExercises);
  
  return { 
    success: true,
    savedAt: new Date().toISOString()
  };
};

// New function for fetching recommended workouts
export const fetchRecommendedWorkouts = async (tier = 'basic') => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock recommended workouts data with tier-specific offerings
  const allWorkouts = [
    {
      id: '1',
      title: 'Gentle Morning Stretch',
      duration: 15,
      difficulty: 'Beginner',
      imageUrl: '/images/gentle-stretch.jpg',
      description: 'Start your day with these gentle stretches to improve flexibility and mobility.',
      tier: 'basic'
    },
    {
      id: '2',
      title: 'Chair Strength Workout',
      duration: 20,
      difficulty: 'Beginner',
      imageUrl: '/images/chair-workout.jpg',
      description: 'Build strength while seated with this accessible workout.',
      tier: 'basic'
    },
    {
      id: '3',
      title: 'Balance Improvement',
      duration: 25,
      difficulty: 'Intermediate',
      imageUrl: '/images/balance.jpg',
      description: 'Exercises designed to improve stability and prevent falls.',
      tier: 'basic'
    },
    {
      id: '4',
      title: 'Joint Health Circuit',
      duration: 30,
      difficulty: 'Intermediate',
      imageUrl: '/images/joint-health.jpg',
      description: 'Targeted exercises to maintain and improve joint health and flexibility.',
      tier: 'premium'
    },
    {
      id: '5',
      title: 'Cardio Endurance Builder',
      duration: 20,
      difficulty: 'Intermediate',
      imageUrl: '/images/cardio.jpg',
      description: 'A gentle cardio workout designed to improve heart health and stamina.',
      tier: 'premium'
    },
    {
      id: '6',
      title: 'Personalized Mobility Plan',
      duration: 35,
      difficulty: 'Intermediate',
      imageUrl: '/images/mobility.jpg',
      description: 'Custom exercise sequence for your specific mobility needs.',
      tier: 'elite'
    }
  ];
  
  // Filter workouts based on subscription tier
  let availableWorkouts;
  if (tier === 'elite') {
    // Elite users get all workouts
    availableWorkouts = allWorkouts;
  } else if (tier === 'premium') {
    // Premium users get basic and premium workouts
    availableWorkouts = allWorkouts.filter(workout => 
      workout.tier === 'basic' || workout.tier === 'premium'
    );
  } else {
    // Basic users only get basic workouts
    availableWorkouts = allWorkouts.filter(workout => workout.tier === 'basic');
  }
  
  return availableWorkouts;
};