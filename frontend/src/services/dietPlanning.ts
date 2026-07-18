export type GoalKey =
  | 'weight loss'
  | 'fat loss'
  | 'body recomposition'
  | 'muscle gain'
  | 'lean bulk'
  | 'weight gain'
  | 'maintain weight'
  | 'improve fitness'
  | 'healthy lifestyle';

export interface AssessmentData {
  fullName: string;
  age: number;
  gender: string;
  height: number;
  currentWeight: number;
  targetWeight: number;
  activityLevel: string;
  dietPreference: string;
  medicalConditions: string[];
  allergies: string[];
  workoutPreference: string;
}

export interface DietMetrics {
  bmi: number;
  bmr: number;
  tdee: number;
  bodyFat: number;
  leanBodyMass: number;
  idealWeightRange: { min: number; max: number };
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
}

export interface MealItem {
  id: string;
  name: string;
  image: string;
  ingredients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  cookingTime: string;
  steps: string[];
}

export interface DayPlan {
  day: string;
  meals: MealItem[];
}

export const goalOptions = [
  {
    key: 'weight loss' as GoalKey,
    label: 'Weight Loss',
    description: 'Create a steady calorie deficit to support sustainable fat loss.',
    accent: 'from-emerald-500 to-lime-500',
  },
  {
    key: 'fat loss' as GoalKey,
    label: 'Fat Loss',
    description: 'Prioritize high protein intake with a moderate calorie deficit.',
    accent: 'from-green-600 to-emerald-500',
  },
  {
    key: 'body recomposition' as GoalKey,
    label: 'Body Recomposition',
    description: 'Lean muscle gain while maintaining a balanced calorie intake.',
    accent: 'from-teal-600 to-cyan-500',
  },
  {
    key: 'muscle gain' as GoalKey,
    label: 'Muscle Gain',
    description: 'Increase calories strategically to support strength and growth.',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    key: 'lean bulk' as GoalKey,
    label: 'Lean Bulk',
    description: 'Add quality calories with a small surplus and solid protein.',
    accent: 'from-yellow-500 to-amber-500',
  },
  {
    key: 'weight gain' as GoalKey,
    label: 'Weight Gain',
    description: 'Use a larger surplus to support healthy body mass increase.',
    accent: 'from-rose-500 to-red-500',
  },
  {
    key: 'maintain weight' as GoalKey,
    label: 'Maintain Weight',
    description: 'Stay balanced while preserving your current body metrics.',
    accent: 'from-sky-500 to-blue-500',
  },
  {
    key: 'improve fitness' as GoalKey,
    label: 'Improve Fitness',
    description: 'Support performance and recovery with a balanced nutrition plan.',
    accent: 'from-violet-500 to-fuchsia-500',
  },
  {
    key: 'healthy lifestyle' as GoalKey,
    label: 'Healthy Lifestyle',
    description: 'Build sustainable habits that support long-term wellbeing.',
    accent: 'from-emerald-700 to-green-500',
  },
];

const activityMultipliers: Record<string, number> = {
  Sedentary: 1.2,
  'Lightly Active': 1.375,
  'Moderately Active': 1.55,
  'Very Active': 1.725,
  Athlete: 1.9,
};

