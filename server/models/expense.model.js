import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {timestamps: true});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;