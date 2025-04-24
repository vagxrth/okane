import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not defined.');
  process.exit(1);
}
const MONGODB_URI = process.env.MONGODB_URI;

// Mongoose schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  balance: { type: Number, default: 0 }, // Store balance in paise/cents
  currency: { type: String, default: 'INR' }
}, { timestamps: true });

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true }, // Store amount in paise/cents
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverName: { type: String, required: true },
}, { timestamps: true });

// Indexes
userSchema.index({ email: 1 });
accountSchema.index({ userId: 1 });
transactionSchema.index({ senderId: 1, receiverId: 1 });
transactionSchema.index({ createdAt: -1 });

// Check if models are already defined
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Account = mongoose.models.Account || mongoose.model('Account', accountSchema);
export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

// Database connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to MongoDB');
      return;
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Call connectDB but don't wait for it
connectDB();

export const connection = mongoose.connection;
