import express from 'express';
import authMiddleware from '../middleware/auth.js';
import User from '../models/User.js';
import Device from '../models/Device.js';

const router = express.Router();

// Get all devices for the user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user's devices or empty array if none
    res.json(user.devices || []);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// Scan for available devices
router.post('/scan', authMiddleware, async (req, res) => {
  try {
    console.log('Received device scan request');
    
    // The actual device scanning is now handled by the Web Bluetooth API on the frontend
    // This endpoint is kept for future server-side device discovery if needed
    res.json({ 
      success: true,
      message: 'Device scanning initiated via Web Bluetooth API',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in device scan endpoint:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to initiate device scan',
      details: error.message
    });
  }
});

// Connect to a device
router.post('/:deviceId/connect', authMiddleware, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize devices array if it doesn't exist
    if (!user.devices) {
      user.devices = [];
    }

    // Check if device is already connected
    const existingDevice = user.devices.find(d => d.id === deviceId);
    if (existingDevice) {
      return res.status(400).json({ error: 'Device already connected' });
    }

    // Add device to user's devices with real device data
    const newDevice = {
      id: deviceId,
      name: req.body.name || 'Unknown Device',
      type: req.body.type || 'bluetooth',
      status: 'connected',
      batteryLevel: req.body.batteryLevel || null,
      lastSync: new Date().toISOString(),
      connectedAt: new Date()
    };

    user.devices.push(newDevice);
    await user.save();

    res.json(newDevice);
  } catch (error) {
    console.error('Error connecting device:', error);
    res.status(500).json({ error: 'Failed to connect device' });
  }
});

// Disconnect a device
router.post('/:deviceId/disconnect', authMiddleware, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find and remove the device
    const deviceIndex = user.devices.findIndex(d => d.id === deviceId);
    if (deviceIndex === -1) {
      return res.status(404).json({ error: 'Device not found' });
    }

    user.devices.splice(deviceIndex, 1);
    await user.save();

    res.json({ message: 'Device disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting device:', error);
    res.status(500).json({ error: 'Failed to disconnect device' });
  }
});

export default router; 