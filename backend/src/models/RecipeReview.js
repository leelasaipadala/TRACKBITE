const mongoose = require('mongoose');

const recipeReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  userName: { type: String, default: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RecipeReview', recipeReviewSchema);
