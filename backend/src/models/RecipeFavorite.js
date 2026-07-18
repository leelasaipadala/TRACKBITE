const mongoose = require('mongoose');

const recipeFavoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Ensure a user can only favorite a recipe once
recipeFavoriteSchema.index({ user: 1, recipe: 1 }, { unique: true });

module.exports = mongoose.model('RecipeFavorite', recipeFavoriteSchema);
