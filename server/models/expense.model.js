import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  expenseTitle: {
    type: String,
    minLength: 4,
    maxLength: 20
  },
  expenseCategory: {
    type: String,
    enum: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other']
  },
  expensePaymentType: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Other']
  },
  expensePrice: {
    type: Number,
    minLength: 1,
    maxLength: 7
  },
  isExpenseActive: {
    type: Boolean,
    default: true
  }
}, {timestamps: true});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;