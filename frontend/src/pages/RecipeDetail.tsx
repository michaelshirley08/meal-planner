import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import { formatQuantity } from '../utils/fractionUtils';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useToast } from '../contexts/ToastContext';
import type { Recipe, RecipeRating } from '../types';
import './RecipeDetail.css';

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ratings, setRatings] = useState<RecipeRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    if (id) {
      loadRecipe(parseInt(id));
    }
  }, [id]);

  const loadRecipe = async (recipeId: number) => {
    try {
      setLoading(true);
      setError(null);
      const [recipeData, ratingsData] = await Promise.all([
        recipeService.getRecipe(recipeId),
        recipeService.getRecipeRatings(recipeId),
      ]);
      setRecipe(recipeData);
      setRatings(ratingsData);
    } catch (error) {
      console.error('Failed to load recipe:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load recipe';
      setError(errorMessage);
      toast.error('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!recipe || !window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      await recipeService.deleteRecipe(recipe.id);
      toast.success('Recipe deleted successfully');
      navigate('/recipes');
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  const handleRateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipe) return;

    try {
      await recipeService.rateRecipe(recipe.id, newRating, newNotes);
      setShowRatingForm(false);
      setNewRating(5);
      setNewNotes('');
      toast.success('Rating submitted successfully');
      loadRecipe(recipe.id);
    } catch (error) {
      console.error('Failed to rate recipe:', error);
      toast.error('Failed to submit rating');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading recipe..." />;
  }

  if (error) {
    return (
      <div className="recipe-detail-page">
        <Link to="/recipes" className="back-link">← Back to Recipes</Link>
        <ErrorMessage
          message={error}
          onRetry={() => id && loadRecipe(parseInt(id))}
        />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-detail-page">
        <Link to="/recipes" className="back-link">← Back to Recipes</Link>
        <ErrorMessage message="Recipe not found" />
      </div>
    );
  }

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="recipe-detail-page">
      <div className="recipe-header">
        <div>
          <Link to="/recipes" className="back-link">← Back to Recipes</Link>
          <h1>{recipe.name}</h1>
          {recipe.cuisineType && <span className="cuisine-badge">{recipe.cuisineType}</span>}
        </div>
        <div className="recipe-actions">
          <Link to={`/recipes/${recipe.id}/edit`} className="btn-secondary">Edit</Link>
          <button onClick={handleDelete} className="btn-danger">Delete</button>
        </div>
      </div>

      {recipe.imageUrl && (
        <img src={recipe.imageUrl} alt={recipe.name} className="recipe-hero-image" />
      )}

      <div className="recipe-meta-bar">
        {totalTime > 0 && (
          <div className="meta-item">
            <span className="meta-label">Total Time</span>
            <span className="meta-value">{totalTime} min</span>
          </div>
        )}
        {recipe.prepTime && (
          <div className="meta-item">
            <span className="meta-label">Prep</span>
            <span className="meta-value">{recipe.prepTime} min</span>
          </div>
        )}
        {recipe.cookTime && (
          <div className="meta-item">
            <span className="meta-label">Cook</span>
            <span className="meta-value">{recipe.cookTime} min</span>
          </div>
        )}
        <div className="meta-item">
          <span className="meta-label">Servings</span>
          <span className="meta-value">{recipe.defaultServings}</span>
        </div>
        {recipe.averageRating && (
          <div className="meta-item">
            <span className="meta-label">Rating</span>
            <span className="meta-value">⭐ {recipe.averageRating.toFixed(1)}</span>
          </div>
        )}
        {recipe.timesMade !== undefined && recipe.timesMade > 0 && (
          <div className="meta-item">
            <span className="meta-label">Made</span>
            <span className="meta-value">{recipe.timesMade}×</span>
          </div>
        )}
      </div>

      {recipe.description && (
        <div className="recipe-description">
          <p>{recipe.description}</p>
        </div>
      )}

      <div className="recipe-content">
        <section className="ingredients-section">
          <h2>Ingredients</h2>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            <ul className="ingredients-list">
              {recipe.ingredients
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((ing) => (
                  <li key={ing.id}>
                    <span className="ingredient-quantity">
                      {formatQuantity(ing.quantity)} {ing.unit}
                    </span>
                    <span className="ingredient-name">{ing.ingredient.name}</span>
                    {ing.prepNote && (
                      <span className="ingredient-prep">, {ing.prepNote}</span>
                    )}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="empty-state">No ingredients added yet</p>
          )}
        </section>

        <section className="instructions-section">
          <h2>Instructions</h2>
          {recipe.instructions ? (
            <div className="instructions-text">{recipe.instructions}</div>
          ) : (
            <p className="empty-state">No instructions added yet</p>
          )}
        </section>
      </div>

      <section className="ratings-section">
        <div className="ratings-header">
          <h2>Ratings & Notes</h2>
          <button
            onClick={() => setShowRatingForm(!showRatingForm)}
            className="btn-primary"
          >
            {showRatingForm ? 'Cancel' : 'Add Rating'}
          </button>
        </div>

        {showRatingForm && (
          <form onSubmit={handleRateRecipe} className="rating-form">
            <div className="form-group">
              <label>Rating</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className={`star ${star <= newRating ? 'active' : ''}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Notes (optional)</label>
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="How did it turn out? Any modifications?"
                rows={3}
              />
            </div>
            <button type="submit" className="btn-primary">Submit Rating</button>
          </form>
        )}

        {ratings.length === 0 ? (
          <p className="empty-state">No ratings yet. Be the first to rate this recipe!</p>
        ) : (
          <ul className="ratings-list">
            {ratings.map((rating) => (
              <li key={rating.id} className="rating-item">
                <div className="rating-stars">
                  {'⭐'.repeat(rating.rating)}
                </div>
                <div className="rating-date">
                  {new Date(rating.dateCooked).toLocaleDateString()}
                </div>
                {rating.notes && <p className="rating-notes">{rating.notes}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
