import { apiClient } from './api';
import type { Recipe, RecipeRating } from '../types';

export const recipeService = {
  async getRecipes(params?: {
    search?: string;
    cuisineType?: string;
    sortBy?: string;
  }): Promise<Recipe[]> {
    const response = await apiClient.get<Recipe[]>('/recipes', params);
    return response.data;
  },

  async getRecipe(id: number): Promise<Recipe> {
    const response = await apiClient.get<Recipe>(`/recipes/${id}`);
    return response.data;
  },

  async createRecipe(recipe: Partial<Recipe>): Promise<Recipe> {
    const response = await apiClient.post<Recipe>('/recipes', recipe);
    return response.data;
  },

  async updateRecipe(id: number, recipe: Partial<Recipe>): Promise<Recipe> {
    const response = await apiClient.put<Recipe>(`/recipes/${id}`, recipe);
    return response.data;
  },

  async deleteRecipe(id: number): Promise<void> {
    await apiClient.delete(`/recipes/${id}`);
  },

  async rateRecipe(recipeId: number, rating: number, notes?: string, dateCooked?: string): Promise<RecipeRating> {
    const response = await apiClient.post<RecipeRating>(`/recipes/${recipeId}/ratings`, {
      rating,
      notes,
      dateCooked: dateCooked || new Date().toISOString().split('T')[0],
    });
    return response.data;
  },

  async getRecipeRatings(recipeId: number): Promise<RecipeRating[]> {
    const response = await apiClient.get<RecipeRating[]>(`/recipes/${recipeId}/ratings`);
    return response.data;
  },

  async getFrequentRecipes(): Promise<Recipe[]> {
    const response = await apiClient.get<Recipe[]>('/recipes/frequent');
    return response.data;
  },
};
