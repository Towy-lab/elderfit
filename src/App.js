import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { ExerciseList } from './components/ExerciseList';
import { Calendar } from './components/Calendar';
import { ProtectedRoute } from './components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<div>Register</div>} />

      {/* Protected routes - Exercises */}
      <Route
        path="/exercises/*"
        element={
          <ProtectedRoute>
            <Routes>
              <Route index element={<ExerciseList />} />
              <Route path=":id" element={<div>Exercise Detail</div>} />
              <Route path="create" element={<div>Create Exercise</div>} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Protected routes - Schedule */}
      <Route
        path="/schedule/*"
        element={
          <ProtectedRoute>
            <Routes>
              <Route path="calendar" element={<Calendar />} />
              <Route path="routines" element={<div>Routines</div>} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;