import { prisma } from '../db/client.js';
import { quantityToDb, dbToQuantity } from '../utils/quantityUtils.js';
import { Quantity } from '../utils/types.js';

export interface RecipeIngredientInput {
  ingredientId: number;
  quantity: Quantity;
  unit: string;
  prepNotes?: string;
}

export interface RecipeInstructionInput {
  stepNumber: number;
  text: string;
}

export interface CreateRecipeInput {
  name: string;
  description?: string;
  cuisineType?: string;
  prepMinutes?: number;
  cookMinutes?: number;
  defaultServings?: number;
  ingredients: RecipeIngredientInput[];
  instructions: RecipeInstructionInput[];
  photoUrl?: string;
}

/**
 * Get recipe by ID (full details)
 */
export async function getRecipe(userId: number, recipeId: number) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      ingredients: {
        include: {
          ingredient: true
        },
        orderBy: {
          displayOrder: 'asc'
        }
      },
      instructions: {
        orderBy: {
          displayOrder: 'asc'
        }
      },
      ratings: {
        where: { userId }
      }
    }
  });

  if (!recipe || recipe.userId !== userId) {
    return null;
  }

  // Transform ingredients to include formatted quantity
  const transformedRecipe = {
    ...recipe,
    ingredients: recipe.ingredients.map((ri) => ({
      id: ri.id,
      ingredientId: ri.ingredientId,
      ingredient: ri.ingredient,
      quantity: dbToQuantity(ri.quantityWhole, ri.quantityNum, ri.quantityDenom),
      unit: ri.unit,
      prepNotes: ri.prepNotes,
      displayOrder: ri.displayOrder
    }))
  };

  return transformedRecipe;
}

/**
 * Get all recipes for a user (list view)
 */
export async function getUserRecipes(userId: number, limit: number = 50, offset: number = 0) {
  const recipes = await prisma.recipe.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      description: true,
      cuisineType: true,
      defaultServings: true,
      photoUrl: true,
      prepMinutes: true,
      cookMinutes: true,
      createdAt: true,
      ratings: {
        select: {
          rating: true
        }
      },
      _count: {
        select: {
          ingredients: true,
          ratings: true,
          mealPlans: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset
  });

  // Calculate average rating for each recipe
  return recipes.map((recipe) => {
    const avgRating =
      recipe.ratings.length > 0
        ? recipe.ratings.reduce((sum, r) => sum + r.rating, 0) / recipe.ratings.length
        : 0;

    return {
      ...recipe,
      averageRating: parseFloat(avgRating.toFixed(1)),
      ratingCount: recipe.ratings.length,
      ingredientCount: recipe._count.ingredients,
      usageCount: recipe._count.mealPlans
    };
  });
}

/**
 * Search recipes by name or description
 */
export async function searchRecipes(userId: number, query: string, limit: number = 20) {
  if (!query || query.length === 0) {
    return [];
  }

  return prisma.recipe.findMany({
    where: {
      userId,
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: query,
            mode: 'insensitive'
          }
        }
      ]
    },
    select: {
      id: true,
      name: true,
      description: true,
      photoUrl: true,
      defaultServings: true,
      cuisineType: true
    },
    take: limit,
    orderBy: { name: 'asc' }
  });
}

/**
 * Create a new recipe
 */
export async function createRecipe(userId: number, input: CreateRecipeInput) {
  // Validate ingredients
  if (!input.ingredients || input.ingredients.length === 0) {
    throw new Error('Recipe must have at least one ingredient');
  }

  // Validate instructions
  if (!input.instructions || input.instructions.length === 0) {
    throw new Error('Recipe must have at least one instruction');
  }

  const recipe = await prisma.recipe.create({
    data: {
      userId,
      name: input.name,
      description: input.description,
      cuisineType: input.cuisineType,
      prepMinutes: input.prepMinutes,
      cookMinutes: input.cookMinutes,
      defaultServings: input.defaultServings || 4,
      photoUrl: input.photoUrl,
      ingredients: {
        create: input.ingredients.map((ing, idx) => ({
          ingredientId: ing.ingredientId,
          ...quantityToDb(ing.quantity),
          unit: ing.unit,
          prepNotes: ing.prepNotes,
          displayOrder: idx
        }))
      },
      instructions: {
        create: input.instructions.map((inst, idx) => ({
          stepNumber: inst.stepNumber,
          text: inst.text,
          displayOrder: idx
        }))
      }
    },
    include: {
      ingredients: {
        include: {
          ingredient: true
        },
        orderBy: {
          displayOrder: 'asc'
        }
      },
      instructions: {
        orderBy: {
          displayOrder: 'asc'
        }
      }
    }
  });

  return recipe;
}

/**
 * Update a recipe
 */
export async function updateRecipe(userId: number, recipeId: number, input: Partial<CreateRecipeInput>) {
  // Verify ownership
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId }
  });

  if (!recipe || recipe.userId !== userId) {
    throw new Error('Recipe not found or access denied');
  }

  // Update basic fields
  const updated = await prisma.recipe.update({
    where: { id: recipeId },
    data: {
      name: input.name,
      description: input.description,
      cuisineType: input.cuisineType,
      prepMinutes: input.prepMinutes,
      cookMinutes: input.cookMinutes,
      defaultServings: input.defaultServings,
      photoUrl: input.photoUrl
    }
  });

  // Update ingredients if provided
  if (input.ingredients) {
    // Delete existing ingredients
    await prisma.recipeIngredient.deleteMany({
      where: { recipeId }
    });

    // Create new ingredients
    await prisma.recipeIngredient.createMany({
      data: input.ingredients.map((ing, idx) => ({
        recipeId,
        ingredientId: ing.ingredientId,
        ...quantityToDb(ing.quantity),
        unit: ing.unit,
        prepNotes: ing.prepNotes,
        displayOrder: idx
      }))
    });
  }

  // Update instructions if provided
  if (input.instructions) {
    // Delete existing instructions
    await prisma.recipeInstruction.deleteMany({
      where: { recipeId }
    });

    // Create new instructions
    await prisma.recipeInstruction.createMany({
      data: input.instructions.map((inst, idx) => ({
        recipeId,
        stepNumber: inst.stepNumber,
        text: inst.text,
        displayOrder: idx
      }))
    });
  }

  return getRecipe(userId, recipeId);
}

/**
 * Delete a recipe
 */
export async function deleteRecipe(userId: number, recipeId: number) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId }
  });

  if (!recipe || recipe.userId !== userId) {
    throw new Error('Recipe not found or access denied');
  }

  await prisma.recipe.delete({
    where: { id: recipeId }
  });
}

/**
 * Get recipes by cuisine type
 */
export async function getRecipesByCuisine(userId: number, cuisineType: string) {
  return prisma.recipe.findMany({
    where: {
      userId,
      cuisineType
    },
    select: {
      id: true,
      name: true,
      photoUrl: true,
      defaultServings: true
    },
    orderBy: { name: 'asc' }
  });
}

/**
 * Get highly-rated recipes
 */
export async function getTopRatedRecipes(userId: number, minRating: number = 4, limit: number = 10) {
  const recipes = await prisma.recipe.findMany({
    where: { userId },
    include: {
      ratings: {
        select: { rating: true }
      }
    }
  });

  // Filter and sort by rating
  const rated = recipes
    .filter((r) => r.ratings.length > 0)
    .map((r) => ({
      ...r,
      averageRating: r.ratings.reduce((sum, rating) => sum + rating.rating, 0) / r.ratings.length
    }))
    .filter((r) => r.averageRating >= minRating)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, limit);

  return rated;
}
