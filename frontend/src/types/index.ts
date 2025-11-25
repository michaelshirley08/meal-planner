// Core Types for Meal Planner Frontend

export interface Quantity {
  whole: number;
  num: number;
  denom: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Ingredient {
  id: number;
  name: string;
  category: string;
  categoryId: number;
  measurementType: 'volume' | 'mass' | 'count';
  aliases?: string[];
  usedInRecipes?: number;
}

export interface RecipeIngredient {
  id: number;
  ingredientId: number;
  ingredient: Ingredient;
  quantity: Quantity;
  unit: string;
  prepNote?: string;
  displayOrder: number;
}

export interface Recipe {
  id: number;
  userId: number;
  name: string;
  description?: string;
  cuisineType?: string;
  defaultServings: number;
  prepTime?: number;
  cookTime?: number;
  instructions?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  ingredients?: RecipeIngredient[];
  averageRating?: number;
  timesMade?: number;
}

export interface RecipeRating {
  id: number;
  recipeId: number;
  rating: number;
  notes?: string;
  dateCooked: string;
  createdAt: string;
}

export interface MealPlan {
  id: number;
  userId: number;
  recipeId: number;
  recipe: Recipe;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servingOverride?: number;
  notes?: string;
  completed: boolean;
  createdAt: string;
}

export interface ShoppingListIngredient {
  ingredientId: number;
  ingredientName: string;
  quantity: Quantity;
  unit: string;
  baseValue?: number;
  baseUnit?: string;
  prepNotes: string[];
  recipeReferences: {
    recipeId: number;
    recipeName: string;
    quantity: Quantity;
    unit: string;
  }[];
  checked: boolean;
}

export interface ShoppingListCategory {
  category: string;
  displayOrder: number;
  ingredients: ShoppingListIngredient[];
}

export interface ShoppingList {
  startDate: string;
  endDate: string;
  totalMeals: number;
  ingredientsByCategory: ShoppingListCategory[];
}

export interface IngredientCategory {
  id: number;
  userId: number;
  name: string;
  displayOrder: number;
  isSystemCategory: boolean;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface RecipeForm {
  name: string;
  description?: string;
  cuisineType?: string;
  defaultServings: number;
  prepTime?: number;
  cookTime?: number;
  instructions?: string;
  imageUrl?: string;
  ingredients: {
    ingredientId: number;
    quantity: string; // Will be parsed to Quantity
    unit: string;
    prepNote?: string;
  }[];
}

export interface MealPlanForm {
  recipeId: number;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servingOverride?: number;
  notes?: string;
}

// API Response types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
