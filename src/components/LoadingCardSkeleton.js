import React from 'react';

const LoadingCard = ({ className = '' }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${className}`}
      role="status"
      aria-label="Loading content"
    >
      <div className="p-6">
        {/* Title and badge skeleton */}
        <div className="flex justify-between items-start mb-3">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>

        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded w-16"></div>
          ))}
        </div>

        {/* Button skeleton */}
        <div className="w-full h-10 bg-gray-200 rounded-md mt-2"></div>
      </div>

      {/* Progress bar skeleton */}
      <div className="h-1 bg-gray-200"></div>
    </div>
  );
};

export default LoadingCard;