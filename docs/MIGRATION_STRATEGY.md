# Migration Strategy: Multi-User to Single-User Schema

## Overview

This document outlines the strategy for migrating the Meal Planner database from a multi-user SaaS architecture to a single-user installable application architecture.

**Two Migration Paths:**
1. **Clean Start** - Recommended for development, no data preservation
2. **Data Preservation** - For production users with existing data

---

## Path 1: Clean Start (Recommended for Development)

### When to Use
- Development environment
- Testing new schema
- No existing user data to preserve
- Fresh installation

### Steps

#### 1. Backup Current Schema (Optional)
```bash
cd /home/mike/meal-planner/backend
cp prisma/schema.prisma prisma/schema-multi-user-backup.prisma
```

#### 2. Replace Schema File
```bash
# Replace the current schema with single-user schema
cp prisma/schema-single-user.prisma prisma/schema.prisma
```

#### 3. Delete Existing Database (if exists)
```bash
# Remove existing SQLite database
rm -f prisma/dev.db
rm -f prisma/dev.db-journal
```

#### 4. Generate Prisma Client
```bash
npx prisma generate
```

#### 5. Create New Database
```bash
npx prisma migrate dev --name init-single-user
```

#### 6. Verify Schema
```bash
# Open Prisma Studio to verify tables
npx prisma studio
```

### Result
- Fresh database with single-user schema
- No userId fields
- Simplified constraints
- Ready for development

### Rollback
```bash
# Restore multi-user schema if needed
cp prisma/schema-multi-user-backup.prisma prisma/schema.prisma
npx prisma generate
npx prisma migrate dev --name restore-multi-user
```

---

## Path 2: Data Preservation (Production Migration)

### When to Use
- Production environment with existing data
- User has created recipes, meal plans, etc.
- Want to preserve cooking history

### Prerequisites
1. Identify primary user (if multiple users in database)
2. Backup existing database
3. Test migration on copy first

### Steps

#### Step 1: Backup Everything

```bash
cd /home/mike/meal-planner/backend

# Backup database file
cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d_%H%M%S)

# Backup schema
cp prisma/schema.prisma prisma/schema-multi-user-backup.prisma

# Export data to JSON (optional, extra safety)
node scripts/export-data.js > data-backup.json
```

#### Step 2: Identify Primary User

```sql
-- Connect to database
sqlite3 prisma/dev.db

-- List all users
SELECT id, email, username, createdAt FROM users;

-- Count recipes per user
SELECT userId, COUNT(*) as recipe_count
FROM recipes
GROUP BY userId;

-- Identify primary user (most active)
SELECT u.id, u.email,
  COUNT(DISTINCT r.id) as recipes,
  COUNT(DISTINCT m.id) as meal_plans,
  COUNT(DISTINCT rr.id) as ratings
FROM users u
LEFT JOIN recipes r ON r.userId = u.id
LEFT JOIN meal_plans m ON m.userId = u.id
LEFT JOIN recipe_ratings rr ON rr.userId = u.id
GROUP BY u.id
ORDER BY recipes DESC, meal_plans DESC;
```

**Record the primary user ID** for next steps.

#### Step 3: Delete Non-Primary User Data

**CRITICAL:** This is destructive. Ensure backups are complete.

```sql
-- Set primary user ID (REPLACE WITH ACTUAL ID)
-- Example: If primary user id is 1
-- DELETE FROM ... WHERE userId != 1

-- Delete other users' recipes (cascade will handle ingredients/instructions)
DELETE FROM recipes WHERE userId != 1;

-- Delete other users' meal plans
DELETE FROM meal_plans WHERE userId != 1;

-- Delete other users' recipe ratings
DELETE FROM recipe_ratings WHERE userId != 1;

-- Delete other users' ingredient customizations
DELETE FROM ingredient_customizations WHERE userId != 1;

-- Delete other users' shopping list items
DELETE FROM shopping_list_items WHERE userId != 1;

-- Delete other users' custom categories
DELETE FROM ingredient_categories WHERE userId IS NOT NULL AND userId != 1;

-- Finally, delete other users
DELETE FROM users WHERE id != 1;

-- Verify only one user remains
SELECT COUNT(*) FROM users; -- Should be 1

-- Verify data integrity
SELECT COUNT(*) FROM recipes;
SELECT COUNT(*) FROM meal_plans;
SELECT COUNT(*) FROM recipe_ratings;
```

#### Step 4: Create Migration SQL Script

Create file: `/home/mike/meal-planner/backend/prisma/migrations/manual_single_user_migration.sql`

