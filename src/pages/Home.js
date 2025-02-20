// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-6">Welcome to ElderFit</h1>
      <p className="text-lg mb-8">Your personalized fitness companion for healthy aging.</p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Link 
          to="/exercises/all" 
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Browse Exercises</h2>
          <p>Explore our library of senior-friendly exercises</p>
        </Link>
        
        <Link 
          to="/calendar" 
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Workout Calendar</h2>
          <p>Plan and track your workout schedule</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;