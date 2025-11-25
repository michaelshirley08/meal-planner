import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useToast } from '../hooks/useToast';
import type { Recipe } from '../types';
import './RecipeList.css';

export function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const toast = useToast();

  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await recipeService.getRecipes({
        search: searchTerm || undefined,
        cuisineType: cuisineFilter || undefined,
        sortBy,
      });
      setRecipes(data);
    } catch (error) {
      console.error('Failed to load recipes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load recipes';
      setError(errorMessage);
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, cuisineFilter, sortBy, toast]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const cuisineTypes = ['Italian', 'Mexican', 'Chinese', 'Indian', 'American', 'Thai', 'Japanese', 'Mediterranean'];

  return (
    <div className="recipe-list-page">
      <div className="page-header">
        <h1>Recipes</h1>
        <Link to="/recipes/new" className="btn-primary">Create Recipe</Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={cuisineFilter}
          onChange={(e) => setCuisineFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Cuisines</option>
          {cuisineTypes.map((cuisine) => (
            <option key={cuisine} value={cuisine}>{cuisine}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="name">Name</option>
          <option value="rating">Rating</option>
          <option value="timesMade">Times Made</option>
          <option value="createdAt">Date Created</option>
        </select>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={loadRecipes}
        />
      )}

      {loading ? (
        <LoadingSpinner message="Loading recipes..." />
      ) : recipes.length === 0 ? (
        <div className="empty-state">
          <p>No recipes found</p>
          <Link to="/recipes/new" className="btn-primary">Create your first recipe</Link>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="recipe-card">
              {recipe.imageUrl && (
                <img src={recipe.imageUrl} alt={recipe.name} className="recipe-image" />
              )}
              {!recipe.imageUrl && (
                <div className="recipe-image-placeholder">No Image</div>
              )}
              <div className="recipe-card-content">
                <h3>{recipe.name}</h3>
                {recipe.cuisineType && (
                  <span className="cuisine-badge">{recipe.cuisineType}</span>
                )}
                <p className="recipe-description">{recipe.description}</p>
                <div className="recipe-meta">
                  <span>{recipe.defaultServings} servings</span>
                  {recipe.prepTime && recipe.cookTime && (
                    <span>{recipe.prepTime + recipe.cookTime} min</span>
                  )}
                  {recipe.averageRating && (
                    <span>⭐ {recipe.averageRating.toFixed(1)}</span>
                  )}
                  {recipe.timesMade !== undefined && recipe.timesMade > 0 && (
                    <span>Made {recipe.timesMade}×</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