```sql
-- Manual Migration: Multi-User to Single-User Schema
-- Date: 2025-11-25
-- IMPORTANT: Backup database before running this migration

-- Start transaction
BEGIN TRANSACTION;

-- ============================================================================
-- STEP 1: Drop userId-dependent indexes
-- ============================================================================

DROP INDEX IF EXISTS recipes_userId_idx;
DROP INDEX IF EXISTS recipe_ratings_userId_idx;
DROP INDEX IF EXISTS meal_plans_userId_idx;
DROP INDEX IF EXISTS ingredient_categories_userId_idx;

-- ============================================================================
-- STEP 2: Create new tables without userId
-- ============================================================================

-- Rename old tables
ALTER TABLE recipes RENAME TO recipes_old;
ALTER TABLE recipe_ratings RENAME TO recipe_ratings_old;
ALTER TABLE meal_plans RENAME TO meal_plans_old;
ALTER TABLE ingredient_categories RENAME TO ingredient_categories_old;
ALTER TABLE ingredient_customizations RENAME TO ingredient_customizations_old;
ALTER TABLE shopping_list_items RENAME TO shopping_list_items_old;

-- Create new recipes table
CREATE TABLE recipes (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT NOT NULL,
  description     TEXT,
  cuisineType     TEXT,
  prepMinutes     INTEGER,
  cookMinutes     INTEGER,
  defaultServings INTEGER DEFAULT 4 NOT NULL,
  photoUrl        TEXT,
  createdAt       DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create new recipe_ratings table
CREATE TABLE recipe_ratings (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  recipeId  INTEGER NOT NULL,
  rating    INTEGER NOT NULL,
  notes     TEXT,
  dateMade  DATETIME NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE,
  UNIQUE(recipeId, dateMade)
);

-- Create new meal_plans table
CREATE TABLE meal_plans (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  recipeId        INTEGER NOT NULL,
  date            DATETIME NOT NULL,
  mealType        TEXT NOT NULL,
  servingOverride INTEGER,
  notes           TEXT,
  completed       INTEGER DEFAULT 0 NOT NULL,
  createdAt       DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (recipeId) REFERENCES recipes(id),
  UNIQUE(recipeId, date, mealType)
);

-- Create new ingredient_categories table
CREATE TABLE ingredient_categories (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT UNIQUE NOT NULL,
  displayOrder INTEGER DEFAULT 0 NOT NULL,
  color        TEXT,
  createdAt    DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create new ingredient_customizations table
CREATE TABLE ingredient_customizations (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  ingredientId  INTEGER UNIQUE NOT NULL,
  preferredUnit TEXT,
  notes         TEXT,
  FOREIGN KEY (ingredientId) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- Create new shopping_list_items table
CREATE TABLE shopping_list_items (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  ingredientId INTEGER UNIQUE NOT NULL,
  checked      INTEGER DEFAULT 0 NOT NULL,
  createdAt    DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt    DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- STEP 3: Copy data from old tables to new tables
-- ============================================================================

-- Copy recipes (excluding userId)
INSERT INTO recipes (id, name, description, cuisineType, prepMinutes, cookMinutes,
                     defaultServings, photoUrl, createdAt, updatedAt)
SELECT id, name, description, cuisineType, prepMinutes, cookMinutes,
       defaultServings, photoUrl, createdAt, updatedAt
FROM recipes_old;

-- Copy recipe_ratings (excluding userId)
INSERT INTO recipe_ratings (id, recipeId, rating, notes, dateMade, createdAt, updatedAt)
SELECT id, recipeId, rating, notes, dateMade, createdAt, updatedAt
FROM recipe_ratings_old;

-- Copy meal_plans (excluding userId)
INSERT INTO meal_plans (id, recipeId, date, mealType, servingOverride, notes,
                        completed, createdAt, updatedAt)
SELECT id, recipeId, date, mealType, servingOverride, notes,
       completed, createdAt, updatedAt
FROM meal_plans_old;

-- Copy ingredient_categories (excluding userId and isSystemCategory)
INSERT INTO ingredient_categories (id, name, displayOrder, color, createdAt)
SELECT id, name, displayOrder, color, createdAt
FROM ingredient_categories_old;

-- Copy ingredient_customizations (excluding userId)
INSERT INTO ingredient_customizations (id, ingredientId, preferredUnit, notes)
SELECT id, ingredientId, preferredUnit, notes
FROM ingredient_customizations_old;

-- Copy shopping_list_items (excluding userId)
INSERT INTO shopping_list_items (id, ingredientId, checked, createdAt, updatedAt)
SELECT id, ingredientId, checked, createdAt, updatedAt
FROM shopping_list_items_old;

-- ============================================================================
-- STEP 4: Create indexes for new tables
-- ============================================================================

CREATE INDEX recipe_ratings_recipeId_idx ON recipe_ratings(recipeId);
CREATE INDEX meal_plans_date_idx ON meal_plans(date);

-- ============================================================================
-- STEP 5: Drop old tables
-- ============================================================================

DROP TABLE recipes_old;
DROP TABLE recipe_ratings_old;
DROP TABLE meal_plans_old;
DROP TABLE ingredient_categories_old;
DROP TABLE ingredient_customizations_old;
DROP TABLE shopping_list_items_old;

-- ============================================================================
-- STEP 6: Drop users table (no longer needed)
-- ============================================================================

DROP TABLE users;

-- ============================================================================
-- STEP 7: Verify data integrity
-- ============================================================================

-- These will show row counts - verify they match expectations
SELECT 'recipes' as table_name, COUNT(*) as count FROM recipes
UNION ALL
SELECT 'recipe_ingredients', COUNT(*) FROM recipe_ingredients
UNION ALL
SELECT 'recipe_instructions', COUNT(*) FROM recipe_instructions
UNION ALL
SELECT 'recipe_ratings', COUNT(*) FROM recipe_ratings
UNION ALL
SELECT 'meal_plans', COUNT(*) FROM meal_plans
UNION ALL
SELECT 'ingredients', COUNT(*) FROM ingredients
UNION ALL
SELECT 'ingredient_categories', COUNT(*) FROM ingredient_categories
UNION ALL
SELECT 'ingredient_customizations', COUNT(*) FROM ingredient_customizations
UNION ALL
SELECT 'shopping_list_items', COUNT(*) FROM shopping_list_items;

-- Commit if everything looks good
COMMIT;

-- If something went wrong, you can ROLLBACK instead
-- ROLLBACK;
```

