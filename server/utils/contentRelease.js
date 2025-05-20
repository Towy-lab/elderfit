const User = require('../models/User');

// Content release schedule configuration
const CONTENT_RELEASE_SCHEDULE = {
  basic: [
    // Basic tier gets 5 core exercises immediately, no further releases
    { contentId: 'basic-exercise-1', daysAfterSignup: 0, type: 'exercise', name: 'Core Exercise 1' },
    { contentId: 'basic-exercise-2', daysAfterSignup: 0, type: 'exercise', name: 'Core Exercise 2' },
    { contentId: 'basic-exercise-3', daysAfterSignup: 0, type: 'exercise', name: 'Core Exercise 3' },
    { contentId: 'basic-exercise-4', daysAfterSignup: 0, type: 'exercise', name: 'Core Exercise 4' },
    { contentId: 'basic-exercise-5', daysAfterSignup: 0, type: 'exercise', name: 'Core Exercise 5' }
  ],
  premium: [
    // Premium tier gets immediate access to all basic exercises plus 10 additional exercises
    { contentId: 'premium-exercise-1', daysAfterSignup: 0, type: 'exercise', name: 'Premium Exercise 1' },
    { contentId: 'premium-exercise-2', daysAfterSignup: 0, type: 'exercise', name: 'Premium Exercise 2' },
    { contentId: 'premium-exercise-3', daysAfterSignup: 0, type: 'exercise', name: 'Premium Exercise 3' },
    { contentId: 'premium-exercise-4', daysAfterSignup: 0, type: 'exercise', name: 'Premium Exercise 4' },
    { contentId: 'premium-exercise-5', daysAfterSignup: 0, type: 'exercise', name: 'Premium Exercise 5' },
    { contentId: 'premium-exercise-6', daysAfterSignup: 0, type: 'exercise', name: 'Premium Exercise 6' },
    { contentId: 'premium-exercise-7', daysAfterSignup: 0, type: 'exercise', name: 'Premium Exercise 7' },
    { contentId: 'premium-exercise-8', daysAfterSignup: 0, type: 'exercise', name: 'Premium Exercise 8' },
    { contentId: 'premium-exercise-9', daysAfterSignup: 0, type: 'exercise', name: 'Premium Exercise 9' },
    { contentId: 'premium-exercise-10', daysAfterSignup: 0, type: 'exercise', name: 'Premium Exercise 10' },
    // Monthly releases of new exercises
    { contentId: 'premium-monthly-1', daysAfterSignup: 30, type: 'exercise', name: 'Monthly Exercise 1' },
    { contentId: 'premium-monthly-2', daysAfterSignup: 60, type: 'exercise', name: 'Monthly Exercise 2' },
    { contentId: 'premium-monthly-3', daysAfterSignup: 90, type: 'exercise', name: 'Monthly Exercise 3' },
    { contentId: 'premium-monthly-4', daysAfterSignup: 120, type: 'exercise', name: 'Monthly Exercise 4' },
    { contentId: 'premium-monthly-5', daysAfterSignup: 150, type: 'exercise', name: 'Monthly Exercise 5' },
    { contentId: 'premium-monthly-6', daysAfterSignup: 180, type: 'exercise', name: 'Monthly Exercise 6' }
  ],
  elite: [
    // Elite tier gets immediate access to all premium exercises plus 3 themed modules
    { contentId: 'elite-module-1', daysAfterSignup: 0, type: 'module', name: 'Strength & Balance Module' },
    { contentId: 'elite-module-2', daysAfterSignup: 0, type: 'module', name: 'Flexibility & Mobility Module' },
    { contentId: 'elite-module-3', daysAfterSignup: 0, type: 'module', name: 'Cardio & Endurance Module' },
    // Monthly module releases
    { contentId: 'elite-module-4', daysAfterSignup: 30, type: 'module', name: 'Joint Health Module' },
    { contentId: 'elite-module-5', daysAfterSignup: 60, type: 'module', name: 'Posture & Alignment Module' },
    { contentId: 'elite-module-6', daysAfterSignup: 90, type: 'module', name: 'Functional Movement Module' },
    { contentId: 'elite-module-7', daysAfterSignup: 120, type: 'module', name: 'Recovery & Relaxation Module' },
    { contentId: 'elite-module-8', daysAfterSignup: 150, type: 'module', name: 'Balance & Coordination Module' },
    { contentId: 'elite-module-9', daysAfterSignup: 180, type: 'module', name: 'Strength & Power Module' }
  ]
};

// Calculate release date based on signup date and days after signup
const calculateReleaseDate = (signupDate, daysAfterSignup) => {
  const releaseDate = new Date(signupDate);
  releaseDate.setDate(releaseDate.getDate() + daysAfterSignup);
  return releaseDate;
};

// Check if content is available for a user
const isContentAvailable = async (userId, contentId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return false;

    // Check if content is already marked as released
    const contentRelease = user.subscription.contentReleases.get(contentId);
    if (contentRelease && contentRelease.released) return true;

    // Get user's subscription tier
    const tier = user.subscription.tier;
    const signupDate = user.createdAt;

    // Find content in release schedule
    const contentSchedule = CONTENT_RELEASE_SCHEDULE[tier]?.find(
      item => item.contentId === contentId
    );

    if (!contentSchedule) return false;

    // Calculate release date
    const releaseDate = calculateReleaseDate(signupDate, contentSchedule.daysAfterSignup);
    const now = new Date();

    // If content should be released
    if (now >= releaseDate) {
      // Mark content as released
      user.subscription.contentReleases.set(contentId, {
        released: true,
        releaseDate,
        contentId,
        type: contentSchedule.type,
        name: contentSchedule.name
      });
      await user.save();
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking content availability:', error);
    return false;
  }
};

// Get all available content for a user
const getAvailableContent = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    const tier = user.subscription.tier;
    const signupDate = user.createdAt;
    const now = new Date();
    const availableContent = [];

    // Include content from lower tiers
    const tiersToInclude = ['basic'];
    if (tier === 'premium' || tier === 'elite') tiersToInclude.push('premium');
    if (tier === 'elite') tiersToInclude.push('elite');

    // Check each content in the schedule for all applicable tiers
    for (const currentTier of tiersToInclude) {
      for (const content of CONTENT_RELEASE_SCHEDULE[currentTier] || []) {
        const releaseDate = calculateReleaseDate(signupDate, content.daysAfterSignup);
        
        if (now >= releaseDate) {
          availableContent.push({
            contentId: content.contentId,
            releaseDate,
            daysAfterSignup: content.daysAfterSignup,
            type: content.type,
            name: content.name,
            tier: currentTier
          });
        }
      }
    }

    return availableContent;
  } catch (error) {
    console.error('Error getting available content:', error);
    return [];
  }
};

module.exports = {
  isContentAvailable,
  getAvailableContent,
  CONTENT_RELEASE_SCHEDULE
}; 