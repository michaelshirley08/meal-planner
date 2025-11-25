import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import * as ingredientService from '../services/ingredientService.js';

const router = Router();

// All ingredient routes require authentication
router.use(authMiddleware);

/**
 * GET /ingredients/search?q=flour
 * Search ingredients by name with autocomplete
 */
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, limit } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Query parameter "q" is required' });
      return;
    }

    const results = await ingredientService.searchIngredients(
      q,
      limit ? parseInt(limit as string, 10) : 20
    );

    res.json(results);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /ingredients/:id
 * Get ingredient details
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const ingredient = await ingredientService.getIngredient(parseInt(id, 10));

    if (!ingredient) {
      res.status(404).json({ error: 'Ingredient not found' });
      return;
    }

    res.json(ingredient);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /ingredients
 * Get all ingredients (paginated)
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
    const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

    const ingredients = await ingredientService.getAllIngredients(limit, offset);
    res.json(ingredients);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /ingredients
 * Create new ingredient
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, categoryId, aliases, typicalUnit } = req.body;

    if (!name || typeof name !== 'string') {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const ingredient = await ingredientService.createIngredient({
      name,
      categoryId,
      aliases,
      typicalUnit
    });

    res.status(201).json(ingredient);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /ingredients/:id
 * Update ingredient
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, categoryId, aliases, typicalUnit } = req.body;

    const ingredient = await ingredientService.updateIngredient(parseInt(id, 10), {
      name,
      categoryId,
      aliases,
      typicalUnit
    });

    res.json(ingredient);
  } catch (err) {
    next(err);
  }
});

export default router;
