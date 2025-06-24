// server/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    goals: [String],
    healthConditions: [String],
    equipment: [String],
    height: Number,
    weight: Number,
    age: Number
  },
  dateOfBirth: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Stripe related fields
  stripeCustomerId: {
    type: String
  },
  subscription: {
    id: String,
    status: {
      type: String,
      enum: ['active', 'past_due', 'unpaid', 'canceled', 'incomplete', 'incomplete_expired', 'trialing'],
      default: 'active' // Default to active for new users
    },
    tier: {
      type: String,
      enum: ['basic', 'premium', 'elite'],
      default: 'basic'
    },
    priceId: String,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    },
    downgradeToBasic: {
      type: Boolean,
      default: false
    },
    // Fields for handling scheduled downgrades
    downgradeToTier: String,
    downgradeToInterval: String,
    // Payment information
    interval: {
      type: String,
      enum: ['month', 'year'],
      default: 'month'
    },
    // Track payment history
    lastPaymentDate: Date,
    nextPaymentDate: Date,
    // Content release tracking
    contentReleases: {
      type: Map,
      of: {
        released: {
          type: Boolean,
          default: false
        },
        releaseDate: Date,
        contentId: String,
        type: {
          type: String,
          enum: ['exercise', 'module', 'video'],
          required: true
        },
        name: String,
        videoUrl: String,
        duration: Number,
        thumbnailUrl: String,
        description: String,
        tags: [String],
        lastWatched: Date,
        watchCount: {
          type: Number,
          default: 0
        }
      },
      default: new Map()
    },
    isFree: {
      type: Boolean,
      default: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    currentPeriodEnd: {
      type: Date,
      default: new Date(2099, 11, 31)
    }
  },
  // User's emergency contacts
  emergencyContacts: [{
    name: String,
    relationship: String,
    phoneNumber: String,
    email: String
  }],
  // Health and safety information
  healthInfo: {
    mobilityLevel: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    medicalConditions: [String],
    medications: [String],
    healthGoals: [String]
  },
  // Progress tracking
  workouts: [{
    id: String,
    completedAt: Date,
    exercisesCompleted: [{
      id: String,
      name: String,
      sets: Number,
      reps: Number,
      duration: Number
    }],
    duration: Number
  }],
  streak: {
    type: Number
  },
  lastWorkout: Date,
  totalWorkouts: {
    type: Number
  },
  workoutHistory: [{
    id: String,
    completedAt: Date,
    exercisesCompleted: [{
      id: String,
      name: String,
      sets: Number,
      reps: Number,
      duration: Number
    }],
    duration: Number
  }],
  achievements: [{
    id: String,
    name: String,
    description: String,
    earnedAt: Date,
    category: String
  }],
  // User preferences
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    workoutReminders: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  // Activity tracking
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  devices: [{
    id: String,
    name: String,
    type: String,
    status: String,
    connectedAt: Date
  }]
});

// Method to validate password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Check if user has access to a specific tier's features
UserSchema.methods.hasAccessToTier = function(tier) {
  const tierLevels = {
    'basic': 0,
    'premium': 1,
    'elite': 2
  };
  
  // If no valid subscription, only allow basic access
  if (!this.subscription || this.subscription.status !== 'active') {
    return tier === 'basic';
  }
  
  const userTierLevel = tierLevels[this.subscription.tier] || 0;
  const requestedTierLevel = tierLevels[tier] || 0;
  
  // User can access requested tier if their subscription tier is equal or higher
  return userTierLevel >= requestedTierLevel;
};

// Check if user's subscription is active
UserSchema.methods.hasActiveSubscription = function() {
  return this.subscription && this.subscription.status === 'active';
};

// Method to get the subscription status with scheduled changes
UserSchema.methods.getSubscriptionStatus = function() {
  const status = {
    currentTier: this.subscription?.tier || 'basic',
    isActive: this.subscription?.status === 'active',
    willDowngrade: false,
    scheduledTier: null,
    currentPeriodEnd: this.subscription?.currentPeriodEnd
  };
  
  if (this.subscription?.cancelAtPeriodEnd) {
    if (this.subscription.downgradeToTier) {
      // Scheduled downgrade to another paid tier
      status.willDowngrade = true;
      status.scheduledTier = this.subscription.downgradeToTier;
    } else {
      // Scheduled downgrade to basic
      status.willDowngrade = true;
      status.scheduledTier = 'basic';
    }
  }
  
  return status;
};

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update lastLogin when retrieved for authentication
UserSchema.pre('findOne', function(next) {
  // Only update lastLogin for authentication queries
  if (this._conditions.email && this._conditions.password) {
    this._conditions.lastLogin = new Date();
    this._conditions.loginCount = { $inc: 1 };
  }
  next();
});

const User = mongoose.model('User', UserSchema);

export default User;