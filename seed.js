const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Expense = require('./models/Expense');

dotenv.config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const seedExpenses = [
  {
    amount: 600,
    description: 'Dinner at restaurant',
    paid_by: 'Shantanu',
    participants: ['Shantanu', 'Sanket', 'Om'],
    split_type: 'equal',
    split_values: [],
  },
  {
    amount: 450,
    description: 'Groceries',
    paid_by: 'Sanket',
    participants: ['Shantanu', 'Sanket', 'Om'],
    split_type: 'equal',
    split_values: [],
  },
  {
    amount: 300,
    description: 'Petrol',
    paid_by: 'Om',
    participants: ['Shantanu', 'Sanket', 'Om'],
    split_type: 'equal',
    split_values: [],
  },
  {
    amount: 500,
    description: 'Movie Tickets',
    paid_by: 'Shantanu',
    participants: ['Shantanu', 'Sanket', 'Om'],
    split_type: 'equal',
    split_values: [],
  },
  {
    amount: 280,
    description: 'Pizza',
    paid_by: 'Sanket',
    participants: ['Shantanu', 'Sanket', 'Om'],
    split_type: 'equal',
    split_values: [],
  }
];

const seedDB = async () => {
  await Expense.deleteMany({});
  await Expense.insertMany(seedExpenses);
  console.log('Database seeded!');
  mongoose.connection.close();
};

seedDB();
