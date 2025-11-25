import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import * as mealPlanService from '../services/mealPlanService.js';
import * as shoppingListService from '../services/shoppingListService.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /meal-plans?startDate=2024-01-01&endDate=2024-01-31
 * Get meal plans for a date range
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

    const meals = await mealPlanService.getMealPlans(req.userId!, start, end);
    res.json(meals);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /meal-plans/week?startDate=2024-01-01
 * Get meals for a week starting on startDate
 */
router.get('/week', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate } = req.query;

    if (!startDate) {
      // Default to this week
      const today = new Date();
      const meals = await mealPlanService.getWeekMeals(req.userId!, today);
      res.json(meals);
      return;
    }

    const start = new Date(startDate as string);
    if (isNaN(start.getTime())) {
      res.status(400).json({ error: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)' });
      return;
    }

    const meals = await mealPlanService.getWeekMeals(req.userId!, start);
    res.json(meals);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /meal-plans/month?year=2024&month=1
 * Get meals for a specific month
 */
router.get('/month', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      // Default to this month
      const today = new Date();
      const meals = await mealPlanService.getMonthMeals(req.userId!, today.getFullYear(), today.getMonth() + 1);
      res.json(meals);
      return;
    }

    const y = parseInt(year as string, 10);
    const m = parseInt(month as string, 10);

    if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
      res.status(400).json({ error: 'Invalid year or month' });
      return;
    }

    const meals = await mealPlanService.getMonthMeals(req.userId!, y, m);
    res.json(meals);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /meal-plans/date/:date
 * Get meals for a specific date
 */
router.get('/date/:date', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date } = req.params;
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({ error: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)' });
      return;
    }

    const meals = await mealPlanService.getMealsByDate(req.userId!, parsedDate);
    res.json(meals);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /meal-plans/upcoming
 * Get next 7 days of meals
 */
router.get('/upcoming', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const meals = await mealPlanService.getUpcomingMeals(req.userId!);
    res.json(meals);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /meal-plans/frequent-recipes
 * Get recipes that appear most in meal plans
 */
router.get('/frequent-recipes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const recipes = await mealPlanService.getFrequentRecipes(req.userId!, limit);
    res.json(recipes);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /meal-plans
 * Create a new meal plan
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { recipeId, date, mealType, servingOverride, notes } = req.body;

    if (!recipeId || !date || !mealType) {
      res.status(400).json({ error: 'recipeId, date, and mealType are required' });
      return;
    }

    if (!['breakfast', 'lunch', 'dinner', 'snack'].includes(mealType)) {
      res.status(400).json({ error: 'mealType must be breakfast, lunch, dinner, or snack' });
      return;
    }

    const mealPlan = await mealPlanService.createMealPlan(req.userId!, {
      recipeId,
      date: new Date(date),
      mealType,
      servingOverride,
      notes
    });

    res.status(201).json(mealPlan);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /meal-plans/:id
 * Update meal plan (drag-and-drop, edit notes, etc.)
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { date, mealType, servingOverride, notes } = req.body;

    const mealPlan = await mealPlanService.updateMealPlan(req.userId!, parseInt(id, 10), {
      date: date ? new Date(date) : undefined,
      mealType,
      servingOverride,
      notes
    });

    res.json(mealPlan);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /meal-plans/:id
 * Delete meal plan
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await mealPlanService.deleteMealPlan(req.userId!, parseInt(id, 10));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/**
 * POST /meal-plans/:id/complete
 * Mark meal as completed (cooked)
 */
router.post('/:id/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await mealPlanService.markMealComplete(req.userId!, parseInt(id, 10));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /meal-plans/:id/duplicate?newDate=2024-01-15&mealType=dinner
 * Duplicate meal plan to another date
 */
router.post('/:id/duplicate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { newDate, mealType } = req.body;

    if (!newDate) {
      res.status(400).json({ error: 'newDate is required' });
      return;
    }

    const result = await mealPlanService.duplicateMealPlan(
      req.userId!,
      parseInt(id, 10),
      new Date(newDate),
      mealType
    );

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
