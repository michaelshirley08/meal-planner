# Database Schema Analysis - Multi-User to Single-User Transition

## Executive Summary

The current Meal Planner database schema is designed for a multi-user SaaS application with full user isolation. This document analyzes the schema's multi-user dependencies and their impact on transitioning to a single-user installable application.

**Key Findings:**
- 7 of 10 models have direct userId dependencies
- All data operations enforce user isolation through userId checks
- ShoppingListItem stores ephemeral state (checked items) tied to users
- IngredientCategory supports both system and user-specific categories
- Recipe ratings allow multiple ratings per recipe per user with dates

**Recommendation:** Complete schema redesign with removal of User model and userId foreign keys will simplify the codebase and improve performance for single-user use case.

---

## Current Schema Overview

### Database Provider
- **Current:** SQLite (via Prisma ORM)
- **Location:** Defined by `DATABASE_URL` environment variable
- **Assessment:** SQLite is ideal for single-user desktop application (no change needed)

### Models Inventory

| Model | Purpose | Has userId | User Isolation | Complexity |
|-------|---------|-----------|----------------|------------|
| User | Authentication & profiles | N/A | N/A | High |
| Recipe | Recipe storage | Yes | Owner-based | Medium |
| Ingredient | Global ingredient library | No | Shared | Low |
| IngredientCategory | Category organization | Optional | Hybrid | Medium |
| IngredientCustomization | User preferences per ingredient | Yes | User-specific | Medium |
| RecipeIngredient | Recipe-ingredient junction | No | Via Recipe | Low |
| RecipeInstruction | Recipe steps | No | Via Recipe | Low |
| RecipeRating | User ratings & cooking history | Yes | User-specific | Medium |
| MealPlan | Scheduled meals | Yes | User-specific | Medium |
| ShoppingListItem | Shopping tracking | Yes | User-specific | Low |

---

## Multi-User Dependencies Analysis

### 1. User Model (users table)

**Current Schema:**
```prisma
model User {
  id                       Int                       @id @default(autoincrement())
  email                    String                    @unique
  username                 String                    @unique
  password                 String
  createdAt                DateTime                  @default(now())
  updatedAt                DateTime                  @updatedAt
  ingredientCustomizations IngredientCustomization[]
  mealPlans                MealPlan[]
  recipeRatings            RecipeRating[]
  recipes                  Recipe[]
}
```

**Dependencies:**
- Referenced by: Recipe, IngredientCustomization, RecipeRating, MealPlan
- Unique constraints on email and username
- Password storage with bcrypt hashing
- JWT token generation for authentication

**Single-User Impact:**
- **REMOVE ENTIRELY** - No authentication needed for local app
- All relations must be updated
- AuthService, AuthMiddleware become obsolete

---

### 2. Recipe Model (recipes table)

