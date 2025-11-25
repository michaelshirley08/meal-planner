import { useState, useEffect, useCallback } from 'react';
import { WeeklyCalendar } from '../components/meal-plan/WeeklyCalendar';
import { AddMealModal } from '../components/meal-plan/AddMealModal';
import { mealPlanService } from '../services/mealPlanService';
import { useToast } from '../hooks/useToast';
import {
  getCurrentWeekStart,
  getNextWeek,
  getPreviousWeek,
  formatFullDate,
  type MealType,
} from '../utils/dateUtils';
import type { MealPlan as MealPlanType, MealPlanForm } from '../types';
import './MealPlan.css';

export function MealPlan() {
  const [weekStart, setWeekStart] = useState(getCurrentWeekStart());
  const [meals, setMeals] = useState<MealPlanType[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const toast = useToast();

  const loadMeals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await mealPlanService.getWeekMealPlans(weekStart);
      setMeals(data);
    } catch (error) {
      console.error('Failed to load meal plans:', error);
      toast.error('Failed to load meal plans');
    } finally {
      setLoading(false);
    }
  }, [weekStart, toast]);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  const handleAddMeal = (date: string, mealType: MealType) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setModalOpen(true);
  };

  const handleSaveMeal = async (mealPlan: MealPlanForm) => {
    try {
      const newMeal = await mealPlanService.createMealPlan(mealPlan);
      setMeals((prev) => [...prev, newMeal]);
      toast.success('Meal added successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add meal';
      console.error('Failed to create meal plan:', error);
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleEditMeal = async (meal: MealPlanType) => {
    // For now, just show a simple confirmation
    // In a full implementation, you'd show an edit modal
    console.log('Edit meal:', meal);
    toast.info('Edit functionality coming soon');
  };

  const handleDeleteMeal = async (meal: MealPlanType) => {
    if (!window.confirm(`Delete ${meal.recipe.name} from your meal plan?`)) {
      return;
    }

    try {
      await mealPlanService.deleteMealPlan(meal.id);
      setMeals((prev) => prev.filter((m) => m.id !== meal.id));
      toast.success('Meal removed');
    } catch (error) {
      console.error('Failed to delete meal plan:', error);
      toast.error('Failed to remove meal');
    }
  };

  const handleToggleComplete = async (meal: MealPlanType) => {
    try {
      const updated = await mealPlanService.completeMealPlan(meal.id);
      setMeals((prev) => prev.map((m) => (m.id === meal.id ? updated : m)));
      toast.success(updated.completed ? 'Meal marked as complete' : 'Meal marked as incomplete');
    } catch (error) {
      console.error('Failed to toggle meal completion:', error);
      toast.error('Failed to update meal');
    }
  };

  const goToThisWeek = () => {
    setWeekStart(getCurrentWeekStart());
  };

  const goToPreviousWeek = () => {
    setWeekStart(getPreviousWeek(weekStart));
  };

  const goToNextWeek = () => {
    setWeekStart(getNextWeek(weekStart));
  };

  const isCurrentWeek = weekStart === getCurrentWeekStart();

  return (
    <div className="meal-plan-page">
      <div className="page-header">
        <h1>Meal Plan</h1>
      </div>

      <div className="week-navigation">
        <button onClick={goToPreviousWeek} className="nav-btn" aria-label="Previous week">
          ← Previous
        </button>

        <div className="week-info">
          <span className="week-label">Week of {formatFullDate(weekStart)}</span>
          {!isCurrentWeek && (
            <button onClick={goToThisWeek} className="today-btn">
              This Week
            </button>
          )}
        </div>

        <button onClick={goToNextWeek} className="nav-btn" aria-label="Next week">
          Next →
        </button>
      </div>

      <WeeklyCalendar
        startDate={weekStart}
        meals={meals}
        onAddMeal={handleAddMeal}
        onEditMeal={handleEditMeal}
        onDeleteMeal={handleDeleteMeal}
        onToggleComplete={handleToggleComplete}
        loading={loading}
      />

      <AddMealModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        date={selectedDate}
        mealType={selectedMealType}
        onSave={handleSaveMeal}
      />
    </div>
  );
}
