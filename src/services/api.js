// src/services/api.js
import axios from 'axios';

// Create and export a default axios instance
const defaultInstance = axios.create({
  baseURL: 'https://localhost:31415',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
defaultInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for common error handling
defaultInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network Error:', error.message);
    } else if (error.response.status === 401) {
      // Only clear token if it's an authentication error
      if (error.response.data?.error === 'Token expired' || 
          error.response.data?.error === 'Invalid token') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API functions
export const loginUser = async (email, password) => {
  const requestData = { 
    email: email?.trim().toLowerCase(),
    password: password
  };
  
  if (!requestData.email) {
    throw new Error('Email is required');
  }
  
  if (!requestData.password) {
    throw new Error('Password is required');
  }
  
  try {
    const response = await defaultInstance.post('/api/auth/login', requestData);
    
    if (!response.data || !response.data.token) {
      throw new Error('Invalid response from server - no token received');
    }
    
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.response?.data?.errors) {
      const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
      throw new Error(errorMessages);
    }
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await defaultInstance.get('/api/auth/me');
    
    if (!response.data || !response.data._id) {
      throw new Error('Invalid user data received');
    }
    
    const userData = {
      ...response.data,
      _id: response.data._id || response.data.id,
      profile: response.data.profile || {},
      subscription: response.data.subscription || {
        tier: 'basic',
        status: 'active',
        isFree: true
      }
    };
    
    return userData;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }
    throw error;
  }
};

