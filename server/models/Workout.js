import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: String,
  sets: Number,
  reps: Number,
  weight: Number,
  duration: Number, // in minutes
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  exercises: [exerciseSchema],
  notes: String,
  duration: Number, // total workout duration in minutes
  satisfaction: Number, // e.g., 1-5 scale
}, { timestamps: true });

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout; 