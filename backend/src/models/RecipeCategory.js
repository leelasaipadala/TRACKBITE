const mongoose = require('mongoose');

const recipeCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  slug: { type: String, unique: true }
});

module.exports = mongoose.model('RecipeCategory', recipeCategorySchema);