export const registerUser = async (userData) => {
  console.log('Sending registration data:', { ...userData, password: '***' });
  
  // Ensure all required fields are present and properly formatted
  const requestData = {
    firstName: userData.firstName?.trim(),
    lastName: userData.lastName?.trim(),
    email: userData.email?.trim().toLowerCase(),
    password: userData.password
  };
  
  // Validate required fields
  if (!requestData.firstName || !requestData.lastName) {
    throw new Error('First name and last name are required');
  }
  
  if (!requestData.email) {
    throw new Error('Email is required');
  }
  
  if (!requestData.password || requestData.password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  
  console.log('Sending formatted data:', { ...requestData, password: '***' });
  
  try {
    const response = await defaultInstance.post('/api/auth/register', requestData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.message);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

// Exercise and workout-related API functions
export const getExercises = async () => {
  try {
    const response = await defaultInstance.get('/api/exercises');
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises:', error.message);
    return [];
  }
};

export const getExerciseDetail = async (id) => {
  try {
    const response = await defaultInstance.get(`/api/exercises/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercise ${id}:`, error.message);
    throw error;
  }
};

export const getWorkoutDetail = async (id) => {
  try {
    const response = await defaultInstance.get(`/api/workouts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching workout ${id}:`, error.message);
    throw error;
  }
};

export const saveWorkoutProgress = async (workoutId, exercisesCompleted, duration) => {
  try {
    console.log('Saving workout progress:', { workoutId, exercisesCompleted, duration });
    const response = await defaultInstance.post('/api/progress/workout', {
      workoutId,
      exercisesCompleted,
      duration
    });
    console.log('Workout progress saved:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving workout progress:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const toggleFavoriteExercise = async (exerciseId) => {
  try {
    const response = await defaultInstance.post(`/api/exercises/${exerciseId}/favorite`);
    return response.data;
  } catch (error) {
    console.error('Error toggling favorite exercise:', error.message);
    throw error;
  }
};

export const fetchRecommendedWorkouts = async () => {
  try {
    const response = await defaultInstance.get('/api/workouts/recommended');
    return response.data;
  } catch (error) {
    console.error('Error fetching recommended workouts:', error.message);
    return [];
  }
};

// Subscription-related API functions with improved error handling
export const getSubscription = async () => {
  try {
    const response = await defaultInstance.get('/api/stripe/subscription');
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription:', error.message);
    
    // Check if server is running/reachable
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Check if your server is running at https://localhost:31415');
      // Return a default subscription to avoid breaking the UI
      return { 
        hasSubscription: true, 
        tier: 'basic', 
        status: 'active',
        isFree: true,
        error: 'Could not connect to server'
      };
    }
    
    // For authentication errors, return a clean state
    if (error.response?.status === 401) {
      return {
        hasSubscription: false,
        tier: 'basic',
        error: 'Authentication error'
      };
    }
    
    // For other errors, throw to be handled by the calling function
    throw error;
  }
};

export const createCheckoutSession = async (data) => {
  try {
    const { tier, interval = 'month' } = data;
    const response = await defaultInstance.post('/api/stripe/create-checkout-session', { tier, interval });
    return response.data;
  } catch (error) {
    console.error('Error creating checkout session:', error.message);
    
    // Check for common errors and provide helpful messages
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to the server. Please check your internet connection and try again.');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data.error || 'Invalid subscription parameters');
    } else if (error.response?.status === 401) {
      throw new Error('You must be logged in to upgrade your subscription');
    } else {
      throw error;
    }
  }
};

export const upgradeSubscription = async (data) => {
  try {
    const { tier, interval = 'month', prorationBehavior = 'create_prorations' } = data;
    const response = await defaultInstance.post('/api/stripe/upgrade-subscription', { 
      tier, 
      interval, 
      prorationBehavior 
    });
    return response.data;
  } catch (error) {
    console.error('Error upgrading subscription:', error.message);
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to the server. Please try again later.');
    } else {
      throw error;
    }
  }
};

export const upgradeFromBasic = async (data) => {
  try {
    const { tier, interval = 'month' } = data;
    const response = await defaultInstance.post('/api/stripe/upgrade-from-basic', { tier, interval });
    return response.data;
  } catch (error) {
    console.error('Error upgrading from basic tier:', error.message);
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to the server. Please try again later.');
    } else {
      throw error;
    }
  }
};

export const downgradeToBasic = async () => {
  try {
    const response = await defaultInstance.post('/api/stripe/downgrade-to-basic');
    return response.data;
  } catch (error) {
    console.error('Error downgrading to basic tier:', error.message);
    throw error;
  }
};

export const immediateDowngradeToBasic = async () => {
  try {
    const response = await defaultInstance.post('/api/stripe/immediate-downgrade-to-basic');
    return response.data;
  } catch (error) {
    console.error('Error immediately downgrading to basic tier:', error.message);
    throw error;
  }
};

export const downgradeToPremium = async (interval = 'month') => {
  try {
    const response = await defaultInstance.post('/api/stripe/downgrade-to-premium', { interval });
    return response.data;
  } catch (error) {
    console.error('Error downgrading to premium tier:', error.message);
    throw error;
  }
};

export const reactivateSubscription = async () => {
  try {
    const response = await defaultInstance.post('/api/stripe/reactivate-subscription');
    return response.data;
  } catch (error) {
    console.error('Error reactivating subscription:', error.message);
    throw error;
  }
};

export const cancelSubscription = async () => {
  try {
    const response = await defaultInstance.post('/api/stripe/cancel-subscription');
    return response.data;
  } catch (error) {
    console.error('Error canceling subscription:', error.message);
    throw error;
  }
};

export const cancelSubscriptionImmediately = async () => {
  try {
    const response = await defaultInstance.post('/api/stripe/cancel-subscription-immediately');
    return response.data;
  } catch (error) {
    console.error('Error canceling subscription immediately:', error.message);
    throw error;
  }
};

export const signupBasic = async () => {
  try {
    const response = await defaultInstance.post('/api/stripe/signup-basic');
    return response.data;
  } catch (error) {
    console.error('Error signing up for basic tier:', error.message);
    throw error;
  }
};

export const calculateProration = async (data) => {
  try {
    const { tier, interval = 'month' } = data;
    const response = await defaultInstance.post('/api/stripe/calculate-proration', { tier, interval });
    return response.data;
  } catch (error) {
    console.error('Error calculating proration:', error.message);
    throw error;
  }
};

export const changeBillingCycle = async (interval) => {
  try {
    const response = await defaultInstance.post('/api/stripe/change-billing-cycle', { interval });
    return response.data;
  } catch (error) {
    console.error('Error changing billing cycle:', error.message);
    throw error;
  }
};

// User profile and preferences API functions
export const updateUserProfile = async (profileData) => {
  console.log('Updating user profile with data:', profileData);
  try {
    // First check if server is running
    const healthCheck = await checkServerHealth();
    console.log('Server health check:', healthCheck);
    
    if (healthCheck.status === 'error') {
      throw new Error('Server is not responding. Please try again later.');
    }

    // Use the correct endpoint that matches our server
    const response = await defaultInstance.put('/api/auth/me/profile', profileData);
    console.log('Profile update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });
    throw error;
  }
};

export const updateUserPreferences = async (preferences) => {
  try {
    const response = await defaultInstance.put('/api/users/preferences', preferences);
    return response.data;
  } catch (error) {
    console.error('Error updating user preferences:', error.message);
    throw error;
  }
};

export const getUserActivityHistory = async () => {
  try {
    const response = await defaultInstance.get('/api/users/activity-history');
    return response.data;
  } catch (error) {
    console.error('Error fetching user activity history:', error.message);
    // Return empty array as fallback
    return [];
  }
};

// Payment-related API functions
export const getPaymentMethods = async () => {
  try {
    const response = await defaultInstance.get('/api/stripe/payment-methods');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error.message);
    // Return empty array as fallback
    return [];
  }
};

export const addPaymentMethod = async (paymentMethodId) => {
  try {
    const response = await defaultInstance.post('/api/stripe/payment-methods', { paymentMethodId });
    return response.data;
  } catch (error) {
    console.error('Error adding payment method:', error.message);
    throw error;
  }
};

export const updateDefaultPaymentMethod = async (paymentMethodId) => {
  try {
    const response = await defaultInstance.put('/api/stripe/default-payment-method', { paymentMethodId });
    return response.data;
  } catch (error) {
    console.error('Error updating default payment method:', error.message);
    throw error;
  }
};

export const removePaymentMethod = async (paymentMethodId) => {
  try {
    const response = await defaultInstance.delete(`/api/stripe/payment-methods/${paymentMethodId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing payment method:', error.message);
    throw error;
  }
};

export const getInvoices = async () => {
  try {
    const response = await defaultInstance.get('/api/stripe/invoices');
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error.message);
    // Return empty array as fallback
    return [];
  }
};

// Webhook verification - for debugging
export const checkWebhookStatus = async () => {
  try {
    const response = await defaultInstance.get('/api/stripe/test-webhook');
    return response.data;
  } catch (error) {
    console.error('Error checking webhook status:', error.message);
    return { status: 'error', message: error.message };
  }
};

// Server health check
export const checkServerHealth = async () => {
  try {
    const response = await defaultInstance.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Error checking server health:', error.message);
    return { status: 'error', message: error.message };
  }
};

// Device-related API functions
export const getDevices = async () => {
  try {
    const response = await defaultInstance.get('/api/devices');
    return response.data;
  } catch (error) {
    console.error('Error fetching devices:', error.message);
    return [];
  }
};

export const scanForDevices = async () => {
  try {
    const response = await defaultInstance.post('/api/devices/scan');
    return response.data;
  } catch (error) {
    console.error('Error scanning for devices:', error.message);
    throw error;
  }
};

export const connectDevice = async (deviceId) => {
  try {
    const response = await defaultInstance.post(`/api/devices/${deviceId}/connect`);
    return response.data;
  } catch (error) {
    console.error('Error connecting device:', error.message);
    throw error;
  }
};

export const disconnectDevice = async (deviceId) => {
  try {
    const response = await defaultInstance.post(`/api/devices/${deviceId}/disconnect`);
    return response.data;
  } catch (error) {
    console.error('Error disconnecting device:', error.message);
    throw error;
  }
};

// Progress-related API functions
export const getProgressData = async () => {
  try {
    console.log('Fetching progress data...');
    const response = await defaultInstance.get('/api/progress');
    console.log('Progress data response:', response.data);
    
    // Validate the response data
    if (!response.data || !hasValidWorkoutData(response.data)) {
      console.log('No valid workout data received, returning empty state');
      return {
        workouts: [],
        streak: 0,
        lastWorkout: null,
        totalWorkouts: 0,
        workoutHistory: [],
        achievements: []
      };
    }
    
    // Filter and validate the data
    const validWorkouts = response.data.workouts?.filter(w => 
      w.completedAt && w.exercisesCompleted?.length > 0
    ) || [];
    
    const validHistory = response.data.workoutHistory?.filter(w => 
      w.completedAt && w.exercisesCompleted?.length > 0
    ) || [];
    
    return {
      workouts: validWorkouts,
      streak: response.data.streak > 0 && response.data.lastWorkout ? response.data.streak : 0,
      lastWorkout: response.data.lastWorkout || null,
      totalWorkouts: validHistory.length,
      workoutHistory: validHistory,
      achievements: response.data.achievements || []
    };
  } catch (error) {
    console.error('Error fetching progress data:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    // Return empty state on error
    return {
      workouts: [],
      streak: 0,
      lastWorkout: null,
      totalWorkouts: 0,
      workoutHistory: [],
      achievements: []
    };
  }
};

export const getWorkoutHistory = async () => {
  try {
    console.log('Fetching workout history...');
    const response = await defaultInstance.get('/api/progress/history');
    console.log('Workout history response:', response.data);
    
    // Validate the response data
    if (!response.data || !response.data.history || !Array.isArray(response.data.history)) {
      console.log('No valid workout history received, returning empty state');
      return {
        history: [],
        totalWorkouts: 0
      };
    }
    
    // Filter and validate the history
    const validHistory = response.data.history.filter(w => 
      w.completedAt && w.exercisesCompleted?.length > 0
    );
    
    return {
      history: validHistory,
      totalWorkouts: validHistory.length
    };
  } catch (error) {
    console.error('Error fetching workout history:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    // Return empty state on error
    return {
      history: [],
      totalWorkouts: 0
    };
  }
};

// Helper function to validate workout data
const hasValidWorkoutData = (data) => {
  if (!data) return false;
  
  // Check if workouts array has valid entries
  const hasValidWorkouts = Array.isArray(data.workouts) && 
    data.workouts.length > 0 &&
    data.workouts.some(w => w.completedAt && w.exercisesCompleted?.length > 0);

  // Check if workout history has valid entries
  const hasValidHistory = Array.isArray(data.workoutHistory) && 
    data.workoutHistory.length > 0 &&
    data.workoutHistory.some(w => w.completedAt && w.exercisesCompleted?.length > 0);

  // Check if streak and totalWorkouts are backed by real data
  const hasValidStats = (
    (data.streak > 0 && data.lastWorkout) ||
    (data.totalWorkouts > 0 && hasValidHistory)
  );

  return hasValidWorkouts || hasValidHistory || hasValidStats;
};

export const getHealthData = async () => {
  try {
    const response = await defaultInstance.get('/api/health/data');
    return response.data;
  } catch (error) {
    console.error('Error in getHealthData:', error);
    throw error;
  }
};

// Export the axios instance for direct use
export { defaultInstance as api };