#### Step 5: Run Migration

```bash
# Test migration on backup first
cp prisma/dev.db prisma/dev-test-migration.db

# Run migration on test database
sqlite3 prisma/dev-test-migration.db < prisma/migrations/manual_single_user_migration.sql

# Verify test database
sqlite3 prisma/dev-test-migration.db "SELECT COUNT(*) FROM recipes;"
sqlite3 prisma/dev-test-migration.db "PRAGMA table_info(recipes);"

# If test looks good, run on production database
sqlite3 prisma/dev.db < prisma/migrations/manual_single_user_migration.sql
```

#### Step 6: Update Prisma Schema

```bash
# Replace schema file
cp prisma/schema-single-user.prisma prisma/schema.prisma

# Regenerate Prisma Client
npx prisma generate

# Verify schema matches database
npx prisma db pull
# This should not show changes if migration was successful
```

#### Step 7: Verify Application Works

```bash
# Run backend tests
npm test

# Start development server
npm run dev

# Test key operations:
# - List recipes
# - Create new recipe
# - View meal plan
# - Generate shopping list
```

### Rollback Plan (If Migration Fails)

```bash
# Stop application
# Restore backup database
cp prisma/dev.db.backup.YYYYMMDD_HHMMSS prisma/dev.db

# Restore multi-user schema
cp prisma/schema-multi-user-backup.prisma prisma/schema.prisma

# Regenerate client
npx prisma generate

# Restart application
npm run dev
```

---

## Service Layer Migration

After database schema migration, service methods must be updated.

### Changes Required

#### 1. Remove userId Parameter

**Before:**
```typescript
export async function getRecipe(userId: number, recipeId: number)
export async function createMealPlan(userId: number, input: CreateMealPlanInput)
```

**After:**
```typescript
export async function getRecipe(recipeId: number)
export async function createMealPlan(input: CreateMealPlanInput)
```

#### 2. Remove userId Filters

**Before:**
```typescript
const recipes = await prisma.recipe.findMany({
  where: { userId }
});
```

**After:**
```typescript
const recipes = await prisma.recipe.findMany({});
```

#### 3. Remove Ownership Checks

**Before:**
```typescript
const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
if (!recipe || recipe.userId !== userId) {
  throw new Error('Recipe not found or access denied');
}
```

**After:**
```typescript
const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
if (!recipe) {
  throw new Error('Recipe not found');
}
```

### Files to Update

1. `/backend/src/services/recipeService.ts` - 10+ methods
2. `/backend/src/services/ingredientService.ts` - 5+ methods
3. `/backend/src/services/mealPlanService.ts` - 12+ methods
4. `/backend/src/services/shoppingListService.ts` - 7+ methods

### Files to Remove

