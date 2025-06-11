const express = require('express');
const ctrl = require('../controllers/expenseController');
const router = express.Router();

router.get('/', ctrl.showIndex);
router.post('/expenses', ctrl.addExpense);
router.get('/edit/:id', ctrl.showEdit);
router.put('/expenses/:id', ctrl.updateExpense);
router.delete('/expenses/:id', ctrl.deleteExpense);
router.get('/summary', ctrl.showSummary);

module.exports = router;
