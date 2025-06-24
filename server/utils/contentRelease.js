import User from '../models/User.js';

// Content release schedule configuration
const CONTENT_RELEASE_SCHEDULE = {
  basic: [
    // Basic tier gets 5 core exercises immediately, no further releases
    { contentId: 'basic-exercise-1', daysAfterSignup: 0, type: 'exercise', name: 'Core Exercise 1' },
    { contentId: 'basic-exercise-2', daysAfterSignup: 0, type: 'exercise', name: 'Core Exercise 2' },
    { contentId: 'basic-exercise-3', daysAfterSignup: 0, type: 'exercise', name: 'Core Exercise 3' },
    { contentId: 'basic-exercise-4', daysAfterSignup: 0, type: 'exercise', name: 'Core Exercise 4' },
    { contentId: 'basic-exercise-5', daysAfterSignup: 0, type: 'exercise', name: 'Core Exercise 5' },
    // Basic video content - immediate and monthly
    { contentId: 'basic-video-1', daysAfterSignup: 0, type: 'video', name: 'Getting Started Guide' },
    { contentId: 'basic-video-2', daysAfterSignup: 30, type: 'video', name: 'Basic Stretching Routine' },
    { contentId: 'basic-video-3', daysAfterSignup: 60, type: 'video', name: 'Balance Fundamentals' },
    { contentId: 'basic-video-4', daysAfterSignup: 90, type: 'video', name: 'Core Strength Basics' },
    { contentId: 'basic-video-5', daysAfterSignup: 120, type: 'video', name: 'Flexibility Training' },
    { contentId: 'basic-video-6', daysAfterSignup: 150, type: 'video', name: 'Mobility Exercises' }
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
    // Premium video content - immediate and monthly
    { contentId: 'premium-video-1', daysAfterSignup: 0, type: 'video', name: 'Advanced Stretching Techniques' },
    { contentId: 'premium-video-2', daysAfterSignup: 30, type: 'video', name: 'Strength Training Basics' },
    { contentId: 'premium-video-3', daysAfterSignup: 60, type: 'video', name: 'Balance & Coordination' },
    { contentId: 'premium-video-4', daysAfterSignup: 90, type: 'video', name: 'Joint Health & Mobility' },
    { contentId: 'premium-video-5', daysAfterSignup: 120, type: 'video', name: 'Posture Improvement' },
    { contentId: 'premium-video-6', daysAfterSignup: 150, type: 'video', name: 'Advanced Core Training' },
    { contentId: 'premium-video-7', daysAfterSignup: 180, type: 'video', name: 'Functional Movement Patterns' },
    { contentId: 'premium-video-8', daysAfterSignup: 210, type: 'video', name: 'Recovery & Regeneration' },
    { contentId: 'premium-video-9', daysAfterSignup: 240, type: 'video', name: 'Advanced Balance Training' },
    { contentId: 'premium-video-10', daysAfterSignup: 270, type: 'video', name: 'Strength & Power Development' },
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
    // Elite video content - immediate and monthly
    { contentId: 'elite-video-1', daysAfterSignup: 0, type: 'video', name: 'Professional Training Introduction' },
    { contentId: 'elite-video-2', daysAfterSignup: 30, type: 'video', name: 'Advanced Movement Patterns' },
    { contentId: 'elite-video-3', daysAfterSignup: 60, type: 'video', name: 'Custom Workout Design' },
    { contentId: 'elite-video-4', daysAfterSignup: 90, type: 'video', name: 'Performance Optimization' },
    { contentId: 'elite-video-5', daysAfterSignup: 120, type: 'video', name: 'Recovery Techniques' },
    { contentId: 'elite-video-6', daysAfterSignup: 150, type: 'video', name: 'Advanced Balance Training' },
    { contentId: 'elite-video-7', daysAfterSignup: 180, type: 'video', name: 'Elite Strength Training' },
    { contentId: 'elite-video-8', daysAfterSignup: 210, type: 'video', name: 'Advanced Mobility Work' },
    { contentId: 'elite-video-9', daysAfterSignup: 240, type: 'video', name: 'Performance Enhancement' },
    { contentId: 'elite-video-10', daysAfterSignup: 270, type: 'video', name: 'Elite Recovery Methods' },
    { contentId: 'elite-video-11', daysAfterSignup: 300, type: 'video', name: 'Advanced Movement Mastery' },
    { contentId: 'elite-video-12', daysAfterSignup: 330, type: 'video', name: 'Elite Training Techniques' },
    // Monthly module releases
    { contentId: 'elite-module-4', daysAfterSignup: 30, type: 'module', name: 'Joint Health Module' },
    { contentId: 'elite-module-5', daysAfterSignup: 60, type: 'module', name: 'Posture & Alignment Module' },
    { contentId: 'elite-module-6', daysAfterSignup: 90, type: 'module', name: 'Functional Movement Module' },
    { contentId: 'elite-module-7', daysAfterSignup: 120, type: 'module', name: 'Recovery & Relaxation Module' },
    { contentId: 'elite-module-8', daysAfterSignup: 150, type: 'module', name: 'Balance & Coordination Module' },
    { contentId: 'elite-module-9', daysAfterSignup: 180, type: 'module', name: 'Strength & Power Module' }
  ]
};

