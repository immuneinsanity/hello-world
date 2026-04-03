const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/workouts', require('./routes/workouts'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/tracking', require('./routes/tracking'));
app.use('/api/analysis', require('./routes/analysis'));

app.get('/', (req, res) => {
  res.json({ message: 'Workout Form Analyzer API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
