const express = require('express');
const auth = require('../middleware/auth');
const WaterLog = require('../models/WaterLog');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const logs = await WaterLog.find({ user: req.user._id }).sort({ date: -1 });
  res.json(logs);
});

router.post('/', auth, async (req, res) => {
  try {
    const log = new WaterLog({ ...req.body, user: req.user._id });
    await log.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Water log failed' });
  }
});

module.exports = router;
