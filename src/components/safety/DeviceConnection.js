import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.js';
import { Button } from '../../components/ui/button.js';
import { Badge } from '../../components/ui/badge.js';
import { useSafety } from '../../contexts/SafetyContext.js';
import { useSubscription } from '../../contexts/SubscriptionContext.js';
import { Shield, Bluetooth, Wifi, Smartphone, Lock } from 'lucide-react';

export const DeviceConnection = () => {
  const { connectDevice, disconnectDevice, connectedDevice } = useSafety();
  const { hasAccess } = useSubscription();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectDevice();
    } catch (error) {
      console.error('Failed to connect device:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectDevice();
  };

  // Preview content for basic tier
  const BasicDevicePreview = () => (
    <div>
      <p className="text-gray-600 mb-4">
        Connect your fitness devices to get real-time safety monitoring and form feedback.
      </p>
      <div className="grid grid-cols-2 gap-4 opacity-50">
        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg">
          Heart Rate Monitor
        </div>
        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg">
          Smart Watch
        </div>
      </div>
    </div>
  );

  // Preview content for premium tier
  const PremiumDevicePreview = () => (
    <div>
      <p className="text-gray-600 mb-4">
        Advanced device integration with real-time monitoring and alerts.
      </p>
      <div className="space-y-3 opacity-50">
        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg">
          Multiple Device Support
        </div>
        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg">
          Custom Alerts
        </div>
        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg">
          Data Sync
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Device Connection</h2>

      {/* Basic Tier Content */}
      {!hasAccess('premium') && (
        <div>
          <BasicDevicePreview />
          <div className="mt-6 bg-purple-50 border border-purple-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-purple-700">Premium Feature</p>
                <p className="text-sm text-purple-600 mb-2">
                  Upgrade to Premium to connect your fitness devices and get real-time safety monitoring.
                </p>
                <a 
                  href="/subscription/plans" 
                  className="text-sm font-medium text-purple-600 hover:text-purple-800"
                >
                  Upgrade to Premium →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Tier Content */}
      {hasAccess('premium') && !hasAccess('elite') && (
        <div>
          <PremiumDevicePreview />
          <div className="mt-6 bg-purple-50 border border-purple-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-purple-700">Elite Feature</p>
                <p className="text-sm text-purple-600 mb-2">
                  Upgrade to Elite for advanced device integration, custom alerts, and data synchronization.
                </p>
                <a 
                  href="/subscription/plans" 
                  className="text-sm font-medium text-purple-600 hover:text-purple-800"
                >
                  Upgrade to Elite →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Elite Tier Content */}
      {hasAccess('elite') && (
        <div>
          {connectedDevice ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                <p className="font-medium">Connected Device</p>
                <p className="text-sm">{connectedDevice.name}</p>
              </div>
              <button
                onClick={handleDisconnect}
                className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Disconnect Device
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 text-gray-700 rounded-lg">
                <p className="font-medium">No Device Connected</p>
                <p className="text-sm">Connect a device to enable real-time monitoring</p>
              </div>
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : 'Connect Device'}
              </button>
            </div>
          )}

          {/* Connected Devices List */}
          <div className="mt-6">
            <h3 className="font-medium mb-3">Available Devices</h3>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
                Heart Rate Monitor
              </div>
              <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
                Smart Watch
              </div>
              <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
                Fitness Tracker
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 