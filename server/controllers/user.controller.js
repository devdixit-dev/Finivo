import Expense from "../models/expense.model.js";
import User from "../models/user.model.js";

export const Dashboard = async (req, res) => {
  try{
    const userData = await User.findById(req.user.userId)
    .select('-updatedAt -createdAt -__v -email -password -isVerified -isActive -login_attempt -last_login_attempt -role -verificationOtp')
    .lean()

    if(!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const expenseData = await Expense.find({ userid: req.user.userId })
    .select('-isExpenseActive -createdAt -updatedAt -__v')
    .lean()

    return res.status(200).json({
      success: true,
      userData,
      expenseData
    });
  }
  catch(err) {
    console.log(`Error in Dashboard controller - ${err.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}