import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  getDevices,
  scanForDevices,
  connectDevice,
  disconnectDevice
} from '../../services/api';

const HealthHub = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const { subscription, loading: subscriptionLoading, hasTierAccess } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only check subscription after it's loaded
    if (subscriptionLoading) {
      return;
    }

    // If subscription is loaded and user doesn't have Elite access
    if (!subscriptionLoading && !hasTierAccess('elite')) {
      console.log('User does not have elite access, redirecting to upgrade');
      navigate('/subscription/upgrade');
      return;
    }

    // Only fetch devices if we have Elite access
    if (hasTierAccess('elite')) {
      console.log('User has elite access, fetching devices');
      fetchDevices();
    }
  }, [subscription, subscriptionLoading, navigate, hasTierAccess]);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const devices = await getDevices();
      setDevices(devices);
    } catch (err) {
      setError('Failed to fetch devices');
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScanForDevices = async () => {
    try {
      setScanning(true);
      setError(null);
      
      console.log('Starting Bluetooth device scan...');
      
      // Check if Web Bluetooth API is available
      if (!navigator.bluetooth) {
        throw new Error('Web Bluetooth API is not available in your browser. Please use a supported browser like Chrome.');
      }
      
      // Request Bluetooth device with specific filters
      const device = await navigator.bluetooth.requestDevice({
        // Accept all devices that have a name
        filters: [
          { services: ['heart_rate'] },
          { services: ['blood_pressure'] },
          { services: ['weight_scale'] },
          { services: ['battery_service'] }
        ],
        optionalServices: ['device_information', 'battery_service']
      });
      
      console.log('Selected device:', device);
      
      // Connect to the device
      const server = await device.gatt.connect();
      console.log('Connected to GATT server');
      
      // Get device information
      const deviceInfo = {
        id: device.id,
        name: device.name || 'Unknown Device',
        type: 'bluetooth',
        status: 'available',
        batteryLevel: null,
        lastSync: new Date().toISOString()
      };
      
      // Try to get battery level if available
      try {
        const batteryService = await server.getPrimaryService('battery_service');
        const batteryCharacteristic = await batteryService.getCharacteristic('battery_level');
        const batteryValue = await batteryCharacteristic.readValue();
        deviceInfo.batteryLevel = batteryValue.getUint8(0);
      } catch (e) {
        console.log('Battery level not available:', e);
      }
      
      // Update devices list with the discovered device
      setDevices(prevDevices => {
        const existingIds = new Set(prevDevices.map(d => d.id));
        if (!existingIds.has(deviceInfo.id)) {
          return [...prevDevices, deviceInfo];
        }
        return prevDevices;
      });
      
      console.log('Device scan completed successfully');
    } catch (err) {
      console.error('Error scanning for devices:', err);
      setError(err.message || 'Failed to scan for devices. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const handleConnectDevice = async (deviceId) => {
    try {
      setError(null);
      const updatedDevice = await connectDevice(deviceId);
      
      // Update device status in the list
      setDevices(devices.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'connected', ...updatedDevice }
          : device
      ));
    } catch (err) {
      setError('Failed to connect device');
      console.error('Error connecting device:', err);
    }
  };

  const handleDisconnectDevice = async (deviceId) => {
    try {
      setError(null);
      await disconnectDevice(deviceId);
      
      // Update device status in the list
      setDevices(devices.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'disconnected' }
          : device
      ));
    } catch (err) {
      setError('Failed to disconnect device');
      console.error('Error disconnecting device:', err);
    }
  };

  // Show loading state while subscription is being checked
  if (subscriptionLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show loading state while fetching devices
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Health Hub</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.firstName || user?.name || 'Elite Member'}!
          </p>
        </div>
        <button
          onClick={handleScanForDevices}
          disabled={scanning}
          className={`bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors ${
            scanning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {scanning ? 'Scanning...' : 'Scan for Devices'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map(device => (
          <div key={device.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{device.name}</h2>
            <p className="text-gray-600 mb-4">Type: {device.type}</p>
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm ${
                device.status === 'connected' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {device.status}
              </span>
              {device.status === 'disconnected' ? (
                <button
                  onClick={() => handleConnectDevice(device.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Connect
                </button>
              ) : (
                <button
                  onClick={() => handleDisconnectDevice(device.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {devices.length === 0 && !scanning && (
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            No devices found. Click "Scan for Devices" to discover available devices.
          </p>
        </div>
      )}
    </div>
  );
};

export default HealthHub; 