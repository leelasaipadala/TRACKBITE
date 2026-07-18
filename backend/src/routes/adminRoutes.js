const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Food = require('../models/Food');
const Recipe = require('../models/Recipe');

const router = express.Router();

router.get('/stats', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  const users = await User.countDocuments();
  const foods = await Food.countDocuments();
  const recipes = await Recipe.countDocuments();
  res.json({ users, foods, recipes });
});

router.get('/users', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  const users = await User.find().select('-password');
  res.json(users);
});

module.exports = router;