1. `/backend/src/services/authService.ts` - DELETE entirely
2. `/backend/src/middleware/authMiddleware.ts` - DELETE entirely
3. `/backend/src/routes/auth.ts` - DELETE entirely

### Service Update Strategy

**Option A: Incremental**
1. Update one service file at a time
2. Update corresponding route file
3. Test each service
4. Move to next service

**Option B: All at Once**
1. Create feature branch
2. Update all services simultaneously
3. Update all routes
4. Test entire application
5. Merge when complete

**Recommendation:** Option A for production, Option B for development

---

## API Routes Migration

### Changes Required

#### 1. Remove Auth Middleware

**Before:**
```typescript
import { authMiddleware } from '../middleware/authMiddleware.js';

router.get('/recipes', authMiddleware, async (req, res) => {
  const userId = req.user!.userId;
  const recipes = await recipeService.getUserRecipes(userId);
  res.json(recipes);
});
```

**After:**
```typescript
router.get('/recipes', async (req, res) => {
  const recipes = await recipeService.getUserRecipes();
  res.json(recipes);
});
```

#### 2. Remove userId Extraction

**Before:**
```typescript
const userId = req.user!.userId;  // From JWT
const recipe = await recipeService.getRecipe(userId, recipeId);
```

**After:**
```typescript
const recipe = await recipeService.getRecipe(recipeId);
```

### Routes to Update

1. `/backend/src/routes/recipes.ts`
2. `/backend/src/routes/ingredients.ts`
3. `/backend/src/routes/mealPlans.ts` (if exists)
4. `/backend/src/routes/shoppingList.ts` (if exists)

### Routes to Remove

1. `/backend/src/routes/auth.ts` - DELETE
   - POST /auth/register
   - POST /auth/login
   - GET /auth/me

---

## Frontend Migration

### Changes Required

#### 1. Remove Authentication Pages

**Files to Delete:**
- `/frontend/src/pages/Login.tsx` (or similar)
- `/frontend/src/pages/Register.tsx` (or similar)

#### 2. Remove Auth State Management

**Redux/Context Changes:**
```typescript
// Remove user slice
// Remove auth tokens
// Remove login/logout actions
```

#### 3. Remove HTTP Auth Interceptors

**Before:**
```typescript
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**After:**
```typescript
// Remove interceptor entirely
```

#### 4. Update API Calls

**Before:**
```typescript
// Login required first
await authService.login(email, password);
const recipes = await recipeService.getRecipes();
```

**After:**
```typescript
// Direct access
const recipes = await recipeService.getRecipes();
```

#### 5. Update Routing

**Before:**
```typescript
<PrivateRoute path="/recipes" component={RecipesPage} />
```

**After:**
```typescript
<Route path="/recipes" component={RecipesPage} />
```

### Frontend Files to Update

1. API service files (remove auth headers)
2. Route configuration (remove auth guards)
3. App initialization (no login check)
4. Navigation (remove login/logout)

---

## Testing Strategy

### Pre-Migration Testing

1. **Backup Verification**
   - Verify backup exists
   - Verify backup is readable
   - Test restore from backup

2. **Data Inventory**
   - Count all recipes
   - Count all meal plans
   - Count all ratings
   - Record counts for verification

### During Migration Testing

1. **Schema Validation**
   ```bash
   # Verify no userId columns
   sqlite3 prisma/dev.db "PRAGMA table_info(recipes);"

   # Verify new constraints
   sqlite3 prisma/dev.db ".schema recipes"
   ```

2. **Data Integrity**
   ```bash
   # Verify row counts match pre-migration
   sqlite3 prisma/dev.db "SELECT COUNT(*) FROM recipes;"
   sqlite3 prisma/dev.db "SELECT COUNT(*) FROM meal_plans;"
   ```

3. **Relationship Validation**
   ```sql
   -- Verify no orphaned recipe_ingredients
   SELECT ri.id FROM recipe_ingredients ri
   LEFT JOIN recipes r ON r.id = ri.recipeId
   WHERE r.id IS NULL;

   -- Should return 0 rows
   ```

### Post-Migration Testing

1. **Service Layer Tests**
   ```bash
   npm test
   ```

2. **Integration Tests**
   - Create new recipe
   - Update recipe
   - Delete recipe
   - Create meal plan
   - Generate shopping list

3. **UI Tests**
   - Navigate all pages
   - Perform CRUD operations
   - Verify no auth prompts

### Test Checklist

- [ ] Backup created and verified
- [ ] Migration script tested on copy
- [ ] Data counts match before/after
- [ ] No orphaned records
- [ ] All constraints working
- [ ] Service layer tests pass
- [ ] Integration tests pass
- [ ] UI works without authentication
- [ ] No console errors
- [ ] Performance is acceptable

---

## Troubleshooting

### Issue: Migration Script Fails Mid-Way

**Solution:**
```bash
# SQLite automatically rolls back on error if in transaction
# Restore from backup
cp prisma/dev.db.backup.YYYYMMDD_HHMMSS prisma/dev.db
# Fix migration script
# Try again
```

### Issue: Row Counts Don't Match

**Diagnosis:**
```sql
-- Find missing data
SELECT 'recipes' as table_name,
  (SELECT COUNT(*) FROM recipes_old) as old_count,
  (SELECT COUNT(*) FROM recipes) as new_count;
