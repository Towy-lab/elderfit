// src/contexts/ToastContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';

// Create context
const ToastContext = createContext();

// Toast component 
const Toast = ({ message, type = 'info', onClose }) => {
  const bgColor = {
    success: 'bg-success',
    error: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info'
  }[type] || 'bg-info';

  return (
    <div 
      className={`toast show ${bgColor} text-white`} 
      role="alert" 
      aria-live="assertive" 
      aria-atomic="true"
    >
      <div className="toast-header">
        <strong className="me-auto">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </strong>
        <button 
          type="button" 
          className="btn-close" 
          data-bs-dismiss="toast" 
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
};

// Toast container component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast
  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    
    setToasts(prevToasts => [
      ...prevToasts,
      { id, message, type }
    ]);

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Custom hook for using the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

export default ToastContext;