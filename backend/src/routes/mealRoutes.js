const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const MealHistory = require('../models/MealHistory');
const NutritionHistory = require('../models/NutritionHistory');

const router = express.Router();

const validateMeal = [
  body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format'),
  body('mealType').isIn(['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Morning Snack', 'Evening Snack', 'Post Workout', 'Smoothies', 'Healthy Desserts']).withMessage('Invalid meal type'),
  body('name').trim().notEmpty().withMessage('Meal name is required'),
  body('calories').isNumeric().withMessage('Calories must be a number'),
  body('protein').isNumeric().withMessage('Protein must be a number'),
  body('carbs').isNumeric().withMessage('Carbohydrates must be a number'),
  body('fat').isNumeric().withMessage('Fat must be a number'),
  body('fiber').optional().isNumeric().withMessage('Fiber must be a number'),
  body('sugar').optional().isNumeric().withMessage('Sugar must be a number'),
  body('sodium').optional().isNumeric().withMessage('Sodium must be a number'),
  body('potassium').optional().isNumeric().withMessage('Potassium must be a number'),
  body('calcium').optional().isNumeric().withMessage('Calcium must be a number'),
  body('iron').optional().isNumeric().withMessage('Iron must be a number'),
  body('vitaminA').optional().isNumeric().withMessage('Vitamin A must be a number'),
  body('vitaminC').optional().isNumeric().withMessage('Vitamin C must be a number'),
  body('vitaminD').optional().isNumeric().withMessage('Vitamin D must be a number'),
];

// GET /api/meals - Get meals for a specific date or all meals
router.get('/', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const query = { user: req.user._id };
    if (date) {
      query.date = date;
    }
    const meals = await MealHistory.find(query).sort({ createdAt: 1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch meals', error: error.message });
  }
});

// POST /api/meals - Log a custom or database meal
router.post('/', auth, validateMeal, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const {
      date,
      mealType,
      name,
      calories,
      protein,
      carbs,
      fat,
      fiber = 0,
      sugar = 0,
      sodium = 0,
      potassium = 0,
      calcium = 0,
      iron = 0,
      vitaminA = 0,
      vitaminC = 0,
      vitaminD = 0
    } = req.body;

    const mealEntry = new MealHistory({
      user: req.user._id,
      date,
      mealType,
      name,
      calories: Number(calories || 0),
      protein: Number(protein || 0),
      carbs: Number(carbs || 0),
      fat: Number(fat || 0),
      fiber: Number(fiber || 0),
      sugar: Number(sugar || 0),
      sodium: Number(sodium || 0),
      potassium: Number(potassium || 0),
      calcium: Number(calcium || 0),
      iron: Number(iron || 0),
      vitaminA: Number(vitaminA || 0),
      vitaminC: Number(vitaminC || 0),
      vitaminD: Number(vitaminD || 0)
    });
    await mealEntry.save();

    // Increment/update daily NutritionHistory
    const summary = await NutritionHistory.findOneAndUpdate(
      { user: req.user._id, date },
      {
        $inc: {
          calories: Number(calories || 0),
          protein: Number(protein || 0),
          carbs: Number(carbs || 0),
          fat: Number(fat || 0),
          fiber: Number(fiber || 0)
        }
      },
      { new: true, upsert: true }
    );

    res.status(201).json({ success: true, meal: mealEntry, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to log meal', error: error.message });
  }
});

// DELETE /api/meals/:id - Delete a logged meal
router.delete('/:id', auth, async (req, res) => {
  try {
    const meal = await MealHistory.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal log not found' });
    }

    // Decrement the values from NutritionHistory
    const summary = await NutritionHistory.findOneAndUpdate(
      { user: req.user._id, date: meal.date },
      {
        $inc: {
          calories: -meal.calories,
          protein: -meal.protein,
          carbs: -meal.carbs,
          fat: -meal.fat,
          fiber: -meal.fiber
        }
      },
      { new: true }
    );

    res.json({ success: true, message: 'Meal log deleted successfully', summary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete meal log', error: error.message });
  }
});

module.exports = router;
