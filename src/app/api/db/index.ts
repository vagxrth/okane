import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your environment variables');
}

if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Account schema for storing user balances
const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Balance stored as integer representing paise (1/100th of a rupee)
  // For example: 3333 represents ₹33.33
  balance: {
    type: Number,
    required: true,
    default: 0,
    // Add validation to ensure balance is always a non-negative integer
    validate: {
      validator: function(value: number) {
        return Number.isInteger(value) && value >= 0;
      },
      message: 'Balance must be a non-negative integer'
    }
  }
}, {
  timestamps: true
});

// Add index on userId for faster queries
accountSchema.index({ userId: 1 });

export const User = mongoose.model('User', userSchema);
export const Account = mongoose.model('Account', accountSchema);

export const connection = mongoose.connection;
