import React from 'react';
import ErrorDisplay from './ErrorDisplay';

const APIErrorBoundary = ({ 
  error, 
  onRetry, 
  children,
  showBack = true 
}) => {
  if (error) {
    let errorMessage = 'An error occurred while fetching data.';
    let errorTitle = 'Error';

    // Handle different types of errors
    if (error.response) {
      // Server responded with error
      switch (error.response.status) {
        case 404:
          errorTitle = 'Not Found';
          errorMessage = 'The requested resource was not found.';
          break;
        case 401:
          errorTitle = 'Unauthorized';
          errorMessage = 'Please log in to access this content.';
          break;
        case 403:
          errorTitle = 'Forbidden';
          errorMessage = 'You don\'t have permission to access this content.';
          break;
        case 500:
          errorTitle = 'Server Error';
          errorMessage = 'An internal server error occurred. Please try again later.';
          break;
        default:
          errorMessage = error.response.data?.message || errorMessage;
      }
    } else if (error.request) {
      // Request made but no response
      errorTitle = 'Network Error';
      errorMessage = 'Unable to connect to the server. Please check your internet connection.';
    }

    return (
      <ErrorDisplay
        error={error}
        onRetry={onRetry}
        showBack={showBack}
        title={errorTitle}
        message={errorMessage}
      />
    );
  }

  return children;
};

export default APIErrorBoundary;