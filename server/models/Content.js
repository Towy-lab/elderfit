import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['article', 'video', 'guide'],
  },
  content: {
    type: String,
    required: true,
  },
  duration: { // minutes
    type: Number,
  },
  tier: {
    type: String,
    required: true,
    enum: ['basic', 'premium', 'elite'],
    default: 'basic',
  },
  releaseDate: {
    type: Date,
    default: Date.now,
  },
  tags: [String],
}, { timestamps: true });

const Content = mongoose.model('Content', contentSchema);

export default Content; 