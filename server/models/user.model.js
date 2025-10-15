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
  password: {
    type: String,
    minLength: 6,
    maxLength: 18
  }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;