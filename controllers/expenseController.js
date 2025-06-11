// const Expense = require('../models/Expense');

// // Add new expense
// exports.addExpense = async (req, res) => {
//   try {
//     const { amount, description, paid_by, participants, split_type, split_values } = req.body;

//     if (!amount || !description || !paid_by || !participants || participants.length === 0) {
//       return res.status(400).json({ success: false, message: 'All fields are required' });
//     }

//     const expense = new Expense({
//       amount,
//       description,
//       paid_by,
//       participants,
//       split_type,
//       split_values,
//     });

//     await expense.save();
//     res.status(201).json({ success: true, data: expense, message: 'Expense added successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get all expenses
// exports.getExpenses = async (req, res) => {
//   try {
//     const expenses = await Expense.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data: expenses });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Update an expense
// exports.updateExpense = async (req, res) => {
//   try {
//     const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).json({ success: false, message: 'Expense not found' });

//     res.status(200).json({ success: true, data: updated, message: 'Expense updated successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Delete an expense
// exports.deleteExpense = async (req, res) => {
//   try {
//     const deleted = await Expense.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ success: false, message: 'Expense not found' });

//     res.status(200).json({ success: true, message: 'Expense deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


const Expense = require('../models/Expense');
const { calculateBalances, simplifyDebts } = require('../utils/settlementUtils');

exports.showIndex = async (req, res) => {
  const expenses = await Expense.find().lean();
  res.render('index', { expenses });
};

exports.addExpense = async (req, res) => {
  const { amount, description, paid_by, participants, share_type, shares } = req.body;
  const arr = participants.split(',').map(s => s.trim());
  let shareArr = [];
  if (share_type !== 'equal' && shares) {
    shareArr = shares.split(',').map(x => {
      const [person, val] = x.split(':').map(s => s.trim());
      return { person, value: +val };
    });
  }
  await Expense.create({ amount, description, paid_by, participants: arr, share_type, shares: shareArr });
  res.redirect('/');
};

exports.showEdit = async (req, res) => {
  const exp = await Expense.findById(req.params.id).lean();
  res.render('edit', { expense: exp });
};

exports.updateExpense = async (req, res) => {
  const { amount, description, paid_by, participants, share_type, shares } = req.body;
  const arr = participants.split(',').map(s => s.trim());
  let shareArr = [];
  if (share_type !== 'equal' && shares) {
    shareArr = shares.split(',').map(x => {
      const [person, val] = x.split(':').map(s => s.trim());
      return { person, value: +val };
    });
  }
  await Expense.findByIdAndUpdate(req.params.id, { amount, description, paid_by, participants: arr, share_type, shares: shareArr });
  res.redirect('/');
};

exports.deleteExpense = async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.redirect('/');
};

exports.showSummary = async (req, res) => {
  const expenses = await Expense.find().lean();
  const balances = calculateBalances(expenses);
  const settlements = simplifyDebts(balances);

//   console.log("---- Expenses ----");
//   console.log(expenses);

//   console.log("---- Balances ----");
//   console.log(balances);

//   console.log("---- Settlements ----");
//   console.log(settlements);

  res.render('summary', { balances, settlements });
};

