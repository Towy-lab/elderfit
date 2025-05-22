import React, { useState } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Shield, Bluetooth, Wifi, Smartphone } from 'lucide-react';

const DeviceConnection = () => {
  const { hasTierAccess } = useSubscription();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);

  const handleConnectDevice = async () => {
    setIsConnecting(true);
    try {
      // Here you would implement the actual device connection logic
      // For now, we'll just simulate a connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      setConnectedDevices(prev => [...prev, {
        id: Date.now(),
        name: 'Sample Device',
        type: 'wearable',
        status: 'connected'
      }]);
    } catch (error) {
      console.error('Error connecting device:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="text-blue-600" size={24} />
        <h3 className="text-xl font-bold">Device Connection</h3>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Connect your wearable devices to track your health metrics and exercise progress.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Bluetooth className="text-blue-500" />
            <span>Bluetooth Devices</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Wifi className="text-green-500" />
            <span>Wi-Fi Devices</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Smartphone className="text-purple-500" />
            <span>Mobile Apps</span>
          </div>
        </div>

        <button
          onClick={handleConnectDevice}
          disabled={isConnecting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${isConnecting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isConnecting ? 'Connecting...' : 'Connect New Device'}
        </button>
      </div>

      {connectedDevices.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Connected Devices</h4>
          <div className="space-y-3">
            {connectedDevices.map(device => (
              <div 
                key={device.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="text-blue-500" />
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-sm text-gray-500">{device.type}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {device.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hasTierAccess('premium') && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-yellow-800">
            Upgrade to Premium to unlock advanced device features and health tracking.
          </p>
          <a 
            href="/subscription/plans" 
            className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            View Premium Features →
          </a>
        </div>
      )}
    </div>
  );
};

export default DeviceConnection; 