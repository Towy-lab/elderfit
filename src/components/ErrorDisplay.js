import React from 'react';
import { AlertCircle, RefreshCcw, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ErrorDisplay = ({ 
  error, 
  onRetry, 
  showBack = true,
  title = 'Something went wrong',
  message,
  className = ''
}) => {
  const navigate = useNavigate();
  
  // Get appropriate error message
  const getErrorMessage = () => {
    if (message) return message;
    if (error?.message) return error.message;
    if (typeof error === 'string') return error;
    return 'An unexpected error occurred. Please try again.';
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md ${className}`}
      role="alert"
    >
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {title}
      </h2>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {getErrorMessage()}
      </p>
      
      <div className="flex gap-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            aria-label="Try again"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>
        )}
        
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={18} />
            Go Back
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;