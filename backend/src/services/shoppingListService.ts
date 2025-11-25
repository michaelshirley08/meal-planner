import { prisma } from '../db/client.js';
import { Quantity } from '../utils/types.js';
import { addQuantities, multiplyQuantity } from '../utils/fractionMath.js';
import { dbToQuantity, quantityToDb } from '../utils/quantityUtils.js';
import { getMeasurementType, toBaseUnits, fromBaseUnits } from '../utils/unitConverter.js';

export interface AggregatedIngredient {
  ingredientId: number;
  ingredientName: string;
  category?: string;
  quantity: Quantity;
  unit: string;
  baseValue: number; // Value in ml or g
  baseUnit: 'ml' | 'g';
  prepNotes?: string[];
  recipeReferences: Array<{
    recipeName: string;
    quantity: Quantity;
    unit: string;
    prepNotes?: string;
  }>;
}

export interface ShoppingList {
  startDate: Date;
  endDate: Date;
  totalMeals: number;
  ingredientsByCategory: Array<{
    category: string;
    displayOrder: number;
    ingredients: AggregatedIngredient[];
  }>;
  allIngredients: AggregatedIngredient[];
}

/**
 * Generate shopping list for a date range
 * Aggregates ingredients from all meals in the date range,
 * scales by serving overrides, and groups by category
 */
export async function generateShoppingList(
  userId: number,
  startDate: Date,
  endDate: Date
): Promise<ShoppingList> {
  // Get all meal plans in date range
  const mealPlans = await prisma.mealPlan.findMany({
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
              ingredient: {
                include: {
                  category: true
                }
              }
            },
            orderBy: {
              displayOrder: 'asc'
            }
          }
        }
      }
    }
  });

  // Map to track aggregated ingredients
  const ingredientMap = new Map<number, AggregatedIngredient>();

  // Process each meal plan
  for (const mealPlan of mealPlans) {
    const recipe = mealPlan.recipe;
    const baseServings = recipe.defaultServings;
    const actualServings = mealPlan.servingOverride || baseServings;
    const scaleFactor = actualServings / baseServings;

    // Process each ingredient in the recipe
    for (const recipeIng of recipe.ingredients) {
      const ingredientId = recipeIng.ingredientId;
      const ingredient = recipeIng.ingredient;

      // Scale the quantity based on serving override
      const baseQuantity = dbToQuantity(
        recipeIng.quantityWhole,
        recipeIng.quantityNum,
        recipeIng.quantityDenom
      );
      const scaledQuantity = multiplyQuantity(baseQuantity, scaleFactor);

      // Get or create aggregated ingredient
      let agg = ingredientMap.get(ingredientId);

      if (!agg) {
        agg = {
          ingredientId,
          ingredientName: ingredient.name,
          category: ingredient.category?.name,
          quantity: scaledQuantity,
          unit: recipeIng.unit,
          baseValue: 0,
          baseUnit: getMeasurementType(recipeIng.unit as any) === 'volume' ? 'ml' : 'g',
          prepNotes: recipeIng.prepNotes ? [recipeIng.prepNotes] : [],
          recipeReferences: []
        };
        ingredientMap.set(ingredientId, agg);
      } else {
        // Aggregate quantities
        // Only combine if same unit - otherwise we need to convert to base units
        if (agg.unit === recipeIng.unit) {
          agg.quantity = addQuantities(agg.quantity, scaledQuantity);
        } else {
          // Convert both to base units and add
          const base1 = toBaseUnits(agg.quantity, agg.unit as any);
          const base2 = toBaseUnits(scaledQuantity, recipeIng.unit as any);
          agg.baseValue = base1.value + base2.value;
          agg.baseUnit = base1.unit as 'ml' | 'g';
          // Keep the first unit for display, but track base value
          // Frontend can decide how to display (unit1 + unit2, or convert to one)
        }

        // Track preparation notes
        if (recipeIng.prepNotes && !agg.prepNotes.includes(recipeIng.prepNotes)) {
          agg.prepNotes.push(recipeIng.prepNotes);
        }
      }

      // Add recipe reference
      agg.recipeReferences.push({
        recipeName: recipe.name,
        quantity: scaledQuantity,
        unit: recipeIng.unit,
        prepNotes: recipeIng.prepNotes
      });
    }
  }

  // Convert to array and calculate base values for aggregated items
  const ingredients = Array.from(ingredientMap.values()).map((agg) => {
    // If not already set (same units), calculate base value
    if (agg.baseValue === 0) {
      const base = toBaseUnits(agg.quantity, agg.unit as any);
      agg.baseValue = base.value;
      agg.baseUnit = base.unit as 'ml' | 'g';
    }
    return agg;
  });

  // Group by category
  const categories = new Map<string, AggregatedIngredient[]>();
  const categoryOrder = new Map<string, number>();

  for (const ing of ingredients) {
    const category = ing.category || 'Other';
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category)!.push(ing);
  }

  // Fetch category display order
  const categoryRecords = await prisma.ingredientCategory.findMany({
    where: {
      OR: [
        { userId },
        { isSystemCategory: true }
      ]
    }
  });

  categoryRecords.forEach((cat) => {
    categoryOrder.set(cat.name, cat.displayOrder);
  });

  // Build grouped shopping list
  const ingredientsByCategory = Array.from(categories.entries())
    .map(([categoryName, items]) => ({
      category: categoryName,
      displayOrder: categoryOrder.get(categoryName) || 999,
      ingredients: items.sort((a, b) => a.ingredientName.localeCompare(b.ingredientName))
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return {
    startDate,
    endDate,
    totalMeals: mealPlans.length,
    ingredientsByCategory,
    allIngredients: ingredients.sort((a, b) =>
      a.ingredientName.localeCompare(b.ingredientName)
    )
  };
}

/**
 * Generate shopping list for a week
 */
export async function generateWeeklyShoppingList(userId: number, startDate: Date) {
  const dayStart = new Date(startDate);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 7);
  dayEnd.setHours(23, 59, 59, 999);

  return generateShoppingList(userId, dayStart, dayEnd);
}

/**
 * Generate shopping list for a month
 */
export async function generateMonthlyShoppingList(
  userId: number,
  year: number,
  month: number
) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  return generateShoppingList(userId, startDate, endDate);
}

