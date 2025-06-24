import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['heart_rate_monitor', 'pedometer', 'smart_watch'],
  },
  name: {
    type: String,
    required: true,
  },
  lastSync: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['connected', 'disconnected', 'error'],
    default: 'disconnected',
  },
}, { timestamps: true });

const Device = mongoose.model('Device', deviceSchema);

export default Device; 