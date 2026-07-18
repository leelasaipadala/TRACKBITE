import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Apple, 
  Plus, 
  Search, 
  Star, 
  PlusCircle,
  Brain,
  Sliders,
  FileText,
  Dumbbell,
  Zap,
  Award,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import TrackBiteLogo from '../components/TrackBiteLogo';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useGoal } from '../context/GoalContext';
import api from '../services/api';
import { 
  readNutritionState, 
  saveNutritionState, 
  getTotals, 
  getRemainingMetrics, 
  getConsistencyScore, 
  getStarterFoods,
  type MealType, 
  type NutritionEntry, 
  type NutritionState,
  type FoodOption
} from '../services/nutritionTracking';

// Exercises Database
const WITHOUT_EQUIP_EXERCISES = [
  { name: 'Push Ups', muscle: 'Chest / Triceps', sets: 4, reps: '15 reps', rest: '45s', difficulty: 'Medium', burn: 40 },
  { name: 'Squats', muscle: 'Quads / Glutes', sets: 4, reps: '20 reps', rest: '60s', difficulty: 'Easy', burn: 45 },
  { name: 'Lunges', muscle: 'Quads / Hamstrings', sets: 3, reps: '12 per leg', rest: '45s', difficulty: 'Medium', burn: 35 },
  { name: 'Burpees', muscle: 'Full Body Cardiorespiratory', sets: 3, reps: '10 reps', rest: '90s', difficulty: 'Hard', burn: 70 },
  { name: 'Mountain Climbers', muscle: 'Core / Shoulders', sets: 4, reps: '40 reps', rest: '30s', difficulty: 'Medium', burn: 38 },
  { name: 'Jump Squats', muscle: 'Leg Plyometrics', sets: 3, reps: '15 reps', rest: '60s', difficulty: 'Hard', burn: 60 },
  { name: 'Plank', muscle: 'Core Stabilizers', sets: 3, reps: '60s hold', rest: '45s', difficulty: 'Medium', burn: 25 },
  { name: 'High Knees', muscle: 'Cardiovascular HIIT', sets: 3, reps: '45s run', rest: '45s', difficulty: 'Medium', burn: 35 },
  { name: 'Leg Raises', muscle: 'Lower Rectus Abdominis', sets: 3, reps: '15 reps', rest: '45s', difficulty: 'Medium', burn: 18 },
  { name: 'Russian Twists', muscle: 'Internal & External Obliques', sets: 3, reps: '30 reps', rest: '45s', difficulty: 'Easy', burn: 20 }
];

const WITH_EQUIP_EXERCISES = [
  { name: 'Band Chest Press', equipment: 'Resistance Bands', muscle: 'Pectorals', sets: 4, reps: '15 reps', rest: '45s', difficulty: 'Easy', burn: 35 },
  { name: 'Dumbbell Bent Over Rows', equipment: 'Dumbbells', muscle: 'Latissimus Dorsi', sets: 4, reps: '10 reps', rest: '60s', difficulty: 'Medium', burn: 48 },
  { name: 'Goblet Squat', equipment: 'Dumbbells / Kettlebell', muscle: 'Quadriceps', sets: 4, reps: '12 reps', rest: '60s', difficulty: 'Medium', burn: 55 },
  { name: 'Dumbbell Curl to Shoulder Press', equipment: 'Dumbbells', muscle: 'Biceps / Deltoids', sets: 3, reps: '10 reps', rest: '60s', difficulty: 'Medium', burn: 42 },
  { name: 'Resistance Band Rows', equipment: 'Resistance Bands', muscle: 'Rhomboids', sets: 4, reps: '15 reps', rest: '45s', difficulty: 'Easy', burn: 30 },
  { name: 'Kettlebell Swing', equipment: 'Kettlebell', muscle: 'Glute-Hamstring Chain', sets: 3, reps: '15 reps', rest: '60s', difficulty: 'Hard', burn: 65 },
  { name: 'Double Unders', equipment: 'Skipping Rope', muscle: 'Calves / Endurance', sets: 3, reps: '50 reps', rest: '45s', difficulty: 'Hard', burn: 80 },
  { name: 'Chin Ups', equipment: 'Pull-up Bar', muscle: 'Biceps / Back', sets: 3, reps: '8 reps', rest: '90s', difficulty: 'Hard', burn: 50 },
  { name: 'TRX Suspended Plank', equipment: 'TRX Bands', muscle: 'Core stabilizer', sets: 3, reps: '45s hold', rest: '45s', difficulty: 'Hard', burn: 32 },
  { name: 'Medicine Ball Slams', equipment: 'Medicine Ball', muscle: 'Core / Shoulders', sets: 3, reps: '12 reps', rest: '45s', difficulty: 'Medium', burn: 38 }
];

const GYM_ROUTINE_EXERCISES = [
  { name: 'Incline Bench Press', equipment: 'Barbell / Incline Bench', muscle: 'Upper Chest', sets: 4, reps: '8-10 reps', weight: 'Recommended: 60-70% 1RM' },
  { name: 'Lat Pulldowns', equipment: 'Cable Machine', muscle: 'Lats & Rhomboids', sets: 4, reps: '10-12 reps', weight: 'Recommended: Moderate weight' },
  { name: 'Barbell Back Squats', equipment: 'Squat Rack & Barbell', muscle: 'Quads & Glutes', sets: 4, reps: '6-8 reps', weight: 'Recommended: Heavy compound' },
  { name: 'Dumbbell Shoulder Press', equipment: 'Dumbbells & Bench', muscle: 'Deltoids', sets: 3, reps: '10 reps', weight: 'Recommended: Moderate compound' },
  { name: 'Cable Tricep Pushdowns', equipment: 'Cable Machine', muscle: 'Triceps Lat', sets: 3, reps: '12-15 reps', weight: 'Recommended: Light-moderate control' },
  { name: 'Incline Dumbbell Curls', equipment: 'Dumbbells & Incline Bench', muscle: 'Bicep Peak', sets: 3, reps: '12 reps', weight: 'Recommended: Isolated contraction' },
  { name: 'Hanging Leg Raises', equipment: 'Captain\'s Chair / Pullup Bar', muscle: 'Abs & Core', sets: 3, reps: '15 reps', weight: 'Recommended: Bodyweight controlled' },
  { name: 'Treadmill Incline Walk', equipment: 'Treadmill', muscle: 'Cardiovascular LISS', sets: 1, reps: '20 mins', weight: 'Incline: 8% | Speed: 5.5 km/h' }
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { goal, calculations, weightLogs, logWeightProgress } = useGoal();
  const [state, setState] = useState<NutritionState>(() => readNutritionState());
  const [activeTab, setActiveTab] = useState<'today' | 'log' | 'nutrition' | 'progress' | 'workouts' | 'coach'>('today');

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<MealType>('Breakfast');
  const [calorieFilter, setCalorieFilter] = useState<number>(650);
  const [proteinFilter, setProteinFilter] = useState<number>(0);
  const carbsFilter = 100;
  const fatFilter = 50;

  // Preference Filters
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg' | 'vegan'>('all');
  const [tagFilters, setTagFilters] = useState<Record<string, boolean>>({
    highProtein: false,
    lowCal: false,
    highFiber: false,
    lowFat: false,
    postWorkout: false
  });

  const [selectedSort, setSelectedSort] = useState<string>('highest-protein');
  const [favoriteFoodsList, setFavoriteFoodsList] = useState<string[]>([]);
  const [recentFoodsList, setRecentFoodsList] = useState<string[]>([]);

  const handleFoodFavoriteToggle = (foodId: string) => {
    setFavoriteFoodsList(prev => {
      if (prev.includes(foodId)) {
        return prev.filter(id => id !== foodId);
      } else {
        return [...prev, foodId];
      }
    });
    showToast('Updated favorites list!', 'success');
  };

  // Modals / forms
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [showManualLogModal, setShowManualLogModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState<FoodOption | null>(null);

  // Custom Food Form
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState(250);
  const [customProtein, setCustomProtein] = useState(15);
  const [customCarbs, setCustomCarbs] = useState(30);
  const [customFat, setCustomFat] = useState(8);
  const [customFiber, setCustomFiber] = useState(4);

  // Manual Log Full Form
  const [manualName, setManualName] = useState('');
  const [manualMealType, setManualMealType] = useState<MealType>('Breakfast');
  const [manualCalories, setManualCalories] = useState(300);
  const [manualProtein, setManualProtein] = useState(20);
  const [manualCarbs, setManualCarbs] = useState(35);
  const [manualFat, setManualFat] = useState(10);
  const [manualFiber, setManualFiber] = useState(5);
  const [manualSugar, setManualSugar] = useState(5);
  const [manualSodium, setManualSodium] = useState(120);

  // Progress Redesign Logging
  const [progressWeight, setProgressWeight] = useState('');
  const [progressWaist, setProgressWaist] = useState('');
  const [progressNeck, setProgressNeck] = useState('');
  const [progressHip, setProgressHip] = useState('');
  const [progressChest, setProgressChest] = useState('');
  const [progressSleepHours, setProgressSleepHours] = useState('');
  const [progressSteps, setProgressSteps] = useState('');
  const [progressWorkoutMinutes, setProgressWorkoutMinutes] = useState('');
  const [progressRange, setProgressRange] = useState<'weekly' | 'monthly'>('weekly');

  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' | 'error' }[]>([]);

  // Random quote
  const quote = useMemo(() => {
    const day = new Date().getDate();
    return MOTIVATIONAL_QUOTES[day % MOTIVATIONAL_QUOTES.length];
  }, []);

  // Sync state changes locally
  useEffect(() => {
    saveNutritionState(state);
  }, [state]);

  const updateDailyMetric = async (updates: Partial<NutritionState>) => {
    try {
      const todayDate = new Date().toISOString().slice(0, 10);
      await api.post(`/progress/daily/${todayDate}`, updates);
    } catch (err) {
      console.warn('Failed to save daily metric to database.', err);
    }
  };

  const fetchDailyLogs = async () => {
    if (!user) return;
    try {
      const todayDate = new Date().toISOString().slice(0, 10);
      const [dailyLogRes, mealsRes] = await Promise.all([
        api.get(`/progress/daily/${todayDate}`),
        api.get(`/meals?date=${todayDate}`)
      ]);
      
      const dailyLog = dailyLogRes.data;
      const meals = mealsRes.data;
      
      setState(prev => {
        const merged = {
          ...prev,
          water: dailyLog.water ?? prev.water,
          weight: dailyLog.weight ?? prev.weight,
          sleepHours: dailyLog.sleepHours ?? prev.sleepHours,
          workoutMinutes: dailyLog.workoutMinutes ?? prev.workoutMinutes,
          steps: dailyLog.steps ?? prev.steps,
          mood: dailyLog.mood ?? prev.mood,
          energy: dailyLog.energy ?? prev.energy,
          entries: meals && meals.length > 0 ? meals.map((m: any) => ({
            id: m._id,
            mealType: m.mealType,
            name: m.name,
            servingSize: m.servingSize || '1 serving',
            calories: m.calories,
            protein: m.protein,
            carbs: m.carbs,
            fat: m.fat,
            fiber: m.fiber || 0,
            sugar: m.sugar || 0,
            sodium: m.sodium || 0,
            potassium: m.potassium || 0,
            calcium: m.calcium || 0,
            iron: m.iron || 0,
            vitaminA: m.vitaminA || 0,
            vitaminC: m.vitaminC || 0,
            vitaminD: m.vitaminD || 0,
            favorite: m.favorite || false,
            createdAt: m.createdAt
          })) : prev.entries
        };
        saveNutritionState(merged);
        return merged;
      });
    } catch (err) {
      console.warn('Failed to fetch daily logs from backend, using local state.', err);
    }
  };

  // Synchronize state when custom event is fired from other pages
  useEffect(() => {
    fetchDailyLogs();
    const handleSync = () => {
      setState(readNutritionState());
      fetchDailyLogs();
    };
    window.addEventListener('nutrition-update', handleSync);
    return () => window.removeEventListener('nutrition-update', handleSync);
  }, [user]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Math totals
  const totals = useMemo(() => getTotals(state.entries), [state.entries]);
  
  // Directly bind targets to context assessment calculations
  const targetGoal = useMemo(() => ({
    targetCalories: goal?.targetCalories || calculations.dailyCalories,
    protein: goal?.protein || calculations.protein,
    carbs: goal?.carbs || calculations.carbs,
    fat: goal?.fat || calculations.fat,
    fiber: goal?.metrics?.fiber || calculations.fiber,
    water: goal?.waterIntake || calculations.waterIntake,
  }), [goal, calculations]);

  const remaining = useMemo(() => getRemainingMetrics(totals, targetGoal, state.water), [totals, targetGoal, state.water]);
  const consistency = useMemo(() => getConsistencyScore(state, totals, targetGoal), [state, totals, targetGoal]);

  const scores = useMemo(() => {
    const caloriePct = Math.min(100, Math.round((totals.calories / targetGoal.targetCalories) * 100)) || 0;
    const proteinPct = Math.min(100, Math.round((totals.protein / targetGoal.protein) * 100)) || 0;
    const waterPct = Math.min(100, Math.round((state.water / targetGoal.water) * 100)) || 0;
    const cons = consistency.score || 0;

    const carbsPct = Math.min(100, Math.round((totals.carbs / targetGoal.carbs) * 100)) || 0;
    const fatPct = Math.min(100, Math.round((totals.fat / targetGoal.fat) * 100)) || 0;
    const fiberPct = Math.min(100, Math.round((totals.fiber / targetGoal.fiber) * 100)) || 0;
    const nutritionScore = Math.round((proteinPct + carbsPct + fatPct + fiberPct) / 4);

    const healthScore = Math.round((caloriePct * 0.3) + (proteinPct * 0.3) + (waterPct * 0.2) + (cons * 0.2));

    return {
      healthScore: isNaN(healthScore) ? 75 : Math.max(10, Math.min(100, healthScore)),
      nutritionScore: isNaN(nutritionScore) ? 70 : Math.max(10, Math.min(100, nutritionScore))
    };
  }, [totals, targetGoal, state.water, consistency]);

  // Progress metrics calculations
  const progressMetricsCalculations = useMemo(() => {
    const diff = calculations.idealWeight - state.weight;
    const progressStatus = diff > 0 ? "Underweight offset" : "Goal difference";
    
    // Healthy weight loss projection (approx 0.5kg per week)
    const weightDiff = Math.abs(state.weight - (goal?.goalWeight || 68));
    const weeksToGoal = Math.ceil(weightDiff / 0.5);
    const targetDate = new Date(Date.now() + weeksToGoal * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    return {
      progressStatus,
      diff: Math.abs(diff).toFixed(1),
      expectedGoalDate: targetDate
    };
  }, [calculations, state.weight, goal]);

  // Scores Dials for Coach Redesign
  const coachDashboardScores = useMemo(() => {
    const waterPct = Math.min(100, Math.round((state.water / targetGoal.water) * 100));
    const workoutScoreVal = state.workoutMinutes >= 45 ? 100 : Math.round((state.workoutMinutes / 45) * 100);

    return {
      healthScore: scores.healthScore,
      nutritionScore: scores.nutritionScore,
      workoutScore: workoutScoreVal,
      hydrationScore: waterPct,
      recoveryScore: state.sleepHours >= 7 && state.sleepHours <= 9 ? 100 : 75,
      consistencyScore: consistency.score
    };
  }, [totals, targetGoal, state, scores, consistency]);

  // Intelligent AI coach dynamic lists
  const dynamicCoachAdvises = useMemo(() => {
    const advices = [];

    // Protein advice
    if (totals.protein < targetGoal.protein) {
      const diff = Math.round(targetGoal.protein - totals.protein);
      advices.push({
        title: "Increase Protein Intake",
        detail: `Eat ${diff}g more protein today to secure muscle retention and target amino acid recovery thresholds.`,
        priority: "High",
        benefit: "Accelerated Fat Loss & Lean Muscle Retention",
        confidence: 95,
        actionLabel: "Add Protein Shake"
      });
    }

    // Calories advice
    if (totals.calories < targetGoal.targetCalories - 200) {
      const diff = Math.round(targetGoal.targetCalories - totals.calories);
      advices.push({
        title: "Caloric Intake Under Goal",
        detail: `You are currently ${diff} kcal below your energy target balance. Log another healthy snack slot.`,
        priority: "Medium",
        benefit: "Supports Baseline BMR & Thyroid Stability",
        confidence: 88,
        actionLabel: "Add Meal Log"
      });
    }

    // Hydration advice
    if (state.water < targetGoal.water) {
      const diffMl = Math.round((targetGoal.water - state.water) * 1000);
      advices.push({
        title: "Drink More Water",
        detail: `Log ${diffMl} ml more water today to complete hydration markers.`,
        priority: "High",
        benefit: "Decreases Water Retention & Prevents Cramping",
        confidence: 98,
        actionLabel: "+250 ml Quick Add"
      });
    }

    // Log tracking warnings
    const breakfastLogged = state.entries.some(e => e.mealType === 'Breakfast');
    if (!breakfastLogged) {
      advices.push({
        title: "Missing Breakfast Log",
        detail: "Starting the day with healthy macros regulates morning insulin release.",
        priority: "Medium",
        benefit: "Boosts Metabolic Focus & Satiety Indicators",
        confidence: 85,
        actionLabel: "Log Breakfast"
      });
    }

    if (advices.length === 0) {
      advices.push({
        title: "Healthy Lifestyle Maintained!",
        detail: "All daily targets have been satisfied perfectly. Continue maintaining progress.",
        priority: "Low",
        benefit: "Optimum Recovery Split reached",
        confidence: 100,
        actionLabel: "View Reports"
      });
    }

    return advices;
  }, [totals, targetGoal, state]);

  // Food list filters matching query
  const allFoodOptions = useMemo(() => {
    return [...getStarterFoods(), ...state.customFoods];
  }, [state.customFoods]);

  const filteredFoods = useMemo(() => {
    let list = allFoodOptions;

    // Filter by slot
    list = list.filter(f => !f.category || f.category === selectedMealType);

    // Search query keyword
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      list = list.filter((food) => food.name.toLowerCase().includes(query));
    }

    // Filter by max calories, protein, carbs, fat
    list = list.filter(f => f.calories <= calorieFilter);
    list = list.filter(f => f.protein >= proteinFilter);
    list = list.filter(f => f.carbs <= carbsFilter);
    list = list.filter(f => f.fat <= fatFilter);

    // Diet pref filters
    if (dietFilter === 'veg') list = list.filter(f => f.vegetarian);
    if (dietFilter === 'non-veg') list = list.filter(f => f.nonVeg);
    if (dietFilter === 'vegan') list = list.filter(f => f.vegan);

    // Boolean tag filters
    if (tagFilters.highProtein) list = list.filter(f => f.highProtein);
    if (tagFilters.lowCal) list = list.filter(f => f.lowCal);
    if (tagFilters.highFiber) list = list.filter(f => f.highFiber);
    if (tagFilters.lowFat) list = list.filter(f => f.lowFat);
    if (tagFilters.postWorkout) list = list.filter(f => f.postWorkout);

    // Sorting
    return list.sort((a, b) => {
      if (selectedSort === 'highest-protein') return b.protein - a.protein;
      if (selectedSort === 'lowest-calories') return a.calories - b.calories;
      if (selectedSort === 'alphabetical') return a.name.localeCompare(b.name);
      
      const aFav = favoriteFoodsList.includes(a.id) ? 1 : 0;
      const bFav = favoriteFoodsList.includes(b.id) ? 1 : 0;
      if (selectedSort === 'favorites') return bFav - aFav;

      const aRec = recentFoodsList.includes(a.id) ? 1 : 0;
      const bRec = recentFoodsList.includes(b.id) ? 1 : 0;
      if (selectedSort === 'recent') return bRec - aRec;

      return 0;
    });
  }, [searchQuery, allFoodOptions, selectedMealType, calorieFilter, proteinFilter, carbsFilter, fatFilter, dietFilter, tagFilters, selectedSort, favoriteFoodsList, recentFoodsList]);

  // Log entry add
  const addLogEntry = async (food: Partial<FoodOption>) => {
    const todayDate = new Date().toISOString().slice(0, 10);
    const newEntryPayload = {
      date: todayDate,
      mealType: selectedMealType,
      name: food.name || 'Unnamed Food',
      calories: food.calories ?? 0,
      protein: food.protein ?? 0,
      carbs: food.carbs ?? 0,
      fat: food.fat ?? 0,
      fiber: food.fiber ?? 0,
      sugar: food.sugar ?? 0,
      sodium: food.sodium ?? 0,
      potassium: food.potassium ?? 0,
      calcium: food.calcium ?? 0,
      iron: food.iron ?? 0,
      vitaminA: food.vitaminA ?? 0,
      vitaminC: food.vitaminC ?? 0,
      vitaminD: food.vitaminD ?? 0
    };

    let newEntry: NutritionEntry;

    try {
      const { data } = await api.post('/meals', newEntryPayload);
      const logged = data.meal;
      newEntry = {
        id: logged._id,
        mealType: logged.mealType,
        name: logged.name,
        servingSize: food.servingSize || '1 unit',
        calories: logged.calories,
        protein: logged.protein,
        carbs: logged.carbs,
        fat: logged.fat,
        fiber: logged.fiber,
        sugar: logged.sugar,
        sodium: logged.sodium,
        potassium: logged.potassium,
        calcium: logged.calcium,
        iron: logged.iron,
        vitaminA: logged.vitaminA,
        vitaminC: logged.vitaminC,
        vitaminD: logged.vitaminD,
        favorite: false,
        createdAt: logged.createdAt
      };
    } catch (err) {
      console.warn('Logging to database failed, using offline fallback', err);
      newEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        mealType: selectedMealType,
        name: food.name || 'Unnamed Food',
        servingSize: food.servingSize || '1 unit',
        calories: food.calories ?? 0,
        protein: food.protein ?? 0,
        carbs: food.carbs ?? 0,
        fat: food.fat ?? 0,
        fiber: food.fiber ?? 0,
        sugar: food.sugar ?? 0,
        sodium: food.sodium ?? 0,
        potassium: food.potassium ?? 0,
        calcium: food.calcium ?? 0,
        iron: food.iron ?? 0,
        vitaminA: food.vitaminA ?? 0,
        vitaminC: food.vitaminC ?? 0,
        vitaminD: food.vitaminD ?? 0,
        favorite: false,
        createdAt: new Date().toISOString()
      };
    }

    if (food.id && !recentFoodsList.includes(food.id)) {
      setRecentFoodsList(prev => [food.id!, ...prev].slice(0, 8));
    }

    setState((prev) => ({
      ...prev,
      entries: [...prev.entries, newEntry]
    }));

    showToast(`Logged ${newEntry.name} successfully!`, 'success');
  };

  // Log Custom Food Option creation
  const handleCreateCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newFood: FoodOption = {
      id: `custom-${Date.now()}`,
      name: customName,
      servingSize: '1 serving',
      calories: customCalories,
      protein: customProtein,
      carbs: customCarbs,
      fat: customFat,
      fiber: customFiber,
      sugar: 5,
      sodium: 150,
      potassium: 200,
      calcium: 50,
      iron: 1,
      vitaminA: 20,
      vitaminC: 5,
      vitaminD: 0,
      category: selectedMealType,
      vegetarian: true,
      nonVeg: false,
      vegan: true,
      highProtein: customProtein >= 15,
      lowCal: customCalories <= 150,
      highFiber: customFiber >= 5,
      lowFat: customFat <= 3,
      postWorkout: selectedMealType === 'Post Workout'
    };

    setState((prev) => ({
      ...prev,
      customFoods: [...prev.customFoods, newFood]
    }));

    showToast(`Created custom food: ${customName}!`, 'success');
    setCustomName('');
    setShowAddCustomModal(false);
  };

  // Manual Logger
  const handleManualMealLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const todayDate = new Date().toISOString().slice(0, 10);
    const newEntryPayload = {
      date: todayDate,
      mealType: manualMealType,
      name: manualName,
      calories: manualCalories,
      protein: manualProtein,
      carbs: manualCarbs,
      fat: manualFat,
      fiber: manualFiber,
      sugar: manualSugar,
      sodium: manualSodium
    };

    let newEntry: NutritionEntry;

    try {
      const { data } = await api.post('/meals', newEntryPayload);
      const logged = data.meal;
      newEntry = {
        id: logged._id,
        mealType: logged.mealType,
        name: logged.name,
        servingSize: '1 serving',
        calories: logged.calories,
        protein: logged.protein,
        carbs: logged.carbs,
        fat: logged.fat,
        fiber: logged.fiber,
        sugar: logged.sugar,
        sodium: logged.sodium,
        potassium: 200,
        calcium: 40,
        iron: 1,
        vitaminA: 30,
        vitaminC: 5,
        vitaminD: 0,
        favorite: false,
        createdAt: logged.createdAt
      };
    } catch (err) {
      console.warn('Manual logging to database failed, using offline fallback', err);
      newEntry = {
        id: `manual-${Date.now()}`,
        mealType: manualMealType,
        name: manualName,
        servingSize: '1 serving',
        calories: manualCalories,
        protein: manualProtein,
        carbs: manualCarbs,
        fat: manualFat,
        fiber: manualFiber,
        sugar: manualSugar,
        sodium: manualSodium,
        potassium: 200,
        calcium: 40,
        iron: 1,
        vitaminA: 30,
        vitaminC: 5,
        vitaminD: 0,
        favorite: false,
        createdAt: new Date().toISOString()
      };
    }

    setState((prev) => ({
      ...prev,
      entries: [...prev.entries, newEntry]
    }));

    showToast(`Logged ${manualName} directly!`, 'success');
    setManualName('');
    setShowManualLogModal(false);
  };

  // Redesigned Progress logs submission
  const handleLogProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(progressWeight);
    const waistNum = parseFloat(progressWaist) || 80;
    const neckNum = parseFloat(progressNeck) || 36;
    const hipNum = parseFloat(progressHip) || 90;
    const chestNum = parseFloat(progressChest) || 90;
    const sleepNum = parseFloat(progressSleepHours) || state.sleepHours || 8;
    const stepsNum = parseInt(progressSteps) || state.steps || 0;
    const workoutMinsNum = parseInt(progressWorkoutMinutes) || state.workoutMinutes || 0;

    if (isNaN(weightNum)) {
      showToast('Please enter a valid weight.', 'error');
      return;
    }

    try {
      await logWeightProgress({
        weight: weightNum,
        waist: waistNum,
        neck: neckNum,
        hip: hipNum,
        chest: chestNum
      });

      // Synchronize sleep, steps, and workout minutes to daily progress in backend
      const todayDate = new Date().toISOString().slice(0, 10);
      await api.post(`/progress/daily/${todayDate}`, {
        sleepHours: sleepNum,
        steps: stepsNum,
        workoutMinutes: workoutMinsNum,
        weight: weightNum
      });

      setState(prev => ({
        ...prev,
        sleepHours: sleepNum,
        steps: stepsNum,
        workoutMinutes: workoutMinsNum,
        weight: weightNum
      }));

      // Fire a sync event
      window.dispatchEvent(new Event('nutrition-update'));

      showToast('Measurements & daily metrics recorded and synchronized!', 'success');
      setProgressWeight('');
      setProgressWaist('');
      setProgressNeck('');
      setProgressHip('');
      setProgressChest('');
      setProgressSleepHours('');
      setProgressSteps('');
      setProgressWorkoutMinutes('');
    } catch (err) {
      showToast('Failed to record progress logs.', 'error');
    }
  };

  const handleDownloadReport = () => {
    const htmlContent = `
      <html>
        <head>
          <title>TRACKBITE Daily Summary - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 30px; color: #111827; background: #f9fafb; }
            .card { background: #ffffff; border-radius: 12px; padding: 20px; border: 1px solid #e5e7eb; margin-bottom: 20px; }
            h1 { color: #10b981; margin-top: 0; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 15px; }
            .metric { text-align: center; padding: 10px; background: #f3f4f6; border-radius: 8px; }
            .metric-val { font-size: 1.25rem; font-weight: bold; color: #111827; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { text-align: left; padding: 10px; border-bottom: 1px solid #e5e7eb; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>TRACKBITE Daily Fitness Summary</h1>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Goal:</strong> ${goal?.type || 'Healthy Lifestyle'}</p>
            <div class="grid">
              <div class="metric"><div class="metric-val">${totals.calories} / ${targetGoal.targetCalories}</div><div>Calories (kcal)</div></div>
              <div class="metric"><div class="metric-val">${totals.protein}g / ${targetGoal.protein}g</div><div>Protein</div></div>
              <div class="metric"><div class="metric-val">${state.water}L / ${targetGoal.water}L</div><div>Water</div></div>
            </div>
          </div>

          <div class="card">
            <h2>Daily Meals Log</h2>
            <table>
              <thead>
                <tr>
                  <th>Meal Slot</th>
                  <th>Food Item</th>
                  <th>Serving</th>
                  <th>Calories</th>
                  <th>Macros (P/C/F)</th>
                </tr>
              </thead>
              <tbody>
                ${state.entries.map(e => `
                  <tr>
                    <td><strong>${e.mealType}</strong></td>
                    <td>${e.name}</td>
                    <td>${e.servingSize}</td>
                    <td>${e.calories} kcal</td>
                    <td>${e.protein}g / ${e.carbs}g / ${e.fat}g</td>
                  </tr>
                `).join('')}
                ${state.entries.length === 0 ? '<tr><td colspan="5" style="text-align:center;">No meals logged today.</td></tr>' : ''}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(htmlContent);
      win.document.close();
      win.print();
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] p-4 md:p-6 transition-colors duration-300 page-transition-container">
      
      {/* Toasts overlay layer */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-2xl shadow-xl backdrop-blur-xl border font-bold text-xs bg-emerald-500/90 border-emerald-400 text-white flex items-center justify-between"
            >
              <span>{t.message}</span>
              <button onClick={() => setToasts(prev => prev.filter(i => i.id !== t.id))} className="ml-3 font-semibold">✕</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Navigation header */}
        <header className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 md:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <TrackBiteLogo size={32} />
            <div>
              <h1 className="font-extrabold text-xl text-[var(--text-primary)] leading-none">TRACKBITE Dashboard</h1>
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mt-1 block">Production Ready Hub</span>
            </div>
          </div>

          <nav className="flex flex-wrap gap-1.5 bg-[var(--bg-sidebar)] p-1.5 rounded-2xl border border-[var(--border-color)]">
            {(['today', 'log', 'nutrition', 'progress', 'workouts', 'coach'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 uppercase tracking-wide ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab === 'log' ? 'Log Meals' : tab === 'coach' ? 'AI Coach' : tab}
              </button>
            ))}
          </nav>
        </header>

        {/* Tab content panel switcher */}
        <div className="min-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* TAB 1: TODAY BANNER CARD */}
              {activeTab === 'today' && (
                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                  
                  {/* Left Column widgets */}
                  <div className="space-y-6">
                    {/* Welcome card */}
                    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Welcome back, {user?.name || 'Vibe Tracker'}!</h2>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 italic">"{quote}"</p>
                      </div>
                      <button 
                        onClick={handleDownloadReport}
                        className="btn-premium flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition"
                      >
                        <FileText size={14} /> Download Report
                      </button>
                    </div>

                    {/* Circular calorie widgets */}
                    <div className="grid gap-4 md:grid-cols-4">
                      {/* Remaining gauge */}
                      <div className="md:col-span-2 rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 flex items-center justify-between gap-4 shadow-sm">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wide">Daily Goal Calories</span>
                          <h3 className="text-3xl font-extrabold text-[var(--text-primary)] mt-1">{remaining.caloriesRemaining}</h3>
                          <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Kcal Remaining (Consumed: {totals.calories})</p>
                        </div>
                        <div className="h-20 w-20 flex-shrink-0 relative">
                          <CircularProgress percent={Math.min(100, Math.round((totals.calories / targetGoal.targetCalories) * 100))} color="#10B981" strokeWidth={6} />
                          <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-[var(--text-primary)]">{Math.min(100, Math.round((totals.calories / targetGoal.targetCalories) * 100))}%</div>
                        </div>
                      </div>

                      {/* Streak days */}
                      <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Daily Streak</span>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-4xl font-black text-orange-500">🔥 {state.streakCount}</span>
                          <span className="text-xs text-[var(--text-muted)] font-bold">days</span>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)] font-semibold">Record: {state.longestStreak} days</span>
                      </div>

                      {/* Consistency rating */}
                      <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Consistency Rating</span>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-3xl font-black text-emerald-500">🛡️ {consistency.score}</span>
                          <span className="text-[10px] text-[var(--text-muted)] font-bold">/100</span>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)] font-semibold">Rating: {consistency.label}</span>
                      </div>
                    </div>

                    {/* Weight status indicators */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-[var(--border-color)] p-4 bg-[var(--bg-card)] text-center">
                        <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Current Weight</div>
                        <div className="text-xl font-black text-[var(--text-primary)] mt-1">
                          {goal?.assessment?.currentWeight || goal?.assessment?.weight || user?.weight || state.weight || 72} kg
                        </div>
                      </div>
                      <div className="rounded-2xl border border-[var(--border-color)] p-4 bg-[var(--bg-card)] text-center">
                        <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Target Goal Weight</div>
                        <div className="text-xl font-black text-emerald-500 mt-1">
                          {goal?.goalWeight || goal?.assessment?.targetWeight || goal?.assessment?.goalWeight || user?.goalWeight || 68} kg
                        </div>
                      </div>
                    </div>

                    {/* Logged meals history list */}
                    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-sm">
                      <h3 className="font-extrabold text-[var(--text-primary)]">Logged Meals list</h3>
                      <div className="space-y-2">
                        {state.entries.map(entry => (
                          <div key={entry.id} className="p-3 border border-[var(--border-color)] rounded-xl flex items-center justify-between text-xs font-semibold bg-[var(--bg-sidebar)]">
                            <div>
                              <span className="rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-[8px] uppercase font-bold px-1.5 py-0.5">{entry.mealType}</span>
                              <h4 className="font-bold text-xs mt-1 text-[var(--text-primary)]">{entry.name} <span className="text-[9px] font-medium text-slate-400">({entry.servingSize})</span></h4>
                            </div>
                            <span className="font-black text-[var(--text-primary)]">{entry.calories} kcal</span>
                          </div>
                        ))}
                        {state.entries.length === 0 && (
                          <p className="text-xs text-[var(--text-muted)] text-center py-6">No meals logged yet today.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar column widgets */}
                  <div className="space-y-6">
                    
                    {/* Energy and Mood selectors */}
                    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-sm">
                      <h3 className="font-bold text-[var(--text-primary)]">Day State Logs</h3>
                      
                      <label className="block space-y-1.5 text-xs">
                        <span className="text-[var(--text-secondary)]">Energy Level</span>
                        <select 
                          className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-[var(--text-primary)] outline-none"
                          value={state.energy || 'Moderate'}
                          onChange={async (e) => {
                            const val = e.target.value;
                            setState(prev => ({ ...prev, energy: val }));
                            await updateDailyMetric({ energy: val });
                            showToast(`Energy marked as ${val}!`, 'info');
                          }}
                        >
                          <option>High</option>
                          <option>Moderate</option>
                          <option>Low</option>
                        </select>
                      </label>

                      <label className="block space-y-1.5 text-xs">
                        <span className="text-[var(--text-secondary)]">Current Mood</span>
                        <select 
                          className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-[var(--text-primary)] outline-none"
                          value={state.mood || 'Balanced'}
                          onChange={async (e) => {
                            const val = e.target.value;
                            setState(prev => ({ ...prev, mood: val }));
                            await updateDailyMetric({ mood: val });
                            showToast(`Mood marked as ${val}!`, 'info');
                          }}
                        >
                          <option>Happy</option>
                          <option>Balanced</option>
                          <option>Tired</option>
                        </select>
                      </label>
                    </div>

                    {/* Health score Index meters */}
                    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-md p-6 space-y-4 shadow-sm card-hover-lift">
                      <h3 className="font-bold text-[var(--text-primary)]">Active Quality Indexes</h3>
                      <div className="space-y-3.5 text-xs font-semibold text-[var(--text-muted)]">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[var(--text-muted)]"><span>Health Index</span><span>{scores.healthScore}/100</span></div>
                          <div className="h-2 rounded-full bg-[var(--border-color)] overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${scores.healthScore}%` }} />
                          </div>
                        </div>
                        <div className="space-y-1 border-t border-[var(--border-color)] pt-2">
                          <div className="flex justify-between text-[var(--text-muted)]"><span>Nutrition Index</span><span>{scores.nutritionScore}/100</span></div>
                          <div className="h-2 rounded-full bg-[var(--border-color)] overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-600 transition-all duration-1000 ease-out" style={{ width: `${scores.nutritionScore}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: LOG MEALS */}
              {activeTab === 'log' && (
                <div className="space-y-6">
                  {/* Category Pills & Quick Controls */}
                  <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-4 md:p-6 shadow-xl flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {(['Breakfast', 'Morning Snack', 'Lunch', 'Evening Snack', 'Dinner', 'Post Workout'] as const).map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedMealType(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition duration-205 ${
                            selectedMealType === cat 
                              ? 'bg-emerald-600 text-white shadow-md' 
                              : 'bg-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowAddCustomModal(true)}
                        className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 px-4 py-2 text-xs font-bold hover:bg-emerald-500/20"
                      >
                        + Custom Food
                      </button>
                      <button 
                        onClick={() => setShowManualLogModal(true)}
                        className="btn-premium px-4 py-2 text-xs font-bold"
                      >
                        Direct Manual Log
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
                    
                    {/* Advanced filter panels */}
                    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-5 shadow-xl h-fit">
                      <h3 className="font-extrabold text-[var(--text-primary)] flex items-center gap-1.5"><Sliders size={16} /> Advanced filters</h3>
                      
                      {/* Search keyword */}
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Search by Name</span>
                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-3 text-[var(--text-muted)]" />
                          <input 
                            type="text"
                            placeholder="Type keyword..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-transparent text-xs outline-none focus:border-emerald-500 text-[var(--text-primary)]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </label>

                      {/* Diet Preferences Option */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Diet Preference</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { value: 'all', label: 'All' },
                            { value: 'veg', label: 'Vegetarian' },
                            { value: 'non-veg', label: 'Non Veg' },
                            { value: 'vegan', label: 'Vegan' }
                          ].map(item => (
                            <button
                              key={item.value}
                              onClick={() => setDietFilter(item.value as any)}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition ${
                                dietFilter === item.value 
                                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600' 
                                  : 'border-[var(--border-color)] hover:bg-[var(--border-color)]'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tag flags toggles */}
                      <div className="space-y-2 border-t border-[var(--border-color)] pt-3">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">Macro Filters</span>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.keys(tagFilters).map(tag => (
                            <button
                              key={tag}
                              onClick={() => setTagFilters(prev => ({ ...prev, [tag]: !prev[tag] }))}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold border transition ${
                                tagFilters[tag] 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'text-[var(--text-secondary)] border-[var(--border-color)]'
                              }`}
                            >
                              {tag.replace(/([A-Z])/g, ' $1').trim()}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Limit macro sliders */}
                      <div className="space-y-3.5 border-t border-[var(--border-color)] pt-3">
                        <label className="block space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-[var(--text-muted)] uppercase"><span>Max Calories</span><span>{calorieFilter} kcal</span></div>
                          <input type="range" min="50" max="800" step="20" className="w-full h-1 bg-[var(--border-color)] accent-emerald-500" value={calorieFilter} onChange={(e) => setCalorieFilter(parseInt(e.target.value))} />
                        </label>
                        <label className="block space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-[var(--text-muted)] uppercase"><span>Min Protein</span><span>{proteinFilter}g</span></div>
                          <input type="range" min="0" max="40" step="2" className="w-full h-1 bg-[var(--border-color)] accent-emerald-500" value={proteinFilter} onChange={(e) => setProteinFilter(parseInt(e.target.value))} />
                        </label>
                      </div>

                      {/* Sort options selection */}
                      <label className="block space-y-1 border-t border-[var(--border-color)] pt-3">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Sort Order</span>
                        <select
                          className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2.5 text-xs outline-none text-[var(--text-primary)]"
                          value={selectedSort}
                          onChange={(e) => setSelectedSort(e.target.value)}
                        >
                          <option value="highest-protein">Highest Protein</option>
                          <option value="lowest-calories">Lowest Calories</option>
                          <option value="recent">Recently Logged</option>
                          <option value="favorites">My Favorites First</option>
                          <option value="alphabetical">Alphabetical</option>
                        </select>
                      </label>
                    </div>

                    {/* Results list */}
                    <div className="space-y-6">
                      <div className="space-y-3.5">
                        <h3 className="font-extrabold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                          🍱 Food Database Matches ({selectedMealType})
                        </h3>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {filteredFoods.map(food => {
                            const isFav = favoriteFoodsList.includes(food.id);
                            return (
                              <div 
                                key={food.id}
                                className="border border-[var(--border-color)] rounded-[24px] p-4 bg-[var(--bg-card)] shadow-xl flex flex-col justify-between"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-xs text-[var(--text-primary)]">{food.name}</h4>
                                    <button 
                                      onClick={() => handleFoodFavoriteToggle(food.id)}
                                      className={`p-1.5 rounded-full border transition ${
                                        isFav 
                                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                                          : 'hover:text-amber-500 text-[var(--text-muted)] border-[var(--border-color)]'
                                      }`}
                                    >
                                      <Star size={11} className={isFav ? 'fill-current' : ''} />
                                    </button>
                                  </div>
                                  
                                  <span className="text-[9px] text-[var(--text-muted)] font-extrabold uppercase">Serving: {food.servingSize}</span>

                                  {/* Compact nutrition metrics grid */}
                                  <div className="grid grid-cols-4 gap-1 p-2 bg-[var(--border-color)] rounded-xl text-center text-[10px] font-semibold text-[var(--text-primary)]">
                                    <div><div className="text-[7px] text-[var(--text-muted)] font-bold uppercase">kcal</div><div>{food.calories}</div></div>
                                    <div><div className="text-[7px] text-[var(--text-muted)] font-bold uppercase">Prot</div><div>{food.protein}g</div></div>
                                    <div><div className="text-[7px] text-[var(--text-muted)] font-bold uppercase">Carb</div><div>{food.carbs}g</div></div>
                                    <div><div className="text-[7px] text-[var(--text-muted)] font-bold uppercase">Fat</div><div>{food.fat}g</div></div>
                                  </div>
                                </div>

                                <div className="flex gap-2 mt-4 border-t border-[var(--border-color)] pt-3">
                                  <button 
                                    onClick={() => addLogEntry(food)}
                                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] py-2 transition active:scale-95"
                                  >
                                    Add Meal
                                  </button>
                                  <button 
                                    onClick={() => setShowNutritionModal(food)}
                                    className="rounded-xl border border-[var(--border-color)] px-3 py-2 text-[10px] font-semibold hover:bg-[var(--border-color)] text-slate-400"
                                  >
                                    Nutrition Facts
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 3: NUTRITION CHARTS */}
              {activeTab === 'nutrition' && (
                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                  
                  {/* Left Column: Progress Rings and Recharts charts */}
                  <div className="space-y-6">
                    {/* Progress Rings Grid */}
                    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 md:p-8 space-y-6 shadow-xl">
                      <h3 className="font-extrabold text-[var(--text-primary)]">Daily Target Progress Rings</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        
                        {/* Calories */}
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="h-24 w-24 relative flex items-center justify-center">
                            <CircularProgress percent={Math.min(100, Math.round((totals.calories / targetGoal.targetCalories) * 100))} color="#10B981" strokeWidth={5} />
                            <span className="absolute text-xs font-bold text-[var(--text-primary)]">{Math.min(100, Math.round((totals.calories / targetGoal.targetCalories) * 100))}%</span>
                          </div>
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Calories</span>
                        </div>

                        {/* Protein */}
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="h-24 w-24 relative flex items-center justify-center">
                            <CircularProgress percent={Math.min(100, Math.round((totals.protein / targetGoal.protein) * 100))} color="#06B6D4" strokeWidth={5} />
                            <span className="absolute text-xs font-bold text-[var(--text-primary)]">{Math.min(100, Math.round((totals.protein / targetGoal.protein) * 100))}%</span>
                          </div>
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Protein</span>
                        </div>

                        {/* Carbs */}
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="h-24 w-24 relative flex items-center justify-center">
                            <CircularProgress percent={Math.min(100, Math.round((totals.carbs / targetGoal.carbs) * 100))} color="#F59E0B" strokeWidth={5} />
                            <span className="absolute text-xs font-bold text-[var(--text-primary)]">{Math.min(100, Math.round((totals.carbs / targetGoal.carbs) * 100))}%</span>
                          </div>
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Carbohydrates</span>
                        </div>

                        {/* Fat */}
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="h-24 w-24 relative flex items-center justify-center">
                            <CircularProgress percent={Math.min(100, Math.round((totals.fat / targetGoal.fat) * 100))} color="#10B981" strokeWidth={5} />
                            <span className="absolute text-xs font-bold text-[var(--text-primary)]">{Math.min(100, Math.round((totals.fat / targetGoal.fat) * 100))}%</span>
                          </div>
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Fat</span>
                        </div>

                        {/* Fiber */}
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="h-24 w-24 relative flex items-center justify-center">
                            <CircularProgress percent={Math.min(100, Math.round((totals.fiber / targetGoal.fiber) * 100))} color="#EC4899" strokeWidth={5} />
                            <span className="absolute text-xs font-bold text-[var(--text-primary)]">{Math.min(100, Math.round((totals.fiber / targetGoal.fiber) * 100))}%</span>
                          </div>
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Fiber</span>
                        </div>

                        {/* Water */}
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="h-24 w-24 relative flex items-center justify-center">
                            <CircularProgress percent={Math.min(100, Math.round((state.water / targetGoal.water) * 100))} color="#0ea5e9" strokeWidth={5} />
                            <span className="absolute text-xs font-bold text-[var(--text-primary)]">{Math.min(100, Math.round((state.water / targetGoal.water) * 100))}%</span>
                          </div>
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Water</span>
                        </div>

                      </div>
                    </div>

                    {/* Macro Split Chart */}
                    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 md:p-8 space-y-4 shadow-xl">
                      <h3 className="font-extrabold text-[var(--text-primary)]">Daily Macro Calorie split</h3>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Protein', value: totals.protein * 4 },
                                { name: 'Carbs', value: totals.carbs * 4 },
                                { name: 'Fat', value: totals.fat * 9 }
                              ]}
                              innerRadius={60}
                              outerRadius={75}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              <Cell fill="#06B6D4" />
                              <Cell fill="#F59E0B" />
                              <Cell fill="#10B981" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Right Column sidebar: Sugar and Micronutrients list */}
                  <div className="space-y-6">
                    {/* Sugar progress */}
                    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-md p-6 space-y-3 shadow-xl card-hover-lift">
                      <h3 className="font-bold text-[var(--text-primary)]">Sugar Progress Tracker</h3>
                      <div className="flex justify-between text-xs font-semibold text-[var(--text-secondary)]">
                        <span>Consumed: {totals.sugar}g</span>
                        <span>Max limit: 40g</span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--border-color)] overflow-hidden">
                        <div className={`h-full rounded-full ${totals.sugar > 40 ? 'bg-rose-500' : 'bg-amber-500'} transition-all duration-1000 ease-out`} style={{ width: `${Math.min(100, (totals.sugar / 40) * 100)}%` }} />
                      </div>
                    </div>

                    {/* Micronutrients details feed list */}
                    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xl">
                      <h3 className="font-bold text-[var(--text-primary)]">Micronutrients Daily Totals</h3>
                      <div className="space-y-3.5 text-xs font-semibold text-[var(--text-secondary)]">
                        <div className="flex justify-between border-b border-[var(--border-color)] pb-1"><span>Sodium</span><span>{totals.sodium} mg</span></div>
                        <div className="flex justify-between border-b border-[#1F2937] pb-1"><span>Potassium</span><span>{totals.potassium} mg</span></div>
                        <div className="flex justify-between border-b border-[#1F2937] pb-1"><span>Calcium</span><span>{totals.calcium} mg</span></div>
                        <div className="flex justify-between border-b border-[#1F2937] pb-1"><span>Iron</span><span>{totals.iron} mg</span></div>
                        <div className="flex justify-between border-b border-[#1F2937] pb-1"><span>Vitamin A</span><span>{totals.vitaminA} mcg</span></div>
                        <div className="flex justify-between border-b border-[#1F2937] pb-1"><span>Vitamin C</span><span>{totals.vitaminC} mg</span></div>
                        <div className="flex justify-between border-b border-[#1F2937] pb-1"><span>Vitamin D</span><span>{totals.vitaminD} mcg</span></div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: REDESIGNED PROGRESS MODULE */}
              {activeTab === 'progress' && (
                <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                  
                  {/* Left Column widgets and Line charts */}
                  <div className="space-y-6">
                    {/* Metrics Dashboard */}
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                      <div className="rounded-2xl border border-[var(--border-color)] p-4 bg-[var(--bg-card)] text-center shadow-sm">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--text-muted)]">Current Weight</span>
                        <div className="text-2xl font-black text-[var(--text-primary)] mt-1">{state.weight} kg</div>
                      </div>
                      <div className="rounded-2xl border border-[var(--border-color)] p-4 bg-[var(--bg-card)] text-center shadow-sm">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--text-muted)]">Target Weight</span>
                        <div className="text-2xl font-black text-emerald-500 mt-1">{goal?.goalWeight || 68} kg</div>
                      </div>
                      <div className="rounded-2xl border border-[var(--border-color)] p-4 bg-[var(--bg-card)] text-center shadow-sm">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--text-muted)]">{progressMetricsCalculations.progressStatus}</span>
                        <div className="text-2xl font-black text-[var(--text-primary)] mt-1">{progressMetricsCalculations.diff} kg</div>
                      </div>
                      <div className="rounded-2xl border border-[var(--border-color)] p-4 bg-[var(--bg-card)] text-center shadow-sm">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--text-muted)]">Body Fat (Navy)</span>
                        <div className="text-2xl font-black text-[#06B6D4] mt-1">{calculations.bodyFatPercent}%</div>
                      </div>
                      <div className="rounded-2xl border border-[var(--border-color)] p-4 bg-[var(--bg-card)] text-center shadow-sm">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--text-muted)]">Lean Muscle Mass</span>
                        <div className="text-2xl font-black text-[var(--text-primary)] mt-1">{calculations.leanBodyMass} kg</div>
                      </div>
                      <div className="rounded-2xl border border-[var(--border-color)] p-4 bg-[var(--bg-card)] text-center shadow-sm">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--text-muted)]">BMI Metric</span>
                        <div className="text-2xl font-black text-[var(--text-primary)] mt-1">{calculations.bmi}</div>
                      </div>
                    </div>

                    {/* Dynamic Recharts Trends Selector */}
                    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 md:p-8 space-y-4 shadow-xl">
                      <div className="flex justify-between items-center flex-wrap gap-2 border-b border-[var(--border-color)] pb-3">
                        <h3 className="font-extrabold text-[var(--text-primary)] text-sm flex items-center gap-1.5"><TrendingUp size={16} /> Progress Analytics Trend</h3>
                        <div className="flex gap-1 text-[10px] font-bold">
                          {(['weekly', 'monthly'] as const).map(range => (
                            <button
                              key={range}
                              onClick={() => setProgressRange(range)}
                              className={`px-2.5 py-1 rounded-lg border transition ${
                                progressRange === range 
                                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' 
                                  : 'border-[var(--border-color)] hover:bg-[var(--border-color)]'
                              }`}
                            >
                              {range}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={weightLogs.slice(progressRange === 'weekly' ? -7 : -30)}>
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={2.5} name="Weight (kg)" />
                            <Line type="monotone" dataKey="bodyFat" stroke="#06B6D4" strokeWidth={1.5} name="Body Fat %" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Goal predictions and motivational cards */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 space-y-2 shadow-sm">
                        <span className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider block">Estimated Goal Date</span>
                        <h4 className="text-lg font-black text-emerald-500">{progressMetricsCalculations.expectedGoalDate}</h4>
                        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">Based on average healthy weight adjustment velocities of 0.5kg per week.</p>
                      </div>
                      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 space-y-2 shadow-sm flex flex-col justify-between">
                        <span className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase block">Longest Log Streak</span>
                        <div className="text-xl font-black text-[var(--text-primary)]">🎯 {state.longestStreak} Days met</div>
                        <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/35 px-2 py-0.5 text-[8px] font-bold text-emerald-500 uppercase w-fit">Consistency Badge earned</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Measurements Form and achievements lists */}
                  <div className="space-y-6">
                    <form onSubmit={handleLogProgress} className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xl">
                      <h3 className="font-bold text-[var(--text-primary)]">Record Progress Logs</h3>
                      
                      <div className="space-y-3.5 text-xs font-semibold">
                        <div className="grid grid-cols-2 gap-2">
                          <label className="block space-y-1">
                            <span className="text-[var(--text-secondary)]">Weight (kg)</span>
                            <input type="number" step="0.1" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2 text-center text-[var(--text-primary)] outline-none" value={progressWeight} onChange={(e) => setProgressWeight(e.target.value)} required />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[var(--text-secondary)]">Waist (cm)</span>
                            <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2 text-center text-[var(--text-primary)] outline-none" value={progressWaist} onChange={(e) => setProgressWaist(e.target.value)} />
                          </label>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <label className="block space-y-1">
                            <span className="text-[var(--text-secondary)]">Neck (cm)</span>
                            <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2 text-center text-[var(--text-primary)] outline-none" value={progressNeck} onChange={(e) => setProgressNeck(e.target.value)} />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[var(--text-secondary)]">Chest (cm)</span>
                            <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2 text-center text-[var(--text-primary)] outline-none" value={progressChest} onChange={(e) => setProgressChest(e.target.value)} />
                          </label>
                        </div>

                        {goal?.assessment?.gender === 'Female' && (
                          <label className="block space-y-1">
                            <span className="text-[var(--text-secondary)]">Hip (cm)</span>
                            <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2 text-center text-[var(--text-primary)] outline-none" value={progressHip} onChange={(e) => setProgressHip(e.target.value)} />
                          </label>
                        )}

                        <div className="grid grid-cols-3 gap-2 border-t border-[var(--border-color)] pt-3 col-span-2">
                          <label className="block space-y-1">
                            <span className="text-[var(--text-secondary)]">Sleep (h)</span>
                            <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2 text-center text-[var(--text-primary)] outline-none" value={progressSleepHours} onChange={(e) => setProgressSleepHours(e.target.value)} />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[var(--text-secondary)]">Steps</span>
                            <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2 text-center text-[var(--text-primary)] outline-none" value={progressSteps} onChange={(e) => setProgressSteps(e.target.value)} />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[var(--text-secondary)]">Workouts (m)</span>
                            <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2 text-center text-[var(--text-primary)] outline-none" value={progressWorkoutMinutes} onChange={(e) => setProgressWorkoutMinutes(e.target.value)} />
                          </label>
                        </div>
                      </div>

                      <button type="submit" className="btn-premium w-full mt-3 active:scale-95">
                        Log Measurements & Metrics
                      </button>
                    </form>

                    {/* Achievements milestone tracker */}
                    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-3.5 shadow-xl">
                      <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5"><Award size={16} className="text-emerald-500" /> Motivational milestones</h3>
                      <div className="space-y-2 text-xs font-semibold text-[var(--text-secondary)]">
                        <div className="flex justify-between border-b border-[var(--border-color)] pb-2"><span>Best Log Week</span><span>7/7 Days</span></div>
                        <div className="flex justify-between border-b border-[var(--border-color)] pb-2"><span>Fastest Progress</span><span>1.2 kg / week</span></div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 5: WORKOUTS RECOMMENDER */}
              {activeTab === 'workouts' && (
                <div className="space-y-6">
                  {/* Selector Header info */}
                  <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
                    <h3 className="font-extrabold text-[var(--text-primary)] text-sm flex items-center gap-1.5 uppercase tracking-wider"><Dumbbell size={16} className="text-emerald-500" /> Active Programs</h3>
                    <span className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/35 text-emerald-600 font-bold text-xs">
                      Preference: {goal?.workoutPreference || 'Home Workout (No Equipment)'}
                    </span>
                  </div>

                  {/* Render Home Workout no equipment split */}
                  {((goal?.workoutPreference || 'Home Workout (No Equipment)').includes('No Equipment')) && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight text-center uppercase border-b border-[var(--border-color)] pb-2">HOME WORKOUT (WITHOUT EQUIPMENT)</h2>
                      
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {WITHOUT_EQUIP_EXERCISES.map(ex => (
                          <div key={ex.name} className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-xl flex flex-col justify-between hover:scale-[1.02] transition">
                            <div className="space-y-2 text-xs font-semibold text-[var(--text-secondary)]">
                              <div className="flex justify-between items-start gap-1">
                                <h4 className="font-black text-sm text-[var(--text-primary)]">{ex.name}</h4>
                                <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[8px] font-bold text-emerald-500 uppercase">{ex.difficulty}</span>
                              </div>
                              <p className="text-[10px] text-[var(--text-muted)]">Target Muscle: {ex.muscle}</p>
                              
                              <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold pt-2 border-t border-[var(--border-color)]">
                                <div><div className="text-[8px] text-[var(--text-muted)] uppercase">Sets x Reps</div>{ex.sets} x {ex.reps}</div>
                                <div><div className="text-[8px] text-[var(--text-muted)] uppercase">Rest</div>{ex.rest}</div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] mt-3 pt-2 border-t border-[var(--border-color)]">
                              <span>Estimated Burn:</span>
                              <span className="font-black text-[var(--text-primary)]">{ex.burn} kcal</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Render Home Workout with equipment split */}
                  {((goal?.workoutPreference || '').includes('With Equipment')) && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight text-center uppercase border-b border-[var(--border-color)] pb-2">HOME WORKOUT (WITH EQUIPMENT)</h2>
                      
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {WITH_EQUIP_EXERCISES.map(ex => (
                          <div key={ex.name} className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-xl flex flex-col justify-between hover:scale-[1.02] transition">
                            <div className="space-y-2 text-xs font-semibold text-[var(--text-secondary)]">
                              <div className="flex justify-between items-start gap-1">
                                <h4 className="font-black text-sm text-[var(--text-primary)]">{ex.name}</h4>
                                <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[8px] font-bold text-emerald-500 uppercase">{ex.difficulty}</span>
                              </div>
                              <p className="text-[10px] text-[var(--text-muted)]">Equipment: {ex.equipment} | Muscle: {ex.muscle}</p>
                              
                              <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold pt-2 border-t border-[var(--border-color)]">
                                <div><div className="text-[8px] text-[var(--text-muted)] uppercase">Sets x Reps</div>{ex.sets} x {ex.reps}</div>
                                <div><div className="text-[8px] text-[var(--text-muted)] uppercase">Rest</div>{ex.rest}</div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] mt-3 pt-2 border-t border-[var(--border-color)]">
                              <span>Estimated Burn:</span>
                              <span className="font-black text-[var(--text-primary)]">{ex.burn} kcal</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Render Gym split routine */}
                  {((goal?.workoutPreference || '').includes('Gym Workout')) && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight text-center uppercase border-b border-[var(--border-color)] pb-2">GYM COMPOUND WORKOUTS</h2>
                      
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {GYM_ROUTINE_EXERCISES.map(ex => (
                          <div key={ex.name} className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-xl flex flex-col justify-between hover:scale-[1.02] transition">
                            <div className="space-y-2 text-xs font-semibold text-[var(--text-secondary)]">
                              <h4 className="font-black text-sm text-[var(--text-primary)]">{ex.name}</h4>
                              <p className="text-[10px] text-[var(--text-muted)]">Equipment: {ex.equipment} | Muscle: {ex.muscle}</p>
                              
                              <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold pt-2 border-t border-[var(--border-color)]">
                                <div><div className="text-[8px] text-[var(--text-muted)] uppercase">Sets x Reps</div>{ex.sets} x {ex.reps}</div>
                                <div><div className="text-[8px] text-[var(--text-muted)] uppercase">Recommendation</div>{ex.weight}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 6: REDESIGNED AI COACH DASHBOARD */}
              {activeTab === 'coach' && (
                <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                  
                  {/* Left Column advices list */}
                  <div className="space-y-6">
                    {/* Advice Priority Cards list */}
                    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 md:p-8 space-y-5 shadow-xl">
                      <h3 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-1.5"><Brain size={18} className="text-emerald-500" /> AI Coach Advice & warnings</h3>
                      
                      <div className="space-y-3.5">
                        {dynamicCoachAdvises.map((rec, idx) => (
                          <div key={idx} className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-3 text-xs">
                            <div className="flex justify-between items-center">
                              <span className={`rounded-lg px-2 py-0.5 text-[8px] font-bold uppercase ${
                                rec.priority === 'High' ? 'bg-red-500/10 border border-red-500/30 text-red-500' : 'bg-amber-500/10 border border-amber-500/30 text-amber-500'
                              }`}>{rec.priority} Priority</span>
                              <span className="text-[8px] text-[var(--text-muted)] font-extrabold uppercase">Confidence {rec.confidence}%</span>
                            </div>

                            <div>
                              <h4 className="font-extrabold text-sm text-[var(--text-primary)]">{rec.title}</h4>
                              <p className="text-[var(--text-secondary)] font-semibold mt-1 leading-relaxed">{rec.detail}</p>
                            </div>

                            <div className="border-t border-[var(--border-color)] pt-2.5 flex justify-between items-center text-[10px] font-bold">
                              <span className="text-emerald-500">Benefit: {rec.benefit}</span>
                              <button onClick={() => showToast(`AI Coach Advice executed: ${rec.title}!`, 'success')} className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5">
                                {rec.actionLabel}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column sidebar: dials scores */}
                  <div className="space-y-6">
                    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xl">
                      <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5"><ShieldCheck size={15} className="text-emerald-500" /> Coach Dashboard Scores</h3>
                      
                      <div className="space-y-3 text-xs font-semibold text-[var(--text-secondary)]">
                        <div className="flex justify-between border-b border-[var(--border-color)] pb-2"><span>Health Score</span><span>{coachDashboardScores.healthScore}%</span></div>
                        <div className="flex justify-between border-b border-[var(--border-color)] pb-2"><span>Nutrition Score</span><span>{coachDashboardScores.nutritionScore}%</span></div>
                        <div className="flex justify-between border-b border-[var(--border-color)] pb-2"><span>Workout Score</span><span>{coachDashboardScores.workoutScore}%</span></div>
                        <div className="flex justify-between border-b border-[var(--border-color)] pb-2"><span>Hydration Score</span><span>{coachDashboardScores.hydrationScore}%</span></div>
                        <div className="flex justify-between border-b border-[var(--border-color)] pb-2"><span>Recovery Score</span><span>{coachDashboardScores.recoveryScore}%</span></div>
                        <div className="flex justify-between"><span>Consistency Score</span><span>{coachDashboardScores.consistencyScore}%</span></div>
                      </div>
                    </div>

                    {/* Static Lifestyle details coach advice */}
                    <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-3 shadow-xl">
                      <h3 className="font-bold text-[var(--text-primary)] text-xs flex items-center gap-1"><Zap size={13} className="text-emerald-500" /> AI Lifestyle Tips</h3>
                      <div className="space-y-2.5 text-[11px] font-semibold text-[var(--text-secondary)]">
                        <div><span className="text-[9px] uppercase tracking-wider font-bold text-emerald-500 block">Sleep Advice</span>Target at least 7.5 hours of deep sleep to restore glycogen.</div>
                        <div className="border-t border-[var(--border-color)] pt-2"><span className="text-[9px] uppercase tracking-wider font-bold text-emerald-500 block">Stress Advice</span>Engage in 5 minutes of abdominal breathing exercises under low energy thresholds.</div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* MODAL Factsheets */}
      <AnimatePresence>
        {showNutritionModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[24px] p-6 max-w-sm w-full space-y-4 relative shadow-2xl">
              <button onClick={() => setShowNutritionModal(null)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕</button>
              
              <h3 className="font-extrabold text-[var(--text-primary)] flex items-center gap-1.5"><Apple size={16} /> Factsheet Details</h3>
              <div>
                <h4 className="font-bold text-sm text-[var(--text-primary)]">{showNutritionModal.name}</h4>
                <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Serving Size: {showNutritionModal.servingSize}</span>
              </div>

              <div className="border-t border-[var(--border-color)] pt-3 space-y-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                <div className="flex justify-between"><span>Calories (kcal)</span><span>{showNutritionModal.calories}</span></div>
                <div className="flex justify-between border-b border-[var(--border-color)] pb-1.5"><span>Protein</span><span>{showNutritionModal.protein}g</span></div>
                <div className="flex justify-between"><span>Carbohydrates</span><span>{showNutritionModal.carbs}g</span></div>
                <div className="flex justify-between"><span>Sugar</span><span>{showNutritionModal.sugar}g</span></div>
                <div className="flex justify-between border-b border-[var(--border-color)] pb-1.5"><span>Fiber</span><span>{showNutritionModal.fiber}g</span></div>
                <div className="flex justify-between"><span>Fat</span><span>{showNutritionModal.fat}g</span></div>
                <div className="flex justify-between"><span>Sodium</span><span>{showNutritionModal.sodium}mg</span></div>
              </div>

              <button onClick={() => { addLogEntry(showNutritionModal); setShowNutritionModal(null); }} className="btn-premium w-full py-3.5 mt-4 transition">
                Add Meal Log
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Food sheets */}
      <AnimatePresence>
        {showAddCustomModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[24px] p-6 max-w-sm w-full space-y-4 relative shadow-2xl">
              <button onClick={() => setShowAddCustomModal(false)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕</button>
              
              <h3 className="font-extrabold text-[var(--text-primary)] flex items-center gap-1.5"><PlusCircle size={16} /> Create custom food</h3>
              
              <form onSubmit={handleCreateCustomFood} className="space-y-3 text-xs font-semibold">
                <label className="block space-y-1">
                  <span>Name</span>
                  <input type="text" placeholder="e.g. Oats with protein" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2.5 outline-none text-[var(--text-primary)]" value={customName} onChange={(e) => setCustomName(e.target.value)} required />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block space-y-1">
                    <span>Calories</span>
                    <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2.5 outline-none text-center text-[var(--text-primary)]" value={customCalories} onChange={(e) => setCustomCalories(parseInt(e.target.value) || 0)} />
                  </label>
                  <label className="block space-y-1">
                    <span>Protein (g)</span>
                    <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2.5 outline-none text-center text-[var(--text-primary)]" value={customProtein} onChange={(e) => setCustomProtein(parseInt(e.target.value) || 0)} />
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <label className="block space-y-1">
                    <span>Carbs (g)</span>
                    <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2.5 outline-none text-center text-[var(--text-primary)]" value={customCarbs} onChange={(e) => setCustomCarbs(parseInt(e.target.value) || 0)} />
                  </label>
                  <label className="block space-y-1">
                    <span>Fat (g)</span>
                    <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2.5 outline-none text-center text-[var(--text-primary)]" value={customFat} onChange={(e) => setCustomFat(parseInt(e.target.value) || 0)} />
                  </label>
                  <label className="block space-y-1">
                    <span>Fiber (g)</span>
                    <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2.5 outline-none text-center text-[var(--text-primary)]" value={customFiber} onChange={(e) => setCustomFiber(parseInt(e.target.value) || 0)} />
                  </label>
                </div>
                <button type="submit" className="btn-premium w-full py-3 mt-3 shadow-md active:scale-95">Save Custom Food</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual log modal */}
      <AnimatePresence>
        {showManualLogModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[24px] p-6 max-w-sm w-full space-y-4 relative shadow-2xl">
              <button onClick={() => setShowManualLogModal(false)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕</button>
              
              <h3 className="font-extrabold text-[var(--text-primary)] flex items-center gap-1.5"><Plus size={16} /> Direct Manual Log</h3>
              
              <form onSubmit={handleManualMealLog} className="space-y-3 text-xs font-semibold">
                <label className="block space-y-1">
                  <span>Meal Name</span>
                  <input type="text" placeholder="e.g. Oats upma + milk" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2.5 outline-none text-[var(--text-primary)]" value={manualName} onChange={(e) => setManualName(e.target.value)} required />
                </label>
                
                <label className="block space-y-1">
                  <span>Meal Type Slot</span>
                  <select className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2.5 outline-none text-[var(--text-primary)]" value={manualMealType} onChange={(e) => setManualMealType(e.target.value as MealType)}>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Morning Snack">Morning Snack</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Evening Snack">Evening Snack</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Post Workout">Post Workout</option>
                  </select>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="block space-y-1">
                    <span>Calories</span>
                    <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2.5 outline-none text-center text-[var(--text-primary)]" value={manualCalories} onChange={(e) => setManualCalories(parseInt(e.target.value) || 0)} />
                  </label>
                  <label className="block space-y-1">
                    <span>Protein (g)</span>
                    <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2.5 outline-none text-center text-[var(--text-primary)]" value={manualProtein} onChange={(e) => setManualProtein(parseInt(e.target.value) || 0)} />
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <label className="block space-y-1">
                    <span>Carbs (g)</span>
                    <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2.5 outline-none text-center text-[var(--text-primary)]" value={manualCarbs} onChange={(e) => setManualCarbs(parseInt(e.target.value) || 0)} />
                  </label>
                  <label className="block space-y-1">
                    <span>Fat (g)</span>
                    <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2.5 outline-none text-center text-[var(--text-primary)]" value={manualFat} onChange={(e) => setManualFat(parseInt(e.target.value) || 0)} />
                  </label>
                  <label className="block space-y-1">
                    <span>Fiber (g)</span>
                    <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2.5 outline-none text-center text-[var(--text-primary)]" value={manualFiber} onChange={(e) => setManualFiber(parseInt(e.target.value) || 0)} />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-[var(--border-color)] pt-2">
                  <label className="block space-y-1">
                    <span>Sugar (g)</span>
                    <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2 outline-none text-center text-[var(--text-primary)]" value={manualSugar} onChange={(e) => setManualSugar(parseInt(e.target.value) || 0)} />
                  </label>
                  <label className="block space-y-1">
                    <span>Sodium (mg)</span>
                    <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent p-2 outline-none text-center text-[var(--text-primary)]" value={manualSodium} onChange={(e) => setManualSodium(parseInt(e.target.value) || 0)} />
                  </label>
                </div>

                <button type="submit" className="btn-premium w-full py-3.5 mt-3 shadow-md active:scale-95">Log Meal Directly</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

const MOTIVATIONAL_QUOTES = [
  "Consistency beats intensity. Keep logging and stay true to your goals.",
  "Your health is an investment, not an expense.",
  "Make healthy choices today that your future self will thank you for.",
  "Every meal is a chance to nourish your body and fuel your potential.",
  "You don't have to be perfect; you just have to keep moving forward."
];

function CircularProgress({ percent, color, strokeWidth = 5 }: { percent: number; color: string; strokeWidth?: number }) {
  const radius = 35;
  const stroke = strokeWidth;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
      <circle
        stroke="var(--border-color)"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset }}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
}
