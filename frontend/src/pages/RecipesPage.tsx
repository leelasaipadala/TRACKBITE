import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  SlidersHorizontal, 
  Heart, 
  Share2, 
  Eye, 
  Plus, 
  Calendar, 
  RefreshCw, 
  Star, 
  Clock, 
  ChefHat, 
  Utensils, 
  X, 
  TrendingUp, 
  Printer, 
  Download, 
  Sparkles, 
  Copy, 
  Award,
  ListPlus,
  BookOpen
} from 'lucide-react';
import { 
  readNutritionState, 
  saveNutritionState, 
  type MealType, 
  type NutritionEntry 
} from '../services/nutritionTracking';
import { 
  fetchRecipes, 
  fetchRecipeDetail, 
  fetchGoalRecommendations, 
  fetchTrendingRecipes, 
  toggleFavorite, 
  logRecipeMeal, 
  addRecipeToWeek, 
  submitReview, 
  type Recipe, 
  type RecipeReview, 
  type FetchRecipesParams 
} from '../services/recipes';

// Hardcoded Categories list matching requirements
const CATEGORIES = [
  { name: 'Breakfast', label: 'Breakfast', icon: '🍳' },
  { name: 'Morning Snack', label: 'Morning Snack', icon: '🍎' },
  { name: 'Lunch', label: 'Lunch', icon: '🍲' },
  { name: 'Evening Snack', label: 'Evening Snack', icon: '🥜' },
  { name: 'Dinner', label: 'Dinner', icon: '🍽️' },
  { name: 'Post Workout', label: 'Post Workout', icon: '🥤' },
  { name: 'Smoothies', label: 'Smoothies', icon: '🍹' },
  { name: 'Healthy Desserts', label: 'Healthy Desserts', icon: '🍰' },
  { name: 'Weight Loss Meals', label: 'Weight Loss', icon: '🥗' },
  { name: 'Weight Gain Meals', label: 'Weight Gain', icon: '🥞' },
  { name: 'Muscle Gain Meals', label: 'Muscle Gain', icon: '🥩' },
  { name: 'Lean Bulk Meals', label: 'Lean Bulk', icon: '🍚' },
  { name: 'Body Recomposition Meals', label: 'Body Recomp', icon: '⚖️' },
  { name: 'Healthy Lifestyle Meals', label: 'Healthy Lifestyle', icon: '🌱' }
];

