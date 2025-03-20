// server/models/User.js - Updated to support Stripe subscriptions

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
      default: 'active' // Changed from 'incomplete' to 'active' for new users
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
  }
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

// Encrypt password before saving - FIXED with return statement
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) {
    return next(); // FIXED: added return here
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', UserSchema);