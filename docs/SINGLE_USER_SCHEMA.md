# Single-User Database Schema Design

## Overview

This document defines the proposed database schema for the single-user Meal Planner application. The design removes all multi-user concepts while preserving core functionality: recipe management, meal planning, shopping lists, and cooking history.

**Design Principles:**
1. Simplicity - Remove all user-related complexity
2. Feature Preservation - Keep valuable features (ratings, history, customization)
3. Data Integrity - Maintain relationships and constraints
4. Local-First - Optimize for SQLite single-user access
5. Future-Proof - Design doesn't preclude future cloud sync

---

## Schema Changes Summary

| Model | Change Type | Description |
|-------|-------------|-------------|
| User | REMOVED | No authentication needed |
| Recipe | MODIFIED | Remove userId, keep all features |
| Ingredient | NO CHANGE | Already user-agnostic |
| IngredientCategory | SIMPLIFIED | Remove userId, isSystemCategory |
| IngredientCustomization | SIMPLIFIED | Remove userId, one preference per ingredient |
| RecipeIngredient | NO CHANGE | Already user-agnostic |
| RecipeInstruction | NO CHANGE | Already user-agnostic |
| RecipeRating | SIMPLIFIED | Remove userId, keep cooking history |
| MealPlan | MODIFIED | Remove userId, keep all features |
| ShoppingListItem | SIMPLIFIED | Remove userId |

---

## Complete Schema Definition

### Core Recipe Models

#### Recipe
Stores recipe metadata and content. No ownership concept needed in single-user app.

```prisma
model Recipe {
  id              Int                 @id @default(autoincrement())
  name            String
  description     String?
  cuisineType     String?
  prepMinutes     Int?
  cookMinutes     Int?
  defaultServings Int                 @default(4)
  photoUrl        String?
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt
  mealPlans       MealPlan[]
  ingredients     RecipeIngredient[]
  instructions    RecipeInstruction[]
  ratings         RecipeRating[]

  @@map("recipes")
}
```

**Changes from Multi-User:**
- ❌ Removed `userId` field
- ❌ Removed `user` relation
- ❌ Removed `@@index([userId])`
- ✅ All other fields unchanged

**Rationale:**
- Recipes are personal to the single user
- No ownership checks needed
- Simpler queries (no userId filter)

---

