import React from 'react';

const EmptyState = ({ message = "No data available", icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      {icon ? (
        <div className="text-gray-400 mb-4">{icon}</div>
      ) : (
        <svg
          className="w-16 h-16 text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      )}
      <p className="text-gray-600 mb-4">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;