import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { signToken, verifyToken } from "../utils/jwt.util.js";

export const Register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required for registration'
      });
    }

    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({
        success: false,
        message: 'User already exist'
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullname, email, password: hashPassword
    });

    const otp = 123456;

    user.verificationOtp = otp;
    await user.save();

    const payload = {
      userId: user._id,
      role: user.role,
      otp: otp
    }

    const signedToken = signToken(payload, '5m');

    res.cookie('v_token', signedToken, {
      httpOnly: true,
      sameSite: true,
      secure: true
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      v_token: signedToken
    });
  }
  catch (err) {
    console.error(`Error in register controller - ${err}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const VerifyEmail = async (req, res) => {
  try {
    const token = req.cookies.v_token;
    const { otp } = req.body;

    if(!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    if(!otp) {
      return res.status(404).json({
        success: false,
        message: 'OTP is required for verification'
      });
    }

    const decodedUser = verifyToken(token);
    if(!decodedUser) {
      return res.status(403).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    const user = await User.findById(decodedUser.userId);
    if(!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if(user.verificationOtp !== otp) {
      return res.status(403).json({
        success: false,
        message: 'OTP is incorrect'
      });
    }

    user.verificationOtp = null;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User email is verified',
      data: user
    });
  }
  catch (err) {
    console.error(`Error in verify email controller - ${err}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const Login = async (req, res) => {}

export const Logout = async (req, res) => {}