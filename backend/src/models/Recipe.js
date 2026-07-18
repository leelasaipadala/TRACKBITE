const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, required: true },
  image: { type: String, default: '' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  prepTime: { type: Number, default: 15 }, // in minutes
  cookTime: { type: Number, default: 15 }, // in minutes
  servings: { type: Number, default: 2 },
  rating: { type: Number, default: 4.5 },
  ratingsCount: { type: Number, default: 0 },
  ingredients: [
    {
      name: { type: String, required: true },
      quantity: { type: String, default: '1 unit' },
      category: { type: String, enum: ['Vegetables', 'Fruits', 'Protein', 'Dairy', 'Grains', 'Healthy Fats', 'Spices', 'Other'], default: 'Other' }
    }
  ],
  steps: [{ type: String }],
  cookingInstructions: { type: String, default: '' },
  nutrition: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 }, // grams
    carbs: { type: Number, default: 0 }, // grams
    fat: { type: Number, default: 0 }, // grams
    fiber: { type: Number, default: 0 }, // grams
    sugar: { type: Number, default: 0 }, // grams
    sodium: { type: Number, default: 0 }, // mg
    potassium: { type: Number, default: 0 }, // mg
    calcium: { type: Number, default: 0 }, // mg
    iron: { type: Number, default: 0 }, // mg
    vitaminA: { type: Number, default: 0 }, // mcg
    vitaminC: { type: Number, default: 0 }, // mg
    vitaminD: { type: Number, default: 0 } // mcg
  },
  dietaryType: [{ type: String }], // 'Vegetarian', 'Vegan', 'Eggetarian', 'Non-Vegetarian', 'Gluten Free', 'Dairy Free', etc.
  goalKeywords: [{ type: String }], // 'Weight Loss', 'Weight Gain', 'Muscle Gain', 'Lean Bulk', 'Body Recomposition', 'Maintain Weight'
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Recipe', recipeSchema);
