const mongoose = require('mongoose');
const Recipe = require('../src/models/Recipe');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/diet-planner';

const recipesToSeed = [
  {
    title: "High-Protein Eggs & Spinach Toast",
    description: "A fast and satisfying high-protein breakfast featuring fresh spinach, soft boiled eggs, and creamy avocado spread on toasted sourdough bread.",
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80",
    difficulty: "Easy",
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    rating: 4.8,
    ratingsCount: 24,
    ingredients: [
      { name: "Sourdough bread slice", quantity: "2 slices", category: "Grains" },
      { name: "Large eggs", quantity: "2 units", category: "Protein" },
      { name: "Fresh spinach leaves", quantity: "1 cup", category: "Vegetables" },
      { name: "Avocado", quantity: "0.5 unit", category: "Healthy Fats" },
      { name: "Black pepper & Salt", quantity: "1 pinch", category: "Spices" }
    ],
    steps: [
      "Toast the sourdough bread slices until golden brown.",
      "Mash the avocado half and spread it evenly over the toast.",
      "Soft-boil or scramble the eggs according to preference.",
      "Sauté the spinach in a pan with a splash of water or oil for 1 minute.",
      "Top toast with spinach, then place eggs on top and season with salt and black pepper."
    ],
    cookingInstructions: "Bring water to a boil, cook eggs for 6.5 minutes for soft yolk. Drain, peel and slice in halves. Warm spinach in pan until wilted. Assemble toasts.",
    nutrition: {
      calories: 380,
      protein: 22,
      carbs: 32,
      fat: 16,
      fiber: 6,
      sugar: 2,
      sodium: 480,
      potassium: 350,
      calcium: 120,
      iron: 2.8,
      vitaminA: 240,
      vitaminC: 15,
      vitaminD: 2.5
    },
    dietaryType: ["Eggetarian", "Dairy Free", "High Protein"],
    goalKeywords: ["Weight Loss", "Muscle Gain", "Body Recomposition", "Maintain Weight"]
  },
  {
    title: "Greek Yogurt Berry Parfait Bowl",
    description: "An antioxidant-rich, high-fiber, low-calorie breakfast bowl that combines thick Greek yogurt, gluten-free oats, chia seeds, and sweet mixed berries.",
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    difficulty: "Easy",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    rating: 4.7,
    ratingsCount: 15,
    ingredients: [
      { name: "Greek yogurt", quantity: "200g", category: "Dairy" },
      { name: "Rolled oats (GF)", quantity: "30g", category: "Grains" },
      { name: "Mixed berries (Strawberries, Blueberries)", quantity: "0.5 cup", category: "Fruits" },
      { name: "Chia seeds", quantity: "1 tsp", category: "Healthy Fats" },
      { name: "Honey", quantity: "1 tsp", category: "Other" }
    ],
    steps: [
      "Spoon the Greek yogurt into a serving bowl.",
      "Add a layer of rolled oats on one side.",
      "Wash and place the mixed berries on top.",
      "Sprinkle the chia seeds and drizzle honey over the entire bowl."
    ],
    cookingInstructions: "No cooking required. Simply assemble the ingredients in layers or in a bowl and serve immediately.",
    nutrition: {
      calories: 290,
      protein: 20,
      carbs: 38,
      fat: 6,
      fiber: 7,
      sugar: 12,
      sodium: 80,
      potassium: 320,
      calcium: 210,
      iron: 1.1,
      vitaminA: 60,
      vitaminC: 22,
      vitaminD: 1.8
    },
    dietaryType: ["Vegetarian", "Gluten Free", "High Protein", "High Fiber"],
    goalKeywords: ["Weight Loss", "Maintain Weight", "Body Recomposition"]
  },
  {
    title: "Grilled Chicken Breast with Jeera Rice",
    description: "A solid post-workout muscle-building meal consisting of lean chicken breast grilled to perfection, served with light basmati cumin rice and roasted veggies.",
    category: "Lunch",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
    difficulty: "Medium",
    prepTime: 15,
    cookTime: 20,
    servings: 1,
    rating: 4.9,
    ratingsCount: 42,
    ingredients: [
      { name: "Chicken breast (boneless)", quantity: "200g", category: "Protein" },
      { name: "Basmati rice", quantity: "80g", category: "Grains" },
      { name: "Broccoli florets", quantity: "1 cup", category: "Vegetables" },
      { name: "Olive oil", quantity: "1 tbsp", category: "Healthy Fats" },
      { name: "Cumin seeds (Jeera)", quantity: "1 tsp", category: "Spices" },
      { name: "Garam Masala & Turmeric", quantity: "1 tsp", category: "Spices" }
    ],
    steps: [
      "Marinate the chicken breast with turmeric, garam masala, salt, and half the olive oil for 10 minutes.",
      "Wash and boil basmati rice with cumin seeds until cooked.",
      "Heat a grill pan with the remaining olive oil, sear chicken breast for 6-7 minutes on each side until internal temp is 165°F.",
      "Steam broccoli florets for 4 minutes until tender-crisp.",
      "Serve hot chicken breast sliced alongside the basmati cumin rice and broccoli."
    ],
    cookingInstructions: "Grill chicken breast in a skillet on medium-high heat. Let rest for 2 minutes before slicing. Steam veggies.",
    nutrition: {
      calories: 540,
      protein: 44,
      carbs: 60,
      fat: 14,
      fiber: 5,
      sugar: 1,
      sodium: 580,
      potassium: 620,
      calcium: 90,
      iron: 3.2,
      vitaminA: 110,
      vitaminC: 45,
      vitaminD: 0.5
    },
    dietaryType: ["Non-Vegetarian", "Dairy Free", "High Protein"],
    goalKeywords: ["Muscle Gain", "Lean Bulk", "Weight Gain", "Body Recomposition"]
  },
  {
    title: "Paneer Butter Masala with Whole Wheat Roti",
    description: "A rich vegetarian muscle-building dinner combining paneer cheese cubes cooked in a savory spiced tomato gravy, served with high-fiber whole wheat rotis.",
    category: "Dinner",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80",
    difficulty: "Medium",
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    rating: 4.6,
    ratingsCount: 38,
    ingredients: [
      { name: "Paneer cheese", quantity: "150g", category: "Dairy" },
      { name: "Whole wheat flour (Atta)", quantity: "100g", category: "Grains" },
      { name: "Canned tomato puree", quantity: "1 cup", category: "Vegetables" },
      { name: "Melon seeds & Cashews", quantity: "1 tbsp", category: "Healthy Fats" },
      { name: "Butter & Ghee", quantity: "1 tbsp", category: "Healthy Fats" },
      { name: "Kasuri Methi & Chili powder", quantity: "1 tsp", category: "Spices" }
    ],
    steps: [
      "Knead wheat flour with water and salt into a soft dough, divide and roll into rotis.",
      "Cook rotis on a hot tawa/skillet until puffed.",
      "Heat butter in a pan, cook tomato puree with cashew paste and spices until dry.",
      "Add paneer cubes, water, and cook for 5 minutes. Finish with crushed kasuri methi.",
      "Serve the hot paneer butter masala with whole wheat rotis."
    ],
    cookingInstructions: "Simmer tomato gravy on medium heat. Ensure paneer is added towards the end to keep it soft. Cook rotis without oil for lower calories.",
    nutrition: {
      calories: 520,
      protein: 20,
      carbs: 48,
      fat: 26,
      fiber: 8,
      sugar: 5,
      sodium: 620,
      potassium: 310,
      calcium: 380,
      iron: 2.5,
      vitaminA: 280,
      vitaminC: 12,
      vitaminD: 1.0
    },
    dietaryType: ["Vegetarian", "High Protein"],
    goalKeywords: ["Weight Gain", "Lean Bulk", "Muscle Gain"]
  },
  {
    title: "Moong Dal Khichdi with Ghee",
    description: "A comforting, light, and easy-to-digest healthy lifestyle meal combining split yellow mung beans and white rice, seasoned with turmeric, ginger, and a touch of ghee.",
    category: "Dinner",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    rating: 4.8,
    ratingsCount: 50,
    ingredients: [
      { name: "Moong Dal (Yellow Mung)", quantity: "0.5 cup", category: "Protein" },
      { name: "White rice", quantity: "0.5 cup", category: "Grains" },
      { name: "Ghee", quantity: "1 tbsp", category: "Healthy Fats" },
      { name: "Ginger grated", quantity: "1 tsp", category: "Spices" },
      { name: "Turmeric & Cumin seeds", quantity: "1 tsp", category: "Spices" }
    ],
    steps: [
      "Wash rice and moong dal together and soak for 15 minutes.",
      "Heat ghee in a pressure cooker or pot, splutter cumin seeds and sauté ginger.",
      "Add turmeric, salt, soaked dal and rice, then add 3.5 cups of water.",
      "Pressure cook for 3 whistles or simmer in a pot for 20 minutes until mushy.",
      "Serve warm with an extra drizzle of ghee if desired."
    ],
    cookingInstructions: "Pressure cook dal and rice with turmeric and salt. Temper ghee and cumin separately and pour over khichdi before serving.",
    nutrition: {
      calories: 320,
      protein: 11,
      carbs: 54,
      fat: 6,
      fiber: 8,
      sugar: 1,
      sodium: 350,
      potassium: 290,
      calcium: 40,
      iron: 2.1,
      vitaminA: 80,
      vitaminC: 3,
      vitaminD: 0
    },
    dietaryType: ["Vegetarian", "Gluten Free"],
    goalKeywords: ["Weight Loss", "Maintain Weight", "Maintain Weight"]
  },
  {
    title: "Green Protein Power Smoothie",
    description: "A refreshing, low-fat, and vitamin-packed smoothie featuring plant protein, baby spinach, ripe banana, and cold-pressed almond milk.",
    category: "Smoothies",
    image: "https://images.unsplash.com/photo-1610970881699-44a5587caaec?auto=format&fit=crop&w=900&q=80",
    difficulty: "Easy",
    prepTime: 3,
    cookTime: 0,
    servings: 1,
    rating: 4.5,
    ratingsCount: 18,
    ingredients: [
      { name: "Vegan Protein Powder", quantity: "1 scoop", category: "Protein" },
      { name: "Almond milk (unsweetened)", quantity: "1.5 cups", category: "Dairy" },
      { name: "Baby spinach", quantity: "1.5 cups", category: "Vegetables" },
      { name: "Ripe banana", quantity: "1 unit", category: "Fruits" },
      { name: "Flaxseed meal", quantity: "1 tsp", category: "Healthy Fats" }
    ],
    steps: [
      "Add spinach and almond milk to a high-speed blender, blend until smooth.",
      "Add protein powder, chopped banana, and flaxseed meal.",
      "Blend on high for 45 seconds until thick and creamy.",
      "Pour into a tall glass and serve cold."
    ],
    cookingInstructions: "Blend the leafy greens with the liquid base first to eliminate any green chunks before blending other solid ingredients.",
    nutrition: {
      calories: 270,
      protein: 25,
      carbs: 35,
      fat: 5,
      fiber: 8,
      sugar: 14,
      sodium: 190,
      potassium: 490,
      calcium: 150,
      iron: 2.2,
      vitaminA: 380,
      vitaminC: 18,
      vitaminD: 1.2
    },
    dietaryType: ["Vegan", "Vegetarian", "Gluten Free", "Dairy Free", "High Protein", "Low Fat"],
    goalKeywords: ["Weight Loss", "Body Recomposition", "Muscle Gain", "Maintain Weight"]
  },
  {
    title: "Chana Masala Chickpea Stew",
    description: "A protein-rich and fiber-packed vegan stew featuring tender chickpeas simmered in a spiced ginger-garlic tomato gravy.",
    category: "Lunch",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
    difficulty: "Medium",
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    rating: 4.8,
    ratingsCount: 31,
    ingredients: [
      { name: "Chickpeas (Kabuli Chana)", quantity: "200g cooked", category: "Protein" },
      { name: "Onion chopped", quantity: "1 cup", category: "Vegetables" },
      { name: "Tomato canned diced", quantity: "1.5 cups", category: "Vegetables" },
      { name: "Ginger garlic paste", quantity: "1 tbsp", category: "Spices" },
      { name: "Coconut oil", quantity: "1 tbsp", category: "Healthy Fats" },
      { name: "Chana Masala spice mix", quantity: "1.5 tsp", category: "Spices" }
    ],
    steps: [
      "Heat coconut oil in a pan, cook chopped onions until soft and brown.",
      "Stir in ginger garlic paste and spices, cook for 1 minute.",
      "Add tomatoes and cook until they release oil.",
      "Stir in cooked chickpeas, 1 cup of water, and simmer for 15 minutes.",
      "Garnish with chopped cilantro and squeeze fresh lemon juice before serving."
    ],
    cookingInstructions: "Mash a small handful of chickpeas against the side of the pot to thicken the tomato stew gravy naturally.",
    nutrition: {
      calories: 310,
      protein: 12,
      carbs: 48,
      fat: 8,
      fiber: 11,
      sugar: 4,
      sodium: 490,
      potassium: 390,
      calcium: 80,
      iron: 3.5,
      vitaminA: 90,
      vitaminC: 14,
      vitaminD: 0
    },
    dietaryType: ["Vegan", "Vegetarian", "Gluten Free", "Dairy Free", "High Fiber"],
    goalKeywords: ["Weight Loss", "Maintain Weight", "Body Recomposition"]
  },
  {
    title: "Post-Workout Banana Whey Protein Bar",
    description: "No-bake, clean high-protein bars packed with whey isolate, rolled oats, ripe banana, and crunchy peanut butter. Ideal for muscle recovery.",
    category: "Post Workout",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 0,
    servings: 4,
    rating: 4.6,
    ratingsCount: 22,
    ingredients: [
      { name: "Whey Protein Powder", quantity: "3 scoops", category: "Protein" },
      { name: "Rolled oats", quantity: "1.5 cups", category: "Grains" },
      { name: "Peanut butter", quantity: "0.5 cup", category: "Healthy Fats" },
      { name: "Ripe banana mashed", quantity: "1 unit", category: "Fruits" },
      { name: "Dark chocolate chips", quantity: "2 tbsp", category: "Other" }
    ],
    steps: [
      "In a bowl, mix oats and protein powder.",
      "Stir in mashed banana and warm peanut butter until a thick dough forms.",
      "Press dough into a square dish lined with parchment paper.",
      "Sprinkle dark chocolate chips on top and press gently.",
      "Refrigerate for 2 hours, then slice into 4 equal bars."
    ],
    cookingInstructions: "If dough is too dry, add 1-2 tbsp of water or almond milk. Ensure peanut butter is warmed slightly to ease mixing.",
    nutrition: {
      calories: 340,
      protein: 26,
      carbs: 38,
      fat: 12,
      fiber: 5,
      sugar: 6,
      sodium: 120,
      potassium: 290,
      calcium: 90,
      iron: 1.8,
      vitaminA: 40,
      vitaminC: 2,
      vitaminD: 0.8
    },
    dietaryType: ["Vegetarian", "High Protein"],
    goalKeywords: ["Muscle Gain", "Lean Bulk", "Weight Gain"]
  },
  {
    title: "Oats Avocado Vegan Pancakes",
    description: "An incredibly healthy dessert that swaps dairy and sugar for oats, avocado, and zero-calorie monk fruit sweetener. Fluffy and delicious.",
    category: "Healthy Desserts",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=900&q=80",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 8,
    servings: 2,
    rating: 4.4,
    ratingsCount: 12,
    ingredients: [
      { name: "Oat flour", quantity: "1 cup", category: "Grains" },
      { name: "Mashed avocado", quantity: "0.25 cup", category: "Healthy Fats" },
      { name: "Almond milk", quantity: "1 cup", category: "Dairy" },
      { name: "Baking powder", quantity: "1 tsp", category: "Other" },
      { name: "Monk fruit sweetener", quantity: "1 tbsp", category: "Other" }
    ],
    steps: [
      "Whisk oat flour, baking powder, and sweetener in a large bowl.",
      "Blend avocado and almond milk until smooth, then pour into flour mix.",
      "Stir until just combined (do not overmix).",
      "Cook ladlefuls of batter in a non-stick skillet for 2-3 minutes on each side.",
      "Serve warm topped with honey or maple syrup."
    ],
    cookingInstructions: "Cook on medium-low heat to ensure the inside cooks fully without burning the outside since avocado makes the batter slightly denser.",
    nutrition: {
      calories: 220,
      protein: 6,
      carbs: 34,
      fat: 8,
      fiber: 6,
      sugar: 1,
      sodium: 210,
      potassium: 240,
      calcium: 120,
      iron: 1.5,
      vitaminA: 30,
      vitaminC: 4,
      vitaminD: 0
    },
    dietaryType: ["Vegan", "Vegetarian", "Dairy Free"],
    goalKeywords: ["Weight Loss", "Maintain Weight"]
  }
];

async function seed() {
  try {
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log("Connected. Cleared existing recipes...");
    await Recipe.deleteMany({});
    
    console.log(`Seeding ${recipesToSeed.length} recipes...`);
    const inserted = await Recipe.insertMany(recipesToSeed);
    console.log(`Successfully seeded ${inserted.length} recipes!`);
    
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
