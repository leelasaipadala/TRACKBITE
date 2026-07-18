const mongoose = require('mongoose');

const mealHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Morning Snack', 'Evening Snack', 'Post Workout'], required: true },
  name: { type: String, required: true },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', default: null },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  fiber: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 },
  sodium: { type: Number, default: 0 },
  potassium: { type: Number, default: 0 },
  calcium: { type: Number, default: 0 },
  iron: { type: Number, default: 0 },
  vitaminA: { type: Number, default: 0 },
  vitaminC: { type: Number, default: 0 },
  vitaminD: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MealHistory', mealHistorySchema);
