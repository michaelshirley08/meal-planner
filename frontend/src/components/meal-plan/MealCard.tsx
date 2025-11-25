import { type MealPlan } from '../../types';
import './MealCard.css';

interface MealCardProps {
  meal: MealPlan;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleComplete?: () => void;
  draggable?: boolean;
}

export function MealCard({
  meal,
  onEdit,
  onDelete,
  onToggleComplete,
  draggable = false,
}: MealCardProps) {
  const totalTime = (meal.recipe.prepTime || 0) + (meal.recipe.cookTime || 0);
  const servings = meal.servingOverride || meal.recipe.defaultServings;

  return (
    <div
      className={`meal-card ${meal.completed ? 'completed' : ''} ${draggable ? 'draggable' : ''}`}
      onClick={onEdit}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEdit?.();
        }
      }}
    >
      <div className="meal-card-header">
        {onToggleComplete && (
          <input
            type="checkbox"
            checked={meal.completed}
            onChange={(e) => {
              e.stopPropagation();
              onToggleComplete();
            }}
            className="meal-checkbox"
            aria-label="Mark meal as complete"
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <h4 className="meal-name">{meal.recipe.name}</h4>
        {onDelete && (
          <button
            className="meal-delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="Delete meal"
            title="Delete meal"
          >
            ✕
          </button>
        )}
      </div>

      <div className="meal-meta">
        {totalTime > 0 && (
          <span className="meal-meta-item" title="Total time">
            {totalTime} min
          </span>
        )}
        <span className="meal-meta-item" title="Servings">
          {servings} servings
        </span>
      </div>

      {meal.notes && (
        <p className="meal-notes">{meal.notes}</p>
      )}

      {meal.recipe.imageUrl && (
        <div className="meal-image-preview">
          <img src={meal.recipe.imageUrl} alt={meal.recipe.name} />
        </div>
      )}
    </div>
  );
}
