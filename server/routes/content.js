const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { isContentAvailable, getAvailableContent } = require('../utils/contentRelease');

// Check if specific content is available
router.get('/check/:contentId', authMiddleware, async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user.id;

    const isAvailable = await isContentAvailable(userId, contentId);
    
    res.json({
      contentId,
      isAvailable,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error checking content availability:', error);
    res.status(500).json({ error: 'Failed to check content availability' });
  }
});

// Get all available content for the user
router.get('/available', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const availableContent = await getAvailableContent(userId);
    
    res.json({
      content: availableContent,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting available content:', error);
    res.status(500).json({ error: 'Failed to get available content' });
  }
});

module.exports = router; 