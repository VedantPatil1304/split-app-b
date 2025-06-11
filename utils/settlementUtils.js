function calculateBalances(expenses) {
  const balances = {};

  expenses.forEach(exp => {
    const total = exp.amount;
    const numParticipants = exp.participants.length;

    let sharePerPerson;

    if (exp.share_type === 'equal') {
      // Equal split
      sharePerPerson = +(total / numParticipants).toFixed(2);
    } else if (Array.isArray(exp.shares)) {
      // Custom shares provided
      sharePerPerson = exp.shares.map(s => s.value);
    } else {
      // No shares defined and not equal: fallback
      console.warn(`Skipping expense "${exp.description}" due to missing shares`);
      return;
    }

    // Subtract share from each participant
    exp.participants.forEach((p, i) => {
      const share = Array.isArray(sharePerPerson) ? sharePerPerson[i] : sharePerPerson;
      balances[p] = (balances[p] || 0) - share;
    });

    // Add total to payer
    balances[exp.paid_by] = (balances[exp.paid_by] || 0) + total;
  });

  return balances;
}

function simplifyDebts(balances) {
  const debtors = [];
  const creditors = [];

  for (const [person, balance] of Object.entries(balances)) {
    if (balance < 0) debtors.push({ person, amount: -balance });
    else if (balance > 0) creditors.push({ person, amount: balance });
  }

  const settlements = [];

  while (debtors.length && creditors.length) {
    const debtor = debtors[0];
    const creditor = creditors[0];
    const amount = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.person,
      to: creditor.person,
      amount: +amount.toFixed(2)
    });

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount === 0) debtors.shift();
    if (creditor.amount === 0) creditors.shift();
  }

  return settlements;
}

module.exports = {
  calculateBalances,
  simplifyDebts
};