export function calculateDietMetrics(assessment: AssessmentData, goal: GoalKey): DietMetrics {
  const heightInMeters = assessment.height / 100;
  const bmi = Number((assessment.currentWeight / (heightInMeters * heightInMeters)).toFixed(1));

  const bmr = assessment.gender === 'Female'
    ? 10 * assessment.currentWeight + 6.25 * assessment.height - 5 * assessment.age - 161
    : 10 * assessment.currentWeight + 6.25 * assessment.height - 5 * assessment.age + 5;

  const tdee = Number((bmr * (activityMultipliers[assessment.activityLevel] || 1.55)).toFixed(0));

  const bodyFat = Number(Math.max(5, Math.min(45, assessment.gender === 'Female'
    ? 1.2 * bmi + 0.23 * assessment.age - 5.4
    : 1.2 * bmi + 0.23 * assessment.age - 16.2)).toFixed(1));

  const leanBodyMass = Number((assessment.currentWeight * (1 - bodyFat / 100)).toFixed(1));
  const idealWeightRange = {
    min: Number((Math.max(45, (assessment.height - 100) * 0.9)).toFixed(1)),
    max: Number((Math.max(50, (assessment.height - 100) * 1.1)).toFixed(1)),
  };

  let dailyCalories = tdee;
  if (goal === 'weight loss') dailyCalories = Math.round(tdee * 0.8);
  if (goal === 'fat loss') dailyCalories = Math.round(tdee * 0.85);
  if (goal === 'body recomposition') dailyCalories = tdee;
  if (goal === 'muscle gain') dailyCalories = Math.round(tdee * 1.15);
  if (goal === 'lean bulk') dailyCalories = Math.round(tdee * 1.1);
  if (goal === 'weight gain') dailyCalories = Math.round(tdee * 1.2);
  if (goal === 'maintain weight') dailyCalories = tdee;
  if (goal === 'improve fitness') dailyCalories = Math.round(tdee * 0.95);
  if (goal === 'healthy lifestyle') dailyCalories = Math.round(tdee * 0.9);

  const proteinTarget = Math.round(Math.max(90, assessment.currentWeight * (goal === 'muscle gain' || goal === 'lean bulk' || goal === 'fat loss' ? 1.8 : goal === 'weight gain' ? 2 : 1.6)));
  const fatCalories = Math.round(dailyCalories * 0.25);
  const proteinCalories = proteinTarget * 4;
  const remainingCalories = dailyCalories - proteinCalories - fatCalories;
  const carbs = Math.round(remainingCalories / 4);
  const fat = Math.round(fatCalories / 9);
  const fiber = goal === 'weight loss' || goal === 'fat loss' ? 35 : goal === 'muscle gain' || goal === 'lean bulk' ? 30 : 28;
  const water = Number((assessment.currentWeight * 0.035 + (assessment.activityLevel === 'Very Active' ? 1.2 : assessment.activityLevel === 'Athlete' ? 1.8 : 0.6)).toFixed(1));

  return {
    bmi,
    bmr: Math.round(bmr),
    tdee,
    bodyFat,
    leanBodyMass,
    idealWeightRange,
    dailyCalories,
    protein: proteinTarget,
    carbs,
    fat,
    fiber,
    water,
  };
}

