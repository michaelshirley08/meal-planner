import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as recipeService from '../services/recipeService';
import { parseQuantityFromAPI } from '../utils/quantityUtils';

const router = Router();

// All recipe routes require authentication
router.use(authMiddleware);

/**
 * GET /recipes
 * Get all recipes for authenticated user (paginated)
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

    const recipes = await recipeService.getUserRecipes(req.userId!, limit, offset);
    res.json(recipes);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /recipes/search?q=pasta
 * Search recipes by name or description
 */
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, limit } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Query parameter "q" is required' });
      return;
    }

    const results = await recipeService.searchRecipes(
      req.userId!,
      q,
      limit ? parseInt(limit as string, 10) : 20
    );

    res.json(results);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /recipes/top-rated
 * Get highly-rated recipes
 */
router.get('/top-rated', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const minRating = req.query.minRating ? parseFloat(req.query.minRating as string) : 4;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const recipes = await recipeService.getTopRatedRecipes(req.userId!, minRating, limit);
    res.json(recipes);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /recipes/cuisine/:type
 * Get recipes by cuisine type
 */
router.get('/cuisine/:type', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.params;
    const recipes = await recipeService.getRecipesByCuisine(req.userId!, type);
    res.json(recipes);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /recipes/:id
 * Get recipe details
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const recipe = await recipeService.getRecipe(req.userId!, parseInt(id, 10));

    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /recipes
 * Create new recipe
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, cuisineType, prepMinutes, cookMinutes, defaultServings, ingredients, instructions, photoUrl } = req.body;

    if (!name || typeof name !== 'string') {
      res.status(400).json({ error: 'Recipe name is required' });
      return;
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      res.status(400).json({ error: 'Recipe must have at least one ingredient' });
      return;
    }

    if (!Array.isArray(instructions) || instructions.length === 0) {
      res.status(400).json({ error: 'Recipe must have at least one instruction' });
      return;
    }

    // Parse quantities from API format (strings like "1.5", "2", etc)
    const parsedIngredients = ingredients.map(
      (ing: { ingredientId: number; quantity: unknown; unit: string; prepNotes?: string }) => ({
      ingredientId: ing.ingredientId,
      quantity: typeof ing.quantity === 'string' ? parseQuantityFromAPI(ing.quantity) : ing.quantity,
      unit: ing.unit,
      prepNotes: ing.prepNotes
    }));

    const recipe = await recipeService.createRecipe(req.userId!, {
      name,
      description,
      cuisineType,
      prepMinutes,
      cookMinutes,
      defaultServings,
      ingredients: parsedIngredients,
      instructions,
      photoUrl
    });

    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /recipes/:id
 * Update recipe
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, cuisineType, prepMinutes, cookMinutes, defaultServings, ingredients, instructions, photoUrl } = req.body;

    const parsedIngredients = ingredients
      ? ingredients.map(
          (ing: { ingredientId: number; quantity: unknown; unit: string; prepNotes?: string }) => ({
          ingredientId: ing.ingredientId,
          quantity: typeof ing.quantity === 'string' ? parseQuantityFromAPI(ing.quantity) : ing.quantity,
          unit: ing.unit,
          prepNotes: ing.prepNotes
        }))
      : undefined;

    const recipe = await recipeService.updateRecipe(req.userId!, parseInt(id, 10), {
      name,
      description,
      cuisineType,
      prepMinutes,
      cookMinutes,
      defaultServings,
      ingredients: parsedIngredients,
      instructions,
      photoUrl
    });

    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /recipes/:id
 * Delete recipe
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await recipeService.deleteRecipe(req.userId!, parseInt(id, 10));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
