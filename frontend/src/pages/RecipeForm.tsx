import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import { ingredientService } from '../services/ingredientService';
import { parseQuantity } from '../utils/fractionUtils';
import type { Ingredient } from '../types';
import './RecipeForm.css';

interface RecipeIngredientInput {
  id?: number;
  ingredientId: number;
  ingredientName: string;
  quantityInput: string;
  unit: string;
  prepNote: string;
  displayOrder: number;
}

export function RecipeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [defaultServings, setDefaultServings] = useState(4);
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ingredients, setIngredients] = useState<RecipeIngredientInput[]>([]);

  const [ingredientSearch, setIngredientSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadRecipe(parseInt(id));
    }
  }, [id, isEditing]);

  const searchIngredients = useCallback(async () => {
    try {
      const results = await ingredientService.searchIngredients(ingredientSearch);
      setSearchResults(results);
    } catch (error) {
      console.error('Failed to search ingredients:', error);
    }
  }, [ingredientSearch]);

  useEffect(() => {
    if (ingredientSearch.length >= 2) {
      searchIngredients();
    } else {
      setSearchResults([]);
    }
  }, [ingredientSearch, searchIngredients]);

  const loadRecipe = async (recipeId: number) => {
    try {
      setLoading(true);
      const recipe = await recipeService.getRecipe(recipeId);
      setName(recipe.name);
      setDescription(recipe.description || '');
      setCuisineType(recipe.cuisineType || '');
      setDefaultServings(recipe.defaultServings);
      setPrepTime(recipe.prepTime?.toString() || '');
      setCookTime(recipe.cookTime?.toString() || '');
      setInstructions(recipe.instructions || '');
      setImageUrl(recipe.imageUrl || '');

      if (recipe.ingredients) {
        setIngredients(
          recipe.ingredients.map((ing, index) => ({
            id: ing.id,
            ingredientId: ing.ingredientId,
            ingredientName: ing.ingredient.name,
            quantityInput: `${ing.quantity.whole || ''} ${ing.quantity.num}/${ing.quantity.denom}`.trim(),
            unit: ing.unit,
            prepNote: ing.prepNote || '',
            displayOrder: index,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load recipe:', error);
      alert('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = (ingredient: Ingredient) => {
    setIngredients([
      ...ingredients,
      {
        ingredientId: ingredient.id,
        ingredientName: ingredient.name,
        quantityInput: '1',
        unit: ingredient.measurementType === 'volume' ? 'cup' : 'oz',
        prepNote: '',
        displayOrder: ingredients.length,
      },
    ]);
    setIngredientSearch('');
    setSearchResults([]);
  };

  const updateIngredient = (
    index: number,
    field: keyof RecipeIngredientInput,
    value: string | number
  ) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const moveIngredient = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === ingredients.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...ingredients];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated[index].displayOrder = index;
    updated[newIndex].displayOrder = newIndex;
    setIngredients(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const recipeData = {
        name,
        description: description || undefined,
        cuisineType: cuisineType || undefined,
        defaultServings,
        prepTime: prepTime ? parseInt(prepTime) : undefined,
        cookTime: cookTime ? parseInt(cookTime) : undefined,
        instructions: instructions || undefined,
        imageUrl: imageUrl || undefined,
        ingredients: ingredients.map((ing, index) => {
          const quantity = parseQuantity(ing.quantityInput);
          return {
            ingredientId: ing.ingredientId,
            quantity,
            unit: ing.unit,
            prepNote: ing.prepNote || undefined,
            displayOrder: index,
          };
        }),
      };

      if (isEditing) {
        await recipeService.updateRecipe(parseInt(id), recipeData);
      } else {
        await recipeService.createRecipe(recipeData);
      }

      navigate('/recipes');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save recipe';
      console.error('Failed to save recipe:', error);
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading recipe...</div>;
  }

  const cuisineTypes = ['Italian', 'Mexican', 'Chinese', 'Indian', 'American', 'Thai', 'Japanese', 'Mediterranean'];

  return (
    <div className="recipe-form-page">
      <div className="form-header">
        <Link to="/recipes" className="back-link">← Back to Recipes</Link>
        <h1>{isEditing ? 'Edit Recipe' : 'Create Recipe'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="recipe-form">
        <section className="form-section">
          <h2>Basic Information</h2>

          <div className="form-group">
            <label htmlFor="name">Recipe Name *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Chocolate Chip Cookies"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the recipe"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cuisineType">Cuisine Type</label>
              <select
                id="cuisineType"
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
              >
                <option value="">Select cuisine</option>
                {cuisineTypes.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="servings">Servings *</label>
              <input
                type="number"
                id="servings"
                value={defaultServings}
                onChange={(e) => setDefaultServings(parseInt(e.target.value))}
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="prepTime">Prep Time (min)</label>
              <input
                type="number"
                id="prepTime"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cookTime">Cook Time (min)</label>
              <input
                type="number"
                id="cookTime"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image URL</label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </section>

        <section className="form-section">
          <h2>Ingredients</h2>

          <div className="ingredient-search">
            <input
              type="text"
              value={ingredientSearch}
              onChange={(e) => setIngredientSearch(e.target.value)}
              placeholder="Search ingredients to add..."
              className="search-input"
            />
            {searchResults.length > 0 && (
              <ul className="search-results">
                {searchResults.map((ingredient) => (
                  <li
                    key={ingredient.id}
                    onClick={() => addIngredient(ingredient)}
                  >
                    {ingredient.name}
                    <span className="ingredient-category">{ingredient.category}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {ingredients.length === 0 ? (
            <p className="empty-state">No ingredients added yet. Search above to add ingredients.</p>
          ) : (
            <ul className="ingredients-form-list">
              {ingredients.map((ing, index) => (
                <li key={index} className="ingredient-form-item">
                  <div className="ingredient-controls">
                    <button
                      type="button"
                      onClick={() => moveIngredient(index, 'up')}
                      disabled={index === 0}
                      className="btn-icon"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveIngredient(index, 'down')}
                      disabled={index === ingredients.length - 1}
                      className="btn-icon"
                      title="Move down"
                    >
                      ↓
                    </button>
                  </div>

                  <div className="ingredient-inputs">
                    <div className="ingredient-name-display">{ing.ingredientName}</div>
                    <input
                      type="text"
                      value={ing.quantityInput}
                      onChange={(e) => updateIngredient(index, 'quantityInput', e.target.value)}
                      placeholder="1 1/2 or 1.5"
                      className="quantity-input"
                      title="Enter quantity as fraction (1 1/2), simple fraction (1/2), or decimal (1.5)"
                    />
                    <input
                      type="text"
                      value={ing.unit}
                      onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                      placeholder="cup, oz, etc."
                      className="unit-input"
                    />
                    <input
                      type="text"
                      value={ing.prepNote}
                      onChange={(e) => updateIngredient(index, 'prepNote', e.target.value)}
                      placeholder="diced, chopped..."
                      className="prep-input"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="btn-remove"
                    title="Remove ingredient"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="form-section">
          <h2>Instructions</h2>
          <div className="form-group">
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter step-by-step instructions..."
              rows={10}
              className="instructions-textarea"
            />
          </div>
        </section>

        <div className="form-actions">
          <Link to="/recipes" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Saving...' : (isEditing ? 'Update Recipe' : 'Create Recipe')}
          </button>
        </div>
      </form>
    </div>
  );
}
