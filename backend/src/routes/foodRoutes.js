const express = require('express');
const Food = require('../models/Food');

const router = express.Router();

router.get('/', async (req, res) => {
  const { search = '', category = '', page = 1, limit = 10 } = req.query;
  const query = {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ],
  };
  if (category) query.category = category;

  const foods = await Food.find(query)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
  const total = await Food.countDocuments(query);

  res.json({ foods, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

router.post('/', async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: 'Food creation failed' });
  }
});

module.exports = router;
