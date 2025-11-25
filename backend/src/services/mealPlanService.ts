import { prisma } from '../db/client';

export interface CreateMealPlanInput {
  recipeId: number;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servingOverride?: number;
  notes?: string;
}

export interface UpdateMealPlanInput {
  date?: Date;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servingOverride?: number;
  notes?: string;
}

/**
 * Get all meal plans for a user in a date range
 */
export async function getMealPlans(
  userId: number,
  startDate: Date,
  endDate: Date
) {
  const meals = await prisma.mealPlan.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      recipe: {
        include: {
          ingredients: {
            include: {
              ingredient: true
            }
          }
        }
      }
    },
    orderBy: [{ date: 'asc' }, { mealType: 'asc' }]
  });

  return meals;
}

/**
 * Get meals for a specific date
 */
export async function getMealsByDate(userId: number, date: Date) {
  // Normalize date to start of day
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  return prisma.mealPlan.findMany({
    where: {
      userId,
      date: {
        gte: dayStart,
        lte: dayEnd
      }
    },
    include: {
      recipe: {
        include: {
          ingredients: {
            include: {
              ingredient: true
            }
          }
        }
      }
    },
    orderBy: { mealType: 'asc' }
  });
}

/**
 * Get meals for a week (7 days starting from startDate)
 */
export async function getWeekMeals(userId: number, startDate: Date) {
  const dayStart = new Date(startDate);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 7);
  dayEnd.setHours(23, 59, 59, 999);

  return getMealPlans(userId, dayStart, dayEnd);
}

/**
 * Get meals for a month
 */
export async function getMonthMeals(userId: number, year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  return getMealPlans(userId, startDate, endDate);
}

/**
 * Create a new meal plan entry
 */
export async function createMealPlan(userId: number, input: CreateMealPlanInput) {
  // Verify recipe exists and belongs to user
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: input.recipeId,
      userId
    }
  });

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  // Normalize date to start of day
  const date = new Date(input.date);
  date.setHours(0, 0, 0, 0);

  // Check for duplicate meal plan
  const existing = await prisma.mealPlan.findFirst({
    where: {
      userId,
      recipeId: input.recipeId,
      date,
      mealType: input.mealType
    }
  });

  if (existing) {
    throw new Error('Meal already scheduled for this date and meal type');
  }

  const mealPlan = await prisma.mealPlan.create({
    data: {
      userId,
      recipeId: input.recipeId,
      date,
      mealType: input.mealType,
      servingOverride: input.servingOverride,
      notes: input.notes
    },
    include: {
      recipe: {
        include: {
          ingredients: {
            include: {
              ingredient: true
            }
          }
        }
      }
    }
  });

  return mealPlan;
}

/**
 * Update a meal plan
 */
export async function updateMealPlan(
  userId: number,
  mealPlanId: number,
  input: UpdateMealPlanInput
) {
  // Verify ownership
  const mealPlan = await prisma.mealPlan.findUnique({
    where: { id: mealPlanId }
  });

  if (!mealPlan || mealPlan.userId !== userId) {
    throw new Error('Meal plan not found or access denied');
  }

  // If changing date/mealType, check for conflicts
  if (input.date || input.mealType) {
    const date = input.date ? new Date(input.date) : mealPlan.date;
    date.setHours(0, 0, 0, 0);

    const mealType = input.mealType || mealPlan.mealType;

    const conflict = await prisma.mealPlan.findFirst({
      where: {
        userId,
        id: { not: mealPlanId },
        date,
        mealType
      }
    });

    if (conflict) {
      throw new Error('Another meal is already scheduled for this date and meal type');
    }
  }

  const normalizedDate = input.date
    ? (() => {
        const d = new Date(input.date);
        d.setHours(0, 0, 0, 0);
        return d;
      })()
    : undefined;

  const updated = await prisma.mealPlan.update({
    where: { id: mealPlanId },
    data: {
      date: normalizedDate,
      mealType: input.mealType,
      servingOverride: input.servingOverride,
      notes: input.notes
    },
    include: {
      recipe: {
        include: {
          ingredients: {
            include: {
              ingredient: true
            }
          }
        }
      }
    }
  });

  return updated;
}

/**
 * Delete a meal plan
 */
export async function deleteMealPlan(userId: number, mealPlanId: number) {
  const mealPlan = await prisma.mealPlan.findUnique({
    where: { id: mealPlanId }
  });

  if (!mealPlan || mealPlan.userId !== userId) {
    throw new Error('Meal plan not found or access denied');
  }

  await prisma.mealPlan.delete({
    where: { id: mealPlanId }
  });
}

/**
 * Mark meal as completed (cooked)
 */
export async function markMealComplete(userId: number, mealPlanId: number) {
  const mealPlan = await prisma.mealPlan.findUnique({
    where: { id: mealPlanId }
  });

  if (!mealPlan || mealPlan.userId !== userId) {
    throw new Error('Meal plan not found or access denied');
  }

  return prisma.mealPlan.update({
    where: { id: mealPlanId },
    data: { completed: true },
    include: {
      recipe: true
    }
  });
}

/**
 * Get upcoming meals (next 7 days from today)
 */
export async function getUpcomingMeals(userId: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(23, 59, 59, 999);

  return getMealPlans(userId, today, nextWeek);
}

/**
 * Get past meals (for rating and history)
 */
export async function getPastMeals(userId: number, days: number = 30) {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const meals = await getMealPlans(userId, startDate, endDate);
  return meals.filter((m) => new Date(m.date) < new Date());
}

/**
 * Get frequently used recipes (appears most in meal plans)
 */
export async function getFrequentRecipes(userId: number, limit: number = 10) {
  const results = await prisma.mealPlan.groupBy({
    by: ['recipeId'],
    where: { userId },
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    },
    take: limit
  });

  // Fetch recipe details
  const recipes = await prisma.recipe.findMany({
    where: {
      id: {
        in: results.map((r) => r.recipeId)
      }
    },
    include: {
      ingredients: {
        include: {
          ingredient: true
        }
      }
    }
  });

  // Add usage count
  return recipes.map((recipe) => ({
    ...recipe,
    usageCount: results.find((r) => r.recipeId === recipe.id)?._count.id || 0
  }));
}

/**
 * Duplicate meal plan to another date
 * Useful for repeating the same meal
 */
export async function duplicateMealPlan(
  userId: number,
  mealPlanId: number,
  newDate: Date,
  newMealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
) {
  const original = await prisma.mealPlan.findUnique({
    where: { id: mealPlanId }
  });

  if (!original || original.userId !== userId) {
    throw new Error('Meal plan not found or access denied');
  }

  const date = new Date(newDate);
  date.setHours(0, 0, 0, 0);

  // Check for conflict
  const mealType = newMealType || original.mealType;
  const conflict = await prisma.mealPlan.findFirst({
    where: {
      userId,
      date,
      mealType
    }
  });

  if (conflict) {
    throw new Error('Meal already scheduled for this date and meal type');
  }

  return prisma.mealPlan.create({
    data: {
      userId,
      recipeId: original.recipeId,
      date,
      mealType,
      servingOverride: original.servingOverride,
      notes: original.notes
    },
    include: {
      recipe: {
        include: {
          ingredients: {
            include: {
              ingredient: true
            }
          }
        }
      }
    }
  });
}