/**
 * Track shopping list item (checked off while shopping)
 */
export async function toggleShoppingListItem(
  userId: number,
  ingredientId: number,
  checked: boolean
) {
  const existing = await prisma.shoppingListItem.findUnique({
    where: {
      userId_ingredientId: {
        userId,
        ingredientId
      }
    }
  });

  if (existing) {
    return prisma.shoppingListItem.update({
      where: {
        userId_ingredientId: {
          userId,
          ingredientId
        }
      },
      data: { checked }
    });
  } else {
    return prisma.shoppingListItem.create({
      data: {
        userId,
        ingredientId,
        checked
      }
    });
  }
}

/**
 * Get checked items for current shopping
 */
export async function getShoppingListChecks(userId: number) {
  return prisma.shoppingListItem.findMany({
    where: { userId },
    include: {
      ingredient: true
    }
  });
}

/**
 * Clear shopping list items (after shopping)
 */
export async function clearShoppingListItems(userId: number) {
  return prisma.shoppingListItem.deleteMany({
    where: { userId }
  });
}

/**
 * Get shopping list with check status
 */
export async function getShoppingListWithStatus(
  userId: number,
  startDate: Date,
  endDate: Date
) {
  const list = await generateShoppingList(userId, startDate, endDate);
  const checks = await getShoppingListChecks(userId);
  const checkMap = new Map(checks.map((c) => [c.ingredientId, c.checked]));

  // Add check status to ingredients
  const withStatus = list.ingredientsByCategory.map((cat) => ({
    ...cat,
    ingredients: cat.ingredients.map((ing) => ({
      ...ing,
      checked: checkMap.get(ing.ingredientId) || false
    }))
  }));

  return {
    ...list,
    ingredientsByCategory: withStatus,
    allIngredients: list.allIngredients.map((ing) => ({
      ...ing,
      checked: checkMap.get(ing.ingredientId) || false
    }))
  };
}
