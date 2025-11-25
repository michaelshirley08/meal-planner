# Technical Standards

**Version:** 1.0
**Date:** November 25, 2025
**Status:** Active

---

## Purpose

This document defines the technical standards, coding conventions, and architectural patterns for the Meal Planner project. All code must adhere to these standards to maintain consistency, quality, and maintainability.

---

## Table of Contents

1. [Code Organization](#code-organization)
2. [TypeScript Standards](#typescript-standards)
3. [Code Style](#code-style)
4. [Architecture Patterns](#architecture-patterns)
5. [API Standards](#api-standards)
6. [Database Standards](#database-standards)
7. [Error Handling](#error-handling)
8. [Testing Standards](#testing-standards)
9. [Documentation Standards](#documentation-standards)
10. [Security Standards](#security-standards)

---

## Code Organization

### Backend Structure

```
backend/
├── src/
│   ├── controllers/     # HTTP request handlers
│   │   └── recipes.controller.ts
│   ├── services/        # Business logic
│   │   └── recipes.service.ts
│   ├── repositories/    # Database access
│   │   └── recipes.repository.ts
│   ├── models/          # Type definitions
│   │   └── recipe.model.ts
│   ├── middleware/      # Express middleware
│   │   └── validation.middleware.ts
│   ├── utils/           # Helper functions
│   │   └── fraction.utils.ts
│   ├── types/           # Shared TypeScript types
│   │   └── api.types.ts
│   ├── config/          # Configuration
│   │   └── database.config.ts
│   └── index.ts         # Application entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── test/
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   └── e2e/             # End-to-end tests
├── package.json
└── tsconfig.json
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/      # Reusable React components
│   │   ├── common/      # Shared UI components
│   │   │   └── Button.tsx
│   │   └── recipes/     # Feature-specific components
│   │       └── RecipeCard.tsx
│   ├── pages/           # Page-level components
│   │   └── RecipeList.tsx
│   ├── hooks/           # Custom React hooks
│   │   └── useRecipes.ts
│   ├── services/        # API clients
│   │   └── api.service.ts
│   ├── types/           # TypeScript types
│   │   └── recipe.types.ts
│   ├── utils/           # Helper functions
│   │   └── format.utils.ts
│   ├── styles/          # Global styles
│   │   └── globals.css
│   ├── context/         # React Context providers
│   │   └── AppContext.tsx
│   └── App.tsx          # Application root
├── public/
├── test/
└── package.json
```

### File Naming Conventions

- **Components:** PascalCase - `RecipeCard.tsx`, `MealPlanner.tsx`
- **Utilities:** camelCase - `fraction.utils.ts`, `format.utils.ts`
- **Services:** camelCase with suffix - `recipes.service.ts`, `api.service.ts`
- **Types:** camelCase with suffix - `recipe.types.ts`, `api.types.ts`
- **Tests:** Same as source with `.test` - `fraction.utils.test.ts`
- **CSS/Styles:** kebab-case - `recipe-card.css`, `meal-planner.module.css`

---

## TypeScript Standards

### Type vs Interface

**Use `interface` for:**
- Public contracts (API responses, component props)
- Extending/implementing
- Object shapes

```typescript
// ✅ Good - Public API contract
interface Recipe {
  id: number;
  title: string;
  ingredients: Ingredient[];
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (id: number) => void;
}
```

**Use `type` for:**
- Unions, intersections, mapped types
- Function types
- Internal/private types

```typescript
// ✅ Good - Union type
type Status = 'draft' | 'published' | 'archived';

// ✅ Good - Function type
type RecipeFilter = (recipe: Recipe) => boolean;

// ✅ Good - Intersection
type RecipeWithAuthor = Recipe & { author: User };
```

### Strict Type Safety

```typescript
// ❌ Bad - Using 'any'
function processData(data: any) {
  return data.value;
}

// ✅ Good - Use unknown and type guard
function processData(data: unknown): string {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return String(data.value);
  }
  throw new Error('Invalid data format');
}

// ✅ Good - Generic with constraints
function processData<T extends { value: string }>(data: T): string {
  return data.value;
}
```

### Null Handling

```typescript
// Enable strict null checks in tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true
  }
}

// ❌ Bad - Assuming value exists
function getName(user: User): string {
  return user.name.toUpperCase(); // Could crash if name is null
}

// ✅ Good - Explicit null handling
function getName(user: User): string {
  return user.name?.toUpperCase() ?? 'Unknown';
}

// ✅ Good - Type guard
function getName(user: User): string {
  if (!user.name) {
    return 'Unknown';
  }
  return user.name.toUpperCase();
}
```

### Type Assertions

```typescript
// ❌ Bad - Dangerous assertion
const recipe = data as Recipe;

// ✅ Good - Validation before assertion
function isRecipe(data: unknown): data is Recipe {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    typeof data.title === 'string'
  );
}

if (isRecipe(data)) {
  const recipe = data; // Type is Recipe here
}
```

---

## Code Style

### Formatting (Prettier)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid"
}
```

### Line Length

- **Maximum:** 100 characters
- **Exceptions:** Import statements, URLs, long strings

### Indentation

- **2 spaces** for all files (TypeScript, JavaScript, JSON, YAML, Markdown)
- No tabs

### Naming Conventions

```typescript
// ✅ Classes - PascalCase
class RecipeService {}

// ✅ Interfaces/Types - PascalCase
interface Recipe {}
type RecipeFilter = (r: Recipe) => boolean;

// ✅ Variables/Functions - camelCase
const recipeCount = 10;
function getRecipes() {}

// ✅ Constants - UPPER_SNAKE_CASE
const MAX_RECIPE_TITLE_LENGTH = 200;
const API_BASE_URL = 'http://localhost:3000';

// ✅ Private members - prefix with _
class RecipeService {
  private _cache: Map<number, Recipe>;
}

// ✅ Boolean variables - is/has/should prefix
const isActive = true;
const hasIngredients = false;
const shouldValidate = true;
```

### Import Organization

```typescript
// 1. External dependencies
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 2. Internal modules (absolute imports)
import { Recipe } from '@/types/recipe.types';
import { RecipeService } from '@/services/recipes.service';

// 3. Relative imports
import { RecipeCard } from './RecipeCard';
import { formatDate } from '../utils/format';

// 4. Styles
import styles from './RecipeList.module.css';
```

### Comments

```typescript
// ❌ Bad - Stating the obvious
// Increment counter
counter++;

// ❌ Bad - Commented-out code
// const oldLogic = () => { ... };

// ✅ Good - Explaining WHY, not WHAT
// Use setTimeout to avoid blocking the UI thread during heavy computation
setTimeout(() => processRecipes(), 0);

// ✅ Good - Documenting complex logic
// The fraction parser handles mixed numbers (1 1/2), improper fractions (3/2),
// and decimals (1.5). It normalizes all to a consistent internal format.
function parseFraction(input: string): Fraction {
  // ...
}

// ✅ Good - TODO with ticket reference
// TODO(MP-123): Refactor to use streaming API for large datasets
```

---

## Architecture Patterns

### Separation of Concerns

**Backend Layers:**

```typescript
// ❌ Bad - Controller has business logic and DB access
export async function getRecipes(req: Request, res: Response) {
  const recipes = await prisma.recipe.findMany({
    where: { userId: req.user.id },
  });
  const filtered = recipes.filter(r => r.isActive);
  res.json(filtered);
}

// ✅ Good - Clear layer separation
// Controller - HTTP handling only
export async function getRecipes(req: Request, res: Response) {
  try {
    const recipes = await recipeService.getActiveRecipes(req.user.id);
    res.json({ data: recipes });
  } catch (error) {
    handleError(error, res);
  }
}

// Service - Business logic
export class RecipeService {
  async getActiveRecipes(userId: number): Promise<Recipe[]> {
    const recipes = await recipeRepository.findByUser(userId);
    return recipes.filter(r => r.isActive);
  }
}

// Repository - Database access only
export class RecipeRepository {
  async findByUser(userId: number): Promise<Recipe[]> {
    return prisma.recipe.findMany({ where: { userId } });
  }
}
```

### Dependency Injection

```typescript
// ❌ Bad - Hard-coded dependencies
class RecipeService {
  async getRecipe(id: number) {
    return await prisma.recipe.findUnique({ where: { id } });
  }
}

// ✅ Good - Injected dependencies (easier to test)
class RecipeService {
  constructor(private repository: RecipeRepository) {}

  async getRecipe(id: number) {
    return await this.repository.findById(id);
  }
}

// Usage
const repository = new RecipeRepository(prisma);
const service = new RecipeService(repository);
```

### Pure Functions

```typescript
// ❌ Bad - Side effects
let total = 0;
function addToTotal(value: number) {
  total += value; // Mutates external state
  return total;
}

// ✅ Good - Pure function
function add(a: number, b: number): number {
  return a + b;
}

// ❌ Bad - Mutates input
function updateRecipe(recipe: Recipe, title: string) {
  recipe.title = title;
  return recipe;
}

// ✅ Good - Returns new object
function updateRecipe(recipe: Recipe, title: string): Recipe {
  return { ...recipe, title };
}
```

---

## API Standards

### REST Conventions

```
GET    /api/v1/recipes          # List all recipes
GET    /api/v1/recipes/:id      # Get single recipe
POST   /api/v1/recipes          # Create recipe
PUT    /api/v1/recipes/:id      # Update recipe (full)
PATCH  /api/v1/recipes/:id      # Update recipe (partial)
DELETE /api/v1/recipes/:id      # Delete recipe

# Collections use plural nouns
# Use kebab-case for multi-word resources
GET    /api/v1/meal-plans
GET    /api/v1/shopping-lists
```

### Request/Response Format

```typescript
// ✅ Success Response
{
  "data": {
    "id": 1,
    "title": "Spaghetti Carbonara",
    "ingredients": [...]
  },
  "meta": {
    "timestamp": "2025-11-25T10:00:00Z"
  }
}

// ✅ List Response with Pagination
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}

// ✅ Error Response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Recipe title is required",
    "details": {
      "field": "title",
      "rule": "required"
    }
  },
  "meta": {
    "timestamp": "2025-11-25T10:00:00Z",
    "requestId": "abc123"
  }
}
```

### HTTP Status Codes

```
200 OK              - Successful GET, PUT, PATCH
201 Created         - Successful POST (resource created)
204 No Content      - Successful DELETE
400 Bad Request     - Validation error, malformed request
401 Unauthorized    - Authentication required
403 Forbidden       - Authenticated but not authorized
404 Not Found       - Resource doesn't exist
409 Conflict        - Duplicate resource, constraint violation
422 Unprocessable   - Semantic errors (valid syntax, invalid logic)
500 Internal Error  - Server error
```

### Date/Time Format

- **Always use ISO 8601:** `2025-11-25T10:30:00Z`
- **Store in UTC** on server
- **Convert to local time** on client

---

## Database Standards

### Table Naming

```sql
-- ✅ Plural snake_case
CREATE TABLE recipes (...)
CREATE TABLE meal_plans (...)
CREATE TABLE shopping_list_items (...)
```

### Column Naming

```sql
-- ✅ snake_case
CREATE TABLE recipes (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  prep_time INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Primary Keys

```sql
-- ✅ Auto-increment integer 'id'
id INTEGER PRIMARY KEY AUTOINCREMENT
```

### Foreign Keys

```sql
-- ✅ {table_name}_id
CREATE TABLE meal_plans (
  id INTEGER PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id),
  user_id INTEGER REFERENCES users(id)
);
```

### Timestamps

```sql
-- ✅ Always include created_at and updated_at
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- Update trigger for updated_at
CREATE TRIGGER update_recipe_timestamp
AFTER UPDATE ON recipes
FOR EACH ROW
BEGIN
  UPDATE recipes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
```

### Indexes

```sql
-- ✅ Index foreign keys
CREATE INDEX idx_meal_plans_recipe_id ON meal_plans(recipe_id);

-- ✅ Index commonly queried columns
CREATE INDEX idx_recipes_title ON recipes(title);

-- ✅ Composite indexes for multi-column queries
CREATE INDEX idx_meal_plans_date_user ON meal_plans(date, user_id);
```

---

## Error Handling

### Custom Error Classes

```typescript
// Base error class
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string | number) {
    super(`${resource} not found: ${id}`, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}
```

### Error Handling Pattern

```typescript
// ❌ Bad - Swallowing errors
try {
  await saveRecipe(recipe);
} catch (error) {
  // Silent failure
}

// ❌ Bad - Generic error handling
try {
  await saveRecipe(recipe);
} catch (error) {
  console.log('Error:', error);
  throw error;
}

// ✅ Good - Specific error handling with context
try {
  await saveRecipe(recipe);
} catch (error) {
  if (error instanceof ValidationError) {
    logger.warn('Recipe validation failed', { recipe, error });
    throw error;
  } else if (error instanceof ConflictError) {
    logger.warn('Duplicate recipe', { recipe, error });
    throw new ConflictError('Recipe with this title already exists');
  } else {
    logger.error('Failed to save recipe', { recipe, error });
    throw new AppError('Failed to save recipe', 500, 'SAVE_FAILED');
  }
}
```

### Logging

```typescript
// ✅ Good - Structured logging with context
logger.info('Recipe created', {
  recipeId: recipe.id,
  userId: user.id,
  timestamp: new Date().toISOString(),
});

logger.error('Database query failed', {
  query: 'SELECT * FROM recipes',
  error: error.message,
  stack: error.stack,
});

// Log levels: error, warn, info, debug
// Production: error, warn, info only
// Development: all levels
```

---

## Testing Standards

### File Organization

```
test/
├── unit/
│   ├── services/
│   │   └── recipes.service.test.ts
│   └── utils/
│       └── fraction.utils.test.ts
├── integration/
│   └── api/
│       └── recipes.api.test.ts
└── e2e/
    └── flows/
        └── create-recipe.e2e.test.ts
```

### Test File Naming

```typescript
// Source: src/utils/fraction.utils.ts
// Test:   test/unit/utils/fraction.utils.test.ts

// Or place test next to source
// src/utils/fraction.utils.ts
// src/utils/fraction.utils.test.ts
```

### Test Structure

```typescript
describe('RecipeService', () => {
  describe('getRecipeById', () => {
    it('should return recipe when it exists', async () => {
      // Arrange
      const mockRecipe = { id: 1, title: 'Test Recipe' };
      mockRepository.findById.mockResolvedValue(mockRecipe);

      // Act
      const result = await service.getRecipeById(1);

      // Assert
      expect(result).toEqual(mockRecipe);
    });

    it('should throw NotFoundError when recipe does not exist', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getRecipeById(999))
        .rejects
        .toThrow(NotFoundError);
    });
  });
});
```

### Test Naming

```typescript
// ✅ Good - Describes behavior and context
it('should return 400 when recipe title is empty', ...)
it('should cache recipe after first fetch', ...)
it('should handle network timeout gracefully', ...)

// ❌ Bad - Too vague
it('should work', ...)
it('should test recipe', ...)
```

### Mocking

```typescript
// ✅ Good - Mock external dependencies
const mockRepository = {
  findById: jest.fn(),
  save: jest.fn(),
};

const service = new RecipeService(mockRepository);

// ✅ Good - Mock at module boundary
jest.mock('@/services/api.service', () => ({
  fetchRecipes: jest.fn(),
}));
```

### Coverage Goals

- **Unit Tests:** 80%+ statement and branch coverage
- **Integration Tests:** All API endpoints
- **E2E Tests:** Critical user flows

---

## Documentation Standards

### JSDoc for Public APIs

```typescript
/**
 * Parses a fraction string into a normalized Fraction object.
 *
 * Supports multiple formats:
 * - Mixed numbers: "1 1/2"
 * - Improper fractions: "3/2"
 * - Decimals: "1.5"
 * - Whole numbers: "2"
 *
 * @param input - The fraction string to parse
 * @returns A normalized Fraction object
 * @throws {ValidationError} If the input format is invalid
 *
 * @example
 * ```typescript
 * parseFraction("1 1/2") // { whole: 1, numerator: 1, denominator: 2 }
 * parseFraction("3/2")   // { whole: 1, numerator: 1, denominator: 2 }
 * ```
 */
export function parseFraction(input: string): Fraction {
  // ...
}
```

### README Files

Every major directory should have a README:

```markdown
# Services

This directory contains business logic services.

## Architecture

Services encapsulate business logic and coordinate between repositories and controllers.
They should:
- Be testable in isolation
- Have no HTTP concerns (no req/res)
- Handle business rules and validation
- Not access database directly (use repositories)

## Examples

- `recipes.service.ts` - Recipe management logic
- `meal-plans.service.ts` - Meal planning logic
```

---

## Security Standards

### Input Validation

```typescript
// ✅ Always validate user input
import { z } from 'zod';

const recipeSchema = z.object({
  title: z.string().min(1).max(200),
  prepTime: z.number().int().positive().optional(),
  servings: z.number().int().positive().min(1).max(100),
});

// Validate in controller/middleware
const recipe = recipeSchema.parse(req.body);
```

### SQL Injection Prevention

```typescript
// ❌ Bad - String concatenation
const query = `SELECT * FROM recipes WHERE title = '${title}'`;

// ✅ Good - Parameterized query (Prisma does this automatically)
const recipe = await prisma.recipe.findMany({
  where: { title: title }
});
```

### XSS Prevention

```typescript
// ✅ React escapes by default
<div>{recipe.title}</div>

// ⚠️ Dangerous - Only use when necessary
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />

// ✅ Sanitize HTML input
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirtyHtml);
```

### Secrets Management

```bash
# ✅ Use environment variables
DATABASE_URL="file:./dev.db"
JWT_SECRET="secret-key-here"

# ❌ Never commit .env files
# Add to .gitignore
.env
.env.local
.env.production
```

---

## Enforcement

These standards are enforced through:

1. **Linting:** ESLint catches style violations
2. **Formatting:** Prettier auto-formats code
3. **Type Checking:** TypeScript compiler catches type errors
4. **Code Review:** Reviewers check architectural patterns
5. **CI/CD:** Automated checks block merges

---

## Questions?

For clarifications or suggestions, create a GitHub Discussion or contact the Tech Lead.
