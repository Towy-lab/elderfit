// App.js
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Import page components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ExerciseSelection from './pages/ExerciseSelection';
import ExerciseDetail from './pages/ExerciseDetail';
import WorkoutDetail from './pages/WorkoutDetail';
import WorkoutList from './pages/WorkoutList';

// Import Schedule Components
import WorkoutCalendar from './components/scheduling/WorkoutCalendar';
import RestDayPlanner from './components/scheduling/RestDayPlanner';
import RoutineBuilder from './components/scheduling/RoutineBuilder';
import WorkoutReminders from './components/scheduling/WorkoutReminders';

// Import Safety Components
import PainTracker from './components/safety/PainTracker';
import EmergencyContact from './components/safety/EmergencyContact';
import FormGuidance from './components/safety/FormGuidance';

const App = () => {
  useEffect(() => {
    console.log('App component mounted');
  }, []);

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              {/* Exercise Routes */}
              <Route path="/exercises/:category" element={<ExerciseSelection />} />
              <Route path="/exercise/:id" element={<ExerciseDetail />} />
              <Route path="/workout/:id" element={<WorkoutDetail />} />
              <Route path="/workouts" element={<WorkoutList />} />
              
              {/* Scheduling Routes */}
              <Route path="/calendar" element={<WorkoutCalendar />} />
              <Route path="/rest-planner" element={<RestDayPlanner />} />
              <Route path="/routines" element={<RoutineBuilder />} />
              <Route path="/reminders" element={<WorkoutReminders />} />
              
              {/* Safety Routes */}
              <Route path="/pain-tracker" element={<PainTracker />} />
              <Route path="/emergency-contacts" element={<EmergencyContact />} />
              <Route path="/form-guide" element={<FormGuidance />} />
            </Route>
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;