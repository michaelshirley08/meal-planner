# Database Schema - Entity Relationship Diagram

**Last Updated:** November 25, 2025
**Database:** SQLite
**ORM:** Prisma
**Migration Status:** ✅ Up to date (1 migration applied)

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│       User          │
├─────────────────────┤
│ id (PK)            │
│ email (UNIQUE)     │
│ username (UNIQUE)  │
│ password           │
│ createdAt          │
│ updatedAt          │
└─────────────────────┘
         │
         │ 1:N (CASCADE DELETE)
         ├─────────────────┐
         │                 │
         │                 │
         ▼                 ▼
┌─────────────────────┐   ┌──────────────────────────┐
│      Recipe         │   │ IngredientCustomization  │
├─────────────────────┤   ├──────────────────────────┤
│ id (PK)            │   │ id (PK)                 │
│ userId (FK) ───────┼───│ userId (FK)             │
│ name               │   │ ingredientId (FK) ──────┼────┐
│ description        │   │ preferredUnit           │    │
│ cuisineType        │   │ notes                   │    │
│ prepMinutes        │   └──────────────────────────┘    │
│ cookMinutes        │                                   │
│ defaultServings    │                                   │
│ photoUrl           │                                   │
│ createdAt          │                                   │
│ updatedAt          │                                   │
└─────────────────────┘                                   │
         │                                                │
         │ 1:N (CASCADE DELETE)                          │
         ├─────────────────┬──────────────┐              │
         │                 │              │              │
         ▼                 ▼              ▼              │
┌──────────────────┐ ┌──────────────┐ ┌─────────────┐   │
│ RecipeIngredient │ │RecipeInstruct│ │ MealPlan    │   │
├──────────────────┤ ├──────────────┤ ├─────────────┤   │
│ id (PK)         │ │ id (PK)     │ │ id (PK)    │   │
│ recipeId (FK)   │ │ recipeId(FK)│ │ userId(FK) │   │
│ ingredientId(FK)├─┼─┐stepNumber  │ │ recipeId(FK)│   │
│ quantityWhole   │ │ │ text        │ │ date        │   │
│ quantityNum     │ │ │ displayOrder│ │ mealType    │   │
│ quantityDenom   │ │ └──────────────┘ │ servings    │   │
│ unit            │ │                  │ notes       │   │
│ prepNotes       │ │                  │ completed   │   │
│ displayOrder    │ │                  │ createdAt   │   │
│ createdAt       │ │                  │ updatedAt   │   │
└──────────────────┘ │                  └─────────────┘   │
         │           │                                     │
         │           │                                     │
         ▼           │                                     │
┌──────────────────────┐◄─────────────────────────────────┘
│     Ingredient       │
├──────────────────────┤
│ id (PK)             │
│ name (UNIQUE)       │
│ categoryId (FK)     │──┐
│ aliases             │  │
│ typicalUnit         │  │
│ createdAt           │  │
│ updatedAt           │  │
└──────────────────────┘  │
         │                │
         │ 1:N            │
         │                │
         ▼                ▼
┌──────────────────────┐ ┌────────────────────────┐
│ ShoppingListItem     │ │ IngredientCategory     │
├──────────────────────┤ ├────────────────────────┤
│ id (PK)             │ │ id (PK)               │
│ userId              │ │ userId                │
│ ingredientId (FK)   │ │ name                  │
│ checked             │ │ displayOrder          │
│ createdAt           │ │ color                 │
│ updatedAt           │ │ isSystemCategory      │
└──────────────────────┘ │ createdAt             │
                         └────────────────────────┘

┌─────────────────────┐
│   RecipeRating      │
├─────────────────────┤
│ id (PK)            │
│ userId (FK) ───────┼──┐
│ recipeId (FK) ─────┼──┼─► (CASCADE DELETE)
│ rating             │  │
│ notes              │  │
│ dateMade           │  │
│ createdAt          │  │
│ updatedAt          │  │
└─────────────────────┘  │
                         │
                         └─► Back to User
