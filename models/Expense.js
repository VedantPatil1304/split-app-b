

const mongoose = require('mongoose');
const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  paid_by: { type: String, required: true },
  participants: { type: [String], required: true },
  share_type: { type: String, enum: ['equal','percentage','exact'], default: 'equal' },
  shares: { type: [{ person: String, value: Number }], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
