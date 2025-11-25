import { useState, useEffect, useCallback } from 'react';
import { Modal } from '../common/Modal';
import { recipeService } from '../../services/recipeService';
import { useDebounce } from '../../hooks/useDebounce';
import type { Recipe, MealPlanForm } from '../../types';
import type { MealType } from '../../utils/dateUtils';
import { getMealTypeDisplay, formatDisplayDate } from '../../utils/dateUtils';
import './AddMealModal.css';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  mealType: MealType;
  onSave: (mealPlan: MealPlanForm) => Promise<void>;
}

export function AddMealModal({ isOpen, onClose, date, mealType, onSave }: AddMealModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [servingOverride, setServingOverride] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await recipeService.getRecipes({
        search: debouncedSearch || undefined,
        sortBy: 'name',
      });
      setRecipes(data);
    } catch (error) {
      console.error('Failed to load recipes:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (isOpen) {
      loadRecipes();
    } else {
      // Reset form when modal closes
      setSearchTerm('');
      setSelectedRecipe(null);
      setServingOverride(undefined);
      setNotes('');
    }
  }, [isOpen, loadRecipes]);

  useEffect(() => {
    if (debouncedSearch || isOpen) {
      loadRecipes();
    }
  }, [debouncedSearch, isOpen, loadRecipes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipe) return;

    setSaving(true);
    try {
      await onSave({
        recipeId: selectedRecipe.id,
        date,
        mealType,
        servingOverride: servingOverride || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Failed to add meal:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Meal" size="medium">
      <form onSubmit={handleSubmit} className="add-meal-form">
        <div className="meal-info">
          <p className="meal-info-text">
            {getMealTypeDisplay(mealType)} on {formatDisplayDate(date)}
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="recipe-search">Search Recipe *</label>
          <input
            id="recipe-search"
            type="text"
            placeholder="Search for a recipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            autoFocus
          />
        </div>

        <div className="recipe-list-container">
          {loading ? (
            <div className="loading-state">Loading recipes...</div>
          ) : recipes.length === 0 ? (
            <div className="empty-state">
              {searchTerm ? 'No recipes found' : 'No recipes available'}
            </div>
          ) : (
            <div className="recipe-list">
              {recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  type="button"
                  className={`recipe-item ${selectedRecipe?.id === recipe.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedRecipe(recipe);
                    setServingOverride(recipe.defaultServings);
                  }}
                >
                  {recipe.imageUrl && (
                    <img src={recipe.imageUrl} alt={recipe.name} className="recipe-thumb" />
                  )}
                  <div className="recipe-info">
                    <span className="recipe-name">{recipe.name}</span>
                    <span className="recipe-meta">
                      {recipe.defaultServings} servings
                      {recipe.prepTime && recipe.cookTime && (
                        <> • {recipe.prepTime + recipe.cookTime} min</>
                      )}
                    </span>
                  </div>
                  {selectedRecipe?.id === recipe.id && (
                    <span className="selected-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedRecipe && (
          <>
            <div className="form-group">
              <label htmlFor="servings">Servings</label>
              <input
                id="servings"
                type="number"
                min="1"
                max="100"
                value={servingOverride || selectedRecipe.defaultServings}
                onChange={(e) => setServingOverride(parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes (optional)</label>
              <textarea
                id="notes"
                placeholder="Add any notes for this meal..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </>
        )}

        <div className="form-actions">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={saving}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={!selectedRecipe || saving}
          >
            {saving ? 'Adding...' : 'Add Meal'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