// Calculate release date based on subscription renewal date and days after renewal
const calculateReleaseDate = (subscriptionDate, daysAfterRenewal) => {
  const releaseDate = new Date(subscriptionDate);
  releaseDate.setDate(releaseDate.getDate() + daysAfterRenewal);
  return releaseDate;
};

// Check if content is available for a user
export const isContentAvailable = async (userId, contentId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return false;

    // Check if content is already marked as released
    const contentRelease = user.subscription.contentReleases.get(contentId);
    if (contentRelease && contentRelease.released) return true;

    // Get user's subscription tier and renewal date
    const tier = user.subscription.tier;
    const subscriptionDate = user.subscription.startDate;
    const currentPeriodEnd = user.subscription.currentPeriodEnd;
    const now = new Date();

    // Find content in release schedule
    const contentSchedule = CONTENT_RELEASE_SCHEDULE[tier]?.find(
      item => item.contentId === contentId
    );

    if (!contentSchedule) return false;

    // For immediate content (daysAfterRenewal = 0), check if subscription is active
    if (contentSchedule.daysAfterSignup === 0) {
      if (now >= subscriptionDate && now <= currentPeriodEnd) {
        // Mark content as released
        user.subscription.contentReleases.set(contentId, {
          released: true,
          releaseDate: subscriptionDate,
          contentId,
          type: contentSchedule.type,
          name: contentSchedule.name
        });
        await user.save();
        return true;
      }
      return false;
    }

    // For monthly content, calculate based on subscription renewal cycles
    const monthsSinceStart = Math.floor((now - subscriptionDate) / (30 * 24 * 60 * 60 * 1000));
    const monthsRequired = Math.floor(contentSchedule.daysAfterSignup / 30);

    if (monthsSinceStart >= monthsRequired && now <= currentPeriodEnd) {
      // Mark content as released
      const releaseDate = calculateReleaseDate(subscriptionDate, contentSchedule.daysAfterSignup);
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
export const getAvailableContent = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    const tier = user.subscription.tier;
    const subscriptionDate = user.subscription.startDate;
    const currentPeriodEnd = user.subscription.currentPeriodEnd;
    const now = new Date();
    const availableContent = [];

    // Include content from lower tiers
    const tiersToInclude = ['basic'];
    if (tier === 'premium' || tier === 'elite') tiersToInclude.push('premium');
    if (tier === 'elite') tiersToInclude.push('elite');

    // Check each content in the schedule for all applicable tiers
    for (const currentTier of tiersToInclude) {
      for (const content of CONTENT_RELEASE_SCHEDULE[currentTier] || []) {
        // For immediate content
        if (content.daysAfterSignup === 0) {
          if (now >= subscriptionDate && now <= currentPeriodEnd) {
            availableContent.push({
              contentId: content.contentId,
              releaseDate: subscriptionDate,
              daysAfterSignup: 0,
              type: content.type,
              name: content.name,
              tier: currentTier
            });
          }
          continue;
        }

        // For monthly content
        const monthsSinceStart = Math.floor((now - subscriptionDate) / (30 * 24 * 60 * 60 * 1000));
        const monthsRequired = Math.floor(content.daysAfterSignup / 30);

        if (monthsSinceStart >= monthsRequired && now <= currentPeriodEnd) {
          const releaseDate = calculateReleaseDate(subscriptionDate, content.daysAfterSignup);
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

// Get content release schedule for a specific tier
export const getContentReleaseSchedule = (tier) => {
  return CONTENT_RELEASE_SCHEDULE[tier] || [];
};

// Get next content release for a user
export const getNextContentRelease = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const tier = user.subscription.tier;
    const subscriptionDate = user.subscription.startDate;
    const now = new Date();

    const schedule = CONTENT_RELEASE_SCHEDULE[tier] || [];
    const unreleasedContent = schedule.filter(content => {
      const monthsSinceStart = Math.floor((now - subscriptionDate) / (30 * 24 * 60 * 60 * 1000));
      const monthsRequired = Math.floor(content.daysAfterSignup / 30);
      return monthsSinceStart < monthsRequired;
    });

    if (unreleasedContent.length === 0) return null;

    // Return the next content to be released
    const nextContent = unreleasedContent.sort((a, b) => a.daysAfterSignup - b.daysAfterSignup)[0];
    const releaseDate = calculateReleaseDate(subscriptionDate, nextContent.daysAfterSignup);

    return {
      contentId: nextContent.contentId,
      name: nextContent.name,
      type: nextContent.type,
      releaseDate,
      daysUntilRelease: Math.ceil((releaseDate - now) / (24 * 60 * 60 * 1000))
    };
  } catch (error) {
    console.error('Error getting next content release:', error);
    return null;
  }
}; 