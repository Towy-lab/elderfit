import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useAuth } from '../../contexts/AuthContext';
import { useHealth } from '../../contexts/HealthContext';
import {
  getDevices,
  scanForDevices,
  connectDevice,
  disconnectDevice
} from '../../services/api';
import { Activity, Heart, Brain, Shield } from 'lucide-react';

const HealthHub = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const { subscription, loading: subscriptionLoading, hasAccess } = useSubscription();
  const { user } = useAuth();
  const { healthData, loading: healthLoading } = useHealth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to upgrade page if user doesn't have elite access
    if (!subscriptionLoading && !hasAccess('elite')) {
      navigate('/subscription/upgrade', {
        state: {
          requiredTier: 'elite',
          from: '/health/hub'
        }
      });
    }
  }, [subscription, subscriptionLoading, navigate, hasAccess]);

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
      
      // Request Bluetooth device with more general options to find more devices
      const device = await navigator.bluetooth.requestDevice({
        // Accept any Bluetooth device
        acceptAllDevices: true,
        optionalServices: [
          // Standard services
          'device_information',
          'battery_service',
          'heart_rate',
          'generic_access',
          // Samsung-specific services
          '0000fe01-0000-1000-8000-00805f9b34fb', // Samsung Health
          '0000fe02-0000-1000-8000-00805f9b34fb', // Samsung Device
          '00001800-0000-1000-8000-00805f9b34fb', // Generic Access Service
          '00001801-0000-1000-8000-00805f9b34fb', // Generic Attribute Service
          '0000180a-0000-1000-8000-00805f9b34fb', // Device Information Service
          '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
          '00001812-0000-1000-8000-00805f9b34fb', // HID Service
          // WHOOP-specific services
          '00001530-0000-1000-8000-00805f9b34fb',
          '00001531-0000-1000-8000-00805f9b34fb'
        ]
      });
      
      console.log('Selected device:', device);
      
      // Check if this might be a Samsung device
      const isSamsungDevice = device.name && (
        device.name.includes('Samsung') || 
        device.name.includes('Galaxy') || 
        device.name.includes('SM-') ||
        device.name.includes('S24')
      );
      
      // Get device information
      const deviceInfo = {
        id: device.id,
        name: device.name || 'Unknown Device',
        type: isSamsungDevice ? 'samsung' : 'bluetooth',
        status: 'available',
        batteryLevel: null,
        lastSync: new Date().toISOString()
      };
      
      // Try to connect to the device (Samsung phones may not fully connect via GATT)
      try {
        const server = await device.gatt.connect();
        console.log('Connected to GATT server');
        
        // Try to get battery level if available
        try {
          const batteryService = await server.getPrimaryService('battery_service');
          const batteryCharacteristic = await batteryService.getCharacteristic('battery_level');
          const batteryValue = await batteryCharacteristic.readValue();
          deviceInfo.batteryLevel = batteryValue.getUint8(0);
        } catch (e) {
          console.log('Battery level not available:', e);
        }

        // Try to get device information if available
        try {
          const deviceInfoService = await server.getPrimaryService('device_information');
          const modelNameCharacteristic = await deviceInfoService.getCharacteristic('model_number_string');
          const modelNameValue = await modelNameCharacteristic.readValue();
          const decoder = new TextDecoder('utf-8');
          deviceInfo.model = decoder.decode(modelNameValue);
          console.log('Device model:', deviceInfo.model);
        } catch (e) {
          console.log('Device information not available:', e);
        }
      } catch (e) {
        console.log('Could not fully connect to GATT server:', e);
        // For Samsung devices, we still want to add them even if GATT fails
        if (!isSamsungDevice) {
          throw new Error('Failed to connect to device. Please try again.');
        }
        deviceInfo.connectionLimited = true;
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

  // Show loading state
  if (subscriptionLoading || healthLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Only render if user has elite access
  if (hasAccess('elite')) {
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
              <p className="text-gray-600 mb-2">Type: {device.type === 'samsung' ? 'Samsung Phone' : device.type}</p>
              {device.model && <p className="text-gray-600 mb-4">Model: {device.model}</p>}
              {device.connectionLimited && (
                <div className="text-amber-600 text-sm mb-4">
                  Note: This device has limited connectivity with Web Bluetooth
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  device.status === 'connected' || device.type === 'samsung'
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {device.type === 'samsung' ? 'Limited Connection' : device.status}
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
  }

  return null;
};

export default HealthHub; 