import axios from 'axios';

const wgerApi = axios.create({
  baseURL: process.env.REACT_APP_WGER_API_URL,
  headers: {
    'Authorization': `Token ${process.env.REACT_APP_WGER_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
wgerApi.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access to API');
    }
    return Promise.reject(error);
  }
);

export const getExercises = async (category) => {
  try {
    const categoryMap = {
      stretches: 10,
      mobility: 14,
      strength: 8
    };

    const response = await wgerApi.get('/exercise/', {
      params: {
        language: 2,
        category: categoryMap[category],
        limit: 20
      }
    });

    return response.data.results.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      duration: 300, // 5 minutes default
      difficulty: 'Moderate',
      imageUrl: exercise.images?.[0]?.image || '/api/placeholder/300/200',
      instructions: exercise.description.split('.').filter(s => s.trim())
    }));
  } catch (error) {
    throw new Error(`Failed to fetch exercises: ${error.message}`);
  }
};

export const getExerciseDetail = async (id) => {
  try {
    const response = await wgerApi.get(`/exercise/${id}/`);
    const exercise = response.data;

    return {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      duration: 300,
      difficulty: 'Moderate',
      imageUrl: exercise.images?.[0]?.image || '/api/placeholder/600/400',
      instructions: exercise.description.split('.').filter(s => s.trim()),
      tips: [
        'Move slowly and controlled',
        'Stop if you feel pain',
        'Breathe naturally throughout the exercise'
      ]
    };
  } catch (error) {
    throw new Error(`Failed to fetch exercise details: ${error.message}`);
  }
};

export const getWorkoutDetail = async (id) => {
  // This would normally be an API call, but we'll use mock data for now
  return {
    id,
    name: "Morning Mobility",
    description: "A gentle workout to start your day",
    duration: 900, // 15 minutes
    difficulty: "Beginner",
    exercises: [
      {
        id: 1,
        name: "Chair Squats",
        sets: 3,
        reps: 10,
        duration: 180,
        instructions: [
          "Stand in front of a chair",
          "Lower yourself as if sitting down",
          "Stop just before touching the chair",
          "Return to standing"
        ]
      },
      {
        id: 2,
        name: "Arm Circles",
        sets: 2,
        reps: 15,
        duration: 120,
        instructions: [
          "Stand with feet shoulder-width apart",
          "Extend arms out to sides",
          "Make small circles forward",
          "Reverse direction"
        ]
      }
    ]
  };
};

export const saveWorkoutProgress = async (workoutId, data) => {
  // This would be an API call in a real application
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving workout progress:', { workoutId, data });
      resolve({ success: true });
    }, 1000);
  });
};

export const toggleFavoriteExercise = async (exerciseId) => {
  // This would be an API call in a real application
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Toggling favorite for exercise:', exerciseId);
      resolve({ success: true });
    }, 500);
  });
};