const DIET_FILTERS = [
  { name: 'Vegetarian', label: 'Vegetarian' },
  { name: 'Vegan', label: 'Vegan' },
  { name: 'Eggetarian', label: 'Eggetarian' },
  { name: 'Non-Vegetarian', label: 'Non-Vegetarian' },
  { name: 'Gluten Free', label: 'Gluten Free' },
  { name: 'Dairy Free', label: 'Dairy Free' },
  { name: 'High Protein', label: 'High Protein' },
  { name: 'Low Carb', label: 'Low Carb' },
  { name: 'Low Fat', label: 'Low Fat' },
  { name: 'High Fiber', label: 'High Fiber' }
];

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest Recipes' },
  { value: 'highest-protein', label: 'Highest Protein' },
  { value: 'lowest-calories', label: 'Lowest Calories' },
  { value: 'highest-rating', label: 'Highest Rating' },
  { value: 'quickest-recipe', label: 'Quickest Cook Time' },
  { value: 'most-popular', label: 'Most Popular' }
];

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // User Goal Info
  const [currentGoalType, setCurrentGoalType] = useState<string>('Maintain Weight');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [caloriesMin, setCaloriesMin] = useState<number | ''>('');
  const [caloriesMax, setCaloriesMax] = useState<number | ''>('');
  const [proteinMin, setProteinMin] = useState<number | ''>('');
  const [carbsMax, setCarbsMax] = useState<number | ''>('');
  const [fatMax, setFatMax] = useState<number | ''>('');
  const [fiberMin, setFiberMin] = useState<number | ''>('');
  const [cookTimeMax, setCookTimeMax] = useState<number | ''>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [selectedSort, setSelectedSort] = useState('latest');

  // Detailed Modal states
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeReviews, setRecipeReviews] = useState<RecipeReview[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Logging triggers
  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [targetPlannerRecipe, setTargetPlannerRecipe] = useState<Recipe | null>(null);
  const [plannerDay, setPlannerDay] = useState('Monday');
  const [plannerMealType, setPlannerMealType] = useState<MealType>('Breakfast');

  // Grocery List state
  const [groceryList, setGroceryList] = useState<Record<string, string[]>>({});
  const [showGroceryDrawer, setShowGroceryDrawer] = useState(false);

  // Success/Error Toasts
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: 'success' | 'error' | 'info' }[]>([]);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}`;
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // Load Initial Data
  useEffect(() => {
    loadAllRecipes();
    loadTrendingAndRecommendations();
    loadRecentlyViewed();
  }, []);

  const loadAllRecipes = async () => {
    setLoading(true);
    try {
      const params: FetchRecipesParams = {
        search: searchQuery,
        category: selectedCategory,
        caloriesMin: caloriesMin !== '' ? Number(caloriesMin) : undefined,
        caloriesMax: caloriesMax !== '' ? Number(caloriesMax) : undefined,
        proteinMin: proteinMin !== '' ? Number(proteinMin) : undefined,
        carbsMax: carbsMax !== '' ? Number(carbsMax) : undefined,
        fatMax: fatMax !== '' ? Number(fatMax) : undefined,
        fiberMin: fiberMin !== '' ? Number(fiberMin) : undefined,
        cookTimeMax: cookTimeMax !== '' ? Number(cookTimeMax) : undefined,
        difficulty: selectedDifficulty || undefined,
        dietPreference: selectedDiet || undefined,
        sort: selectedSort
      };
      const data = await fetchRecipes(params);
      setRecipes(data);
    } catch {
      showToast('Could not load recipe list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on parameter updates
  useEffect(() => {
    loadAllRecipes();
  }, [selectedCategory, selectedSort, selectedDifficulty, selectedDiet]);

  const loadTrendingAndRecommendations = async () => {
    try {
      const trending = await fetchTrendingRecipes();
      setTrendingRecipes(trending);

      // Recommendations
      const reco = await fetchGoalRecommendations();
      setRecommendedRecipes(reco.recipes);
      setCurrentGoalType(reco.goal);
    } catch (err) {
      console.warn('Backend recommendations failing, showing trending fallbacks');
    }
  };

  const loadRecentlyViewed = () => {
    try {
      const saved = localStorage.getItem('recently-viewed-recipes');
      if (saved) {
        setRecentlyViewed(JSON.parse(saved));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveToRecentlyViewed = (recipe: Recipe) => {
    try {
      const saved = localStorage.getItem('recently-viewed-recipes');
      let list: Recipe[] = saved ? JSON.parse(saved) : [];
      list = list.filter(r => r._id !== recipe._id); // Avoid duplicates
      list.unshift(recipe); // Add to top
      list = list.slice(0, 5); // Max 5 items
      localStorage.setItem('recently-viewed-recipes', JSON.stringify(list));
      setRecentlyViewed(list);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFavoriteToggle = async (recipe: Recipe) => {
    try {
      const res = await toggleFavorite(recipe._id);
      if (res.favorited) {
        setFavorites(prev => [...prev, recipe._id]);
        showToast(`Added ${recipe.title} to Favorites!`, 'success');
      } else {
        setFavorites(prev => prev.filter(id => id !== recipe._id));
        showToast(`Removed ${recipe.title} from Favorites.`, 'info');
      }
    } catch (error) {
      // Offline toggle fallback
      if (favorites.includes(recipe._id)) {
        setFavorites(prev => prev.filter(id => id !== recipe._id));
        showToast('Removed from local favorites.', 'info');
      } else {
        setFavorites(prev => [...prev, recipe._id]);
        showToast('Added to local favorites.', 'success');
      }
    }
  };

  // View detailed recipe overlay
  const handleViewRecipe = async (recipe: Recipe) => {
    saveToRecentlyViewed(recipe);
    setSelectedRecipe(recipe);
    setShowDetailModal(true);
    setNewReviewComment('');
    setNewReviewRating(5);
    try {
      const details = await fetchRecipeDetail(recipe._id);
      setSelectedRecipe(details.recipe);
      setRecipeReviews(details.reviews);
    } catch (err) {
      console.warn('Could not load extra recipe reviews from server.');
      setRecipeReviews([]);
    }
  };

  // Post rating review
  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipe) return;
    try {
      const res = await submitReview(selectedRecipe._id, newReviewRating, newReviewComment);
      setRecipeReviews(prev => [res.review, ...prev]);
      setSelectedRecipe(res.recipe); // Update average ratings
      showToast('Review submitted successfully!', 'success');
      setNewReviewComment('');
    } catch {
      showToast('Failed to post review.', 'error');
    }
  };

  // Log Recipe to Today's Dashboard Meals
  const handleLogToToday = async (recipe: Recipe, typeMeal: MealType) => {
    try {
      // 1. Send API request to backend
      const todayDate = new Date().toISOString().slice(0, 10);
      try {
        await logRecipeMeal(recipe._id, typeMeal, todayDate);
      } catch (err) {
        console.warn('Backend logging failed, updating local state only');
      }

      // 2. Load and update localStorage state so Dashboard renders instantly
      const localState = readNutritionState();
      const newEntry: NutritionEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        mealType: typeMeal,
        name: recipe.title,
        servingSize: `${recipe.servings || 1} serving(s)`,
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
        favorite: favorites.includes(recipe._id),
        createdAt: new Date().toISOString()
      };

      localState.entries.push(newEntry);
      saveNutritionState(localState);

      // 3. Dispatch global custom event for Dashboard Page
      window.dispatchEvent(new Event('nutrition-update'));
      showToast(`Logged ${recipe.title} to ${typeMeal}!`, 'success');
    } catch (err) {
      showToast('Could not log meal.', 'error');
    }
  };

  // Log to Weekly Planner
  const handleAddToWeeklyPlanner = async () => {
    if (!targetPlannerRecipe) return;
    try {
      await addRecipeToWeek(targetPlannerRecipe._id, plannerDay, plannerMealType);
      showToast(`Saved to Weekly Planner on ${plannerDay} for ${plannerMealType}!`, 'success');
      setShowPlannerModal(false);
    } catch {
      showToast('Could not save to Weekly Planner.', 'error');
    }
  };

  // Replace Current Meal in Weekly Planner (simply adds it as replacement)
  const handleReplaceMeal = (recipe: Recipe) => {
    setTargetPlannerRecipe(recipe);
    setShowReplaceModal(true);
  };

  const handleConfirmReplace = async () => {
    if (!targetPlannerRecipe) return;
    try {
      await addRecipeToWeek(targetPlannerRecipe._id, plannerDay, plannerMealType);
      showToast(`Replaced meal on ${plannerDay} (${plannerMealType}) with ${targetPlannerRecipe.title}!`, 'success');
      setShowReplaceModal(false);
    } catch {
      showToast('Replacement failed.', 'error');
    }
  };

  // Add Ingredients to Grocery List
  const handleAddIngredientsToGrocery = (recipe: Recipe) => {
    setGroceryList(prev => {
      const updated = { ...prev };
      recipe.ingredients.forEach(ing => {
        const cat = ing.category || 'Other';
        if (!updated[cat]) {
          updated[cat] = [];
        }
        const desc = `${ing.quantity} ${ing.name}`;
        if (!updated[cat].includes(desc)) {
          updated[cat].push(desc);
        }
      });
      return updated;
    });
    showToast(`Ingredients for ${recipe.title} added to shopping list!`, 'success');
  };

  // Remove single grocery item
  const handleRemoveGroceryItem = (category: string, index: number) => {
    setGroceryList(prev => {
      const updated = { ...prev };
      updated[category] = updated[category].filter((_, idx) => idx !== index);
      if (updated[category].length === 0) {
        delete updated[category];
      }
      return updated;
    });
  };

  // Download Grocery List as PDF (Simulated text file download)
  const handleDownloadGroceryText = () => {
    let content = '=== MY NUTRI-VIBE SHOPPING LIST ===\n\n';
    Object.entries(groceryList).forEach(([cat, items]) => {
      content += `[${cat.toUpperCase()}]\n`;
      items.forEach(item => {
        content += `- ${item}\n`;
      });
      content += '\n';
    });
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'grocery_list.txt';
    link.click();
    showToast('Grocery list downloaded successfully!', 'success');
  };

  // Print Grocery List
  const handlePrintGrocery = () => {
    window.print();
  };

  // Clear search parameters
  const clearFilters = () => {
    setCaloriesMin('');
    setCaloriesMax('');
    setProteinMin('');
    setCarbsMax('');
    setFatMax('');
    setFiberMin('');
    setCookTimeMax('');
    setSelectedDifficulty('');
    setSelectedDiet('');
    setSelectedSort('latest');
    showToast('Filters cleared', 'info');
  };

  // Recharts Helper for comparing recipe nutrition with daily targets
  const targetNutrition = {
    calories: 2000,
    protein: 130,
    carbs: 220,
    fat: 65,
    fiber: 30
  };

  const chartData = selectedRecipe ? [
    { name: 'Calories', Recipe: selectedRecipe.nutrition.calories, Target: targetNutrition.calories },
    { name: 'Protein (g)', Recipe: selectedRecipe.nutrition.protein, Target: targetNutrition.protein },
    { name: 'Carbs (g)', Recipe: selectedRecipe.nutrition.carbs, Target: targetNutrition.carbs },
    { name: 'Fat (g)', Recipe: selectedRecipe.nutrition.fat, Target: targetNutrition.fat },
    { name: 'Fiber (g)', Recipe: selectedRecipe.nutrition.fiber || 0, Target: targetNutrition.fiber },
  ] : [];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.05),_transparent_40%),linear-gradient(135deg,_#f6fff8_0%,_#eefef5_100%)] dark:bg-[linear-gradient(135deg,_#09130e_0%,_#050c08_100%)] text-slate-800 dark:text-slate-100 p-4 md:p-8 transition-colors duration-300">
      
      {/* Toast notifications rendering */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`p-4 rounded-2xl shadow-xl backdrop-blur-xl border font-medium text-xs flex items-center justify-between ${
                t.type === 'success' 
                  ? 'bg-emerald-500/90 border-emerald-400 text-white shadow-emerald-500/10' 
                  : t.type === 'error' 
                    ? 'bg-rose-500/90 border-rose-400 text-white shadow-rose-500/10' 
                    : 'bg-slate-800/90 border-slate-700 text-white'
              }`}
            >
              <span>{t.msg}</span>
              <button onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))} className="ml-3 hover:opacity-85"><X size={14} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* BANNER HEADER */}
        <header className="rounded-[2.5rem] border border-emerald-100/10 dark:border-emerald-950/20 bg-white/60 dark:bg-slate-900/60 p-6 md:p-10 shadow-lg backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2.5 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">Nutritional Culinary Suite</span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Curated Recipe Vault</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              Explore nutrient-dense, goal-supporting meals engineered for your active diet plan. Filter by macros, category, or dietary preferences.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => setShowGroceryDrawer(true)} 
              className="relative flex items-center gap-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-3.5 text-xs font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              <ListPlus size={15} className="text-emerald-600" />
              <span>Grocery Cart</span>
              {Object.keys(groceryList).length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[9px] font-bold rounded-full h-5 w-5 flex items-center justify-center border border-white">
                  {Object.values(groceryList).reduce((acc, current) => acc + current.length, 0)}
                </span>
              )}
            </button>
            <button 
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/10 px-5 py-3.5 text-xs font-bold hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 transition"
            >
              <RefreshCw size={14} />
              Reset Config
            </button>
          </div>
        </header>

        {/* SEARCH AND CATEGORIES SLIDER */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search recipe title, key ingredients, category..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:border-emerald-500 text-sm shadow-sm transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadAllRecipes()}
              />
            </div>
            
            {/* Filter Toggle Buttons */}
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => setShowFilterDrawer(true)} 
                className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 text-sm font-semibold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <SlidersHorizontal size={15} />
                <span>Filters</span>
              </button>
              <button 
                onClick={loadAllRecipes} 
                className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 text-sm font-semibold shadow-md shadow-emerald-500/15 transition"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Categories Pill Slider */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
            <button
              onClick={() => setSelectedCategory('')}
              className={`flex-shrink-0 px-4 py-2.5 rounded-full text-xs font-semibold transition border ${
                selectedCategory === '' 
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition border ${
                  selectedCategory === cat.name 
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* AI CAPABILITY BOX (Apple Design) */}
        <section className="rounded-3xl border border-emerald-100/10 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 dark:from-emerald-950/20 dark:to-slate-900/10 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                AI Coaching Ready 
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md">V2 Modules</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Reserved models loaded for: **AI Recipe Recommendation**, **AI Nutrition Coach**, and **AI Food Recognition**.
              </p>
            </div>
          </div>
          <button className="rounded-xl border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 px-4 py-2 text-xs font-bold hover:bg-emerald-500/10 transition">
            Interface Coach
          </button>
        </section>

        {/* GOAL-BASED RECOMMENDATIONS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Award size={18} className="text-emerald-500" />
            <h2 className="text-xl font-bold tracking-tight">Goal-Based Suggestions ({currentGoalType})</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedRecipes.slice(0, 3).map(recipe => (
              <RecipeCard 
                key={`reco-${recipe._id}`} 
                recipe={recipe} 
                onView={handleViewRecipe}
                onLog={handleLogToToday}
                onPlan={(r) => { setTargetPlannerRecipe(r); setShowPlannerModal(true); }}
                onReplace={handleReplaceMeal}
                onFavorite={handleFavoriteToggle}
                isFavorited={favorites.includes(recipe._id)}
              />
            ))}
            {recommendedRecipes.length === 0 && (
              <div className="sm:col-span-3 rounded-2xl bg-white dark:bg-slate-900 p-8 border text-center text-xs text-slate-400">
                Complete assessment wizard to calculate personalized goals and display target meal recommendations.
              </div>
            )}
          </div>
        </section>

        {/* MAIN RESULTS GRID & TRENDING */}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          
          {/* Main Recipes Search Result Grid */}
          <main className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Matches & Curated Library</h2>
              <div className="text-xs text-slate-400 font-semibold">{recipes.length} Meals Loaded</div>
            </div>
            
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {[1, 2, 3, 4].map(idx => (
                  <div key={idx} className="h-80 rounded-[2rem] bg-slate-200/50 dark:bg-slate-900/60 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {recipes.map(recipe => (
                  <RecipeCard 
                    key={recipe._id} 
                    recipe={recipe} 
                    onView={handleViewRecipe}
                    onLog={handleLogToToday}
                    onPlan={(r) => { setTargetPlannerRecipe(r); setShowPlannerModal(true); }}
                    onReplace={handleReplaceMeal}
                    onFavorite={handleFavoriteToggle}
                    isFavorited={favorites.includes(recipe._id)}
                  />
                ))}
                {recipes.length === 0 && (
                  <div className="sm:col-span-2 text-center rounded-[2rem] border-2 border-dashed bg-white dark:bg-slate-900 p-16 text-slate-400">
                    <Utensils size={36} className="mx-auto mb-4 text-slate-300" />
                    <p className="font-semibold text-sm">No recipes match your criteria.</p>
                    <button onClick={clearFilters} className="mt-3 text-xs font-bold text-emerald-500 hover:underline">Clear all filters</button>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* Sidebar Section: Trending / Recently Viewed */}
          <aside className="space-y-8">
            {/* Trending Recipes */}
            <div className="rounded-[2rem] border border-emerald-100/10 dark:border-emerald-950/20 bg-white/40 dark:bg-slate-900/40 p-6 shadow-sm backdrop-blur-xl space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><TrendingUp size={16} className="text-emerald-500" /> Trending Right Now</h3>
              <div className="space-y-3.5">
                {trendingRecipes.slice(0, 4).map(recipe => (
                  <div 
                    key={`trend-${recipe._id}`} 
                    onClick={() => handleViewRecipe(recipe)}
                    className="flex gap-3 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/30 p-2 rounded-xl transition duration-200"
                  >
                    <img 
                      src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80'} 
                      className="w-14 h-14 rounded-xl object-cover" 
                      alt="" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">{recipe.title}</h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold mt-1">
                        <span>{recipe.nutrition.calories} kcal</span>
                        <span>•</span>
                        <span className="flex items-center text-amber-500"><Star size={10} className="fill-current mr-0.5" />{recipe.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <div className="rounded-[2rem] border border-emerald-100/10 dark:border-emerald-950/20 bg-white/40 dark:bg-slate-900/40 p-6 shadow-sm backdrop-blur-xl space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><Eye size={16} className="text-slate-500" /> Recently Viewed</h3>
                <div className="space-y-3.5">
                  {recentlyViewed.map(recipe => (
                    <div 
                      key={`recent-${recipe._id}`} 
                      onClick={() => handleViewRecipe(recipe)}
                      className="flex gap-3 cursor-pointer group p-2 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-xl transition duration-200"
                    >
                      <img 
                        src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80'} 
                        className="w-12 h-12 rounded-xl object-cover" 
                        alt="" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 transition">{recipe.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{recipe.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

      </div>

      {/* FILTER DRAWER SLIDE OVER (Apple Sheet design) */}
      <AnimatePresence>
        {showFilterDrawer && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilterDrawer(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-900 border-l border-emerald-100/10 shadow-2xl p-6 overflow-y-auto z-50 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <SlidersHorizontal size={16} /> Advanced Parameters
                  </h3>
                  <button onClick={() => setShowFilterDrawer(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"><X size={20} /></button>
                </div>

                {/* Categories Select Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Diet Type Preference</label>
                  <div className="grid grid-cols-2 gap-2">
                    {DIET_FILTERS.map(diet => (
                      <button
                        key={diet.name}
                        onClick={() => setSelectedDiet(selectedDiet === diet.name ? '' : diet.name)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border text-center transition ${
                          selectedDiet === diet.name 
                            ? 'bg-emerald-600 text-white border-emerald-500' 
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {diet.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Macro Nutrient Ranges */}
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Macronutrient Ranges</span>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">Calories Min</span>
                      <input 
                        type="number" 
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2 text-xs outline-none" 
                        value={caloriesMin}
                        onChange={(e) => setCaloriesMin(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">Calories Max</span>
                      <input 
                        type="number" 
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2 text-xs outline-none" 
                        value={caloriesMax}
                        onChange={(e) => setCaloriesMax(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">Protein Min (g)</span>
                      <input 
                        type="number" 
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2 text-xs outline-none text-center" 
                        value={proteinMin}
                        onChange={(e) => setProteinMin(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">Carbs Max (g)</span>
                      <input 
                        type="number" 
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2 text-xs outline-none text-center" 
                        value={carbsMax}
                        onChange={(e) => setCarbsMax(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">Fat Max (g)</span>
                      <input 
                        type="number" 
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2 text-xs outline-none text-center" 
                        value={fatMax}
                        onChange={(e) => setFatMax(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </label>
                  </div>
                </div>

                {/* Difficulty & Cook time */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="block space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Difficulty</span>
                    <select 
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2 text-xs outline-none" 
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                    >
                      <option value="">All</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Max Cook Time</span>
                    <input 
                      type="number" 
                      placeholder="mins"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2 text-xs outline-none" 
                      value={cookTimeMax}
                      onChange={(e) => setCookTimeMax(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </label>
                </div>

                {/* Sort Option */}
                <label className="block space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Sorting</span>
                  <select 
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2 text-xs outline-none" 
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex gap-3 border-t pt-4 mt-6">
                <button 
                  onClick={clearFilters} 
                  className="flex-1 rounded-xl border py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => { loadAllRecipes(); setShowFilterDrawer(false); }} 
                  className="flex-1 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500"
                >
                  Apply & Search
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* RECIPE DETAILS OVERLAY MODAL */}
      <AnimatePresence>
        {showDetailModal && selectedRecipe && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 overflow-y-auto"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-10 bottom-10 md:inset-x-12 lg:inset-x-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-emerald-100/10 shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Modal Body Container */}
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                {/* Hero header */}
                <div className="relative h-64 md:h-80 w-full">
                  <img src={selectedRecipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80'} className="h-full w-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  
                  {/* Close button */}
                  <button 
                    onClick={() => setShowDetailModal(false)} 
                    className="absolute top-6 right-6 p-2 rounded-full bg-slate-900/60 text-white border border-white/10 hover:bg-slate-900 transition"
                  >
                    <X size={20} />
                  </button>

                  {/* Badges and titles */}
                  <div className="absolute bottom-6 left-6 md:left-10 text-white space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-bold uppercase">{selectedRecipe.category}</span>
                      <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase">{selectedRecipe.difficulty}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold">{selectedRecipe.title}</h2>
                  </div>
                </div>

                {/* Split grid details */}
                <div className="p-6 md:p-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                  
                  {/* Left Column: Description, ingredients, steps */}
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recipe Summary</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{selectedRecipe.description || 'No description available for this healthy recipe template.'}</p>
                    </div>

                    {/* Time breakdown cards */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3 text-center border">
                        <Clock size={16} className="mx-auto text-slate-400 mb-1" />
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Prep Time</div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedRecipe.prepTime} min</div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3 text-center border">
                        <Clock size={16} className="mx-auto text-slate-400 mb-1" />
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Cook Time</div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedRecipe.cookTime} min</div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-3 text-center border">
                        <Utensils size={16} className="mx-auto text-slate-400 mb-1" />
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Servings</div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedRecipe.servings} Servings</div>
                      </div>
                    </div>

                    {/* Ingredients grouped */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ingredients Checklist</h3>
                        <button 
                          onClick={() => handleAddIngredientsToGrocery(selectedRecipe)} 
                          className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline"
                        >
                          <ListPlus size={14} /> Add Ingredients To Grocery List
                        </button>
                      </div>
                      
                      <div className="grid gap-3 sm:grid-cols-2">
                        {selectedRecipe.ingredients.map((ing, idx) => (
                          <label 
                            key={idx} 
                            className="flex items-center gap-3 cursor-pointer p-3 border rounded-2xl bg-slate-50/40 dark:bg-slate-850/20 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                          >
                            <input type="checkbox" className="h-4.5 w-4.5 accent-emerald-600 rounded" />
                            <div className="text-xs">
                              <span className="font-bold text-slate-800 dark:text-white mr-1">{ing.quantity}</span>
                              <span className="text-slate-600 dark:text-slate-300">{ing.name}</span>
                              <span className="block text-[9px] text-slate-400 font-semibold">{ing.category}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Steps / preparation */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Directions</h3>
                      <div className="space-y-4">
                        {selectedRecipe.steps.map((step, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-200">
                              {idx + 1}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mt-0.5">{step}</p>
                          </div>
                        ))}
                        {selectedRecipe.cookingInstructions && (
                          <div className="mt-4 p-4 rounded-2xl bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/10 text-xs">
                            <span className="font-bold text-emerald-800 dark:text-emerald-400 block mb-1">👨‍🍳 Chef's Cooking Tip</span>
                            {selectedRecipe.cookingInstructions}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Review Comments list */}
                    <div className="space-y-6 border-t pt-8">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recipe Reviews ({recipeReviews.length})</h3>
                      <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {recipeReviews.map(rev => (
                          <div key={rev._id} className="rounded-2xl border p-4 bg-slate-50/20 dark:bg-slate-800/10 space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="text-slate-800 dark:text-white">{rev.userName}</span>
                              <span className="text-amber-500 flex items-center"><Star size={12} className="fill-current mr-0.5" />{rev.rating}</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">{rev.comment}</p>
                          </div>
                        ))}
                        {recipeReviews.length === 0 && (
                          <p className="text-xs text-slate-400 text-center py-4">No reviews yet. Be the first to review this recipe!</p>
                        )}
                      </div>

                      {/* Write Review Form */}
                      <form onSubmit={handlePostReview} className="space-y-3.5 mt-4">
                        <span className="text-xs font-bold text-slate-400 block">Rate & Review</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Your Rating:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(val => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setNewReviewRating(val)}
                                className={`p-0.5 hover:scale-110 transition ${newReviewRating >= val ? 'text-amber-500' : 'text-slate-300'}`}
                              >
                                <Star size={16} className="fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Tell us what you think of this meal..."
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3 text-xs outline-none focus:border-emerald-500 transition"
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                        />
                        <button type="submit" className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 shadow-sm transition">
                          Post Review
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Right Column: Nutrition Charts and comparison */}
                  <div className="space-y-6">
                    <div className="rounded-[2rem] border border-emerald-100/10 dark:border-emerald-950/20 bg-slate-50/50 dark:bg-slate-850/10 p-6 space-y-6">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Nutrition Comparison</h3>
                        <p className="text-xs text-slate-500 mt-1">Recipe Macros compared to standard daily goal targets.</p>
                      </div>

                      {/* Detailed Micronutrient Grid */}
                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="rounded-xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-emerald-50/5 text-center">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Calories</span>
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">{selectedRecipe.nutrition.calories} kcal</span>
                        </div>
                        <div className="rounded-xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-emerald-50/5 text-center">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Protein</span>
                          <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 block">{selectedRecipe.nutrition.protein}g</span>
                        </div>
                        <div className="rounded-xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-emerald-50/5 text-center">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Carbohydrates</span>
                          <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 block">{selectedRecipe.nutrition.carbs}g</span>
                        </div>
                        <div className="rounded-xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-emerald-50/5 text-center">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Fat</span>
                          <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 block">{selectedRecipe.nutrition.fat}g</span>
                        </div>
                      </div>

                      {/* Nutrient progress bars comparing with target */}
                      <div className="space-y-3.5">
                        {chartData.map((d, index) => {
                          const percent = Math.min(100, Math.round((d.Recipe / d.Target) * 100));
                          return (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-350">
                                <span>{d.name}</span>
                                <span>{d.Recipe} / {d.Target} ({percent}%)</span>
                              </div>
                              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div 
                                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" 
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Complete Nutrition Facts list */}
                      <div className="border-t pt-4 space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">Detailed Micronutrients</span>
                        <div className="flex justify-between"><span>Dietary Fiber</span><span className="font-semibold">{selectedRecipe.nutrition.fiber || 0}g</span></div>
                        <div className="flex justify-between"><span>Sugar</span><span className="font-semibold">{selectedRecipe.nutrition.sugar || 0}g</span></div>
                        <div className="flex justify-between"><span>Sodium</span><span className="font-semibold">{selectedRecipe.nutrition.sodium || 0}mg</span></div>
                        <div className="flex justify-between"><span>Potassium</span><span className="font-semibold">{selectedRecipe.nutrition.potassium || 0}mg</span></div>
                        <div className="flex justify-between"><span>Calcium</span><span className="font-semibold">{selectedRecipe.nutrition.calcium || 0}mg</span></div>
                        <div className="flex justify-between"><span>Iron</span><span className="font-semibold">{selectedRecipe.nutrition.iron || 0}mg</span></div>
                        <div className="flex justify-between"><span>Vitamin A</span><span className="font-semibold">{selectedRecipe.nutrition.vitaminA || 0}mcg</span></div>
                        <div className="flex justify-between"><span>Vitamin C</span><span className="font-semibold">{selectedRecipe.nutrition.vitaminC || 0}mg</span></div>
                        <div className="flex justify-between"><span>Vitamin D</span><span className="font-semibold">{selectedRecipe.nutrition.vitaminD || 0}mcg</span></div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>

              {/* Action footer */}
              <div className="border-t p-6 bg-slate-50 dark:bg-slate-900/80 flex flex-wrap gap-3 items-center justify-between">
                <button
                  onClick={() => handleLogToToday(selectedRecipe, 'Breakfast')}
                  className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 shadow-md transition"
                >
                  Log To Today's Breakfast
                </button>
                <div className="flex gap-2.5">
                  <button 
                    onClick={() => { setTargetPlannerRecipe(selectedRecipe); setShowPlannerModal(true); }}
                    className="flex items-center gap-1.5 rounded-2xl bg-white dark:bg-slate-800 border px-4 py-3 text-xs font-semibold hover:bg-slate-50"
                  >
                    <Calendar size={14} /> Weekly Calendar
                  </button>
                  <button 
                    onClick={() => handleReplaceMeal(selectedRecipe)}
                    className="flex items-center gap-1.5 rounded-2xl bg-white dark:bg-slate-800 border px-4 py-3 text-xs font-semibold hover:bg-slate-50"
                  >
                    <RefreshCw size={14} /> Replace Scheduled
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* WEEKLY PLANNER ASSIGN MODAL */}
      <AnimatePresence>
        {showPlannerModal && targetPlannerRecipe && (
          <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 border rounded-[2rem] p-6 max-w-sm w-full space-y-4 shadow-2xl relative"
              >
                <button onClick={() => setShowPlannerModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={18} /></button>
                
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5"><Calendar size={18} className="text-emerald-500" /> Log to Weekly Planner</h3>
                <p className="text-xs text-slate-500">Log "{targetPlannerRecipe.title}" into a targeted day/meal slot.</p>

                <div className="space-y-3.5">
                  <label className="block space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Target Day</span>
                    <select 
                      className="w-full rounded-xl border bg-white dark:bg-slate-800 p-2.5 text-xs outline-none"
                      value={plannerDay}
                      onChange={(e) => setPlannerDay(e.target.value)}
                    >
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                      <option>Saturday</option>
                      <option>Sunday</option>
                    </select>
                  </label>

                  <label className="block space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Meal Slot</span>
                    <select 
                      className="w-full rounded-xl border bg-white dark:bg-slate-800 p-2.5 text-xs outline-none"
                      value={plannerMealType}
                      onChange={(e) => setPlannerMealType(e.target.value as MealType)}
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Morning Snack">Morning Snack</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Evening Snack">Evening Snack</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Post Workout">Post Workout</option>
                    </select>
                  </label>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button onClick={() => setShowPlannerModal(false)} className="flex-1 rounded-xl border py-2.5 text-xs font-semibold text-slate-500">Cancel</button>
                  <button onClick={handleAddToWeeklyPlanner} className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5">Confirm Log</button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* REPLACE MEAL CONFIRMATION MODAL */}
      <AnimatePresence>
        {showReplaceModal && targetPlannerRecipe && (
          <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 border rounded-[2rem] p-6 max-w-sm w-full space-y-4 shadow-2xl relative"
              >
                <button onClick={() => setShowReplaceModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={18} /></button>
                
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5"><RefreshCw size={18} className="text-emerald-500" /> Replace Scheduled Meal</h3>
                <p className="text-xs text-slate-500">Choose the slot you wish to replace with "{targetPlannerRecipe.title}".</p>

                <div className="space-y-3.5">
                  <label className="block space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Weekly Day</span>
                    <select 
                      className="w-full rounded-xl border bg-white dark:bg-slate-800 p-2.5 text-xs outline-none"
                      value={plannerDay}
                      onChange={(e) => setPlannerDay(e.target.value)}
                    >
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                      <option>Saturday</option>
                      <option>Sunday</option>
                    </select>
                  </label>

                  <label className="block space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Meal Type</span>
                    <select 
                      className="w-full rounded-xl border bg-white dark:bg-slate-800 p-2.5 text-xs outline-none"
                      value={plannerMealType}
                      onChange={(e) => setPlannerMealType(e.target.value as MealType)}
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Morning Snack">Morning Snack</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Evening Snack">Evening Snack</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Post Workout">Post Workout</option>
                    </select>
                  </label>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button onClick={() => setShowReplaceModal(false)} className="flex-1 rounded-xl border py-2.5 text-xs font-semibold text-slate-500">Cancel</button>
                  <button onClick={handleConfirmReplace} className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5">Confirm Replace</button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* GROCERY CART SIDE DRAWER */}
      <AnimatePresence>
        {showGroceryDrawer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGroceryDrawer(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-sm z-45"
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-900 border-l border-emerald-100/10 shadow-2xl p-6 overflow-y-auto z-50 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ListPlus size={18} className="text-emerald-500" /> My Shopping Cart
                  </h3>
                  <button onClick={() => setShowGroceryDrawer(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"><X size={20} /></button>
                </div>

                {/* Main list */}
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
                  {Object.entries(groceryList).map(([cat, items]) => (
                    <div key={cat} className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{cat}</span>
                      <div className="space-y-1.5">
                        {items.map((item, index) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between p-2.5 border rounded-xl bg-slate-50/40 dark:bg-slate-850/10 text-xs"
                          >
                            <span className="text-slate-700 dark:text-slate-200">{item}</span>
                            <button 
                              onClick={() => handleRemoveGroceryItem(cat, index)} 
                              className="text-rose-500 hover:text-rose-600"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {Object.keys(groceryList).length === 0 && (
                    <div className="text-center py-16 text-slate-400">
                      <BookOpen size={28} className="mx-auto mb-3 text-slate-350" />
                      <p className="text-xs">Your shopping list is currently empty. Open recipe cards to populate ingredients.</p>
                    </div>
                  )}
                </div>
              </div>

              {Object.keys(groceryList).length > 0 && (
                <div className="border-t pt-4 mt-6 flex flex-col gap-2.5">
                  <button 
                    onClick={handleDownloadGroceryText} 
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3"
                  >
                    <Download size={14} /> Download List (.TXT)
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={handlePrintGrocery} 
                      className="flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold hover:bg-slate-50"
                    >
                      <Printer size={14} /> Print
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(groceryList, null, 2));
                        showToast('Copied shopping cart to clipboard!', 'info');
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold hover:bg-slate-50"
                    >
                      <Copy size={14} /> Share
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

// Subcomponent: Animated Recipe Card with Framer Motion
interface RecipeCardProps {
  recipe: Recipe;
  isFavorited: boolean;
  onView: (recipe: Recipe) => void;
  onLog: (recipe: Recipe, typeMeal: MealType) => void;
  onPlan: (recipe: Recipe) => void;
  onReplace: (recipe: Recipe) => void;
  onFavorite: (recipe: Recipe) => void;
}

function RecipeCard({ 
  recipe, 
  isFavorited,
  onView, 
  onLog, 
  onPlan, 
  onReplace, 
  onFavorite 
}: RecipeCardProps) {
  
  const [showLogOptions, setShowLogOptions] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/recipes/${recipe._id}`);
    alert(`Copied link to clipboard: ${recipe.title}`);
  };

  const handleLogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowLogOptions(!showLogOptions);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-[2rem] border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 shadow-sm hover:shadow-xl dark:shadow-none hover:border-emerald-200 dark:hover:border-emerald-950/40 p-4 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between h-[410px]"
    >
      <div className="space-y-3 cursor-pointer" onClick={() => onView(recipe)}>
        {/* Card Image */}
        <div className="relative h-44 rounded-2xl overflow-hidden">
          <img 
            src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            alt={recipe.title} 
          />
          
          {/* Quick Info Glass Badges */}
          <div className="absolute top-3 left-3 bg-slate-900/60 backdrop-blur-md text-[10px] text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-white/5">
            {recipe.category}
          </div>

          <div className="absolute top-3 right-3 flex gap-1.5">
            {/* Heart Favorite button */}
            <button 
              onClick={(e) => { e.stopPropagation(); onFavorite(recipe); }}
              className={`p-2 rounded-full backdrop-blur-md border hover:scale-110 transition ${
                isFavorited 
                  ? 'bg-rose-500/90 border-rose-400 text-white' 
                  : 'bg-slate-900/60 border-white/10 text-white hover:text-rose-500'
              }`}
            >
              <Heart size={13} className={isFavorited ? 'fill-current' : ''} />
            </button>
            
            {/* Share button */}
            <button 
              onClick={handleShare}
              className="p-2 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-white hover:scale-110 transition"
            >
              <Share2 size={13} />
            </button>
          </div>

          <div className="absolute bottom-3 left-3 bg-black/55 backdrop-blur-md rounded-lg px-2 py-0.5 text-[10px] text-white font-bold flex items-center gap-1">
            <Clock size={11} /> {recipe.prepTime + recipe.cookTime}m
          </div>
        </div>

        {/* Title and Ratings */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1"><ChefHat size={11} /> {recipe.difficulty}</span>
            <span className="text-[10px] font-bold text-amber-500 flex items-center"><Star size={11} className="fill-current mr-0.5" />{recipe.rating}</span>
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate group-hover:text-emerald-600 transition duration-200">{recipe.title}</h3>
        </div>

        {/* Macros panel (Glass Overlay styling) */}
        <div className="grid grid-cols-4 gap-1.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 p-2 text-center text-[10px] font-medium border border-slate-100 dark:border-slate-800/40">
          <div>
            <span className="text-slate-400 block font-bold text-[8px] uppercase">Cal</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold mt-0.5 block">{recipe.nutrition.calories}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-bold text-[8px] uppercase">Prot</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold mt-0.5 block">{recipe.nutrition.protein}g</span>
          </div>
          <div>
            <span className="text-slate-400 block font-bold text-[8px] uppercase">Carbs</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold mt-0.5 block">{recipe.nutrition.carbs}g</span>
          </div>
          <div>
            <span className="text-slate-400 block font-bold text-[8px] uppercase">Fat</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold mt-0.5 block">{recipe.nutrition.fat}g</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-3 space-y-1.5 relative">
        <button 
          onClick={() => onView(recipe)} 
          className="w-full text-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 py-2.5 text-xs font-bold text-slate-800 dark:text-white transition duration-200"
        >
          View Recipe
        </button>

        <div className="flex gap-1.5">
          <button 
            onClick={handleLogClick}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-extrabold shadow-sm transition"
          >
            <Plus size={11} /> Log Today
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onPlan(recipe); }}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
            title="Add To Weekly Planner"
          >
            <Calendar size={13} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onReplace(recipe); }}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
            title="Replace Scheduled Meal"
          >
            <RefreshCw size={13} />
          </button>
        </div>

        {/* Log Option popover panel */}
        <AnimatePresence>
          {showLogOptions && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowLogOptions(false)} />
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-12 left-0 right-0 z-20 bg-white dark:bg-slate-900 border rounded-2xl p-2 shadow-2xl flex flex-col gap-1 text-[11px] font-semibold"
              >
                <button 
                  onClick={(e) => { e.stopPropagation(); onLog(recipe, 'Breakfast'); setShowLogOptions(false); }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  🌅 Log to Breakfast
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onLog(recipe, 'Lunch'); setShowLogOptions(false); }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  ☀️ Log to Lunch
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onLog(recipe, 'Dinner'); setShowLogOptions(false); }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  🌌 Log to Dinner
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onLog(recipe, 'Evening Snack'); setShowLogOptions(false); }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  🍎 Log to Evening Snack
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
