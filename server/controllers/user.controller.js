import Expense from "../models/expense.model";
import User from "../models/user.model";

export const Dashboard = async (req, res) => {
  try{
    const user = req?.user;
    if(!user) {
      return res.status(403).json({
        success: false,
        message: 'User is undefined'
      });
    }

    const userData = await User.findById(user._id)
    .select('-updatedAt -createdAt -__v -email -password -isVerified -isActive -login_attempt -last_login_attempt -role -verificationOtp');

    const expenseData = await Expense.findById(user._id)
    .select()

    return res.status(200).json({
      success: true,
      data: {
        username: userData.fullname,
        totalBudget: userData.totalBudget,
        totalSpent: userData.totalSpent,
        remaining: userData.remaining,
      }
    })
  }
  catch(err) {
    console.log(`Error in Dashboard controller - ${err.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}