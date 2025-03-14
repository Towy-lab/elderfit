// src/services/api.js
import axios from 'axios';

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API functions
export const loginUser = async (email, password) => {
  console.log('Sending login request with:', { email, password: '***' });
  
  // Create a proper object for the request body
  const requestData = { 
    email, 
    password 
  };
  
  const response = await axiosInstance.post('/auth/login', requestData);
  return response.data;
};

export const registerUser = async (userData) => {
  console.log('Sending registration data:', { ...userData, password: '***' });
  
  // Make sure we're sending a proper object
  const requestData = {
    name: userData.name,
    email: userData.email,
    password: userData.password
    // Note: age is not included since we don't want to collect it
  };
  
  const response = await axiosInstance.post('/auth/register', requestData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

// Existing API functions
export const getExercises = async () => {
  const response = await axiosInstance.get('/exercises');
  return response.data;
};

export const getExerciseDetail = async (id) => {
  const response = await axiosInstance.get(`/exercises/${id}`);
  return response.data;
};

export const getWorkoutDetail = async (id) => {
  const response = await axiosInstance.get(`/workouts/${id}`);
  return response.data;
};

export const saveWorkoutProgress = async (workoutId, progressData) => {
  const response = await axiosInstance.post(`/workouts/${workoutId}/progress`, progressData);
  return response.data;
};

export const toggleFavoriteExercise = async (exerciseId) => {
  const response = await axiosInstance.post(`/exercises/${exerciseId}/favorite`);
  return response.data;
};

export const fetchRecommendedWorkouts = async () => {
  const response = await axiosInstance.get('/workouts/recommended');
  return response.data;
};

// Subscription-related API functions
export const getSubscription = async () => {
  const response = await axiosInstance.get('/stripe/subscription');
  return response.data;
};

export const createCheckoutSession = async (tier) => {
  const response = await axiosInstance.post('/stripe/create-checkout-session', { tier });
  return response.data;
};

export const upgradeSubscription = async (tier) => {
  const response = await axiosInstance.post('/stripe/upgrade-subscription', { tier });
  return response.data;
};

export const upgradeFromBasic = async (tier) => {
  const response = await axiosInstance.post('/stripe/upgrade-from-basic', { tier });
  return response.data;
};

export const downgradeToBasic = async () => {
  const response = await axiosInstance.post('/stripe/downgrade-to-basic');
  return response.data;
};

export const cancelSubscription = async () => {
  const response = await axiosInstance.post('/stripe/cancel-subscription');
  return response.data;
};

export const signupBasic = async () => {
  const response = await axiosInstance.post('/stripe/signup-basic');
  return response.data;
};

// Export the axiosInstance for direct use
export const api = axiosInstance;