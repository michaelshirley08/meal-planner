import { apiClient } from './api';
import type { MealPlan, MealPlanForm } from '../types';

export const mealPlanService = {
  async getMealPlans(startDate: string, endDate: string): Promise<MealPlan[]> {
    const response = await apiClient.get<MealPlan[]>('/meal-plans', { startDate, endDate });
    return response.data;
  },

  async getWeekMealPlans(startDate: string): Promise<MealPlan[]> {
    const response = await apiClient.get<MealPlan[]>('/meal-plans/week', { startDate });
    return response.data;
  },

  async getMonthMealPlans(year: number, month: number): Promise<MealPlan[]> {
    const response = await apiClient.get<MealPlan[]>('/meal-plans/month', { year, month });
    return response.data;
  },

  async getDayMealPlans(date: string): Promise<MealPlan[]> {
    const response = await apiClient.get<MealPlan[]>(`/meal-plans/date/${date}`);
    return response.data;
  },

  async createMealPlan(mealPlan: MealPlanForm): Promise<MealPlan> {
    const response = await apiClient.post<MealPlan>('/meal-plans', mealPlan);
    return response.data;
  },

  async updateMealPlan(id: number, updates: Partial<MealPlanForm>): Promise<MealPlan> {
    const response = await apiClient.put<MealPlan>(`/meal-plans/${id}`, updates);
    return response.data;
  },

  async deleteMealPlan(id: number): Promise<void> {
    await apiClient.delete(`/meal-plans/${id}`);
  },

  async completeMealPlan(id: number): Promise<MealPlan> {
    const response = await apiClient.post<MealPlan>(`/meal-plans/${id}/complete`);
    return response.data;
  },

  async duplicateMealPlan(id: number, date: string, mealType: string): Promise<MealPlan> {
    const response = await apiClient.post<MealPlan>(`/meal-plans/${id}/duplicate`, { date, mealType });
    return response.data;
  },

  async getUpcomingMeals(): Promise<MealPlan[]> {
    const response = await apiClient.get<MealPlan[]>('/meal-plans/upcoming');
    return response.data;
  },
};
