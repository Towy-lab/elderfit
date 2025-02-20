import React from 'react';
import { Loader2 } from 'lucide-react';

const sizeMap = {
  small: 'w-4 h-4',
  medium: 'w-6 h-6',
  large: 'w-8 h-8',
  xlarge: 'w-12 h-12'
};

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'text-blue-500',
  className = '',
  label = 'Loading...'
}) => {
  return (
    <div 
      role="status"
      className={`flex items-center justify-center ${className}`}
      aria-label={label}
    >
      <Loader2 
        className={`animate-spin ${sizeMap[size]} ${color}`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoadingSpinner;