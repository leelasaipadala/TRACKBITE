export type MealType = 
  | 'Breakfast' 
  | 'Morning Snack' 
  | 'Lunch' 
  | 'Evening Snack' 
  | 'Dinner' 
  | 'Post Workout';

export interface NutritionEntry {
  id: string;
  mealType: MealType;
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  potassium: number;
  calcium: number;
  iron: number;
  vitaminA: number;
  vitaminC: number;
  vitaminD: number;
  favorite: boolean;
  createdAt: string;
}

export interface DayLog {
  entries: NutritionEntry[];
  water: number;
  weight: number;
  bodyFat: number;
  waist: number;
  chest: number;
  hip: number;
  neck: number;
  leanBodyMass: number;
  caloriesBurned: number;
  workoutMinutes: number;
  steps: number;
  sleepHours: number;
  mood: string;
  energy: string;
}

export interface NutritionState {
  entries: NutritionEntry[];
  water: number;
  weight: number;
  bodyFat: number;
  waist: number;
  chest: number;
  hip: number;
  neck: number;
  leanBodyMass: number;
  caloriesBurned: number;
  workoutMinutes: number;
  steps: number;
  sleepHours: number;
  mood: string;
  energy: string;
  history: Record<string, DayLog>;
  customFoods: FoodOption[];
  streakCount: number;
  longestStreak: number;
  lastStreakUpdateDate: string;
  workoutDays: string[];
  reminders: {
    mealReminders: boolean;
    workoutReminders: boolean;
  };
}

export interface GoalMetrics {
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
}

export interface DailyNutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  potassium: number;
  calcium: number;
  iron: number;
  vitaminA: number;
  vitaminC: number;
  vitaminD: number;
}

const STORAGE_KEY = 'nutrition-tracker-state-v3';

const defaultState: NutritionState = {
  entries: [],
  water: 0,
  weight: 70,
  bodyFat: 18,
  waist: 32,
  chest: 38,
  hip: 36,
  neck: 14,
  leanBodyMass: 57.4,
  caloriesBurned: 0,
  workoutMinutes: 0,
  steps: 0,
  sleepHours: 8,
  mood: 'Energetic',
  energy: 'High',
  history: {},
  customFoods: [],
  streakCount: 0,
  longestStreak: 0,
  lastStreakUpdateDate: '',
  workoutDays: ['Monday', 'Wednesday', 'Friday'],
  reminders: {
    mealReminders: true,
    workoutReminders: true,
  },
};

export interface FoodOption {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  potassium: number;
  calcium: number;
  iron: number;
  vitaminA: number;
  vitaminC: number;
  vitaminD: number;
  category?: string;
  
  // Dietary preference tags
  vegetarian: boolean;
  nonVeg: boolean;
  vegan: boolean;
  highProtein: boolean;
  lowCal: boolean;
  highFiber: boolean;
  lowFat: boolean;
  postWorkout: boolean;
}

export function getStarterFoods(): FoodOption[] {
  return [
    // === BREAKFAST (25 items) ===
    { id: 'b1', name: 'Plain Idli', servingSize: '2 pcs', calories: 150, protein: 4, carbs: 32, fat: 1, fiber: 2, sugar: 1, sodium: 280, potassium: 120, calcium: 20, iron: 0.8, vitaminA: 0, vitaminC: 0, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'b2', name: 'Idli with Sambar', servingSize: '2 idli + 1 bowl sambar', calories: 230, protein: 7, carbs: 44, fat: 3, fiber: 5, sugar: 2, sodium: 450, potassium: 240, calcium: 40, iron: 1.5, vitaminA: 80, vitaminC: 5, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: true, postWorkout: false },
    { id: 'b3', name: 'Mini Idli', servingSize: '10 pcs', calories: 180, protein: 5, carbs: 36, fat: 1, fiber: 2, sugar: 1, sodium: 310, potassium: 140, calcium: 22, iron: 0.9, vitaminA: 0, vitaminC: 0, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'b4', name: 'Rava Idli', servingSize: '2 pcs', calories: 220, protein: 6, carbs: 42, fat: 3, fiber: 3, sugar: 2, sodium: 390, potassium: 180, calcium: 35, iron: 1.2, vitaminA: 10, vitaminC: 1, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: false, highProtein: false, lowCal: false, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'b5', name: 'Plain Dosa', servingSize: '1 pc', calories: 140, protein: 3, carbs: 28, fat: 2, fiber: 1.5, sugar: 0, sodium: 220, potassium: 90, calcium: 15, iron: 0.6, vitaminA: 0, vitaminC: 0, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'b6', name: 'Masala Dosa', servingSize: '1 pc', calories: 280, protein: 5, carbs: 48, fat: 8, fiber: 4, sugar: 1, sodium: 390, potassium: 220, calcium: 30, iron: 1.4, vitaminA: 60, vitaminC: 4, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'b7', name: 'Onion Dosa', servingSize: '1 pc', calories: 190, protein: 4, carbs: 32, fat: 5, fiber: 2.5, sugar: 2, sodium: 295, potassium: 130, calcium: 24, iron: 0.9, vitaminA: 12, vitaminC: 2, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'b8', name: 'Ragi Dosa', servingSize: '1 pc', calories: 175, protein: 4, carbs: 35, fat: 2, fiber: 5, sugar: 1, sodium: 280, potassium: 190, calcium: 320, iron: 2.5, vitaminA: 30, vitaminC: 1, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: true, postWorkout: false },
    { id: 'b9', name: 'Pesarattu', servingSize: '1 pc', calories: 210, protein: 9, carbs: 34, fat: 4, fiber: 6, sugar: 1, sodium: 320, potassium: 280, calcium: 40, iron: 2.1, vitaminA: 90, vitaminC: 4, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'b10', name: 'Vegetable Poha', servingSize: '1 plate', calories: 245, protein: 4, carbs: 45, fat: 5, fiber: 3.5, sugar: 2, sodium: 350, potassium: 115, calcium: 25, iron: 1.5, vitaminA: 40, vitaminC: 5, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'b11', name: 'Vegetable Upma', servingSize: '1 plate', calories: 260, protein: 5, carbs: 48, fat: 6, fiber: 3, sugar: 2, sodium: 380, potassium: 140, calcium: 30, iron: 1.2, vitaminA: 80, vitaminC: 4, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'b12', name: 'Vegetable Oats Upma', servingSize: '1 bowl', calories: 230, protein: 8, carbs: 36, fat: 5, fiber: 7, sugar: 2, sodium: 310, potassium: 210, calcium: 50, iron: 2.0, vitaminA: 110, vitaminC: 5, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'b13', name: 'Oats Idli', servingSize: '2 pcs', calories: 185, protein: 7, carbs: 32, fat: 3, fiber: 5, sugar: 1, sodium: 310, potassium: 180, calcium: 40, iron: 1.8, vitaminA: 50, vitaminC: 2, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: false, highProtein: false, lowCal: false, highFiber: true, lowFat: true, postWorkout: false },
    { id: 'b14', name: 'Vegetable Uttapam', servingSize: '1 pc', calories: 255, protein: 6, carbs: 44, fat: 6, fiber: 4.5, sugar: 2, sodium: 390, potassium: 165, calcium: 42, iron: 1.6, vitaminA: 120, vitaminC: 8, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'b15', name: 'Daliya', servingSize: '1 bowl', calories: 220, protein: 7, carbs: 42, fat: 3, fiber: 8, sugar: 2, sodium: 290, potassium: 190, calcium: 30, iron: 2.2, vitaminA: 80, vitaminC: 4, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: true, postWorkout: false },
    { id: 'b16', name: 'Pongal', servingSize: '1 plate', calories: 310, protein: 8, carbs: 54, fat: 7, fiber: 4, sugar: 0, sodium: 450, potassium: 190, calcium: 50, iron: 2.0, vitaminA: 40, vitaminC: 1, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: false, highProtein: false, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'b17', name: 'Chapati', servingSize: '2 pcs', calories: 180, protein: 6, carbs: 36, fat: 2, fiber: 4, sugar: 0, sodium: 180, potassium: 150, calcium: 30, iron: 1.8, vitaminA: 0, vitaminC: 0, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: true, postWorkout: false },
    { id: 'b18', name: 'Peanut Butter Toast', servingSize: '2 slices bread + 2 tbsp PB', calories: 320, protein: 12, carbs: 32, fat: 16, fiber: 4, sugar: 5, sodium: 280, potassium: 250, calcium: 40, iron: 1.5, vitaminA: 0, vitaminC: 0, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: true, highProtein: true, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'b19', name: 'Bread Omelette', servingSize: '2 bread + 2 eggs', calories: 340, protein: 18, carbs: 26, fat: 16, fiber: 2, sugar: 3, sodium: 490, potassium: 290, calcium: 90, iron: 2.6, vitaminA: 240, vitaminC: 8, vitaminD: 2.2, category: 'Breakfast', vegetarian: false, nonVeg: true, vegan: false, highProtein: true, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'b20', name: 'Boiled Eggs', servingSize: '2 eggs', calories: 150, protein: 13, carbs: 1, fat: 10, fiber: 0, sugar: 0, sodium: 120, potassium: 125, calcium: 50, iron: 1.2, vitaminA: 160, vitaminC: 0, vitaminD: 2.0, category: 'Breakfast', vegetarian: false, nonVeg: true, vegan: false, highProtein: true, lowCal: true, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'b21', name: 'Vegetable Omelette', servingSize: '2 eggs + veggies', calories: 210, protein: 15, carbs: 5, fat: 14, fiber: 1.5, sugar: 1, sodium: 360, potassium: 210, calcium: 75, iron: 2.1, vitaminA: 190, vitaminC: 10, vitaminD: 2.0, category: 'Breakfast', vegetarian: false, nonVeg: true, vegan: false, highProtein: true, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'b22', name: 'Cornflakes', servingSize: '40g + 150ml milk', calories: 220, protein: 7, carbs: 38, fat: 4, fiber: 1, sugar: 8, sodium: 290, potassium: 210, calcium: 190, iron: 2.8, vitaminA: 120, vitaminC: 6, vitaminD: 1.2, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: false, highProtein: false, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'b23', name: 'Muesli', servingSize: '40g + 150ml milk', calories: 240, protein: 8, carbs: 42, fat: 5, fiber: 4, sugar: 9, sodium: 110, potassium: 250, calcium: 210, iron: 2.4, vitaminA: 80, vitaminC: 4, vitaminD: 1.2, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: false, highProtein: false, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'b24', name: 'Oats Porridge', servingSize: '1 bowl', calories: 210, protein: 8, carbs: 36, fat: 4, fiber: 5, sugar: 6, sodium: 95, potassium: 230, calcium: 120, iron: 1.8, vitaminA: 40, vitaminC: 1, vitaminD: 0.8, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: false, highProtein: false, lowCal: false, highFiber: true, lowFat: true, postWorkout: false },
    { id: 'b25', name: 'Fruit Bowl', servingSize: '1 bowl mixed', calories: 120, protein: 2, carbs: 28, fat: 0.5, fiber: 5, sugar: 20, sodium: 5, potassium: 380, calcium: 30, iron: 0.6, vitaminA: 280, vitaminC: 75, vitaminD: 0, category: 'Breakfast', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: true, lowFat: true, postWorkout: false },

    // === MORNING SNACK (24 items) ===
    { id: 'ms1', name: 'Apple', servingSize: '1 medium', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, sodium: 2, potassium: 195, calcium: 10, iron: 0.2, vitaminA: 50, vitaminC: 8, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: true, lowFat: true, postWorkout: false },
    { id: 'ms2', name: 'Banana', servingSize: '1 medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1, sugar: 14, sodium: 1, potassium: 420, calcium: 6, iron: 0.3, vitaminA: 60, vitaminC: 10, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'ms3', name: 'Orange', servingSize: '1 medium', calories: 60, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.0, sugar: 12, sodium: 0, potassium: 230, calcium: 50, iron: 0.1, vitaminA: 20, vitaminC: 70, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'ms4', name: 'Papaya', servingSize: '1 cup cubes', calories: 55, protein: 0.6, carbs: 14, fat: 0.1, fiber: 2.5, sugar: 11, sodium: 4, potassium: 260, calcium: 24, iron: 0.3, vitaminA: 310, vitaminC: 80, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'ms5', name: 'Watermelon', servingSize: '1 cup cubes', calories: 45, protein: 0.9, carbs: 11, fat: 0.2, fiber: 0.6, sugar: 9, sodium: 2, potassium: 170, calcium: 10, iron: 0.4, vitaminA: 80, vitaminC: 12, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'ms6', name: 'Grapes', servingSize: '1 cup', calories: 100, protein: 1.1, carbs: 26, fat: 0.2, fiber: 1.4, sugar: 23, sodium: 3, potassium: 290, calcium: 15, iron: 0.5, vitaminA: 10, vitaminC: 15, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'ms7', name: 'Guava', servingSize: '1 medium', calories: 70, protein: 2.5, carbs: 14, fat: 0.9, fiber: 9.0, sugar: 9, sodium: 3, potassium: 410, calcium: 20, iron: 0.3, vitaminA: 240, vitaminC: 370, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: true, lowFat: true, postWorkout: false },
    { id: 'ms8', name: 'Kiwi', servingSize: '1 pc', calories: 40, protein: 0.8, carbs: 10, fat: 0.4, fiber: 2.0, sugar: 6, sodium: 2, potassium: 215, calcium: 23, iron: 0.2, vitaminA: 30, vitaminC: 64, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'ms9', name: 'Pear', servingSize: '1 medium', calories: 100, protein: 0.6, carbs: 27, fat: 0.2, fiber: 5.5, sugar: 17, sodium: 1, potassium: 200, calcium: 16, iron: 0.3, vitaminA: 20, vitaminC: 7, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: true, lowFat: true, postWorkout: false },
    { id: 'ms10', name: 'Mixed Nuts', servingSize: '30g', calories: 180, protein: 6, carbs: 6, fat: 16, fiber: 3, sugar: 1.2, sodium: 5, potassium: 180, calcium: 40, iron: 1.0, vitaminA: 0, vitaminC: 0, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'ms11', name: 'Almonds', servingSize: '15 pcs', calories: 100, protein: 3.5, carbs: 3.5, fat: 9, fiber: 2.2, sugar: 0.8, sodium: 1, potassium: 120, calcium: 45, iron: 0.6, vitaminA: 0, vitaminC: 0, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'ms12', name: 'Walnuts', servingSize: '7 halves', calories: 130, protein: 3, carbs: 2.8, fat: 13, fiber: 1.4, sugar: 0.5, sodium: 1, potassium: 90, calcium: 20, iron: 0.6, vitaminA: 0, vitaminC: 0, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'ms13', name: 'Cashews', servingSize: '12 pcs', calories: 110, protein: 3.5, carbs: 6, fat: 9, fiber: 0.6, sugar: 1.2, sodium: 3, potassium: 130, calcium: 8, iron: 1.2, vitaminA: 0, vitaminC: 0, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'ms14', name: 'Pistachios', servingSize: '25 pcs', calories: 80, protein: 3, carbs: 4, fat: 6.5, fiber: 1.4, sugar: 1.0, sodium: 1, potassium: 140, calcium: 15, iron: 0.6, vitaminA: 20, vitaminC: 1, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'ms15', name: 'Dates', servingSize: '3 pcs', calories: 120, protein: 1, carbs: 32, fat: 0.1, fiber: 3, sugar: 28, sodium: 1, potassium: 290, calcium: 25, iron: 0.5, vitaminA: 10, vitaminC: 0, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'ms16', name: 'Raisins', servingSize: '2 tbsp', calories: 60, protein: 0.6, carbs: 16, fat: 0.1, fiber: 0.8, sugar: 12, sodium: 2, potassium: 150, calcium: 10, iron: 0.4, vitaminA: 0, vitaminC: 1, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'ms17', name: 'Roasted Chana', servingSize: '1 cup', calories: 190, protein: 11, carbs: 28, fat: 3, fiber: 8, sugar: 1, sodium: 280, potassium: 290, calcium: 60, iron: 2.8, vitaminA: 20, vitaminC: 1, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: true, postWorkout: false },
    { id: 'ms18', name: 'Sprouts Chaat', servingSize: '1 bowl', calories: 150, protein: 8, carbs: 24, fat: 2, fiber: 6, sugar: 3, sodium: 310, potassium: 320, calcium: 50, iron: 2.2, vitaminA: 140, vitaminC: 15, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: true, lowFat: true, postWorkout: false },
    { id: 'ms19', name: 'Greek Yogurt', servingSize: '150g', calories: 120, protein: 15, carbs: 6, fat: 4, fiber: 0, sugar: 4, sodium: 60, potassium: 210, calcium: 180, iron: 0.1, vitaminA: 40, vitaminC: 0, vitaminD: 1.5, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: false, highProtein: true, lowCal: true, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'ms20', name: 'Coconut Water', servingSize: '1 glass', calories: 45, protein: 1, carbs: 10, fat: 0.2, fiber: 1, sugar: 6, sodium: 250, potassium: 600, calcium: 60, iron: 0.4, vitaminA: 0, vitaminC: 6, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'ms21', name: 'Boiled Corn', servingSize: '1 cup', calories: 130, protein: 4, carbs: 28, fat: 1.5, fiber: 3.5, sugar: 5, sodium: 150, potassium: 240, calcium: 10, iron: 0.6, vitaminA: 180, vitaminC: 8, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'ms22', name: 'Makhana', servingSize: '30g', calories: 110, protein: 3, carbs: 22, fat: 0.5, fiber: 2, sugar: 0, sodium: 60, potassium: 110, calcium: 35, iron: 0.4, vitaminA: 10, vitaminC: 0, vitaminD: 0, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'ms23', name: 'Protein Bar', servingSize: '1 bar', calories: 220, protein: 20, carbs: 22, fat: 6, fiber: 5, sugar: 3, sodium: 180, potassium: 190, calcium: 90, iron: 1.5, vitaminA: 20, vitaminC: 0, vitaminD: 0.4, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: false, highProtein: true, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'ms24', name: 'Buttermilk', servingSize: '1 glass', calories: 60, protein: 3, carbs: 5, fat: 2, fiber: 0, sugar: 4, sodium: 220, potassium: 140, calcium: 110, iron: 0.1, vitaminA: 30, vitaminC: 1, vitaminD: 0.2, category: 'Morning Snack', vegetarian: true, nonVeg: false, vegan: false, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },

    // === LUNCH (20 items) ===
    { id: 'l1', name: 'White Rice', servingSize: '1 bowl', calories: 200, protein: 4, carbs: 44, fat: 0.4, fiber: 1, sugar: 0, sodium: 2, potassium: 35, calcium: 10, iron: 0.4, vitaminA: 0, vitaminC: 0, vitaminD: 0, category: 'Lunch', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'l2', name: 'Brown Rice', servingSize: '1 bowl', calories: 215, protein: 5, carbs: 45, fat: 1.6, fiber: 3.5, sugar: 0, sodium: 2, potassium: 85, calcium: 15, iron: 0.8, vitaminA: 0, vitaminC: 0, vitaminD: 0, category: 'Lunch', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'l3', name: 'Jeera Rice', servingSize: '1 bowl', calories: 240, protein: 4.5, carbs: 46, fat: 4, fiber: 1.5, sugar: 0.2, sodium: 280, potassium: 65, calcium: 20, iron: 0.9, vitaminA: 10, vitaminC: 0, vitaminD: 0, category: 'Lunch', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'l4', name: 'Tomato Rice', servingSize: '1 bowl', calories: 260, protein: 5, carbs: 48, fat: 5, fiber: 2, sugar: 2, sodium: 390, potassium: 140, calcium: 24, iron: 1.1, vitaminA: 120, vitaminC: 12, vitaminD: 0, category: 'Lunch', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'l5', name: 'Lemon Rice', servingSize: '1 bowl', calories: 250, protein: 4.5, carbs: 46, fat: 5.5, fiber: 1.8, sugar: 1, sodium: 340, potassium: 80, calcium: 18, iron: 1.0, vitaminA: 15, vitaminC: 15, vitaminD: 0, category: 'Lunch', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'l6', name: 'Sambar Rice', servingSize: '1 bowl', calories: 310, protein: 7, carbs: 58, fat: 4, fiber: 5, sugar: 2, sodium: 450, potassium: 240, calcium: 60, iron: 1.8, vitaminA: 90, vitaminC: 5, vitaminD: 0, category: 'Lunch', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'l7', name: 'Vegetable Pulao', servingSize: '1 bowl', calories: 320, protein: 6, carbs: 56, fat: 7, fiber: 4, sugar: 2, sodium: 390, potassium: 190, calcium: 40, iron: 1.5, vitaminA: 180, vitaminC: 8, vitaminD: 0, category: 'Lunch', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'l8', name: 'Vegetable Biryani', servingSize: '1 plate', calories: 380, protein: 8, carbs: 64, fat: 9, fiber: 5, sugar: 3, sodium: 580, potassium: 260, calcium: 60, iron: 2.1, vitaminA: 210, vitaminC: 10, vitaminD: 0, category: 'Lunch', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'l9', name: 'Chicken Biryani', servingSize: '1 plate', calories: 540, protein: 28, carbs: 68, fat: 15, fiber: 3, sugar: 2, sodium: 790, potassium: 420, calcium: 50, iron: 2.8, vitaminA: 140, vitaminC: 6, vitaminD: 0.5, category: 'Lunch', vegetarian: false, nonVeg: true, vegan: false, highProtein: true, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'l10', name: 'Egg Biryani', servingSize: '1 plate', calories: 440, protein: 18, carbs: 64, fat: 12, fiber: 3, sugar: 2, sodium: 680, potassium: 310, calcium: 70, iron: 2.4, vitaminA: 190, vitaminC: 5, vitaminD: 1.8, category: 'Lunch', vegetarian: false, nonVeg: true, vegan: false, highProtein: true, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'l11', name: 'Brown Rice with Dal & Vegetables', servingSize: '1 plate', calories: 380, protein: 12, carbs: 68, fat: 6, fiber: 9, sugar: 2, sodium: 420, potassium: 380, calcium: 80, iron: 2.8, vitaminA: 160, vitaminC: 8, vitaminD: 0, category: 'Lunch', vegetarian: true, nonVeg: false, vegan: true, highProtein: true, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'l12', name: 'Rajma Chawal', servingSize: '1 plate', calories: 450, protein: 14, carbs: 76, fat: 8, fiber: 11, sugar: 2, sodium: 540, potassium: 380, calcium: 80, iron: 3.2, vitaminA: 120, vitaminC: 5, vitaminD: 0, category: 'Lunch', vegetarian: true, nonVeg: false, vegan: true, highProtein: true, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'l13', name: 'Chole with Whole Wheat Roti', servingSize: '1 plate', calories: 420, protein: 13, carbs: 68, fat: 10, fiber: 10, sugar: 3, sodium: 580, potassium: 310, calcium: 90, iron: 3.0, vitaminA: 110, vitaminC: 6, vitaminD: 0, category: 'Lunch', vegetarian: true, nonVeg: false, vegan: true, highProtein: true, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'l14', name: 'Millet Khichdi', servingSize: '1 bowl', calories: 290, protein: 9, carbs: 50, fat: 5, fiber: 7, sugar: 1, sodium: 360, potassium: 280, calcium: 50, iron: 2.4, vitaminA: 110, vitaminC: 4, vitaminD: 0, category: 'Lunch', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'l15', name: 'Quinoa Vegetable Bowl', servingSize: '1 bowl', calories: 340, protein: 12, carbs: 54, fat: 8, fiber: 10, sugar: 3, sodium: 280, potassium: 420, calcium: 80, iron: 2.8, vitaminA: 210, vitaminC: 18, vitaminD: 0, category: 'Lunch', vegetarian: true, nonVeg: false, vegan: true, highProtein: true, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'l16', name: 'Fish Curry with Brown Rice', servingSize: '1 plate', calories: 480, protein: 28, carbs: 60, fat: 12, fiber: 4, sugar: 1, sodium: 690, potassium: 510, calcium: 60, iron: 2.1, vitaminA: 120, vitaminC: 6, vitaminD: 3.5, category: 'Lunch', vegetarian: false, nonVeg: true, vegan: false, highProtein: true, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'l17', name: 'Paneer Bhurji with Roti', servingSize: '1 plate', calories: 460, protein: 18, carbs: 48, fat: 20, fiber: 6, sugar: 3, sodium: 490, potassium: 280, calcium: 220, iron: 2.4, vitaminA: 240, vitaminC: 8, vitaminD: 1.0, category: 'Lunch', vegetarian: true, nonVeg: false, vegan: false, highProtein: true, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'l18', name: 'Chicken Curry', servingSize: '1 bowl', calories: 320, protein: 24, carbs: 8, fat: 20, fiber: 2, sugar: 1, sodium: 590, potassium: 310, calcium: 30, iron: 1.8, vitaminA: 80, vitaminC: 3, vitaminD: 0.5, category: 'Lunch', vegetarian: false, nonVeg: true, vegan: false, highProtein: true, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'l19', name: 'Dal Fry', servingSize: '1 bowl', calories: 190, protein: 9, carbs: 26, fat: 5, fiber: 6, sugar: 1, sodium: 410, potassium: 210, calcium: 40, iron: 1.8, vitaminA: 60, vitaminC: 2, vitaminD: 0, category: 'Lunch', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'l20', name: 'Mixed Vegetable Curry', servingSize: '1 bowl', calories: 160, protein: 4, carbs: 24, fat: 5, fiber: 6, sugar: 4, sodium: 380, potassium: 240, calcium: 60, iron: 1.4, vitaminA: 210, vitaminC: 15, vitaminD: 0, category: 'Lunch', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },

    // === EVENING SNACK (12 items) ===
    { id: 'es1', name: 'Fruit Salad', servingSize: '1 cup', calories: 90, protein: 1, carbs: 22, fat: 0.3, fiber: 3.5, sugar: 16, sodium: 2, potassium: 260, calcium: 20, iron: 0.4, vitaminA: 120, vitaminC: 45, vitaminD: 0, category: 'Evening Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'es2', name: 'Roasted Makhana', servingSize: '30g', calories: 120, protein: 3, carbs: 22, fat: 2, fiber: 2, sugar: 0, sodium: 120, potassium: 110, calcium: 35, iron: 0.4, vitaminA: 10, vitaminC: 0, vitaminD: 0, category: 'Evening Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'es3', name: 'Peanut Chaat', servingSize: '1 cup', calories: 210, protein: 9, carbs: 12, fat: 15, fiber: 4, sugar: 2, sodium: 310, potassium: 210, calcium: 40, iron: 1.1, vitaminA: 40, vitaminC: 6, vitaminD: 0, category: 'Evening Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'es4', name: 'Paneer Cubes', servingSize: '50g', calories: 160, protein: 9, carbs: 2, fat: 13, fiber: 0, sugar: 1, sodium: 180, potassium: 60, calcium: 240, iron: 0.1, vitaminA: 120, vitaminC: 0, vitaminD: 0.8, category: 'Evening Snack', vegetarian: true, nonVeg: false, vegan: false, highProtein: false, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'es5', name: 'Chickpea Salad', servingSize: '1 bowl', calories: 180, protein: 8, carbs: 28, fat: 4, fiber: 7, sugar: 3, sodium: 320, potassium: 260, calcium: 60, iron: 2.1, vitaminA: 90, vitaminC: 12, vitaminD: 0, category: 'Evening Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'es6', name: 'Corn Chaat', servingSize: '1 cup', calories: 140, protein: 4, carbs: 29, fat: 2, fiber: 4, sugar: 5, sodium: 220, potassium: 240, calcium: 10, iron: 0.6, vitaminA: 160, vitaminC: 10, vitaminD: 0, category: 'Evening Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },
    { id: 'es7', name: 'Protein Ladoo', servingSize: '1 pc', calories: 150, protein: 8, carbs: 14, fat: 7, fiber: 3, sugar: 6, sodium: 40, potassium: 150, calcium: 40, iron: 1.2, vitaminA: 10, vitaminC: 0, vitaminD: 0.2, category: 'Evening Snack', vegetarian: true, nonVeg: false, vegan: false, highProtein: false, lowCal: true, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'es8', name: 'Vegetable Sandwich', servingSize: '1 sandwich', calories: 220, protein: 6, carbs: 36, fat: 5, fiber: 5, sugar: 3, sodium: 390, potassium: 160, calcium: 60, iron: 1.5, vitaminA: 110, vitaminC: 8, vitaminD: 0, category: 'Evening Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'es9', name: 'Yogurt with Fruits', servingSize: '1 cup', calories: 160, protein: 8, carbs: 24, fat: 4, fiber: 3, sugar: 15, sodium: 75, potassium: 280, calcium: 190, iron: 0.4, vitaminA: 80, vitaminC: 14, vitaminD: 1.0, category: 'Evening Snack', vegetarian: true, nonVeg: false, vegan: false, highProtein: false, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'es10', name: 'Boiled Eggs', servingSize: '2 eggs', calories: 155, protein: 13, carbs: 1, fat: 11, fiber: 0, sugar: 0, sodium: 124, potassium: 126, calcium: 50, iron: 1.2, vitaminA: 160, vitaminC: 0, vitaminD: 2.0, category: 'Evening Snack', vegetarian: false, nonVeg: true, vegan: false, highProtein: true, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'es11', name: 'Peanut Butter Sandwich', servingSize: '1 sandwich', calories: 280, protein: 10, carbs: 32, fat: 12, fiber: 4, sugar: 4, sodium: 310, potassium: 210, calcium: 35, iron: 1.2, vitaminA: 0, vitaminC: 0, vitaminD: 0, category: 'Evening Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'es12', name: 'Sweet Potato', servingSize: '150g boiled', calories: 130, protein: 2, carbs: 30, fat: 0.2, fiber: 4, sugar: 6, sodium: 80, potassium: 450, calcium: 40, iron: 0.8, vitaminA: 1400, vitaminC: 30, vitaminD: 0, category: 'Evening Snack', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: true, lowFat: true, postWorkout: false },

    // === DINNER (14 items) ===
    { id: 'd1', name: 'Grilled Fish with Vegetables', servingSize: '150g fish + veg', calories: 320, protein: 28, carbs: 12, fat: 16, fiber: 4, sugar: 2, sodium: 480, potassium: 560, calcium: 80, iron: 1.8, vitaminA: 180, vitaminC: 22, vitaminD: 4.0, category: 'Dinner', vegetarian: false, nonVeg: true, vegan: false, highProtein: true, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'd2', name: 'Palak Paneer with Roti', servingSize: '1 plate', calories: 440, protein: 16, carbs: 46, fat: 20, fiber: 7, sugar: 3, sodium: 520, potassium: 340, calcium: 280, iron: 3.2, vitaminA: 420, vitaminC: 12, vitaminD: 0.8, category: 'Dinner', vegetarian: true, nonVeg: false, vegan: false, highProtein: true, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'd3', name: 'Vegetable Soup', servingSize: '1 bowl', calories: 120, protein: 3, carbs: 22, fat: 2, fiber: 5, sugar: 4, sodium: 580, potassium: 280, calcium: 40, iron: 1.2, vitaminA: 260, vitaminC: 18, vitaminD: 0, category: 'Dinner', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: true, lowFat: true, postWorkout: false },
    { id: 'd4', name: 'Chicken Salad', servingSize: '1 bowl', calories: 290, protein: 26, carbs: 10, fat: 15, fiber: 4, sugar: 3, sodium: 450, potassium: 380, calcium: 50, iron: 1.6, vitaminA: 140, vitaminC: 12, vitaminD: 0.5, category: 'Dinner', vegetarian: false, nonVeg: true, vegan: false, highProtein: true, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'd5', name: 'Mixed Vegetable Curry with Millet Roti', servingSize: '1 plate', calories: 360, protein: 9, carbs: 58, fat: 9, fiber: 8, sugar: 4, sodium: 410, potassium: 290, calcium: 70, iron: 2.5, vitaminA: 210, vitaminC: 14, vitaminD: 0, category: 'Dinner', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'd6', name: 'Tofu Stir Fry', servingSize: '1 bowl', calories: 240, protein: 14, carbs: 18, fat: 12, fiber: 5, sugar: 2, sodium: 380, potassium: 280, calcium: 140, iron: 2.2, vitaminA: 120, vitaminC: 10, vitaminD: 0, category: 'Dinner', vegetarian: true, nonVeg: false, vegan: true, highProtein: true, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'd7', name: 'Moong Dal Khichdi', servingSize: '1 bowl', calories: 280, protein: 10, carbs: 50, fat: 4, fiber: 8, sugar: 1, sodium: 320, potassium: 280, calcium: 40, iron: 2.1, vitaminA: 70, vitaminC: 3, vitaminD: 0, category: 'Dinner', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: true, postWorkout: false },
    { id: 'd8', name: 'Quinoa Salad', servingSize: '1 bowl', calories: 260, protein: 8, carbs: 38, fat: 8, fiber: 7, sugar: 2, sodium: 210, potassium: 310, calcium: 50, iron: 2.0, vitaminA: 160, vitaminC: 14, vitaminD: 0, category: 'Dinner', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'd9', name: 'Egg Bhurji with Roti', servingSize: '1 plate', calories: 390, protein: 18, carbs: 42, fat: 16, fiber: 5, sugar: 2, sodium: 480, potassium: 280, calcium: 80, iron: 2.6, vitaminA: 190, vitaminC: 5, vitaminD: 1.5, category: 'Dinner', vegetarian: false, nonVeg: true, vegan: false, highProtein: true, lowCal: false, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'd10', name: 'Dal Soup', servingSize: '1 bowl', calories: 160, protein: 9, carbs: 26, fat: 2, fiber: 6, sugar: 1, sodium: 390, potassium: 240, calcium: 30, iron: 1.8, vitaminA: 60, vitaminC: 2, vitaminD: 0, category: 'Dinner', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: true, postWorkout: false },
    { id: 'd11', name: 'Chapati', servingSize: '2 pcs', calories: 170, protein: 5.5, carbs: 35, fat: 1.5, fiber: 4, sugar: 0, sodium: 160, potassium: 140, calcium: 25, iron: 1.6, vitaminA: 0, vitaminC: 0, vitaminD: 0, category: 'Dinner', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: false, highFiber: true, lowFat: true, postWorkout: false },
    { id: 'd12', name: 'Vegetable Stir Fry', servingSize: '1 bowl', calories: 140, protein: 4, carbs: 20, fat: 6, fiber: 5, sugar: 3, sodium: 320, potassium: 250, calcium: 55, iron: 1.2, vitaminA: 190, vitaminC: 25, vitaminD: 0, category: 'Dinner', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: true, lowFat: false, postWorkout: false },
    { id: 'd13', name: 'Chicken Soup', servingSize: '1 bowl', calories: 180, protein: 18, carbs: 10, fat: 7, fiber: 1.5, sugar: 1.2, sodium: 580, potassium: 280, calcium: 30, iron: 1.2, vitaminA: 110, vitaminC: 4, vitaminD: 0.2, category: 'Dinner', vegetarian: false, nonVeg: true, vegan: false, highProtein: true, lowCal: false, highFiber: false, lowFat: false, postWorkout: false },
    { id: 'd14', name: 'Tomato Soup', servingSize: '1 bowl', calories: 110, protein: 2.5, carbs: 18, fat: 3, fiber: 2, sugar: 5, sodium: 490, potassium: 210, calcium: 20, iron: 0.7, vitaminA: 160, vitaminC: 15, vitaminD: 0, category: 'Dinner', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: false, lowFat: true, postWorkout: false },

    // === POST WORKOUT (12 items) ===
    { id: 'pw1', name: 'Whey Protein Shake', servingSize: '1 scoop', calories: 140, protein: 25, carbs: 3, fat: 2, fiber: 0, sugar: 1, sodium: 90, potassium: 180, calcium: 120, iron: 0.2, vitaminA: 0, vitaminC: 0, vitaminD: 0, category: 'Post Workout', vegetarian: true, nonVeg: false, vegan: false, highProtein: true, lowCal: true, highFiber: false, lowFat: true, postWorkout: true },
    { id: 'pw2', name: 'Banana Protein Shake', servingSize: '1 shake', calories: 260, protein: 27, carbs: 32, fat: 3, fiber: 4, sugar: 15, sodium: 110, potassium: 610, calcium: 140, iron: 0.5, vitaminA: 60, vitaminC: 10, vitaminD: 0.5, category: 'Post Workout', vegetarian: true, nonVeg: false, vegan: false, highProtein: true, lowCal: false, highFiber: true, lowFat: true, postWorkout: true },
    { id: 'pw3', name: 'Chocolate Protein Smoothie', servingSize: '1 glass', calories: 320, protein: 30, carbs: 36, fat: 6, fiber: 6, sugar: 10, sodium: 190, potassium: 480, calcium: 150, iron: 2.1, vitaminA: 80, vitaminC: 2, vitaminD: 1.0, category: 'Post Workout', vegetarian: true, nonVeg: false, vegan: false, highProtein: true, lowCal: false, highFiber: true, lowFat: false, postWorkout: true },
    { id: 'pw4', name: 'Greek Yogurt with Fruits', servingSize: '1 bowl', calories: 210, protein: 18, carbs: 28, fat: 3.5, fiber: 4, sugar: 18, sodium: 75, potassium: 310, calcium: 210, iron: 0.8, vitaminA: 120, vitaminC: 24, vitaminD: 1.5, category: 'Post Workout', vegetarian: true, nonVeg: false, vegan: false, highProtein: true, lowCal: false, highFiber: true, lowFat: false, postWorkout: true },
    { id: 'pw5', name: 'Protein Oats', servingSize: '1 bowl', calories: 310, protein: 22, carbs: 42, fat: 6, fiber: 8, sugar: 4, sodium: 120, potassium: 290, calcium: 80, iron: 2.1, vitaminA: 30, vitaminC: 1, vitaminD: 0.5, category: 'Post Workout', vegetarian: true, nonVeg: false, vegan: false, highProtein: true, lowCal: false, highFiber: true, lowFat: false, postWorkout: true },
    { id: 'pw6', name: 'Boiled Eggs', servingSize: '3 eggs', calories: 225, protein: 19.5, carbs: 1.5, fat: 15, fiber: 0, sugar: 0, sodium: 180, potassium: 185, calcium: 75, iron: 1.8, vitaminA: 240, vitaminC: 0, vitaminD: 3.0, category: 'Post Workout', vegetarian: false, nonVeg: true, vegan: false, highProtein: true, lowCal: false, highFiber: false, lowFat: false, postWorkout: true },
    { id: 'pw7', name: 'Grilled Chicken Breast', servingSize: '150g', calories: 250, protein: 38, carbs: 0, fat: 9, fiber: 0, sugar: 0, sodium: 420, potassium: 380, calcium: 20, iron: 1.5, vitaminA: 30, vitaminC: 0, vitaminD: 0, category: 'Post Workout', vegetarian: false, nonVeg: true, vegan: false, highProtein: true, lowCal: false, highFiber: false, lowFat: false, postWorkout: true },
    { id: 'pw8', name: 'Paneer Salad', servingSize: '1 bowl', calories: 290, protein: 16, carbs: 12, fat: 18, fiber: 4, sugar: 3, sodium: 380, potassium: 220, calcium: 310, iron: 1.2, vitaminA: 180, vitaminC: 12, vitaminD: 0.8, category: 'Post Workout', vegetarian: true, nonVeg: false, vegan: false, highProtein: true, lowCal: false, highFiber: true, lowFat: false, postWorkout: true },
    { id: 'pw9', name: 'Moong Sprouts', servingSize: '1 bowl', calories: 120, protein: 7, carbs: 22, fat: 0.5, fiber: 6, sugar: 2, sodium: 180, potassium: 260, calcium: 40, iron: 1.8, vitaminA: 90, vitaminC: 10, vitaminD: 0, category: 'Post Workout', vegetarian: true, nonVeg: false, vegan: true, highProtein: false, lowCal: true, highFiber: true, lowFat: true, postWorkout: true },
    { id: 'pw10', name: 'Cottage Cheese Bowl', servingSize: '1 bowl', calories: 220, protein: 24, carbs: 12, fat: 8, fiber: 2, sugar: 8, sodium: 680, potassium: 180, calcium: 140, iron: 0.6, vitaminA: 120, vitaminC: 4, vitaminD: 1.2, category: 'Post Workout', vegetarian: true, nonVeg: false, vegan: false, highProtein: true, lowCal: false, highFiber: false, lowFat: false, postWorkout: true },
    { id: 'pw11', name: 'Egg Whites', servingSize: '5 eggs whites', calories: 90, protein: 20, carbs: 1, fat: 0.2, fiber: 0, sugar: 0, sodium: 280, potassium: 240, calcium: 20, iron: 0.2, vitaminA: 0, vitaminC: 0, vitaminD: 0, category: 'Post Workout', vegetarian: false, nonVeg: true, vegan: false, highProtein: true, lowCal: true, highFiber: false, lowFat: true, postWorkout: true },
    { id: 'pw12', name: 'Protein Pancakes', servingSize: '2 small pcs', calories: 280, protein: 18, carbs: 32, fat: 8, fiber: 3, sugar: 6, sodium: 340, potassium: 190, calcium: 80, iron: 1.4, vitaminA: 40, vitaminC: 1, vitaminD: 0.5, category: 'Post Workout', vegetarian: true, nonVeg: false, vegan: false, highProtein: true, lowCal: false, highFiber: false, lowFat: false, postWorkout: true }
  ];
}

export function readNutritionState(): NutritionState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState;
    const parsed = JSON.parse(stored);
    
    // Sync current day entries from history if we load on a new day
    const today = new Date().toISOString().slice(0, 10);
    const history = parsed.history ?? {};
    
    let entries = parsed.entries ?? [];
    let water = parsed.water ?? 0;
    let weight = parsed.weight ?? 70;
    let bodyFat = parsed.bodyFat ?? 18;
    let waist = parsed.waist ?? 32;
    let chest = parsed.chest ?? 38;
    let hip = parsed.hip ?? 36;
    let neck = parsed.neck ?? 14;
    let leanBodyMass = parsed.leanBodyMass ?? 57.4;
    let caloriesBurned = parsed.caloriesBurned ?? 0;
    let workoutMinutes = parsed.workoutMinutes ?? 0;
    let steps = parsed.steps ?? 0;
    let sleepHours = parsed.sleepHours ?? 8;
    let mood = parsed.mood ?? 'Energetic';
    let energy = parsed.energy ?? 'High';

    if (history[today]) {
      entries = history[today].entries ?? [];
      water = history[today].water ?? 0;
      weight = history[today].weight ?? weight;
      bodyFat = history[today].bodyFat ?? bodyFat;
      waist = history[today].waist ?? waist;
      chest = history[today].chest ?? chest;
      hip = history[today].hip ?? hip;
      neck = history[today].neck ?? neck;
      leanBodyMass = history[today].leanBodyMass ?? leanBodyMass;
      caloriesBurned = history[today].caloriesBurned ?? caloriesBurned;
      workoutMinutes = history[today].workoutMinutes ?? 0;
      steps = history[today].steps ?? 0;
      sleepHours = history[today].sleepHours ?? 8;
      mood = history[today].mood ?? 'Energetic';
      energy = history[today].energy ?? 'High';
    }

    return {
      ...defaultState,
      ...parsed,
      entries,
      water,
      weight,
      bodyFat,
      waist,
      chest,
      hip,
      neck,
      leanBodyMass,
      caloriesBurned,
      workoutMinutes,
      steps,
      sleepHours,
      mood,
      energy,
      history,
      customFoods: parsed.customFoods ?? [],
      streakCount: parsed.streakCount ?? 0,
      longestStreak: parsed.longestStreak ?? 0,
      lastStreakUpdateDate: parsed.lastStreakUpdateDate ?? '',
      workoutDays: parsed.workoutDays ?? defaultState.workoutDays,
      reminders: parsed.reminders ?? defaultState.reminders,
    };
  } catch {
    return defaultState;
  }
}

export function saveNutritionState(state: NutritionState) {
  if (typeof window === 'undefined') return;
  const today = new Date().toISOString().slice(0, 10);
  
  const updatedHistory = {
    ...state.history,
    [today]: {
      entries: state.entries,
      water: state.water,
      weight: state.weight,
      bodyFat: state.bodyFat,
      waist: state.waist,
      chest: state.chest,
      hip: state.hip,
      neck: state.neck,
      leanBodyMass: state.leanBodyMass,
      caloriesBurned: state.caloriesBurned,
      workoutMinutes: state.workoutMinutes,
      steps: state.steps,
      sleepHours: state.sleepHours,
      mood: state.mood,
      energy: state.energy,
    }
  };

  const stateToStore = {
    ...state,
    history: updatedHistory
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
}

export function getTodayEntries(entries: NutritionEntry[]) {
  return entries;
}

export function getTotals(entries: NutritionEntry[]): DailyNutritionTotals {
  return entries.reduce<DailyNutritionTotals>((acc, entry) => ({
    calories: acc.calories + entry.calories,
    protein: acc.protein + entry.protein,
    carbs: acc.carbs + entry.carbs,
    fat: acc.fat + entry.fat,
    fiber: acc.fiber + (entry.fiber || 0),
    sugar: acc.sugar + (entry.sugar || 0),
    sodium: acc.sodium + (entry.sodium || 0),
    potassium: acc.potassium + (entry.potassium || 0),
    calcium: acc.calcium + (entry.calcium || 0),
    iron: acc.iron + (entry.iron || 0),
    vitaminA: acc.vitaminA + (entry.vitaminA || 0),
    vitaminC: acc.vitaminC + (entry.vitaminC || 0),
    vitaminD: acc.vitaminD + (entry.vitaminD || 0),
  }), {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    potassium: 0,
    calcium: 0,
    iron: 0,
    vitaminA: 0,
    vitaminC: 0,
    vitaminD: 0,
  });
}

export function getRemainingMetrics(totals: DailyNutritionTotals, goal: GoalMetrics, water: number) {
  return {
    caloriesRemaining: Math.max(goal.targetCalories - totals.calories, 0),
    proteinRemaining: Math.max(goal.protein - totals.protein, 0),
    carbsRemaining: Math.max(goal.carbs - totals.carbs, 0),
    fatRemaining: Math.max(goal.fat - totals.fat, 0),
    fiberRemaining: Math.max(goal.fiber - totals.fiber, 0),
    waterRemaining: Math.max(goal.water - water, 0),
  };
}

export function getConsistencyScore(state: NutritionState, totals: DailyNutritionTotals, goal: GoalMetrics) {
  const loggedMealsCount = new Set(state.entries.map(e => e.mealType)).size;
  const mealScore = Math.min(100, Math.round((loggedMealsCount / 4) * 100)); // target at least 4 logged categories

  const workoutScore = Math.min(100, Math.round((state.workoutMinutes / 30) * 100));
  const waterScore = Math.min(100, Math.round((state.water / (goal.water || 2.5)) * 100));
  const sleepScore = state.sleepHours >= 7 && state.sleepHours <= 9 ? 100 : Math.min(100, Math.round((state.sleepHours / 8) * 100));
  const weightScore = state.weight > 0 ? 100 : 0;

  const pDiff = Math.abs(totals.protein - goal.protein) / (goal.protein || 1);
  const cDiff = Math.abs(totals.carbs - goal.carbs) / (goal.carbs || 1);
  const fDiff = Math.abs(totals.fat - goal.fat) / (goal.fat || 1);
  const macroScore = Math.max(0, Math.round(100 - (pDiff + cDiff + fDiff) * 33));

  const average = Math.round((mealScore + workoutScore + waterScore + sleepScore + weightScore + macroScore) / 6);
  
  let label: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement' = 'Needs Improvement';
  if (average >= 85) label = 'Excellent';
  else if (average >= 70) label = 'Good';
  else if (average >= 50) label = 'Average';

  return {
    score: average,
    label,
    breakdown: {
      mealScore,
      workoutScore,
      waterScore,
      sleepScore,
      weightScore,
      nutritionScore: macroScore
    }
  };
}

export function getAiRecommendation(totals: DailyNutritionTotals, goal: GoalMetrics, state: NutritionState) {
  const suggestions: Array<{ title: string; detail: string; action: string }> = [];

  if (totals.calories < goal.targetCalories * 0.85) {
    suggestions.push({ title: 'Increase Calories', detail: 'You are below your energy target.', action: 'Add a clean meal like Pesarattu or Protein Oats to bridge the gap.' });
  } else if (totals.calories > goal.targetCalories * 1.15) {
    suggestions.push({ title: 'Energy Excess', detail: 'You exceeded your daily calorie target.', action: 'Focus on high-fiber salads or soups for the rest of today.' });
  }

  if (totals.protein < goal.protein * 0.8) {
    suggestions.push({ title: 'Increase Protein', detail: 'Sufficient protein supports muscle repair.', action: 'Log a Whey Protein Shake or some Paneer Cubes post workout.' });
  }

  if (state.water < goal.water * 0.8) {
    suggestions.push({ title: 'Hydration Target', detail: 'Hydration keeps cognitive functions high.', action: 'Hydrate now with a full glass of water or coconut water.' });
  }

  if (state.workoutMinutes === 0) {
    suggestions.push({ title: 'Activity Alert', detail: 'No physical activity logged.', action: 'Aim for a 20-minute brisk walk or quick bodyweight routine.' });
  }

  if (suggestions.length === 0) {
    suggestions.push({ title: 'Flawless Balance!', detail: 'Your macros, workout, and water are completely optimized.', action: 'Keep up this fantastic streak!' });
  }

  return suggestions.slice(0, 3);
}

export function buildWeeklyTrend(history: Record<string, DayLog>) {
  const trend = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const log = history[key];
    const calories = log ? log.entries.reduce((sum, e) => sum + e.calories, 0) : 0;
    trend.push({
      day: daysOfWeek[d.getDay()],
      date: key,
      calories,
    });
  }
  return trend;
}

export function buildWeeklyProteinTrend(history: Record<string, DayLog>) {
  const trend = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const log = history[key];
    const protein = log ? log.entries.reduce((sum, e) => sum + e.protein, 0) : 0;
    trend.push({
      day: daysOfWeek[d.getDay()],
      date: key,
      protein,
    });
  }
  return trend;
}

export function buildWeeklyWaterTrend(history: Record<string, DayLog>) {
  const trend = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const log = history[key];
    const water = log ? log.water : 0;
    trend.push({
      day: daysOfWeek[d.getDay()],
      date: key,
      water,
    });
  }
  return trend;
}

export function buildMonthlyTrend(history: Record<string, DayLog>) {
  const trend = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const log = history[key];
    const calories = log ? log.entries.reduce((sum, e) => sum + e.calories, 0) : 0;
    const water = log ? log.water : 0;
    const weight = log ? log.weight : 70;
    trend.push({
      day: d.getDate().toString(),
      date: key,
      calories,
      water,
      weight,
    });
  }
  return trend;
}

export interface Badge {
  id: string;
  name: string;
  days: number;
  unlocked: boolean;
  description: string;
}

export function getStreakBadges(streakCount: number): Badge[] {
  return [
    { id: '7-days', name: '7 Days Streak', days: 7, description: 'Log consistently for a full week', unlocked: streakCount >= 7 },
    { id: '15-days', name: '15 Days Streak', days: 15, description: 'Halfway to building a powerful routine', unlocked: streakCount >= 15 },
    { id: '30-days', name: '30 Days Streak', days: 30, description: 'A solid month of dedication and growth', unlocked: streakCount >= 30 },
    { id: '50-days', name: '50 Days Streak', days: 50, description: 'Fifty days of active healthy living', unlocked: streakCount >= 50 },
    { id: '100-days', name: '100 Days Streak', days: 100, description: 'Legendary fitness consistency achieved', unlocked: streakCount >= 100 },
  ];
}

export function verifyAndIncrementStreak(state: NutritionState): { current: number; longest: number; updated: boolean } {
  const todayStr = new Date().toISOString().slice(0, 10);
  if (state.lastStreakUpdateDate === todayStr) {
    return { current: state.streakCount, longest: state.longestStreak, updated: false };
  }

  const hasMeals = state.entries.length > 0;
  const hasWater = state.water > 0;
  const hasWorkout = state.workoutMinutes > 0;
  const isValidToday = hasMeals || hasWater || hasWorkout;

  if (!isValidToday) {
    return { current: state.streakCount, longest: state.longestStreak, updated: false };
  }

  let nextStreak = state.streakCount;
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (state.lastStreakUpdateDate === yesterdayStr) {
    nextStreak += 1;
  } else if (state.lastStreakUpdateDate === '') {
    nextStreak = 1;
  } else {
    nextStreak = 1;
  }

  const nextLongest = Math.max(state.longestStreak, nextStreak);

  return {
    current: nextStreak,
    longest: nextLongest,
    updated: true
  };
}
