const express = require('express');
const auth = require('../middleware/auth');
const Recipe = require('../models/Recipe');
const RecipeCategory = require('../models/RecipeCategory');
const RecipeReview = require('../models/RecipeReview');
const RecipeFavorite = require('../models/RecipeFavorite');
const MealHistory = require('../models/MealHistory');
const NutritionHistory = require('../models/NutritionHistory');
const WeeklyMeals = require('../models/WeeklyMeals');
const Goal = require('../models/Goal');

const router = express.Router();

// GET /recipes - Fetch recipes with search, filtering, and sorting
router.get('/', async (req, res) => {
  try {
    const { 
      search = '', 
      category = '', 
      caloriesMin, 
      caloriesMax, 
      proteinMin, 
      carbsMax, 
      fatMax, 
      fiberMin,
      cookTimeMax, 
      difficulty, 
      dietPreference, 
      goal,
      sort
    } = req.query;

    const query = {};

    // Advanced search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'ingredients.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Filters
    if (category) {
      query.category = category;
    }

    if (caloriesMin || caloriesMax) {
      query['nutrition.calories'] = {};
      if (caloriesMin) query['nutrition.calories'].$gte = Number(caloriesMin);
      if (caloriesMax) query['nutrition.calories'].$lte = Number(caloriesMax);
    }

    if (proteinMin) {
      query['nutrition.protein'] = { $gte: Number(proteinMin) };
    }

    if (carbsMax) {
      query['nutrition.carbs'] = { $lte: Number(carbsMax) };
    }

    if (fatMax) {
      query['nutrition.fat'] = { $lte: Number(fatMax) };
    }

    if (fiberMin) {
      query['nutrition.fiber'] = { $gte: Number(fiberMin) };
    }

    if (cookTimeMax) {
      query.$expr = { $lte: [{ $add: ['$prepTime', '$cookTime'] }, Number(cookTimeMax)] };
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (dietPreference) {
      // E.g. Vegetarian, Vegan, Eggetarian, Non-Vegetarian, Gluten Free, Dairy Free
      query.dietaryType = { $in: [new RegExp(`^${dietPreference}$`, 'i')] };
    }

    if (goal) {
      // E.g. Weight Loss, Weight Gain, Muscle Gain, Lean Bulk, Body Recomposition, Maintain Weight
      query.goalKeywords = { $in: [new RegExp(`^${goal}$`, 'i')] };
    }

    let sortBuilder = { createdAt: -1 }; // Default: Latest
    
    if (sort) {
      switch (sort) {
        case 'highest-protein':
          sortBuilder = { 'nutrition.protein': -1 };
          break;
        case 'lowest-calories':
          sortBuilder = { 'nutrition.calories': 1 };
          break;
        case 'highest-rating':
          sortBuilder = { rating: -1 };
          break;
        case 'quickest-recipe':
          sortBuilder = { cookTime: 1 };
          break;
        case 'most-popular':
          sortBuilder = { ratingsCount: -1 };
          break;
        case 'latest':
          sortBuilder = { createdAt: -1 };
          break;
      }
    }

    const recipes = await Recipe.find(query).sort(sortBuilder);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch recipes', error: error.message });
  }
});

// GET /recipes/recommended - Recommended recipes based on user goal
router.get('/recommended', auth, async (req, res) => {
  try {
    const userGoal = await Goal.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    const goalType = userGoal ? userGoal.type.toLowerCase() : 'maintain weight';

    let query = {};
    let keyword = 'Maintain Weight';

    if (goalType.includes('loss') || goalType.includes('diet')) {
      keyword = 'Weight Loss';
      query.$or = [
        { goalKeywords: 'Weight Loss' },
        { 'nutrition.calories': { $lte: 450 } }
      ];
    } else if (goalType.includes('gain') && !goalType.includes('muscle')) {
      keyword = 'Weight Gain';
      query.$or = [
        { goalKeywords: 'Weight Gain' },
        { 'nutrition.calories': { $gte: 600 } }
      ];
    } else if (goalType.includes('muscle')) {
      keyword = 'Muscle Gain';
      query.$or = [
        { goalKeywords: 'Muscle Gain' },
        { 'nutrition.protein': { $gte: 25 } }
      ];
    } else if (goalType.includes('bulk')) {
      keyword = 'Lean Bulk';
      query.$or = [
        { goalKeywords: 'Lean Bulk' },
        { 'nutrition.calories': { $gte: 500 } }
      ];
    } else if (goalType.includes('recomp')) {
      keyword = 'Body Recomposition';
      query.$or = [
        { goalKeywords: 'Body Recomposition' },
        { 'nutrition.protein': { $gte: 22 } }
      ];
    } else {
      query.$or = [
        { goalKeywords: 'Maintain Weight' },
        { 'nutrition.calories': { $gte: 350, $lte: 650 } }
      ];
    }

    const recommended = await Recipe.find(query).limit(10);
    res.json({ success: true, goal: keyword, recipes: recommended });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch recommendations', error: error.message });
  }
});

// GET /recipes/trending - Trending recipes
router.get('/trending', async (req, res) => {
  try {
    const trending = await Recipe.find({}).sort({ rating: -1, ratingsCount: -1 }).limit(10);
    res.json(trending);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch trending recipes' });
  }
});

// GET /recipes/history - Fetch user cooking/logged history
router.get('/history', auth, async (req, res) => {
  try {
    const history = await MealHistory.find({ user: req.user._id })
      .populate('recipe')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(history);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch history' });
  }
});

// GET /recipes/:id - Get recipe details and populate reviews
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const reviews = await RecipeReview.find({ recipe: recipe._id }).sort({ createdAt: -1 });
    res.json({ success: true, recipe, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch recipe detail' });
  }
});

