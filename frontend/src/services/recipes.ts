import api from './api';

export interface RecipeIngredient {
  name: string;
  quantity: string;
  category: 'Vegetables' | 'Fruits' | 'Protein' | 'Dairy' | 'Grains' | 'Healthy Fats' | 'Spices' | 'Other';
}

export interface RecipeNutrition {
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

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: number;
  cookTime: number;
  servings: number;
  rating: number;
  ratingsCount: number;
  ingredients: RecipeIngredient[];
  steps: string[];
  cookingInstructions: string;
  nutrition: RecipeNutrition;
  dietaryType: string[];
  goalKeywords: string[];
  createdAt?: string;
}

export interface RecipeReview {
  _id: string;
  user: string;
  userName: string;
  recipe: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface FetchRecipesParams {
  search?: string;
  category?: string;
  caloriesMin?: number;
  caloriesMax?: number;
  proteinMin?: number;
  carbsMax?: number;
  fatMax?: number;
  fiberMin?: number;
  cookTimeMax?: number;
  difficulty?: string;
  dietPreference?: string;
  goal?: string;
  sort?: string;
}

export const fetchRecipes = async (params: FetchRecipesParams = {}): Promise<Recipe[]> => {
  const { data } = await api.get<Recipe[]>('/recipes', { params });
  return data;
};

export const fetchRecipeDetail = async (id: string): Promise<{ recipe: Recipe; reviews: RecipeReview[] }> => {
  const { data } = await api.get<{ success: boolean; recipe: Recipe; reviews: RecipeReview[] }>(`/recipes/${id}`);
  return { recipe: data.recipe, reviews: data.reviews };
};

export const fetchGoalRecommendations = async (): Promise<{ goal: string; recipes: Recipe[] }> => {
  const { data } = await api.get<{ success: boolean; goal: string; recipes: Recipe[] }>('/recipes/recommended');
  return { goal: data.goal, recipes: data.recipes };
};

export const fetchTrendingRecipes = async (): Promise<Recipe[]> => {
  const { data } = await api.get<Recipe[]>('/recipes/trending');
  return data;
};

export const fetchHistory = async (): Promise<any[]> => {
  const { data } = await api.get<any[]>('/recipes/history');
  return data;
};

export const toggleFavorite = async (recipeId: string): Promise<{ favorited: boolean; message: string }> => {
  const { data } = await api.post<{ success: boolean; favorited: boolean; message: string }>('/recipes/favorite', { recipeId });
  return data;
};

export const logRecipeMeal = async (recipeId: string, mealType: string, date: string): Promise<any> => {
  const { data } = await api.post('/recipes/add-to-meal', { recipeId, mealType, date });
  return data;
};

export const addRecipeToWeek = async (recipeId: string, day: string, mealType: string): Promise<any> => {
  const { data } = await api.post('/recipes/add-to-week', { recipeId, day, mealType });
  return data;
};

export const submitReview = async (recipeId: string, rating: number, comment: string): Promise<{ review: RecipeReview; recipe: Recipe }> => {
  const { data } = await api.post<{ success: boolean; review: RecipeReview; recipe: Recipe }>(`/recipes/${recipeId}/reviews`, { rating, comment });
  return data;
};