```

---

## Tables Summary

| Table | Rows (Approx) | Purpose | Cascade Deletes |
|-------|---------------|---------|-----------------|
| **User** | Low (1 in single-user POC) | User accounts | → Recipes, MealPlans, Ratings, Customizations |
| **Recipe** | Medium (100-1000) | User's recipe collection | → RecipeIngredients, Instructions, MealPlans, Ratings |
| **Ingredient** | Medium (500+) | Master ingredient list | → RecipeIngredients, ShoppingListItems, Customizations |
| **RecipeIngredient** | High (500-5000) | Recipe-ingredient relationships | None |
| **RecipeInstruction** | High (1000-10000) | Recipe steps | None |
| **MealPlan** | Medium (100-500) | Weekly meal schedule | None |
| **ShoppingListItem** | Low (10-50) | Current shopping list | None |
| **IngredientCategory** | Low (10-30) | Ingredient organization | None (orphans ingredients) |
| **IngredientCustomization** | Low (50-200) | User preferences per ingredient | None |
| **RecipeRating** | Medium (50-500) | User's recipe ratings | None |

---

## Cascade Delete Rules

### ⚠️ Critical Data Loss Risks

**Deleting a User:**
- ✅ Cascades to: Recipes, MealPlans, RecipeRatings, IngredientCustomizations
- ⚠️ **Impact:** Deletes ALL user data (recipes, meal plans, ratings)
- **Risk Level:** CRITICAL

**Deleting a Recipe:**
- ✅ Cascades to: RecipeIngredients, RecipeInstructions, MealPlans (via FK), RecipeRatings
- ⚠️ **Impact:** Removes recipe from meal plans, deletes all ratings
- **Risk Level:** MEDIUM

**Deleting an Ingredient:**
- ✅ Cascades to: RecipeIngredients, ShoppingListItems, IngredientCustomizations
- ⚠️ **Impact:** Removes ingredient from ALL recipes using it, clears from shopping list
- **Risk Level:** HIGH (affects multiple recipes)

**Deleting an IngredientCategory:**
- ❌ No cascade: Ingredients become orphaned (categoryId = null)
- **Risk Level:** LOW

---

## Unique Constraints

| Table | Constraint | Purpose |
|-------|-----------|---------|
| User | email | Prevent duplicate accounts |
| User | username | Prevent duplicate usernames |
| Ingredient | name | Prevent duplicate ingredients |
| RecipeIngredient | [recipeId, ingredientId] | One entry per ingredient per recipe |
| RecipeInstruction | [recipeId, stepNumber] | Unique step numbers per recipe |
| RecipeRating | [userId, recipeId, dateMade] | One rating per recipe per date |
| MealPlan | [userId, recipeId, date, mealType] | One meal per type per day |
| ShoppingListItem | [userId, ingredientId] | One entry per ingredient |
| IngredientCategory | [userId, name] | Unique category names per user |
| IngredientCustomization | [userId, ingredientId] | One customization per ingredient per user |

---

## Indexes

### Performance-Critical Indexes

| Table | Indexed Fields | Query Pattern |
|-------|---------------|---------------|
| Recipe | userId | "Show my recipes" |
| RecipeIngredient | recipeId | "Get ingredients for recipe" |
| RecipeIngredient | ingredientId | "Find recipes using ingredient" |
| RecipeInstruction | recipeId | "Get recipe steps" |
| MealPlan | userId | "Show my meal plans" |
| MealPlan | date | "Get meals for date range" |
| RecipeRating | userId | "Show my ratings" |
| RecipeRating | recipeId | "Get ratings for recipe" |
| Ingredient | name | "Search ingredients by name" |
| Ingredient | categoryId | "Get ingredients by category" |
| IngredientCategory | userId | "Get user's categories" |

---

## Quantity Storage (Backward Compatible)

**Current Approach:**
- Stores: `quantityWhole`, `quantityNum`, `quantityDenom` (3 fields)
- Internal: Uses decimal `Quantity = number` type
- Conversion functions: `dbToQuantity()` and `quantityToDb()`

**Example:**
```typescript
// Database storage (backward compatible)
{ quantityWhole: 1, quantityNum: 50, quantityDenom: 100 }

// Application usage (decimal)
const quantity: Quantity = 1.5; // Simple number

// Conversion on read
dbToQuantity(1, 50, 100) → 1.5

// Conversion on write
quantityToDb(1.5) → { quantityWhole: 1, quantityNum: 50, quantityDenom: 100 }
```

---

## Migration History

| Migration | Date | Description | Status |
|-----------|------|-------------|--------|
| `20251125010307_init` | 2025-11-25 | Initial schema creation | ✅ Applied |

**Next Migration:** None pending - schema is in sync

---

## Schema Validation

**Last Checked:** November 25, 2025
**Command:** `npx prisma migrate status`
**Result:** ✅ Database schema is up to date!

---

## Future Considerations

### Potential Schema Changes

1. **Remove fraction fields** - Once confident in decimal-only approach, can simplify to single `quantity` field
2. **Add composite indexes** - For complex queries (e.g., `[userId, date]` on MealPlan)
3. **Add soft deletes** - `deletedAt` timestamp instead of CASCADE DELETE for critical tables
4. **Add full-text search** - For recipe/ingredient name search optimization
5. **Add quantity units enum** - Constrain `unit` field to valid values

### Known Issues

- Case-insensitive search removed in PR #3 (Prisma `mode: 'insensitive'` unsupported)
- ShoppingListItem missing quantity fields (can't specify "2 lbs butter" - only "butter")
- No audit trail for recipe modifications

---

## Related Documentation

- [DATABASE_MIGRATION_GUIDE.md](./DATABASE_MIGRATION_GUIDE.md) - Migration procedures
- [DATA_ENGINEER_RECOMMENDATIONS.md](./DATA_ENGINEER_RECOMMENDATIONS.md) - Safety guidelines
- [SINGLE_USER_SCHEMA.md](./SINGLE_USER_SCHEMA.md) - Single-user architecture decisions

---

**⚠️ IMPORTANT:** Any changes to `backend/prisma/schema.prisma` require:
1. Data Engineer review (CODEOWNERS enforced)
2. Migration script generation (`npx prisma migrate dev`)
3. Risk assessment in PR description
4. Testing on production-like data
5. Rollback procedure documentation