// POST /recipes - Add new recipe
router.post('/', auth, async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.status(201).json({ success: true, recipe: newRecipe });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Recipe creation failed', error: error.message });
  }
});

// PUT /recipes/:id - Edit recipe
router.put('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }
    res.json({ success: true, recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to edit recipe' });
  }
});

// DELETE /recipes/:id - Delete recipe
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }
    res.json({ success: true, message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete recipe' });
  }
});

// POST /recipes/favorite - Toggle favorite
router.post('/favorite', auth, async (req, res) => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) {
      return res.status(400).json({ success: false, message: 'Recipe ID is required' });
    }

    const existing = await RecipeFavorite.findOne({ user: req.user._id, recipe: recipeId });
    if (existing) {
      await RecipeFavorite.findByIdAndDelete(existing._id);
      res.json({ success: true, favorited: false, message: 'Removed from favorites' });
    } else {
      const fav = new RecipeFavorite({ user: req.user._id, recipe: recipeId });
      await fav.save();
      res.json({ success: true, favorited: true, message: 'Added to favorites' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Favorite action failed', error: error.message });
  }
});

// POST /recipes/add-to-meal - Log recipe to today's meals
router.post('/add-to-meal', auth, async (req, res) => {
  try {
    const { recipeId, mealType, date } = req.body;
    if (!recipeId || !mealType || !date) {
      return res.status(400).json({ success: false, message: 'recipeId, mealType and date are required' });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    // Save to MealHistory
    const mealEntry = new MealHistory({
      user: req.user._id,
      date,
      mealType,
      name: recipe.title,
      recipe: recipe._id,
      calories: recipe.nutrition.calories,
      protein: recipe.nutrition.protein,
      carbs: recipe.nutrition.carbs,
      fat: recipe.nutrition.fat,
      fiber: recipe.nutrition.fiber,
      sugar: recipe.nutrition.sugar,
      sodium: recipe.nutrition.sodium,
      potassium: recipe.nutrition.potassium,
      calcium: recipe.nutrition.calcium,
      iron: recipe.nutrition.iron,
      vitaminA: recipe.nutrition.vitaminA,
      vitaminC: recipe.nutrition.vitaminC,
      vitaminD: recipe.nutrition.vitaminD,
    });
    await mealEntry.save();

    // Find and update daily nutrition summary
    const summary = await NutritionHistory.findOneAndUpdate(
      { user: req.user._id, date },
      {
        $inc: {
          calories: recipe.nutrition.calories,
          protein: recipe.nutrition.protein,
          carbs: recipe.nutrition.carbs,
          fat: recipe.nutrition.fat,
          fiber: recipe.nutrition.fiber,
        }
      },
      { new: true, upsert: true }
    );

    res.status(201).json({ success: true, meal: mealEntry, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to log recipe meal', error: error.message });
  }
});

// POST /recipes/add-to-week - Log to weekly planner
router.post('/add-to-week', auth, async (req, res) => {
  try {
    const { recipeId, day, mealType } = req.body;
    if (!recipeId || !day || !mealType) {
      return res.status(400).json({ success: false, message: 'recipeId, day, and mealType are required' });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const weeklyMeal = new WeeklyMeals({
      user: req.user._id,
      day,
      mealType,
      recipe: recipe._id,
      name: recipe.title,
      calories: recipe.nutrition.calories,
      protein: recipe.nutrition.protein,
      carbs: recipe.nutrition.carbs,
      fat: recipe.nutrition.fat,
      fiber: recipe.nutrition.fiber
    });
    await weeklyMeal.save();

    // Synchronize to the user's main Goal weeklyPlan
    const userGoal = await Goal.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (userGoal && userGoal.weeklyPlan) {
      const dayPlan = userGoal.weeklyPlan.find(dp => dp.day.toLowerCase() === day.toLowerCase());
      if (dayPlan && dayPlan.meals) {
        const targetType = mealType === 'Snacks' ? 'Snack' : mealType;
        const mealIdx = dayPlan.meals.findIndex(m => 
          m.id.toLowerCase().includes(targetType.toLowerCase()) || 
          m.name.toLowerCase().includes(targetType.toLowerCase()) ||
          m.id.startsWith(targetType)
        );

        const mealData = {
          id: `${targetType}-${day}`,
          name: recipe.title,
          image: recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
          ingredients: recipe.ingredients.map(i => i.name),
          calories: recipe.nutrition.calories,
          protein: recipe.nutrition.protein,
          carbs: recipe.nutrition.carbs,
          fat: recipe.nutrition.fat,
          fiber: recipe.nutrition.fiber,
          cookingTime: `${recipe.prepTime + recipe.cookTime} min`,
          steps: recipe.steps
        };

        if (mealIdx !== -1) {
          dayPlan.meals[mealIdx] = mealData;
        } else {
          dayPlan.meals.push(mealData);
        }

        userGoal.markModified('weeklyPlan');
        await userGoal.save();
      }
    }

    res.status(201).json({ success: true, weeklyMeal, userGoal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add recipe to weekly plan', error: error.message });
  }
});

// POST /recipes/:id/reviews - Submit review and rating
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating) {
      return res.status(400).json({ success: false, message: 'Rating is required' });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const review = new RecipeReview({
      user: req.user._id,
      recipe: recipe._id,
      rating: Number(rating),
      comment: comment || '',
      userName: req.user.name || 'User'
    });
    await review.save();

    // Update Recipe average rating
    const reviews = await RecipeReview.find({ recipe: recipe._id });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    
    recipe.rating = Number(avgRating.toFixed(1));
    recipe.ratingsCount = reviews.length;
    await recipe.save();

    res.status(201).json({ success: true, review, recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit review', error: error.message });
  }
});

module.exports = router;
