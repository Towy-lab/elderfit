import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingState = ({ 
  type = 'spinner', // 'spinner' or 'skeleton'
  text = 'Loading...',
  children,
  className = ''
}) => {
  if (type === 'skeleton' && children) {
    return children;
  }

  return (
    <div 
      className={`flex flex-col items-center justify-center p-8 ${className}`}
      role="status"
      aria-busy="true"
    >
      <LoadingSpinner size="large" />
      {text && (
        <p className="mt-4 text-gray-600 text-center">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingState;