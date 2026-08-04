require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trackbite')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Smart Diet Planner API is running' });
});

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/goals', require('./src/routes/goalRoutes'));
app.use('/api/foods', require('./src/routes/foodRoutes'));
app.use('/api/recipes', require('./src/routes/recipeRoutes'));
app.use('/api/meals', require('./src/routes/mealRoutes'));
app.use('/api/progress', require('./src/routes/progressRoutes'));
app.use('/api/water', require('./src/routes/waterRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/ai', require('./src/routes/aiRoutes'));

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
