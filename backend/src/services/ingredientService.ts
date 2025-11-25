import { prisma } from '../db/client';

/**
 * Search for ingredients by name with autocomplete
 * Returns ingredients matching the search term (case-insensitive)
 */
export async function searchIngredients(query: string, limit: number = 20) {
  if (!query || query.length === 0) {
    return [];
  }

  const ingredients = await prisma.ingredient.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          aliases: {
            contains: query,
            mode: 'insensitive'
          }
        }
      ]
    },
    include: {
      category: true
    },
    take: limit,
    orderBy: {
      name: 'asc'
    }
  });

  return ingredients;
}

/**
 * Get ingredient by ID
 */
export async function getIngredient(id: number) {
  return prisma.ingredient.findUnique({
    where: { id },
    include: {
      category: true,
      recipeIngredients: {
        include: {
          recipe: {
            select: {
              id: true,
              name: true,
              userId: true
            }
          }
        }
      }
    }
  });
}

/**
 * Create a new ingredient
 */
export async function createIngredient(data: {
  name: string;
  categoryId?: number;
  aliases?: string[];
  typicalUnit?: string;
}) {
  // Check for duplicates
  const existing = await prisma.ingredient.findUnique({
    where: { name: data.name }
  });

  if (existing) {
    throw new Error(`Ingredient "${data.name}" already exists`);
  }

  return prisma.ingredient.create({
    data: {
      name: data.name,
      categoryId: data.categoryId,
      typicalUnit: data.typicalUnit,
      aliases: data.aliases ? JSON.stringify(data.aliases) : null
    },
    include: {
      category: true
    }
  });
}

/**
 * Update an ingredient
 */
export async function updateIngredient(
  id: number,
  data: {
    name?: string;
    categoryId?: number | null;
    aliases?: string[];
    typicalUnit?: string;
  }
) {
  return prisma.ingredient.update({
    where: { id },
    data: {
      name: data.name,
      categoryId: data.categoryId,
      typicalUnit: data.typicalUnit,
      aliases: data.aliases ? JSON.stringify(data.aliases) : undefined
    },
    include: {
      category: true
    }
  });
}

/**
 * Get or create ingredient (used when adding to recipes)
 */
export async function getOrCreateIngredient(name: string) {
  const existing = await prisma.ingredient.findUnique({
    where: { name }
  });

  if (existing) {
    return existing;
  }

  return createIngredient({ name });
}

/**
 * Get ingredients by category
 */
export async function getIngredientsByCategory(categoryId: number) {
  return prisma.ingredient.findMany({
    where: { categoryId },
    orderBy: { name: 'asc' }
  });
}

/**
 * Get all ingredients with usage count
 */
export async function getAllIngredients(limit: number = 100, offset: number = 0) {
  const ingredients = await prisma.ingredient.findMany({
    include: {
      category: true,
      _count: {
        select: { recipeIngredients: true }
      }
    },
    orderBy: { name: 'asc' },
    take: limit,
    skip: offset
  });

  return ingredients.map((ing) => ({
    ...ing,
    usageCount: ing._count.recipeIngredients
  }));
}
