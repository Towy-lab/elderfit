import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Bluetooth, Smartphone, Watch, HelpCircle, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const DeviceConnection = () => {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDeviceType, setSelectedDeviceType] = useState(null);
  const [showBluetoothHelp, setShowBluetoothHelp] = useState(false);
  const { user } = useAuth();
  const { hasAccess } = useSubscription();
  const navigate = useNavigate();

  // Check if Web Bluetooth API is available on mount
  useEffect(() => {
    if (!navigator.bluetooth) {
      setError('Your browser may not fully support the Web Bluetooth API. For best results, please use Chrome or Edge on desktop, or Chrome on Android.');
    }
  }, []);

  const deviceTypes = [
    {
      id: 'whoop',
      name: 'WHOOP Strap',
      icon: Watch,
      instructions: [
        'Make sure your WHOOP strap is charged',
        'Open the WHOOP app on your phone',
        'Go to Settings > Device > Connect New Device',
        'Follow the in-app instructions to put your WHOOP in pairing mode',
        'Return here and click "Connect WHOOP"'
      ]
    },
    {
      id: 'smartwatch',
      name: 'Smart Watch',
      icon: Watch,
      instructions: [
        'Enable Bluetooth on your watch',
        'Put your watch in pairing mode',
        'Make sure your watch is charged',
        'Click "Connect Watch" below'
      ]
    },
    {
      id: 'phone',
      name: 'Smartphone',
      icon: Smartphone,
      instructions: [
        'Enable Bluetooth on your phone',
        'Put your phone in discovery/pairing mode',
        'Make sure your phone is charged',
        'Click "Connect Phone" below'
      ]
    }
  ];

  const handleScanForDevices = async (deviceType) => {
    try {
      setScanning(true);
      setError(null);
      setSelectedDeviceType(deviceType);
      
      // Check if Web Bluetooth API is available
      if (!navigator.bluetooth) {
        throw new Error('Your browser does not support Bluetooth. Please use Chrome or Edge.');
      }

      let requestOptions = {};
      
      // Use different filters based on device type
      if (deviceType === 'phone') {
        // For smartphones, we need to be more general as they may not advertise specific services
        requestOptions = {
          // Accept any Bluetooth device for phones
          acceptAllDevices: true,
          optionalServices: [
            // Standard services
            'device_information',
            'battery_service',
            'generic_access',
            // Samsung-specific services (partial list)
            '0000fe01-0000-1000-8000-00805f9b34fb', // Samsung Health
            '0000fe02-0000-1000-8000-00805f9b34fb', // Samsung Device
            '00001800-0000-1000-8000-00805f9b34fb', // Generic Access Service
            '00001801-0000-1000-8000-00805f9b34fb', // Generic Attribute Service
            '0000180a-0000-1000-8000-00805f9b34fb', // Device Information Service
            '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
            '00001812-0000-1000-8000-00805f9b34fb'  // HID Service
          ]
        };
      } else {
        // For other devices like WHOOP/smartwatches, use specific filters
        requestOptions = {
          filters: [
            // WHOOP-specific service UUIDs
            { services: ['00001530-0000-1000-8000-00805f9b34fb'] },
            { services: ['00001531-0000-1000-8000-00805f9b34fb'] },
            // Generic health services
            { services: ['heart_rate'] },
            { services: ['battery_service'] }
          ],
          optionalServices: [
            'device_information',
            'battery_service',
            '00001530-0000-1000-8000-00805f9b34fb',
            '00001531-0000-1000-8000-00805f9b34fb'
          ]
        };
      }

      console.log(`Scanning for ${deviceType} with options:`, requestOptions);
      
      // Request Bluetooth device
      const device = await navigator.bluetooth.requestDevice(requestOptions);

      console.log('Device selected:', device);
      
      // Check if this might be a Samsung device
      const isSamsungDevice = device.name && (
        device.name.includes('Samsung') || 
        device.name.includes('Galaxy') || 
        device.name.includes('SM-') ||
        device.name.includes('S24')
      );
      
      // Device information
      const deviceInfo = {
        id: device.id,
        name: device.name || 'Unknown Device',
        type: deviceType,
        status: 'connected',
        batteryLevel: null,
        lastSync: new Date().toISOString(),
        isSamsung: isSamsungDevice
      };

      // Try to connect to device (Samsung phones may not fully connect via GATT)
      try {
        const server = await device.gatt.connect();
        console.log('Connected to GATT server');
        
        // Try to get battery level
        try {
          const batteryService = await server.getPrimaryService('battery_service');
          const batteryCharacteristic = await batteryService.getCharacteristic('battery_level');
          const batteryValue = await batteryCharacteristic.readValue();
          deviceInfo.batteryLevel = batteryValue.getUint8(0);
        } catch (e) {
          console.log('Battery level not available:', e);
        }

        // Try to get device information
        try {
          const deviceInfoService = await server.getPrimaryService('device_information');
          const modelCharacteristic = await deviceInfoService.getCharacteristic('model_number_string');
          const modelValue = await modelCharacteristic.readValue();
          const decoder = new TextDecoder('utf-8');
          deviceInfo.model = decoder.decode(modelValue);
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
      }

      // Update devices list
      setDevices(prevDevices => {
        const existingIds = new Set(prevDevices.map(d => d.id));
        if (!existingIds.has(deviceInfo.id)) {
          return [...prevDevices, deviceInfo];
        }
        return prevDevices;
      });

    } catch (err) {
      console.error('Error scanning for devices:', err);
      setError(err.message || 'Failed to scan for devices. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const handleUnpairDevice = async (deviceId) => {
    try {
      setError(null);
      
      // Get the device from the list
      const deviceToUnpair = devices.find(d => d.id === deviceId);
      if (!deviceToUnpair) {
        throw new Error('Device not found');
      }

      // If the device is a Bluetooth device, disconnect from it
      if (deviceToUnpair.type === 'bluetooth' || deviceToUnpair.type === 'whoop') {
        try {
          const device = await navigator.bluetooth.getDevices();
          const connectedDevice = device.find(d => d.id === deviceId);
          if (connectedDevice && connectedDevice.gatt.connected) {
            await connectedDevice.gatt.disconnect();
          }
        } catch (e) {
          console.log('Error disconnecting from Bluetooth device:', e);
        }
      }

      // Remove device from the list
      setDevices(prevDevices => prevDevices.filter(d => d.id !== deviceId));
      
      // Show success message
      setError('Device unpaired successfully');
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      console.error('Error unpairing device:', err);
      setError(err.message || 'Failed to unpair device');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Connect Your Devices</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {deviceTypes.map(deviceType => (
            <div 
              key={deviceType.id}
              className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center mb-4">
                <deviceType.icon className="w-8 h-8 text-blue-500 mr-3" />
                <h2 className="text-xl font-semibold">{deviceType.name}</h2>
              </div>
              
              <ul className="space-y-2 mb-4">
                {deviceType.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{instruction}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleScanForDevices(deviceType.id)}
                disabled={scanning}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  scanning && selectedDeviceType === deviceType.id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {scanning && selectedDeviceType === deviceType.id
                  ? 'Scanning...'
                  : `Connect ${deviceType.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* Bluetooth Help Section */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Bluetooth className="w-6 h-6 mr-2 text-blue-700" />
            Bluetooth Connection Help
          </h2>
          
          <button 
            onClick={() => setShowBluetoothHelp(!showBluetoothHelp)}
            className="text-blue-600 hover:text-blue-800 mb-4 font-medium flex items-center"
          >
            {showBluetoothHelp ? 'Hide Help' : 'Show Help'} 
            <HelpCircle className="w-4 h-4 ml-1" />
          </button>
          
          {showBluetoothHelp && (
            <div className="text-sm text-gray-700 space-y-3">
              <p>
                <strong>Web Bluetooth Requirements:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Make sure you're using a supported browser: Chrome (desktop or Android), Edge, or Opera</li>
                <li>Safari and Firefox do not currently support Web Bluetooth</li>
                <li>Your device must have Bluetooth hardware enabled</li>
                <li>You must be on a secure (HTTPS) connection</li>
                <li>Some corporate networks or VPNs may block Bluetooth access</li>
              </ul>
              
              <p>
                <strong>Samsung Device Notes:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Samsung phones (including Galaxy S24) have limited compatibility with Web Bluetooth</li>
                <li>Your phone must be in "discoverable" mode in Bluetooth settings</li>
                <li>For Samsung devices: Settings → Connections → Bluetooth → Turn on "Visible to all nearby devices"</li>
                <li>Samsung phones can be detected, but some features like battery level may not work</li>
              </ul>
              
              <p>
                <strong>Troubleshooting Steps:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Make sure Bluetooth is enabled on both devices</li>
                <li>Ensure your device is in pairing mode</li>
                <li>Try refreshing the page</li>
                <li>If on Windows, check that Bluetooth is enabled in Windows Settings</li>
                <li>If on Android, make sure location permissions are granted</li>
                <li>For Samsung phones: temporarily disable power saving mode</li>
              </ul>
              
              <p className="pt-2">
                <strong>Note:</strong> Due to browser security limitations, the Web Bluetooth API can only detect devices that are actively advertising their presence. If your device is not appearing, please ensure it is in pairing/discovery mode.
              </p>
            </div>
          )}
        </div>

        {/* Connected Devices Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Connected Devices</h2>
          {devices.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600">No devices are currently connected.</p>
              <p className="text-gray-500 text-sm mt-2">Connect a device using one of the options above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map(device => (
                <div key={device.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-lg">{device.name}</h3>
                      <div className="text-sm text-gray-600">
                        <p>Type: {device.isSamsung ? 'Samsung Phone' : device.type}</p>
                        {device.model && <p>Model: {device.model}</p>}
                      </div>
                    </div>
                    <span className={`px-2 py-1 ${device.isSamsung ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} rounded-full text-sm`}>
                      {device.isSamsung ? 'Limited Connection' : 'Connected'}
                    </span>
                  </div>
                  {device.batteryLevel !== null && (
                    <div className="mt-2 text-sm text-gray-600">
                      Battery: {device.batteryLevel}%
                    </div>
                  )}
                  {device.isSamsung && (
                    <div className="mt-2 text-sm text-amber-600">
                      Note: Samsung phones have limited Bluetooth Web API support
                    </div>
                  )}
                  <div className="mt-4 border-t pt-3">
                    <button
                      onClick={() => handleUnpairDevice(device.id)}
                      className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Unpair Device
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start">
            <HelpCircle className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If you're having trouble with your devices, try these troubleshooting steps:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Make sure Bluetooth is enabled on your device</li>
                <li>Ensure your device is in pairing mode</li>
                <li>Check that your device is charged</li>
                <li>Try restarting your device</li>
                <li>Make sure you're using a supported browser (Chrome or Edge)</li>
                <li>To unpair a device, click the "Unpair Device" button on the device card</li>
                <li>After unpairing, you may need to restart your device before pairing again</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceConnection; 