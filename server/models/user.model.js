import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    trim: true,
    minLength: 4,
    maxLength: 16
  },
  email: {
    type: String,
    smallcase: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  verificationOtp: {
    type: String,
    minLength: 6,
    maxLength: 6
  },
  password: {
    type: String,
    minLength: 6
  },
  totalBudget: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  remaining: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  expenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense'
  }],
  login_attempt: {
    type: Number,
    default: 0
  },
  last_login_attempt: {
    type: Number,
    default: 0
  }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;