```

**Solution:**
- Rollback migration
- Investigate why data wasn't copied
- Fix INSERT statements
- Retry migration

### Issue: Foreign Key Constraint Violations

**Diagnosis:**
```sql
PRAGMA foreign_keys = ON;
PRAGMA foreign_key_check;
```

**Solution:**
- Identify orphaned records
- Either delete orphans or fix relationships
- Retry migration

### Issue: Prisma Client Out of Sync

**Symptoms:**
- TypeScript errors about userId
- Runtime errors about missing columns

**Solution:**
```bash
# Regenerate Prisma Client
npx prisma generate

# If still issues, introspect database
npx prisma db pull

# Compare with schema file
diff prisma/schema.prisma prisma/schema-single-user.prisma
```

### Issue: Service Methods Still Reference userId

**Symptoms:**
- TypeScript compilation errors
- Runtime errors about undefined userId

**Solution:**
- Search codebase for userId references
```bash
grep -r "userId" backend/src/services/
grep -r "req.user" backend/src/routes/
```
- Update all references
- Remove auth middleware imports

---

## Timeline Estimates

### Clean Start Migration
- Schema replacement: 5 minutes
- Database creation: 2 minutes
- Verification: 5 minutes
- **Total: ~15 minutes**

### Data Preservation Migration
- Backup and planning: 30 minutes
- Primary user identification: 15 minutes
- Data cleanup: 20 minutes
- Migration script creation: 45 minutes
- Migration execution: 10 minutes
- Verification: 20 minutes
- **Total: ~2.5 hours**

### Service Layer Updates
- Per service file: 30-60 minutes
- Total services (4 files): 2-4 hours
- Testing: 1-2 hours
- **Total: ~3-6 hours**

### API Routes Updates
- Per route file: 20-30 minutes
- Total routes (4 files): 1-2 hours
- Testing: 1 hour
- **Total: ~2-3 hours**

### Frontend Updates
- Remove auth: 1-2 hours
- Update API calls: 2-3 hours
- Testing: 1-2 hours
- **Total: ~4-7 hours**

### **Grand Total: 1-2 days** (including testing and verification)

---

## Success Criteria

Migration is successful when:

✅ Database schema has no userId columns
✅ User table is deleted
✅ All existing data is preserved
✅ All constraints are enforced
✅ All indexes are created
✅ Service layer works without userId
✅ API routes work without authentication
✅ Frontend works without login
✅ All tests pass
✅ Application functions correctly
✅ Performance is acceptable or improved

---

## Rollback Criteria

Rollback if:

❌ Data loss detected
❌ Migration script fails repeatedly
❌ Constraints cannot be satisfied
❌ Service layer changes too complex
❌ Critical bugs discovered
❌ Timeline exceeds 2x estimate

---

## Post-Migration Cleanup

After successful migration:

1. **Delete backup files** (after verification period)
   ```bash
   rm prisma/dev.db.backup.*
   rm prisma/schema-multi-user-backup.prisma
   ```

2. **Delete auth-related files**
   ```bash
   rm src/services/authService.ts
   rm src/middleware/authMiddleware.ts
   rm src/routes/auth.ts
   ```

3. **Update documentation**
   - Remove authentication from API docs
   - Update setup instructions
   - Update architecture diagrams

4. **Clean up dependencies**
   ```bash
   npm uninstall jsonwebtoken bcrypt
   npm uninstall @types/jsonwebtoken @types/bcrypt
   ```

5. **Update tests**
   - Remove auth-related tests
   - Update integration tests (no login needed)

---

## Summary

This migration strategy provides two clear paths:

**For Development:**
- Use Clean Start approach
- Fast and simple
- No data to preserve

**For Production:**
- Use Data Preservation approach
- Careful, tested migration
- Preserves user data

Both paths lead to the same destination: a simplified, single-user database schema that's easier to maintain and better suited for a local installable application.
