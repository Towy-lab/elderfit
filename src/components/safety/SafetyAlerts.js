import React from 'react';
import { Shield } from 'lucide-react';

export const SafetyAlerts = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Safety Monitoring</h3>
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-start">
            <Shield className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
            <span className="text-gray-600">{alert}</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 