// src/components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'indigo' }) => {
  // Size mappings
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };
  
  // Color mappings
  const colorClasses = {
    indigo: 'border-indigo-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    gray: 'border-gray-500'
  };
  
  // Get the appropriate classes or use defaults
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const colorClass = colorClasses[color] || colorClasses.indigo;
  
  return (
    <div className="flex justify-center">
      <div className={`animate-spin rounded-full ${sizeClass} border-t-2 border-b-2 ${colorClass}`}></div>
    </div>
  );
};

export default LoadingSpinner;