**Current Schema:**
```prisma
model Recipe {
  id              Int                 @id @default(autoincrement())
  userId          Int
  name            String
  description     String?
  cuisineType     String?
  prepMinutes     Int?
  cookMinutes     Int?
  defaultServings Int                 @default(4)
  photoUrl        String?
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt
  user            User                @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

**Multi-User Dependencies:**
- `userId` foreign key (required)
- Cascade delete when user deleted
- Index on userId for query optimization
- All service methods filter by userId

**Service Layer Access Pattern:**
```typescript
// All queries filter by userId
const recipe = await prisma.recipe.findUnique({
  where: { id: recipeId }
});
if (!recipe || recipe.userId !== userId) {
  return null;  // Enforce ownership
}
```

**Single-User Changes:**
- Remove `userId` field
- Remove `user` relation
- Remove `@@index([userId])`
- Remove ownership checks in services
- Simplified queries (no userId filter needed)

---

### 3. IngredientCategory Model (ingredient_categories table)

**Current Schema:**
```prisma
model IngredientCategory {
  id               Int          @id @default(autoincrement())
  userId           Int?
  name             String
  displayOrder     Int          @default(0)
  color            String?
  isSystemCategory Boolean      @default(false)
  createdAt        DateTime     @default(now())
  ingredients      Ingredient[]

  @@unique([userId, name])
  @@index([userId])
}
```

**Multi-User Design:**
- **Hybrid model** - supports both system and user categories
- `userId` is nullable
- System categories have `isSystemCategory = true` and `userId = null`
- User categories belong to specific user
- Unique constraint prevents duplicate category names per user

**Service Access Pattern:**
```typescript
const categories = await prisma.ingredientCategory.findMany({
  where: {
    OR: [
      { userId },
      { isSystemCategory: true }
    ]
  }
});
```

**Single-User Impact:**
- **SIMPLIFY** - No need for user/system distinction
- Remove `userId` field
- Remove `isSystemCategory` field
- Change unique constraint to just `name`
- All categories are "user" categories (but no user concept)

---

### 4. IngredientCustomization Model (ingredient_customizations table)

**Current Schema:**
```prisma
model IngredientCustomization {
  id            Int        @id @default(autoincrement())
  userId        Int
  ingredientId  Int
  preferredUnit String?
  notes         String?
  ingredient    Ingredient @relation(fields: [ingredientId], references: [id], onDelete: Cascade)
  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, ingredientId])
}
```

**Purpose:**
- Store user-specific preferences for ingredients
- Override typical units (e.g., prefer grams over cups)
- Add personal notes about ingredients

**Single-User Impact:**
- **REDESIGN OR REMOVE** - Depends on feature value
- Option 1: Remove entirely (simplify ingredient to just have preferredUnit)
- Option 2: Keep as Ingredient preferences (embedded in Ingredient model)
- Option 3: Keep table but remove userId (one preference per ingredient)

**Recommendation:** **Option 3** - Keep table, make it simple ingredient preferences
- Ensures one preference per ingredient
- Allows future extensibility
- Minimal migration impact

---

### 5. RecipeRating Model (recipe_ratings table)

**Current Schema:**
```prisma
model RecipeRating {
  id        Int      @id @default(autoincrement())
  userId    Int
  recipeId  Int
  rating    Int
  notes     String?
  dateMade  DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  recipe    Recipe   @relation(fields: [recipeId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, recipeId, dateMade])
  @@index([userId])
  @@index([recipeId])
}
```

**Multi-User Design:**
- Multiple ratings per recipe (different users)
- Multiple ratings per user-recipe pair (different dates)
- Unique constraint: one rating per user, per recipe, per date

**Single-User Impact:**
- **SIMPLIFY** - Keep cooking history concept
- Remove `userId` field and relation
- Change unique constraint to `[recipeId, dateMade]`
- Allows tracking multiple cooks of same recipe
- Remove userId index

**Use Case Preserved:**
- Track when recipe was made
- Rate each cooking attempt
- Add notes about what worked/didn't work

---

### 6. MealPlan Model (meal_plans table)

**Current Schema:**
```prisma
model MealPlan {
  id              Int      @id @default(autoincrement())
  userId          Int
  recipeId        Int
  date            DateTime
  mealType        String
  servingOverride Int?
  notes           String?
  completed       Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  recipe          Recipe   @relation(fields: [recipeId], references: [id])
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, recipeId, date, mealType])
  @@index([userId])
  @@index([date])
}
```

**Multi-User Design:**
- Each user has their own meal calendar
- Prevents scheduling same recipe twice on same date/mealType per user
- Indexed by userId and date for efficient queries

**Single-User Impact:**
- Remove `userId` field and relation
- Change unique constraint to `[recipeId, date, mealType]`
- Remove userId index (date index remains useful)
- Service queries simplified (no userId filter)

---

### 7. ShoppingListItem Model (shopping_list_items table)

**Current Schema:**
```prisma
model ShoppingListItem {
  id           Int      @id @default(autoincrement())
  userId       Int
  ingredientId Int
  checked      Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([userId, ingredientId])
}
```

**Purpose:**
- Track which ingredients user has checked off while shopping
- Ephemeral state - cleared after shopping trip
- No relation to Ingredient (intentionally - allows any ingredient ID)

**Multi-User Design:**
- Each user has own shopping check state
- One check status per user per ingredient

**Single-User Impact:**
- **SIMPLIFY DRAMATICALLY**
- Remove userId entirely
- Change unique constraint to just `ingredientId`
- One check state per ingredient globally

**Note:** No foreign key to Ingredient table (by design) - allows flexibility

---

## Models WITHOUT User Dependencies

### 8. Ingredient Model (ingredients table)

**Current Schema:**
```prisma
model Ingredient {
  id                Int                       @id @default(autoincrement())
  name              String                    @unique
  categoryId        Int?
  aliases           String?
  typicalUnit       String?
  createdAt         DateTime                  @default(now())
  updatedAt         DateTime                  @updatedAt
  category          IngredientCategory?       @relation(fields: [categoryId], references: [id])
  customizations    IngredientCustomization[]
  recipeIngredients RecipeIngredient[]
}
```

**Single-User Impact:**
- **NO CHANGES** - Already user-agnostic
- Global ingredient library (shared resource in multi-user world)
- Perfect for single-user (just one user's ingredient library)

### 9. RecipeIngredient Model (recipe_ingredients table)

**Current Schema:**
```prisma
model RecipeIngredient {
  id            Int        @id @default(autoincrement())
  recipeId      Int
  ingredientId  Int
  quantityWhole Int
  quantityNum   Int
  quantityDenom Int
  unit          String
  prepNotes     String?
  displayOrder  Int
  createdAt     DateTime   @default(now())
  ingredient    Ingredient @relation(fields: [ingredientId], references: [id])
  recipe        Recipe     @relation(fields: [recipeId], references: [id], onDelete: Cascade)

  @@unique([recipeId, ingredientId])
}
```

**Single-User Impact:**
- **NO CHANGES** - Already user-agnostic
- User isolation via Recipe relation

### 10. RecipeInstruction Model (recipe_instructions table)

**Current Schema:**
```prisma
model RecipeInstruction {
  id           Int    @id @default(autoincrement())
  recipeId     Int
  stepNumber   Int
  text         String
  displayOrder Int
  recipe       Recipe @relation(fields: [recipeId], references: [id], onDelete: Cascade)

  @@unique([recipeId, stepNumber])
}
```

**Single-User Impact:**
- **NO CHANGES** - Already user-agnostic
- User isolation via Recipe relation

---

## Service Layer Analysis

### Current Service Methods Requiring userId

**All services follow this pattern:**

1. **Accept userId as first parameter**
```typescript
export async function getRecipe(userId: number, recipeId: number)
export async function createMealPlan(userId: number, input: CreateMealPlanInput)
```

2. **Filter queries by userId**
```typescript
const recipes = await prisma.recipe.findMany({
  where: { userId }
});
```

3. **Verify ownership before mutations**
```typescript
const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
if (!recipe || recipe.userId !== userId) {
  throw new Error('Recipe not found or access denied');
}
```

### Single-User Service Changes

**All service methods need updates:**

1. **Remove userId parameter**
```typescript
// Before
export async function getRecipe(userId: number, recipeId: number)

