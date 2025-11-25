import { type MealPlan } from '../../types';
import { type MealType } from '../../utils/dateUtils';
import { MealCard } from './MealCard';
import './MealSlot.css';

interface MealSlotProps {
  date: string;
  mealType: MealType;
  meal?: MealPlan;
  onAddClick?: () => void;
  onEditMeal?: (meal: MealPlan) => void;
  onDeleteMeal?: (meal: MealPlan) => void;
  onToggleComplete?: (meal: MealPlan) => void;
  isDroppable?: boolean;
  isOver?: boolean;
}

export function MealSlot({
  date,
  mealType,
  meal,
  onAddClick,
  onEditMeal,
  onDeleteMeal,
  onToggleComplete,
  isDroppable = false,
  isOver = false,
}: MealSlotProps) {
  return (
    <div
      className={`meal-slot ${isDroppable ? 'droppable' : ''} ${isOver ? 'drag-over' : ''}`}
      data-date={date}
      data-meal-type={mealType}
    >
      {meal ? (
        <MealCard
          meal={meal}
          onEdit={() => onEditMeal?.(meal)}
          onDelete={() => onDeleteMeal?.(meal)}
          onToggleComplete={() => onToggleComplete?.(meal)}
          draggable={true}
        />
      ) : (
        <button
          className="add-meal-btn"
          onClick={onAddClick}
          aria-label={`Add meal for ${mealType}`}
        >
          + Add meal
        </button>
      )}
    </div>
  );
}
