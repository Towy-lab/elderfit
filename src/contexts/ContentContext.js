import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSubscription } from './SubscriptionContext';
import { getAllWorkouts, getWorkoutsByTier } from '../data/workouts';

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const { subscription } = useSubscription();
  const userTier = subscription?.tier || 'basic';
  
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [workoutFilters, setWorkoutFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Load workouts based on user tier
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const availableWorkouts = getWorkoutsByTier(userTier);
      setWorkouts(availableWorkouts);
      setFilteredWorkouts(availableWorkouts);
      setLoading(false);
    }, 500);
  }, [userTier]);
  
  // Apply filters when they change
  useEffect(() => {
    if (!workouts.length) return;
    
    const filtered = workouts.filter(workout => {
      // Filter by duration
      if (workoutFilters.maxDuration && workout.duration > workoutFilters.maxDuration) {
        return false;
      }
      
      // Filter by level
      if (workoutFilters.level && workout.level !== workoutFilters.level) {
        return false;
      }
      
      // Filter by focus area
      if (workoutFilters.focusArea && workout.focusArea !== workoutFilters.focusArea) {
        return false;
      }
      
      return true;
    });
    
    // Apply search query
    const searchedResults = searchQuery 
      ? filtered.filter(workout => 
          workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workout.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (workout.focusArea && workout.focusArea.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : filtered;
    
    setFilteredWorkouts(searchedResults);
  }, [workouts, workoutFilters, searchQuery]);
  
  const updateFilters = (newFilters) => {
    setWorkoutFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };
  
  const clearFilters = () => {
    setWorkoutFilters({});
  };
  
  const value = {
    workouts: filteredWorkouts,
    allWorkouts: workouts,
    loading,
    filters: workoutFilters,
    updateFilters,
    clearFilters,
    searchQuery,
    setSearchQuery,
    userTier
  };
  
  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export default ContentContext;
