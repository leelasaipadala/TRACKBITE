const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Goal = require('../models/Goal');

const router = express.Router();

const validateGoal = [
  body('type').trim().notEmpty().withMessage('Goal type is required'),
  body('targetCalories').isNumeric().withMessage('Target Calories must be a number'),
  body('protein').isNumeric().withMessage('Protein target must be a number'),
  body('carbs').isNumeric().withMessage('Carbohydrates target must be a number'),
  body('fat').isNumeric().withMessage('Fat target must be a number'),
  body('waterIntake').isNumeric().withMessage('Water Intake target must be a number'),
];

router.post('/', auth, validateGoal, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    let goal = await Goal.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (goal) {
      Object.assign(goal, req.body);
      await goal.save();
    } else {
      goal = new Goal({ ...req.body, user: req.user._id });
      await goal.save();
    }
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Goal save failed', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch goals' });
  }
});

module.exports = router;
