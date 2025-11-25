import { apiClient } from './api';
import type { ShoppingList } from '../types';

export const shoppingListService = {
  async getShoppingList(startDate: string, endDate: string): Promise<ShoppingList> {
    const response = await apiClient.get<ShoppingList>('/shopping-lists', { startDate, endDate });
    return response.data;
  },

  async getWeekShoppingList(startDate: string): Promise<ShoppingList> {
    const response = await apiClient.get<ShoppingList>('/shopping-lists/week', { startDate });
    return response.data;
  },

  async getMonthShoppingList(year: number, month: number): Promise<ShoppingList> {
    const response = await apiClient.get<ShoppingList>('/shopping-lists/month', { year, month });
    return response.data;
  },

  async toggleItem(ingredientId: number, checked: boolean): Promise<void> {
    await apiClient.post(`/shopping-lists/items/${ingredientId}/toggle`, { checked });
  },

  async getCheckedItems(): Promise<number[]> {
    const response = await apiClient.get<{ ingredientIds: number[] }>('/shopping-lists/items');
    return response.data.ingredientIds || [];
  },

  async clearCheckedItems(): Promise<void> {
    await apiClient.delete('/shopping-lists/items');
  },
};
