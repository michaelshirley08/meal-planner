import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as shoppingListService from '../services/shoppingListService';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /shopping-lists?startDate=2024-01-01&endDate=2024-01-07
 * Generate shopping list for a date range
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate query parameters are required' });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ error: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)' });
      return;
    }

    const list = await shoppingListService.getShoppingListWithStatus(req.userId!, start, end);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /shopping-lists/week?startDate=2024-01-01
 * Generate shopping list for a week
 */
router.get('/week', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate } = req.query;

    if (!startDate) {
      // Default to this week
      const today = new Date();
      const list = await shoppingListService.generateWeeklyShoppingList(req.userId!, today);
      res.json(list);
      return;
    }

    const start = new Date(startDate as string);
    if (isNaN(start.getTime())) {
      res.status(400).json({ error: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)' });
      return;
    }

    const list = await shoppingListService.generateWeeklyShoppingList(req.userId!, start);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /shopping-lists/month?year=2024&month=1
 * Generate shopping list for a month
 */
router.get('/month', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      // Default to this month
      const today = new Date();
      const list = await shoppingListService.generateMonthlyShoppingList(
        req.userId!,
        today.getFullYear(),
        today.getMonth() + 1
      );
      res.json(list);
      return;
    }

    const y = parseInt(year as string, 10);
    const m = parseInt(month as string, 10);

    if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
      res.status(400).json({ error: 'Invalid year or month' });
      return;
    }

    const list = await shoppingListService.generateMonthlyShoppingList(req.userId!, y, m);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /shopping-lists/items/:ingredientId/toggle
 * Check/uncheck item while shopping
 */
router.post('/items/:ingredientId/toggle', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ingredientId } = req.params;
    const { checked } = req.body;

    if (typeof checked !== 'boolean') {
      res.status(400).json({ error: 'checked property must be a boolean' });
      return;
    }

    const result = await shoppingListService.toggleShoppingListItem(
      req.userId!,
      parseInt(ingredientId, 10),
      checked
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /shopping-lists/items
 * Get all checked items for current shopping
 */
router.get('/items', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await shoppingListService.getShoppingListChecks(req.userId!);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /shopping-lists/items
 * Clear all shopping list items (after shopping)
 */
router.delete('/items', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await shoppingListService.clearShoppingListItems(req.userId!);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
