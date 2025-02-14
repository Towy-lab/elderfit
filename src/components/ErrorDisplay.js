import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="text-center p-8">
      <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      )}
    </div>
  );
};