#### RecipeIngredient
Junction table linking recipes to ingredients with quantities. No changes needed.

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
  @@index([recipeId])
  @@index([ingredientId])
  @@map("recipe_ingredients")
}
```

**Changes:** None - already user-agnostic

**Rationale:**
- User isolation was via Recipe relation
- Unique constraint prevents duplicate ingredients per recipe
- Quantity stored as fraction (whole, numerator, denominator)

---

#### RecipeInstruction
Stores step-by-step cooking instructions. No changes needed.

```prisma
model RecipeInstruction {
  id           Int    @id @default(autoincrement())
  recipeId     Int
  stepNumber   Int
  text         String
  displayOrder Int
  recipe       Recipe @relation(fields: [recipeId], references: [id], onDelete: Cascade)

  @@unique([recipeId, stepNumber])
  @@index([recipeId])
  @@map("recipe_instructions")
}
```

**Changes:** None - already user-agnostic

**Rationale:**
- User isolation was via Recipe relation
- stepNumber allows logical ordering
- displayOrder allows custom reordering

---

### Ingredient Models

#### Ingredient
Global ingredient library. No changes needed.

```prisma
model Ingredient {
  id                Int                       @id @default(autoincrement())
  name              String                    @unique
  categoryId        Int?
  aliases           String?
  typicalUnit       String?
  createdAt         DateTime                  @default(now())
  updatedAt         DateTime                  @updatedAt
  customization     IngredientCustomization?
  category          IngredientCategory?       @relation(fields: [categoryId], references: [id])
  recipeIngredients RecipeIngredient[]

  @@index([name])
  @@index([categoryId])
  @@map("ingredients")
}
```

**Changes from Multi-User:**
- ✅ Changed `customizations` (array) to `customization` (optional single)
- ✅ All other fields unchanged

**Rationale:**
- Ingredient library is personal to single user
- One customization per ingredient (simplified 1:1 relationship)
- Unique name constraint prevents duplicates

---

#### IngredientCategory
Organizes ingredients for shopping lists. Simplified from hybrid user/system model.

```prisma
model IngredientCategory {
  id           Int          @id @default(autoincrement())
  name         String       @unique
  displayOrder Int          @default(0)
  color        String?
  createdAt    DateTime     @default(now())
  ingredients  Ingredient[]

  @@map("ingredient_categories")
}
```

**Changes from Multi-User:**
- ❌ Removed `userId` field (was nullable)
- ❌ Removed `isSystemCategory` field
- ❌ Removed `@@unique([userId, name])` - now just `@unique` on name
- ❌ Removed `@@index([userId])`
- ✅ All other fields unchanged

**Rationale:**
- No need to distinguish "system" vs "user" categories
- All categories are user's categories
- Simpler unique constraint (just name)
- displayOrder allows custom sorting in shopping lists

---

#### IngredientCustomization
Store user preferences for ingredients (preferred units, notes). Simplified to 1:1 with Ingredient.

```prisma
model IngredientCustomization {
  id            Int        @id @default(autoincrement())
  ingredientId  Int        @unique
  preferredUnit String?
  notes         String?
  ingredient    Ingredient @relation(fields: [ingredientId], references: [id], onDelete: Cascade)

  @@map("ingredient_customizations")
}
```

**Changes from Multi-User:**
- ❌ Removed `userId` field
- ❌ Removed `user` relation
- ❌ Removed `@@unique([userId, ingredientId])`
- ✅ Added `@unique` on `ingredientId` (one customization per ingredient)

**Rationale:**
- Preserves customization feature (valuable for single user)
- Simpler 1:1 relationship instead of many-to-many
- One set of preferences per ingredient
- Cascade delete when ingredient deleted

**Alternative Considered:** Embed fields directly in Ingredient model
- **Rejected:** Keeps customization optional and separated from core ingredient data

---

### Rating & History Models

#### RecipeRating
Track cooking history with ratings and notes. Support multiple cooks of same recipe.

```prisma
model RecipeRating {
  id        Int      @id @default(autoincrement())
  recipeId  Int
  rating    Int
  notes     String?
  dateMade  DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  recipe    Recipe   @relation(fields: [recipeId], references: [id], onDelete: Cascade)

  @@unique([recipeId, dateMade])
  @@index([recipeId])
  @@map("recipe_ratings")
}
```

**Changes from Multi-User:**
- ❌ Removed `userId` field
- ❌ Removed `user` relation
- ❌ Removed `@@unique([userId, recipeId, dateMade])`
- ✅ Added `@@unique([recipeId, dateMade])` - one rating per recipe per date
- ❌ Removed `@@index([userId])`

**Rationale:**
- Preserves cooking history (when did I make this?)
- Allows rating same recipe multiple times (different cooking attempts)
- dateMade prevents duplicate ratings on same day
- Rating scale typically 1-5 stars
- Notes capture what worked or needed adjustment

**Use Cases:**
- "Made lasagna 3 times, ratings improved as I learned"
- "First time: 3 stars - too much garlic. Second time: 5 stars - perfect!"
- Track recipe evolution and personal preferences

---

### Meal Planning Models

#### MealPlan
Schedule recipes on calendar with serving overrides and notes.

```prisma
model MealPlan {
  id              Int      @id @default(autoincrement())
  recipeId        Int
  date            DateTime
  mealType        String
  servingOverride Int?
  notes           String?
  completed       Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  recipe          Recipe   @relation(fields: [recipeId], references: [id])

  @@unique([recipeId, date, mealType])
  @@index([date])
  @@map("meal_plans")
}
```

**Changes from Multi-User:**
- ❌ Removed `userId` field
- ❌ Removed `user` relation
- ❌ Removed `@@unique([userId, recipeId, date, mealType])`
- ✅ Added `@@unique([recipeId, date, mealType])` - prevent duplicate scheduling
- ❌ Removed `@@index([userId])`

**Rationale:**
- Meal calendar is personal to single user
- Unique constraint prevents scheduling same recipe twice on same date/meal
- mealType: 'breakfast', 'lunch', 'dinner', 'snack'
- servingOverride scales recipe ingredients (overrides defaultServings)
- completed tracks which meals were actually cooked
- Date index for efficient calendar queries

**Note:** Unique constraint allows same recipe on different meals same day
- OK: Lasagna for lunch AND dinner same day
- NOT OK: Lasagna for lunch twice same day

---

### Shopping List Models

#### ShoppingListItem
Track which ingredients are checked off while shopping. Ephemeral state.

```prisma
model ShoppingListItem {
  id           Int      @id @default(autoincrement())
  ingredientId Int      @unique
  checked      Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("shopping_list_items")
}
```

**Changes from Multi-User:**
- ❌ Removed `userId` field
- ❌ Removed `@@unique([userId, ingredientId])`
- ✅ Added `@unique` on `ingredientId` - one check status per ingredient

**Rationale:**
- Shopping list check state is ephemeral
- One check status per ingredient globally
- Typically cleared after shopping trip
- No foreign key to Ingredient (by design) - allows flexibility

**Note:** No FK to Ingredient table
- Allows checking off aggregated/computed ingredients
- Shopping list generated dynamically from meal plans
- This table just tracks check state

---

## Complete Prisma Schema File

See `/home/mike/meal-planner/backend/prisma/schema-single-user.prisma` for the complete, ready-to-use schema file.

---

## Relationship Overview

### One-to-Many Relationships

**Recipe → RecipeIngredient**
- One recipe has many ingredients
- Cascade delete when recipe deleted

**Recipe → RecipeInstruction**
- One recipe has many instructions
- Cascade delete when recipe deleted

**Recipe → RecipeRating**
- One recipe has many ratings (cooking history)
- Cascade delete when recipe deleted

**Recipe → MealPlan**
- One recipe scheduled many times
- Default behavior when recipe deleted (restrict or cascade - TBD)

**Ingredient → RecipeIngredient**
- One ingredient used in many recipes
- Default behavior when ingredient deleted (restrict - prevent deletion if used)

**IngredientCategory → Ingredient**
- One category contains many ingredients
- Null foreign key (optional category)
- Set null when category deleted

### One-to-One Relationships

**Ingredient → IngredientCustomization**
- One ingredient has one optional customization
- Cascade delete when ingredient deleted

---

## Constraints & Validation

### Unique Constraints

| Model | Constraint | Purpose |
|-------|------------|---------|
| Recipe | None | Allow duplicate recipe names |
| Ingredient | name | Prevent duplicate ingredients |
| IngredientCategory | name | Prevent duplicate categories |
| IngredientCustomization | ingredientId | One customization per ingredient |
| RecipeIngredient | [recipeId, ingredientId] | One entry per ingredient per recipe |
| RecipeInstruction | [recipeId, stepNumber] | Prevent duplicate step numbers |
| RecipeRating | [recipeId, dateMade] | One rating per recipe per day |
| MealPlan | [recipeId, date, mealType] | Prevent duplicate meal scheduling |
| ShoppingListItem | ingredientId | One check status per ingredient |

### Indexes

| Model | Index | Purpose |
|-------|-------|---------|
| Ingredient | name | Fast ingredient search/autocomplete |
| Ingredient | categoryId | Fast category filtering |
| RecipeIngredient | recipeId | Fast ingredient lookup for recipe |
| RecipeIngredient | ingredientId | Fast recipe lookup for ingredient |
| RecipeInstruction | recipeId | Fast instruction lookup |
| RecipeRating | recipeId | Fast rating lookup for recipe |
| MealPlan | date | Fast calendar queries |

### Cascade Deletes

**When Recipe deleted:**
- Delete all RecipeIngredient entries
- Delete all RecipeInstruction entries
- Delete all RecipeRating entries
- MealPlan behavior: TBD (likely restrict or set null)

**When Ingredient deleted:**
- Delete IngredientCustomization if exists
- RecipeIngredient behavior: Restrict (prevent deletion if used in recipes)

**When IngredientCategory deleted:**
- Set Ingredient.categoryId to null (ingredients become uncategorized)

---

## Data Types & Defaults

### Integer Fields
- All IDs: autoincrement integers
- quantityWhole, quantityNum, quantityDenom: Integer fractions
- prepMinutes, cookMinutes: Nullable integers
- defaultServings: Integer, default 4
- servingOverride: Nullable integer
- rating: Integer (1-5 scale, enforced at application level)
- displayOrder: Integer (for custom ordering)

### String Fields
- name, description, notes: Text
- cuisineType, mealType: String (could be enum)
- unit: String (free-form units)
- photoUrl: String (file path or URL)
- color: String (hex color for categories)

### Boolean Fields
- checked: Default false
- completed: Default false

### DateTime Fields
- date: Normalized to day start (no time component for meal planning)
- dateMade: Normalized to day start
- createdAt: Auto-set on creation
- updatedAt: Auto-updated on modification

---

## Feature Preservation

### Features Kept from Multi-User Version

✅ **Recipe Management**
- Full CRUD operations
- Ingredients with fractional quantities
- Step-by-step instructions
- Recipe metadata (cuisine, timing, servings)

✅ **Meal Planning**
- Calendar-based scheduling
- Serving overrides
- Meal type organization
- Completion tracking

✅ **Shopping Lists**
- Dynamic generation from meal plans
- Ingredient aggregation
- Category grouping
- Check-off tracking

✅ **Cooking History**
- Multiple ratings per recipe
- Date tracking
- Notes per cooking attempt

✅ **Ingredient Customization**
- Preferred units
- Personal notes

✅ **Categorization**
- Custom ingredient categories
- Display order control
- Color coding

### Features Removed

❌ **Authentication**
- No login/registration
- No password management
- No JWT tokens

❌ **User Management**
- No user profiles
- No email/username

❌ **Multi-User Features**
- No user isolation
- No shared/private recipes
- No per-user settings

---

## Migration Compatibility

### Forward Migration (Multi-User → Single-User)

**If preserving data:**
1. Select primary user (if multiple users)
2. Delete other users' data
3. Drop userId columns
4. Update unique constraints
5. Rebuild indexes

**If clean start:**
1. Drop all tables
2. Create new schema
3. Fresh database

### Backward Migration (Single-User → Multi-User)

**Not recommended, but possible:**
1. Add User table
2. Create default user
3. Add userId columns to all tables
4. Set all userId values to default user
5. Add back unique constraints with userId
6. Add back indexes

**Better approach:** Export/import data rather than schema migration

---

## Performance Characteristics

### Query Simplification

**Before (Multi-User):**
```sql
SELECT * FROM recipes WHERE userId = ? AND id = ?;
```

**After (Single-User):**
```sql
SELECT * FROM recipes WHERE id = ?;
```

**Impact:**
- Simpler query plans
- One fewer index lookup
- Faster execution (marginal, but consistent)

### Index Optimization

**Removed indexes:**
- recipes(userId)
- recipe_ratings(userId)
- meal_plans(userId)
- ingredient_categories(userId)

**Impact:**
- Faster inserts/updates (fewer indexes to maintain)
- Smaller database file size
- No query performance regression (queries don't filter by userId)

### SQLite Optimization

**Single-user advantages:**
- No concurrent user queries
- No transaction conflicts
- Simpler locking
- Better cache utilization

---

## Future Extensibility

### Cloud Sync Considerations

If future cloud sync is added, consider:

**Option 1: User ID at Sync Layer**
- Keep single-user schema
- Add userId during sync upload
- Strip userId during sync download
- Sync server has multi-user schema

**Option 2: Cloud-First Schema**
- Adopt multi-user schema even for local
- Always use same user ID locally
- Direct schema compatibility with cloud
- Easier sync implementation

**Recommendation:** Option 1 - Keep local schema simple, complexity at sync boundary

### Import/Export

**Export format:**
- JSON with complete data dump
- Include schema version
- No userId in export

**Import format:**
- Accept multi-user exports (strip userId)
- Accept single-user exports (direct import)
- Validate schema compatibility

---

## Security Model

### Local Database Security

**Protection:**
- OS file system permissions
- User's home directory
- Standard file ACLs

**Optional Enhancements:**
- SQLite encryption (SQLCipher)
- Application-level encryption of sensitive fields
- Backup encryption

### No Network Security

**Assumptions:**
- App not network-accessible
- No remote API access
- Local desktop application only

**If adding network features:**
- Add authentication layer
- Consider read-only remote access
- Or full multi-user architecture

---

## Testing Strategy

### Schema Validation

**Test Cases:**
1. All constraints enforced
2. Cascade deletes work correctly
3. Unique constraints prevent duplicates
4. Indexes improve query performance
5. Default values applied

### Data Integrity

**Test Cases:**
1. Cannot delete ingredient used in recipe
2. Deleting recipe removes ratings/ingredients/instructions
3. Deleting category nulls ingredient.categoryId
4. Meal plan prevents duplicate scheduling
5. One customization per ingredient

### Migration Testing

**Test Cases:**
1. Multi-user data migrates correctly (if applicable)
2. Clean installation works
3. No orphaned records
4. All relations valid

---

## Summary

This schema design successfully simplifies the multi-user architecture to single-user while:

✅ **Preserving all valuable features**
- Recipe management with full details
- Meal planning with calendar
- Shopping list generation
- Cooking history and ratings
- Ingredient customization

✅ **Removing complexity**
- No authentication
- No user management
- No ownership checks
- Simpler queries
- Fewer indexes

✅ **Maintaining data integrity**
- All relationships preserved
- Constraints enforced
- Cascade deletes configured
- Unique constraints appropriate

✅ **Optimizing for single-user**
- SQLite-appropriate
- Local-first design
- Simpler query patterns
- Better performance

✅ **Future-proofing**
- Export/import support
- Cloud sync compatible (with adapter layer)
- Clear migration path if needed
