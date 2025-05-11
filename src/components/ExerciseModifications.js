import React from 'react';
import { AlertCircle, Check, Info } from 'lucide-react';
import { TieredFormGuidance } from './safety/TieredFormGuidance';

const ExerciseModifications = ({ 
  modifications, 
  limitations, 
  equipment,
  className = '',
  exercise 
}) => {
  const renderEquipmentList = () => {
    if (!equipment || equipment.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Equipment Needed:</h4>
        <div className="flex flex-wrap gap-2">
          {equipment.map((item, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderLimitations = () => {
    if (!limitations || limitations.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 text-orange-600 mb-2">
          <AlertCircle size={16} />
          <h4 className="text-sm font-semibold">Consider These Limitations:</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {limitations.map((limitation, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
            >
              {limitation}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderModifications = () => {
    if (!modifications || modifications.length === 0) return null;

    return (
      <div>
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <Info size={16} />
          <h4 className="text-sm font-semibold">Available Modifications:</h4>
        </div>
        <ul className="space-y-2">
          {modifications.map((mod, index) => (
            <li 
              key={index}
              className="flex items-start gap-2 text-sm"
            >
              <Check size={16} className="text-green-500 mt-1 flex-shrink-0" />
              <span>{mod}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (!modifications?.length && !limitations?.length && !equipment?.length && !exercise) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      {exercise && <TieredFormGuidance exercise={exercise} />}
      {renderEquipmentList()}
      {renderLimitations()}
      {renderModifications()}
    </div>
  );
};

export default ExerciseModifications;