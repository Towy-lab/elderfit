// src/services/api.js
import axios from 'axios';

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:31415/api',
  headers: {
    'Content-Type': 'application/json'
  },
  // Add timeout to prevent long-hanging requests
  timeout: 10000, // 10 second timeout
  timeoutErrorMessage: 'Request timed out - server might be unavailable'
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

// Add response interceptor for common error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      // Log additional details for debugging
      if (error.request) {
        console.error('Request details:', {
          url: error.config?.url,
          method: error.config?.method
        });
      }
    } else if (error.response.status === 401) {
      console.error('Authentication error - token may be invalid or expired');
    }
    
    return Promise.reject(error);
  }
);

// Authentication API functions
export const loginUser = async (email, password) => {
  console.log('Sending login request with:', { email, password: '***' });
  
  // Create a proper object for the request body
  const requestData = { 
    email, 
    password 
  };
  
  try {
    console.log('Making request to /auth/login with data:', requestData);
    const response = await axiosInstance.post('/auth/login', requestData);
    console.log('Login response:', response.data);
    
    if (!response.data || !response.data.token) {
      console.error('Login response missing token:', response.data);
      throw new Error('Invalid response from server - no token received');
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });
    // Rethrow to be handled by the component
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error.message);
    throw error;
  }
};

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
  
  try {
    const response = await axiosInstance.post('/auth/register', requestData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.message);
    throw error;
  }
};

// Exercise and workout-related API functions
export const getExercises = async () => {
  try {
    const response = await axiosInstance.get('/exercises');
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises:', error.message);
    // Return empty array as fallback to prevent UI errors
    return [];
  }
};

export const getExerciseDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/exercises/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercise ${id}:`, error.message);
    throw error;
  }
};

export const getWorkoutDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/workouts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching workout ${id}:`, error.message);
    throw error;
  }
};

export const saveWorkoutProgress = async (workoutId, progressData) => {
  try {
    const response = await axiosInstance.post(`/workouts/${workoutId}/progress`, progressData);
    return response.data;
  } catch (error) {
    console.error('Error saving workout progress:', error.message);
    throw error;
  }
};

export const toggleFavoriteExercise = async (exerciseId) => {
  try {
    const response = await axiosInstance.post(`/exercises/${exerciseId}/favorite`);
    return response.data;
  } catch (error) {
    console.error('Error toggling favorite exercise:', error.message);
    throw error;
  }
};

export const fetchRecommendedWorkouts = async () => {
  try {
    const response = await axiosInstance.get('/workouts/recommended');
    return response.data;
  } catch (error) {
    console.error('Error fetching recommended workouts:', error.message);
    // Return empty array as fallback
    return [];
  }
};

// Subscription-related API functions with improved error handling
export const getSubscription = async () => {
  try {
    const response = await axiosInstance.get('/stripe/subscription');
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription:', error.message);
    
    // Check if server is running/reachable
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Check if your server is running at http://localhost:31415');
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
    const response = await axiosInstance.post('/stripe/create-checkout-session', { tier, interval });
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
    const response = await axiosInstance.post('/stripe/upgrade-subscription', { 
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
    const response = await axiosInstance.post('/stripe/upgrade-from-basic', { tier, interval });
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
    const response = await axiosInstance.post('/stripe/downgrade-to-basic');
    return response.data;
  } catch (error) {
    console.error('Error downgrading to basic tier:', error.message);
    throw error;
  }
};

export const immediateDowngradeToBasic = async () => {
  try {
    const response = await axiosInstance.post('/stripe/immediate-downgrade-to-basic');
    return response.data;
  } catch (error) {
    console.error('Error immediately downgrading to basic tier:', error.message);
    throw error;
  }
};

export const downgradeToPremium = async (interval = 'month') => {
  try {
    const response = await axiosInstance.post('/stripe/downgrade-to-premium', { interval });
    return response.data;
  } catch (error) {
    console.error('Error downgrading to premium tier:', error.message);
    throw error;
  }
};

export const reactivateSubscription = async () => {
  try {
    const response = await axiosInstance.post('/stripe/reactivate-subscription');
    return response.data;
  } catch (error) {
    console.error('Error reactivating subscription:', error.message);
    throw error;
  }
};

export const cancelSubscription = async () => {
  try {
    const response = await axiosInstance.post('/stripe/cancel-subscription');
    return response.data;
  } catch (error) {
    console.error('Error canceling subscription:', error.message);
    throw error;
  }
};

export const cancelSubscriptionImmediately = async () => {
  try {
    const response = await axiosInstance.post('/stripe/cancel-subscription-immediately');
    return response.data;
  } catch (error) {
    console.error('Error canceling subscription immediately:', error.message);
    throw error;
  }
};

export const signupBasic = async () => {
  try {
    const response = await axiosInstance.post('/stripe/signup-basic');
    return response.data;
  } catch (error) {
    console.error('Error signing up for basic tier:', error.message);
    throw error;
  }
};

export const calculateProration = async (data) => {
  try {
    const { tier, interval = 'month' } = data;
    const response = await axiosInstance.post('/stripe/calculate-proration', { tier, interval });
    return response.data;
  } catch (error) {
    console.error('Error calculating proration:', error.message);
    throw error;
  }
};

export const changeBillingCycle = async (interval) => {
  try {
    const response = await axiosInstance.post('/stripe/change-billing-cycle', { interval });
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
    const response = await axiosInstance.put('/users/me/profile', profileData);
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
    const response = await axiosInstance.put('/users/preferences', preferences);
    return response.data;
  } catch (error) {
    console.error('Error updating user preferences:', error.message);
    throw error;
  }
};

export const getUserActivityHistory = async () => {
  try {
    const response = await axiosInstance.get('/users/activity-history');
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
    const response = await axiosInstance.get('/stripe/payment-methods');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error.message);
    // Return empty array as fallback
    return [];
  }
};

export const addPaymentMethod = async (paymentMethodId) => {
  try {
    const response = await axiosInstance.post('/stripe/payment-methods', { paymentMethodId });
    return response.data;
  } catch (error) {
    console.error('Error adding payment method:', error.message);
    throw error;
  }
};

export const updateDefaultPaymentMethod = async (paymentMethodId) => {
  try {
    const response = await axiosInstance.put('/stripe/default-payment-method', { paymentMethodId });
    return response.data;
  } catch (error) {
    console.error('Error updating default payment method:', error.message);
    throw error;
  }
};

export const removePaymentMethod = async (paymentMethodId) => {
  try {
    const response = await axiosInstance.delete(`/stripe/payment-methods/${paymentMethodId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing payment method:', error.message);
    throw error;
  }
};

export const getInvoices = async () => {
  try {
    const response = await axiosInstance.get('/stripe/invoices');
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
    const response = await axiosInstance.get('/stripe/test-webhook');
    return response.data;
  } catch (error) {
    console.error('Error checking webhook status:', error.message);
    return { status: 'error', message: error.message };
  }
};

// Server health check
export const checkServerHealth = async () => {
  try {
    const response = await axiosInstance.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking server health:', error.message);
    return { status: 'error', message: error.message };
  }
};

// Export the axiosInstance for direct use
export const api = axiosInstance;