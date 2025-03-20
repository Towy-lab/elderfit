// src/services/api.js - Enhanced with Stripe-related functions
import axios from 'axios';

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:31415/api',
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
// Add this function to your api.js file
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};
// In api.js
export const registerUser = async (userData) => {
  console.log('Sending registration data:', { ...userData, password: '***' });
  
  // Ensure all required fields are included
  const requestData = {
    firstName: userData.firstName || userData.name || 'Default', // Fallback
    lastName: userData.lastName || userData.name || 'User',     // Fallback
    email: userData.email,
    password: userData.password
  };
  
  console.log('Sending formatted data:', { ...requestData, password: '***' });
  
  const response = await axiosInstance.post('/auth/register', requestData);
  return response.data;
};

// Exercise and workout-related API functions
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

export const createCheckoutSession = async (data) => {
  const { tier, interval = 'month' } = data;
  const response = await axiosInstance.post('/stripe/create-checkout-session', { tier, interval });
  return response.data;
};

export const upgradeSubscription = async (data) => {
  const { tier, interval = 'month', prorationBehavior = 'create_prorations' } = data;
  const response = await axiosInstance.post('/stripe/upgrade-subscription', { 
    tier, 
    interval, 
    prorationBehavior 
  });
  return response.data;
};

export const upgradeFromBasic = async (data) => {
  const { tier, interval = 'month' } = data;
  const response = await axiosInstance.post('/stripe/upgrade-from-basic', { tier, interval });
  return response.data;
};

export const downgradeToBasic = async () => {
  const response = await axiosInstance.post('/stripe/downgrade-to-basic');
  return response.data;
};

export const immediateDowngradeToBasic = async () => {
  const response = await axiosInstance.post('/stripe/immediate-downgrade-to-basic');
  return response.data;
};

export const cancelSubscription = async () => {
  const response = await axiosInstance.post('/stripe/cancel-subscription');
  return response.data;
};

export const cancelSubscriptionImmediately = async () => {
  const response = await axiosInstance.post('/stripe/cancel-subscription-immediately');
  return response.data;
};

export const signupBasic = async () => {
  const response = await axiosInstance.post('/stripe/signup-basic');
  return response.data;
};

export const calculateProration = async (data) => {
  const { tier, interval = 'month' } = data;
  const response = await axiosInstance.post('/stripe/calculate-proration', { tier, interval });
  return response.data;
};

export const reactivateSubscription = async () => {
  const response = await axiosInstance.post('/stripe/reactivate-subscription');
  return response.data;
};

export const changeBillingCycle = async (interval) => {
  const response = await axiosInstance.post('/stripe/change-billing-cycle', { interval });
  return response.data;
};

// User profile and preferences API functions
export const updateUserProfile = async (profileData) => {
  const response = await axiosInstance.put('/users/profile', profileData);
  return response.data;
};

export const updateUserPreferences = async (preferences) => {
  const response = await axiosInstance.put('/users/preferences', preferences);
  return response.data;
};

export const getUserActivityHistory = async () => {
  const response = await axiosInstance.get('/users/activity-history');
  return response.data;
};

// Payment-related API functions
export const getPaymentMethods = async () => {
  const response = await axiosInstance.get('/stripe/payment-methods');
  return response.data;
};

export const addPaymentMethod = async (paymentMethodId) => {
  const response = await axiosInstance.post('/stripe/payment-methods', { paymentMethodId });
  return response.data;
};

export const updateDefaultPaymentMethod = async (paymentMethodId) => {
  const response = await axiosInstance.put('/stripe/default-payment-method', { paymentMethodId });
  return response.data;
};

export const removePaymentMethod = async (paymentMethodId) => {
  const response = await axiosInstance.delete(`/stripe/payment-methods/${paymentMethodId}`);
  return response.data;
};

export const getInvoices = async () => {
  const response = await axiosInstance.get('/stripe/invoices');
  return response.data;
};

// Export the axiosInstance for direct use
export const api = axiosInstance;