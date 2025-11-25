import { apiClient } from './api';
import type { Ingredient, IngredientCategory } from '../types';

export const ingredientService = {
  async getIngredients(search?: string): Promise<Ingredient[]> {
    const response = await apiClient.get<Ingredient[]>('/ingredients', { search });
    return response.data;
  },

  async getIngredient(id: number): Promise<Ingredient> {
    const response = await apiClient.get<Ingredient>(`/ingredients/${id}`);
    return response.data;
  },

  async createIngredient(ingredient: Partial<Ingredient>): Promise<Ingredient> {
    const response = await apiClient.post<Ingredient>('/ingredients', ingredient);
    return response.data;
  },

  async updateIngredient(id: number, ingredient: Partial<Ingredient>): Promise<Ingredient> {
    const response = await apiClient.put<Ingredient>(`/ingredients/${id}`, ingredient);
    return response.data;
  },

  async deleteIngredient(id: number): Promise<void> {
    await apiClient.delete(`/ingredients/${id}`);
  },

  async searchIngredients(query: string): Promise<Ingredient[]> {
    const response = await apiClient.get<Ingredient[]>('/ingredients/search', { q: query });
    return response.data;
  },

  async getCategories(): Promise<IngredientCategory[]> {
    const response = await apiClient.get<IngredientCategory[]>('/ingredients/categories');
    return response.data;
  },
};
