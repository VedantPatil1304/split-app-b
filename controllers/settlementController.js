const Expense = require('../models/Expense');

// Get all unique people
exports.getPeople = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const peopleSet = new Set();

    expenses.forEach((exp) => {
      peopleSet.add(exp.paid_by);
      exp.participants.forEach(p => peopleSet.add(p));
    });

    res.status(200).json({ success: true, data: [...peopleSet] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get balances per person
exports.getBalances = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const balances = {};

    expenses.forEach((exp) => {
      const { amount, paid_by, participants, split_type, split_values } = exp;
      const numParticipants = participants.length;
      let shares = [];

      if (split_type === 'equal') {
        const share = parseFloat((amount / numParticipants).toFixed(2));
        shares = Array(numParticipants).fill(share);
      } else if (split_type === 'exact') {
        shares = split_values;
      } else if (split_type === 'percentage') {
        shares = split_values.map(p => parseFloat(((amount * p) / 100).toFixed(2)));
      }

      // Deduct shares
      participants.forEach((person, index) => {
        const owed = shares[index] || 0;
        balances[person] = (balances[person] || 0) - owed;
      });

      // Add to payer
      balances[paid_by] = (balances[paid_by] || 0) + amount;
    });

    res.status(200).json({ success: true, data: balances });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Settlement summary (who owes whom)
exports.getSettlement = async (req, res) => {
  try {
    const balancesRes = await exports.getBalancesInternal();
    const balances = balancesRes.data;

    const debtors = [], creditors = [];

    for (const [person, balance] of Object.entries(balances)) {
      if (balance < 0) debtors.push({ person, amount: -balance });
      if (balance > 0) creditors.push({ person, amount: balance });
    }

    const settlements = [];

    while (debtors.length && creditors.length) {
      const debtor = debtors[0];
      const creditor = creditors[0];

      const minAmount = Math.min(debtor.amount, creditor.amount);
      settlements.push({
        from: debtor.person,
        to: creditor.person,
        amount: parseFloat(minAmount.toFixed(2))
      });

      debtor.amount -= minAmount;
      creditor.amount -= minAmount;

      if (debtor.amount === 0) debtors.shift();
      if (creditor.amount === 0) creditors.shift();
    }

    res.status(200).json({ success: true, data: settlements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Internal use for calculations
exports.getBalancesInternal = async () => {
  const expenses = await Expense.find();
  const balances = {};

  expenses.forEach((exp) => {
    const { amount, paid_by, participants, split_type, split_values } = exp;
    const numParticipants = participants.length;
    let shares = [];

    if (split_type === 'equal') {
      const share = parseFloat((amount / numParticipants).toFixed(2));
      shares = Array(numParticipants).fill(share);
    } else if (split_type === 'exact') {
      shares = split_values;
    } else if (split_type === 'percentage') {
      shares = split_values.map(p => parseFloat(((amount * p) / 100).toFixed(2)));
    }

    participants.forEach((person, index) => {
      const owed = shares[index] || 0;
      balances[person] = (balances[person] || 0) - owed;
    });

    balances[paid_by] = (balances[paid_by] || 0) + amount;
  });

  return { data: balances };
};