function buildMealTemplate(assessment: AssessmentData, goal: GoalKey, mealType: string, dayIndex: number): MealItem {
  const preference = assessment.dietPreference;
  const templates = {
    Breakfast: [
      {
        name: preference === 'Vegan' ? 'Chia Oat Power Bowl' : preference === 'Vegetarian' || preference === 'Eggetarian' ? 'Greek Yogurt Berry Bowl' : 'Protein Omelette Bowl',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
        ingredients: ['Greek yogurt', 'berries', 'rolled oats', 'chia seeds', 'almonds'],
        calories: 360,
        protein: 24,
        carbs: 40,
        fat: 12,
        fiber: 10,
        cookingTime: '10 min',
        steps: ['Mix the base ingredients', 'Top with fruit and nuts', 'Serve chilled'],
      },
      {
        name: preference === 'Vegan' ? 'Tofu Scramble Wrap' : 'Egg & Spinach Toast',
        image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80',
        ingredients: ['whole grain bread', 'eggs', 'spinach', 'tomato', 'avocado'],
        calories: 390,
        protein: 26,
        carbs: 34,
        fat: 16,
        fiber: 8,
        cookingTime: '12 min',
        steps: ['Cook the vegetables', 'Add eggs and fold gently', 'Serve with toast'],
      },
    ],
    'Morning Snack': [
      {
        name: 'Apple Cinnamon Protein Box',
        image: 'https://images.unsplash.com/photo-1464965911861-746a04bca7f6?auto=format&fit=crop&w=900&q=80',
        ingredients: ['apple', 'protein shake', 'almonds', 'cinnamon'],
        calories: 240,
        protein: 20,
        carbs: 25,
        fat: 8,
        fiber: 6,
        cookingTime: '5 min',
        steps: ['Slice the apple', 'Pair with a shake and nuts', 'Enjoy fresh'],
      },
      {
        name: 'Hummus Veggie Cups',
        image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80',
        ingredients: ['hummus', 'carrots', 'cucumber', 'bell peppers'],
        calories: 220,
        protein: 10,
        carbs: 22,
        fat: 10,
        fiber: 7,
        cookingTime: '8 min',
        steps: ['Slice the veggies', 'Portion with hummus', 'Serve chilled'],
      },
    ],
    Lunch: [
      {
        name: preference === 'Vegan' ? 'Quinoa Chickpea Bowl' : preference === 'Non-Vegetarian' ? 'Chicken Rice Power Bowl' : 'Paneer Quinoa Bowl',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
        ingredients: ['quinoa', 'greens', 'roasted veggies', 'olive oil', 'protein source'],
        calories: 520,
        protein: 35,
        carbs: 48,
        fat: 18,
        fiber: 12,
        cookingTime: '20 min',
        steps: ['Cook the grain', 'Roast vegetables', 'Assemble and season'],
      },
      {
        name: preference === 'Vegan' ? 'Mediterranean Lentil Plate' : 'Salmon Herb Plate',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80',
        ingredients: ['lentils', 'cucumber', 'tomato', 'olive oil', 'herbs'],
        calories: 560,
        protein: 32,
        carbs: 42,
        fat: 22,
        fiber: 13,
        cookingTime: '18 min',
        steps: ['Cook lentils', 'Combine with vegetables', 'Dress and serve'],
      },
    ],
    'Evening Snack': [
      {
        name: 'Trail Mix & Banana',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
        ingredients: ['banana', 'mixed nuts', 'dried fruit'],
        calories: 260,
        protein: 8,
        carbs: 30,
        fat: 12,
        fiber: 6,
        cookingTime: '3 min',
        steps: ['Pack the snack', 'Enjoy as a portable option', 'Stay hydrated'],
      },
      {
        name: 'Cottage Cheese Bowl',
        image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=900&q=80',
        ingredients: ['cottage cheese', 'berries', 'pumpkin seeds'],
        calories: 240,
        protein: 18,
        carbs: 18,
        fat: 10,
        fiber: 5,
        cookingTime: '5 min',
        steps: ['Mix and portion', 'Top with fruit', 'Serve chilled'],
      },
    ],
    Dinner: [
      {
        name: preference === 'Vegan' ? 'Tempeh Stir-Fry' : preference === 'Non-Vegetarian' ? 'Grilled Chicken Plate' : 'Paneer Veggie Stir-Fry',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
        ingredients: ['protein', 'broccoli', 'carrots', 'brown rice', 'soy sauce'],
        calories: 610,
        protein: 38,
        carbs: 52,
        fat: 22,
        fiber: 11,
        cookingTime: '25 min',
        steps: ['Cook the protein', 'Sauté vegetables', 'Serve with rice'],
      },
      {
        name: preference === 'Vegetarian' || preference === 'Eggetarian' ? 'Mushroom Tofu Rice Bowl' : 'Salmon Greens Plate',
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80',
        ingredients: ['tofu', 'greens', 'mushrooms', 'rice', 'olive oil'],
        calories: 590,
        protein: 34,
        carbs: 46,
        fat: 24,
        fiber: 9,
        cookingTime: '22 min',
        steps: ['Sear the protein', 'Roast the vegetables', 'Plate with grains'],
      },
    ],
  };

  const options = templates[mealType as keyof typeof templates] || templates.Breakfast;
  const option = options[(dayIndex + (goal === 'muscle gain' ? 1 : 0)) % options.length];
  const adjustment = goal === 'weight loss' || goal === 'fat loss' ? 0.92 : goal === 'weight gain' ? 1.08 : goal === 'muscle gain' || goal === 'lean bulk' ? 1.04 : 1;

  return {
    id: `${mealType}-${dayIndex}`,
    ...option,
    calories: Math.round(option.calories * adjustment),
    protein: Math.round(option.protein * (goal === 'fat loss' ? 1.06 : goal === 'muscle gain' ? 1.04 : 1)),
    carbs: Math.round(option.carbs * (goal === 'weight loss' || goal === 'fat loss' ? 0.95 : 1)),
    fat: Math.round(option.fat * (goal === 'weight gain' ? 1.04 : 1)),
    fiber: Math.round(option.fiber * (goal === 'weight loss' || goal === 'fat loss' ? 1.08 : 1)),
  };
}