// After
export async function getRecipe(recipeId: number)
```

2. **Remove userId filters**
```typescript
// Before
const recipes = await prisma.recipe.findMany({
  where: { userId }
});

// After
const recipes = await prisma.recipe.findMany({});
```

3. **Remove ownership checks**
```typescript
// Before
if (!recipe || recipe.userId !== userId) {
  throw new Error('Recipe not found or access denied');
}

// After
if (!recipe) {
  throw new Error('Recipe not found');
}
```

---

## Authentication & Middleware Impact

### Files to Remove/Modify

1. **/backend/src/services/authService.ts**
   - **Action:** DELETE
   - Contains: user registration, login, JWT generation, password hashing
   - No longer needed in single-user app

2. **/backend/src/middleware/authMiddleware.ts**
   - **Action:** DELETE
   - Contains: JWT verification, user extraction from tokens
   - No longer needed - no authentication required

3. **/backend/src/routes/auth.ts**
   - **Action:** DELETE
   - Contains: `/auth/register`, `/auth/login`, `/auth/me` endpoints
   - No longer needed

4. **All other routes**
   - **Action:** MODIFY
   - Remove `authMiddleware` from route protection
   - Remove `req.user` references (JWT payload)
   - Pass hardcoded or no userId to service methods

---

## Data Migration Considerations

### Migration Path Options

**Option A: Clean Start (Recommended for Dev)**
- Drop all tables
- Create new schema from scratch
- No data preservation
- Simplest approach

**Option B: Data Preservation (If Existing Data)**
- Keep single user's data
- Delete User table and other users' data
- Update all tables to remove userId columns
- Requires careful migration script

### Migration Script Requirements (Option B)

1. **Identify primary user** (if multiple users exist)
2. **Delete data for other users**
   ```sql
   DELETE FROM recipes WHERE userId != <primary_user_id>;
   DELETE FROM meal_plans WHERE userId != <primary_user_id>;
   -- etc.
   ```
3. **Remove userId columns**
   ```sql
   ALTER TABLE recipes DROP COLUMN userId;
   ALTER TABLE meal_plans DROP COLUMN userId;
   -- etc.
   ```
4. **Update constraints and indexes**
   - Drop userId-based unique constraints
   - Create new unique constraints
   - Drop userId indexes

---

## Breaking Changes Summary

### Schema Changes
- User model removed entirely
- 7 models lose userId field
- 6 unique constraints modified
- 4 indexes removed
- 3 indexes remain unchanged

### Service Layer Changes
- 40+ service methods need userId parameter removed
- All ownership checks removed
- Query filters simplified

### API Layer Changes
- Authentication endpoints removed (3 endpoints)
- All protected routes become public (no auth middleware)
- Request handlers no longer extract userId from JWT

### Frontend Changes
- Remove login/registration pages
- Remove JWT token storage
- Remove authentication state management
- Remove HTTP interceptors adding Authorization headers

---

## Performance Implications

### Improvements
- **Simpler queries** - No userId filters needed
- **Fewer indexes** - Less overhead on writes
- **No authentication overhead** - No JWT verification per request
- **Smaller database** - Fewer columns, smaller indexes

### No Regression
- Key performance indexes remain (date, recipeId, ingredientId)
- SQLite already optimized for single-user access
- Query complexity reduced overall

---

## Security Considerations

### Multi-User Security (Current)
- JWT-based authentication
- bcrypt password hashing
- User isolation at database level
- Authorization checks in every service method

### Single-User Security (Proposed)
- **No authentication** - Local app with file system access control
- **OS-level security** - User's SQLite file protected by OS permissions
- **No network exposure** - Desktop app (not web-accessible)
- **Database encryption** - Could add SQLite encryption if needed (optional enhancement)

### Risks & Mitigations
- **Risk:** Anyone with file access can read database
- **Mitigation:** OS file permissions, optional SQLite encryption
- **Risk:** No audit trail of who made changes
- **Mitigation:** Not needed for single-user app
- **Risk:** Accidental data loss (no user backups)
- **Mitigation:** Implement application-level backup feature

---

## Questions for Product Owner / Coordinator

### Feature Decisions Needed

1. **IngredientCustomization:**
   - Keep as ingredient preferences (one per ingredient)?
   - Move fields into Ingredient model directly?
   - Remove feature entirely?

2. **RecipeRating History:**
   - Keep ability to rate recipe multiple times (different dates)?
   - Simplify to one rating per recipe?
   - Include notes field for each cooking attempt?

3. **Shopping List Persistence:**
   - Should checked items persist across app restarts?
   - Or clear on app close (ephemeral state)?

4. **Data Import/Export:**
   - Support importing recipes from multi-user backup?
   - Export format needed?

5. **Future Multi-Device Support:**
   - Any plans for sync across devices?
   - Would affect architecture decisions

---

## Recommendations

### Immediate Actions
1. ✅ Review this analysis with product owner
2. ✅ Decide on IngredientCustomization approach
3. ✅ Confirm RecipeRating design
4. ✅ Create new single-user schema
5. ✅ Document migration strategy

### Schema Design Principles
- **Simplicity first** - Remove all user-related complexity
- **Keep useful features** - Cooking history, meal planning still valuable
- **Local-first** - Optimize for single SQLite file
- **Future-proof** - Don't preclude future cloud sync (design for it but don't build it)

### Migration Strategy
- **Development:** Clean start (drop all, recreate)
- **Production:** Data preservation script (if user has existing data)
- **Testing:** Validate all service methods work without userId

---

## Next Steps

1. **Read:** Review SINGLE_USER_SCHEMA.md for proposed new schema
2. **Read:** Review MIGRATION_STRATEGY.md for migration approach
3. **Implement:** Create schema-single-user.prisma file
4. **Document:** Create ER diagrams for new schema
5. **Plan:** Update service layer (separate task/phase)
6. **Plan:** Update API routes (separate task/phase)
7. **Plan:** Update frontend (separate task/phase)
