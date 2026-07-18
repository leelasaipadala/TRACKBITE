const mongoose = require('mongoose');

const nutritionHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
  weight: { type: Number, default: 70 },
  workoutMinutes: { type: Number, default: 0 },
  steps: { type: Number, default: 0 },
  sleepHours: { type: Number, default: 8 },
  mood: { type: String, default: 'Balanced' },
  energy: { type: String, default: 'Moderate' },
  createdAt: { type: Date, default: Date.now }
});

// Unique combination of user and date
nutritionHistorySchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('NutritionHistory', nutritionHistorySchema);