export function generateWeeklyPlan(assessment: AssessmentData, goal: GoalKey, metrics: DietMetrics): DayPlan[] {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Morning Snack', 'Lunch', 'Evening Snack', 'Dinner'];
  const includePostWorkout = goal === 'muscle gain' || goal === 'lean bulk' || assessment.activityLevel === 'Very Active' || assessment.activityLevel === 'Athlete';

  return days.map((day, index) => ({
    day,
    meals: [
      ...mealTypes.map((mealType) => buildMealTemplate(assessment, goal, mealType, index)),
      ...(includePostWorkout ? [
        {
          id: `${day}-post-workout`,
          name: 'Recovery Smoothie',
          image: 'https://images.unsplash.com/photo-1574178879139-7e845c3f5f85?auto=format&fit=crop&w=900&q=80',
          ingredients: ['banana', 'protein powder', 'almond milk', 'berries'],
          calories: Math.round(metrics.dailyCalories * 0.08),
          protein: 24,
          carbs: 28,
          fat: 7,
          fiber: 5,
          cookingTime: '5 min',
          steps: ['Blend all ingredients', 'Drink within 30 minutes after training', 'Hydrate before the next meal'],
        },
      ] : []),
    ],
  }));
}

export function buildGroceryList(_weeklyPlan: DayPlan[]) {
  const categories = {
    Vegetables: ['spinach', 'bell peppers', 'broccoli', 'carrots', 'cucumbers', 'tomatoes'],
    Fruits: ['berries', 'banana', 'apple', 'avocado'],
    'Protein Sources': ['Greek yogurt', 'eggs', 'chicken', 'tofu', 'salmon', 'lentils', 'cottage cheese'],
    Dairy: ['Greek yogurt', 'cottage cheese', 'almond milk'],
    Grains: ['oats', 'quinoa', 'brown rice', 'whole grain bread'],
    Spices: ['cinnamon', 'olive oil', 'herbs', 'soy sauce'],
    'Healthy Fats': ['almonds', 'chia seeds', 'olive oil', 'nuts'],
  };

  return Object.entries(categories).map(([label, items]) => ({ label, items }));
}

export function getRecommendations(progress: Array<{ date: string; currentWeight: number; bodyFat: number }>, goal: GoalKey) {
  if (progress.length >= 14) {
    const recent = progress.slice(-14);
    const change = recent[recent.length - 1].currentWeight - recent[0].currentWeight;
    if (Math.abs(change) < 0.3) {
      return [
        { title: 'Increase Protein', detail: 'A slightly higher protein target can help preserve lean mass while you progress.', icon: '🥗' },
        { title: 'Improve Water Intake', detail: 'Aim for a consistent hydration rhythm across the day.', icon: '💧' },
        { title: 'Increase Cardio', detail: 'A small addition to your activity can accelerate body recomposition.', icon: '🚶' },
      ];
    }
  }

  return [
    { title: 'Keep the routine steady', detail: 'Consistency beats extreme changes. Continue the plan and track progress daily.', icon: '✨' },
    { title: `${goal === 'weight loss' || goal === 'fat loss' ? 'Reduce Sugar' : 'Balance Meals'}`, detail: 'A focused meal rhythm supports better adherence and recovery.', icon: '🍽️' },
    { title: 'Hydrate consistently', detail: 'A simple water target can make the whole system feel easier.', icon: '💧' },
  ];
}
