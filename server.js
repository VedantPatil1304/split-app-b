// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const cors = require('cors');

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/expenses', require('./routes/expenseRoutes'));

// app.use('/api', require('./routes/settlementRoutes'));

// app.get('/', (req, res) => res.send("Split App API Running"));

// app.use(express.static('public'));


// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });


require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', expenseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
