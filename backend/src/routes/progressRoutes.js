const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const WeightLog = require('../models/WeightLog');
const NutritionHistory = require('../models/NutritionHistory');

const router = express.Router();

const validateDailyProgress = [
  body('water').optional().isNumeric().withMessage('Water must be a number'),
  body('weight').optional().isNumeric().withMessage('Weight must be a number'),
  body('workoutMinutes').optional().isNumeric().withMessage('Workout minutes must be a number'),
  body('steps').optional().isNumeric().withMessage('Steps must be a number'),
  body('sleepHours').optional().isNumeric().withMessage('Sleep hours must be a number'),
  body('mood').optional().trim().notEmpty().withMessage('Mood must not be empty'),
  body('energy').optional().trim().notEmpty().withMessage('Energy must not be empty'),
];

// GET /api/progress - Fetch all raw weight logs
router.get('/', auth, async (req, res) => {
  try {
    const logs = await WeightLog.find({ user: req.user._id }).sort({ date: 1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch weight logs' });
  }
});

// POST /api/progress - Log a weight log entry
router.post('/', auth, async (req, res) => {
  try {
    const log = new WeightLog({ ...req.body, user: req.user._id });
    await log.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Progress update failed' });
  }
});

// GET /api/progress/daily - Fetch all daily logs (must be declared before :date)
router.get('/daily', auth, async (req, res) => {
  try {
    const logs = await NutritionHistory.find({ user: req.user._id }).sort({ date: 1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve daily history log', error: error.message });
  }
});

// GET /api/progress/daily/:date - Fetch daily stats (water, steps, sleep, weight, mood, energy)
router.get('/daily/:date', auth, async (req, res) => {
  try {
    const { date } = req.params;
    let log = await NutritionHistory.findOne({ user: req.user._id, date });
    if (!log) {
      log = {
        user: req.user._id,
        date,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        water: 0,
        weight: req.user.weight || 70,
        workoutMinutes: 0,
        steps: 0,
        sleepHours: 8,
        mood: 'Balanced',
        energy: 'Moderate'
      };
    }
    res.json(log);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve daily log', error: error.message });
  }
});

// POST /api/progress/daily/:date - Save daily stats
router.post('/daily/:date', auth, validateDailyProgress, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { date } = req.params;
    const updates = req.body;
    
    const log = await NutritionHistory.findOneAndUpdate(
      { user: req.user._id, date },
      { $set: updates },
      { new: true, upsert: true }
    );
    
    res.json(log);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save daily log', error: error.message });
  }
});

module.exports = router;
