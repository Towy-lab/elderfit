import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ExerciseSelection from './pages/ExerciseSelection';
import WorkoutList from './pages/WorkoutList';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercises/:category" element={<ExerciseSelection />} />
          <Route path="/workouts" element={<WorkoutList />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;