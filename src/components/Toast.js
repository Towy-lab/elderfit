import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Toast = ({ 
  message, 
  type = 'success', 
  onClose,
  duration = 3000 
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed bottom-4 right-4 ${typeStyles[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 hover:text-gray-200"
      >
        <X size={18} />
      </button>
    </div>
  );
};