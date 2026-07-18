const mongoose = require('mongoose');

const weeklyMealsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
  mealType: { type: String, enum: ['Breakfast', 'Morning Snack', 'Lunch', 'Evening Snack', 'Dinner', 'Post Workout', 'Snacks'], required: true },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', default: null },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  fiber: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeeklyMeals', weeklyMealsSchema);
