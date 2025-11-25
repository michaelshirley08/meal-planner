import { useMemo } from 'react';
import { type MealPlan } from '../../types';
import {
  getWeekDates,
  getShortDayName,
  getAllMealTypes,
  getMealTypeDisplay,
  isToday,
  type MealType,
} from '../../utils/dateUtils';
import { MealSlot } from './MealSlot';
import './WeeklyCalendar.css';

interface WeeklyCalendarProps {
  startDate: string;
  meals: MealPlan[];
  onAddMeal: (date: string, mealType: MealType) => void;
  onEditMeal: (meal: MealPlan) => void;
  onDeleteMeal: (meal: MealPlan) => void;
  onToggleComplete: (meal: MealPlan) => void;
  loading?: boolean;
}

export function WeeklyCalendar({
  startDate,
  meals,
  onAddMeal,
  onEditMeal,
  onDeleteMeal,
  onToggleComplete,
  loading = false,
}: WeeklyCalendarProps) {
  const weekDates = useMemo(() => getWeekDates(startDate), [startDate]);
  const mealTypes = getAllMealTypes();

  const getMealForSlot = (date: string, mealType: MealType): MealPlan | undefined => {
    return meals.find((meal) => meal.date === date && meal.mealType === mealType);
  };

  if (loading) {
    return (
      <div className="calendar-loading">
        <div className="loading-spinner"></div>
        <p>Loading meal plan...</p>
      </div>
    );
  }

  return (
    <div className="weekly-calendar">
      <div className="calendar-grid">
        {/* Header row with day names */}
        <div className="calendar-header">
          <div className="meal-type-header"></div>
          {weekDates.map((date) => (
            <div
              key={date}
              className={`day-header ${isToday(date) ? 'today' : ''}`}
            >
              <span className="day-name">{getShortDayName(date)}</span>
              <span className="day-date">{new Date(date).getDate()}</span>
            </div>
          ))}
        </div>

        {/* Calendar body with meal slots */}
        {mealTypes.map((mealType) => (
          <div key={mealType} className="calendar-row">
            <div className="meal-type-label">
              {getMealTypeDisplay(mealType)}
            </div>
            {weekDates.map((date) => {
              const meal = getMealForSlot(date, mealType);
              return (
                <MealSlot
                  key={`${date}-${mealType}`}
                  date={date}
                  mealType={mealType}
                  meal={meal}
                  onAddClick={() => onAddMeal(date, mealType)}
                  onEditMeal={onEditMeal}
                  onDeleteMeal={onDeleteMeal}
                  onToggleComplete={onToggleComplete}
                  isDroppable={true}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
