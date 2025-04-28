// src/config/tierConfig.js

/**
 * Subscription Tier Configuration
 * 
 * This file defines what features are available for each subscription tier.
 * It's used throughout the application to control access to functionality.
 */

const tierConfig = {
    /**
     * Workout Content
     */
    workouts: {
      basic: {
        count: 5,
        description: "Basic beginner-friendly workout routines",
        features: [
          "Gentle stretching exercises",
          "Seated workouts",
          "Beginner balance exercises",
          "Foundational strength training",
          "Basic mobility routines"
        ],
        restrictions: [
          "Limited workout variety",
          "Basic video quality",
          "No personalization",
          "No advanced tracking"
        ]
      },
      premium: {
        count: 30,
        description: "Expanded library of specialized workout routines",
        features: [
          "All basic workouts plus...",
          "Low-impact cardio sessions",
          "Joint-friendly strength training",
          "Posture improvement routines",
          "Recovery exercises",
          "Condition-specific workouts (arthritis, osteoporosis, etc.)",
          "Different intensity levels",
          "High-definition videos"
        ]
      },
      elite: {
        count: 50,
        description: "Comprehensive library with exclusive content",
        features: [
          "All premium workouts plus...",
          "Professional trainer guided routines",
          "Custom routines based on your specific needs",
          "Real-time form feedback",
          "Adaptive progressions based on performance",
          "Multi-week training programs"
        ]
      }
    },
  
    /**
     * Progress Tracking
     */
    progressTracking: {
      basic: {
        description: "Simple progress tracking",
        features: [
          "Workout completion logging",
          "Basic statistics (total workouts, current streak)",
          "Simple weekly goals",
          "Basic achievement badges"
        ]
      },
      premium: {
        description: "Advanced tracking & analytics",
        features: [
          "All basic tracking plus...",
          "Detailed workout history",
          "Comprehensive statistics and trends",
          "Progress visualizations",
          "Custom goals creation",
          "Advanced achievement system",
          "Exportable progress reports",
          "Monthly fitness assessments"
        ]
      },
      elite: {
        description: "Professional performance tracking",
        features: [
          "All premium tracking plus...",
          "Personalized insights from fitness professionals",
          "Health metric integration (with optional devices)",
          "Comprehensive progress reports with professional annotations",
          "Advanced goal customization with professional guidance",
          "Recovery and exertion tracking"
        ]
      }
    },
  
    /**
     * Features & Tools
     */
    features: {
      basic: {
        description: "Essential features",
        list: [
          "Basic workout library (5 routines)",
          "Simple progress tracking",
          "Safety guidelines",
          "Weekly goals (limited customization)",
          "Exercise demonstration videos (basic)",
          "Simple calendar view"
        ]
      },
      premium: {
        description: "Enhanced features",
        list: [
          "Expanded workout library (30+ routines)",
          "Advanced progress tracking",
          "Workout calendar with scheduling",
          "HD video demonstrations",
          "Personalized recommendations",
          "Rest day planning",
          "Pain tracking & adjustments",
          "Community access",
          "Email support"
        ]
      },
      elite: {
        description: "Premium features with advanced technology",
        list: [
          "Complete workout library (50+ routines)",
          "AI-powered personalized training",
          "Health device integration and analytics",
          "Specialized condition-specific programs",
          "Multi-user family plan (up to 5 profiles)",
          "Priority support with 24-hour response",
          "Advanced safety monitoring",
          "VIP community access",
          "Exclusive monthly workshops",
          "Personalized exercise modifications"
        ]
      }
    },
  
    /**
     * Support Options
     */
    support: {
      basic: {
        description: "Standard support",
        channels: [
          "Help center & documentation",
          "Email support (48-hour response)",
          "Community forum access (read-only)"
        ]
      },
      premium: {
        description: "Enhanced support",
        channels: [
          "All basic support plus...",
          "Email support (24-hour response)",
          "Full community forum access",
          "Monthly group Q&A sessions"
        ]
      },
      elite: {
        description: "Premium support with priority service",
        channels: [
          "All premium support plus...",
          "Priority email support (12-hour response)",
          "AI-assisted fitness recommendations",
          "Advanced troubleshooting and technical support",
          "Custom exercise prescriptions via our AI system",
          "Monthly personalized progress reviews"
        ]
      }
    },
  
    /**
     * Community Features
     */
    community: {
      basic: {
        description: "Limited community access",
        features: [
          "View-only access to community boards",
          "Read success stories",
          "View public workout logs"
        ]
      },
      premium: {
        description: "Full community participation",
        features: [
          "All basic features plus...",
          "Post in community forums",
          "Join group challenges",
          "Create & share custom workout logs",
          "Monthly community events",
          "Create workout groups",
          "Direct message community members"
        ]
      },
      elite: {
        description: "VIP community experience",
        features: [
          "All premium features plus...",
          "Expert-moderated discussion groups",
          "Exclusive VIP forums",
          "Early access to new features",
          "Private groups with trainers",
          "Community leadership opportunities",
          "Feature input & beta testing access"
        ]
      }
    },
  
    /**
     * Educational Content
     */
    education: {
      basic: {
        description: "Basic educational resources",
        features: [
          "Safety guidelines",
          "Basic exercise tutorials",
          "Introductory articles on fitness for seniors"
        ]
      },
      premium: {
        description: "Comprehensive educational library",
        features: [
          "All basic resources plus...",
          "In-depth articles on senior fitness topics",
          "Expert video tutorials",
          "Health & nutrition guidance",
          "Monthly webinars",
          "Downloadable resources"
        ]
      },
      elite: {
        description: "Professional educational content",
        features: [
          "All premium resources plus...",
          "Exclusive workshops with healthcare professionals",
          "Personalized educational recommendations",
          "One-on-one educational sessions",
          "Custom learning paths",
          "Professional topic deep-dives"
        ]
      }
    }
  };
  
  /**
   * Get features available for a specific tier and category
   * 
   * @param {string} category - The feature category
   * @param {string} tier - The subscription tier
   * @return {Object} The features for the specified tier and category
   */
  export const getTierFeatures = (category, tier) => {
    if (!tierConfig[category]) {
      console.warn(`Category '${category}' not found in tier configuration`);
      return null;
    }
    
    if (!tierConfig[category][tier]) {
      console.warn(`Tier '${tier}' not found in category '${category}'`);
      return null;
    }
    
    return tierConfig[category][tier];
  };
  
  /**
   * Check if a specific tier has access to a feature
   * 
   * @param {string} requiredTier - The minimum tier required ('basic', 'premium', 'elite')
   * @param {string} userTier - The user's current tier
   * @return {boolean} Whether the user has access
   */
  export const checkTierAccess = (requiredTier, userTier) => {
    const tierLevels = {
      'basic': 0,
      'premium': 1,
      'elite': 2
    };
    
    const requiredLevel = tierLevels[requiredTier] || 0;
    const userLevel = tierLevels[userTier] || 0;
    
    return userLevel >= requiredLevel;
  };
  
  export default tierConfig;