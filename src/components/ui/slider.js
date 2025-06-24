import React from 'react';

export const Slider = ({ 
  value = 0, 
  min = 0, 
  max = 100, 
  step = 1,
  onChange,
  className = '', 
  showValue = false,
  ...props 
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(parseInt(e.target.value));
    }
  };
  
  return (
    <div className={`w-full ${className}`} {...props}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      {showValue && (
        <div className="text-sm text-gray-600 mt-1 text-center">
          {value}
        </div>
      )}
    </div>
  );
}; 