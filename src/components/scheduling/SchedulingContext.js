import React, { createContext, useContext, useState, useEffect } from 'react';

const SchedulingContext = createContext();

const LOCAL_STORAGE_KEYS = {
  SCHEDULED_WORKOUTS: 'elderfit_scheduled_workouts',
  ROUTINES: 'elderfit_routines',
  REMINDERS: 'elderfit_reminders',
  REST_DAYS: 'elderfit_rest_days'
};

export const SchedulingProvider = ({ children }) => {
  // Scheduled Workouts State
  const [scheduledWorkouts, setScheduledWorkouts] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SCHEDULED_WORKOUTS);
    return saved ? JSON.parse(saved) : [];
  });

  // Routines State
  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ROUTINES);
    return saved ? JSON.parse(saved) : [];
  });

  // Reminders State
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REMINDERS);
    return saved ? JSON.parse(saved) : [];
  });

  // Rest Days State
  const [restDays, setRestDays] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REST_DAYS);
    return saved ? JSON.parse(saved) : [];
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SCHEDULED_WORKOUTS, JSON.stringify(scheduledWorkouts));
  }, [scheduledWorkouts]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REST_DAYS, JSON.stringify(restDays));
  }, [restDays]);

  // Scheduling Methods
  const scheduleWorkout = (workout) => {
    setScheduledWorkouts(prev => [...prev, workout]);
  };

  const removeScheduledWorkout = (workoutId) => {
    setScheduledWorkouts(prev => prev.filter(w => w.id !== workoutId));
  };

  const updateScheduledWorkout = (workoutId, updates) => {
    setScheduledWorkouts(prev => 
      prev.map(workout => workout.id === workoutId ? { ...workout, ...updates } : workout)
    );
  };

  // Routine Methods
  const createRoutine = (routine) => {
    setRoutines(prev => [...prev, { ...routine, id: Date.now() }]);
  };

  const updateRoutine = (routineId, updates) => {
    setRoutines(prev =>
      prev.map(routine => routine.id === routineId ? { ...routine, ...updates } : routine)
    );
  };

  const deleteRoutine = (routineId) => {
    setRoutines(prev => prev.filter(r => r.id !== routineId));
  };

  // Reminder Methods
  const addReminder = (reminder) => {
    setReminders(prev => [...prev, { ...reminder, id: Date.now() }]);
    
    // Set up browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      const notificationTime = new Date(reminder.datetime).getTime() - Date.now();
      setTimeout(() => {
        new Notification('ElderFit Workout Reminder', {
          body: reminder.message,
          icon: '/logo.png'
        });
      }, notificationTime);
    }
  };

  const removeReminder = (reminderId) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  // Rest Day Methods
  const setRestDay = (date) => {
    setRestDays(prev => [...prev, date]);
  };

  const removeRestDay = (date) => {
    setRestDays(prev => prev.filter(d => d !== date));
  };

  const isRestDay = (date) => {
    return restDays.includes(date);
  };

  // Utility Methods
  const getWorkoutsForWeek = (startDate) => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);
    
    return scheduledWorkouts.filter(workout => {
      const workoutDate = new Date(workout.datetime);
      return workoutDate >= startDate && workoutDate < endDate;
    });
  };

  const getUpcomingWorkouts = () => {
    const now = new Date();
    return scheduledWorkouts
      .filter(workout => new Date(workout.datetime) > now)
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  };

  const getRoutinesByType = (type) => {
    return routines.filter(routine => routine.type === type);
  };

  const value = {
    // Scheduled Workouts
    scheduledWorkouts,
    scheduleWorkout,
    removeScheduledWorkout,
    updateScheduledWorkout,
    getWorkoutsForWeek,
    getUpcomingWorkouts,
    
    // Routines
    routines,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    getRoutinesByType,
    
    // Reminders
    reminders,
    addReminder,
    removeReminder,
    
    // Rest Days
    restDays,
    setRestDay,
    removeRestDay,
    isRestDay
  };

  return (
    <SchedulingContext.Provider value={value}>
      {children}
    </SchedulingContext.Provider>
  );
};

export const useScheduling = () => {
  const context = useContext(SchedulingContext);
  if (!context) {
    throw new Error('useScheduling must be used within a SchedulingProvider');
  }
  return context;
};

export default SchedulingContext;