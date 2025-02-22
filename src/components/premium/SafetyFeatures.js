import React from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';

const SafetyFeatures = () => {
  const { subscription } = useSubscription();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Safety Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Fall Detection</h3>
          <p className="text-gray-600 mb-4">
            Automatic fall detection and emergency alerts.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Configure
          </button>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Emergency Contacts</h3>
          <p className="text-gray-600 mb-4">
            Manage your emergency contacts and alert settings.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Manage Contacts
          </button>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Health Metrics</h3>
          <p className="text-gray-600 mb-4">
            Track and monitor important health metrics.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            View Metrics
          </button>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Wearable Integration</h3>
          <p className="text-gray-600 mb-4">
            Connect and manage your wearable devices.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Connect Device
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafetyFeatures;