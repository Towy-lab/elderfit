import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ExerciseSelection from './pages/ExerciseSelection';
import ExerciseDetail from './pages/ExerciseDetail';
import WorkoutDetail from './pages/WorkoutDetail';
import WorkoutList from './pages/WorkoutList';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/exercises/:category" element={<ExerciseSelection />} />
              <Route path="/exercise/:id" element={<ExerciseDetail />} />
              <Route path="/workout/:id" element={<WorkoutDetail />} />
              <Route path="/workouts" element={<WorkoutList />} />
            </Route>
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;