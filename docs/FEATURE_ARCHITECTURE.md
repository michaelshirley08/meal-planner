# Feature Architecture - Modular Design with Feature Flags

**Date:** November 25, 2025
**Principle:** Build features that can be independently enabled/disabled
**Goal:** Scalable, maintainable, easy to evolve from POC → MVP → Full Product

---

## Core Philosophy

**Each feature is:**
- **Self-contained** - Has its own UI, routes, services, and data
- **Independently toggleable** - Can be enabled/disabled via feature flag
- **Progressively enhanced** - Can start simple and add complexity
- **Well-bounded** - Clear interfaces with other features

---

## Feature Hierarchy

### Foundation Features (Always Enabled)
These are core to the app and cannot be disabled:

#### F0: Core Infrastructure
- Database connection
- API server
- Frontend routing
- Basic layout/navigation

---

### POC Features (Phase 1)

#### F1: Ingredient Management
**Status:** Required for POC
**Flag:** `FEATURE_INGREDIENTS`
**Dependencies:** None

**Capabilities:**
- Create ingredient (name only)
- List ingredients
- View ingredient details
- Search ingredients

**API Endpoints:**
- `GET /ingredients`
- `GET /ingredients/:id`
- `POST /ingredients`
- `GET /ingredients/search?q=flour`

**UI Components:**
- `IngredientListPage`
- `IngredientFormModal` (simple)

**Database:**
- `Ingredient` table

---

#### F2: Recipe Management
**Status:** Required for POC
**Flag:** `FEATURE_RECIPES`
**Dependencies:** F1 (Ingredients)

**Capabilities:**
- Create recipe with ingredients and instructions
- List recipes
- View recipe details
- Edit recipe
- Delete recipe
- Search recipes by name

**API Endpoints:**
- `GET /recipes`
- `GET /recipes/:id`
- `POST /recipes`
- `PUT /recipes/:id`
- `DELETE /recipes/:id`
- `GET /recipes/search?q=pasta`

**UI Components:**
- `RecipeListPage`
- `RecipeDetailPage`
- `RecipeFormPage`

**Database:**
- `Recipe` table
- `RecipeIngredient` junction table
- `RecipeInstruction` table

---

#### F3: Meal Planning
**Status:** Required for POC
**Flag:** `FEATURE_MEAL_PLANNING`
**Dependencies:** F2 (Recipes)

**Capabilities:**
- View weekly meal calendar
- Add recipe to meal slot
- Remove meal from calendar
- Navigate weeks

**API Endpoints:**
- `GET /meal-plans?startDate=X&endDate=Y`
- `POST /meal-plans`
- `DELETE /meal-plans/:id`

**UI Components:**
- `MealPlannerPage`
- `WeeklyCalendar`
- `AddMealModal`

**Database:**
- `MealPlan` table

---

### MVP Features (Phase 2)

#### F4: Shopping Lists
**Status:** Post-POC
**Flag:** `FEATURE_SHOPPING_LISTS`
**Dependencies:** F3 (Meal Planning)

**Capabilities:**
- Generate shopping list from meal plan
- Save and name lists
- Check off items
- View past lists

**API Endpoints:**
- `POST /shopping-lists/generate`
- `POST /shopping-lists`
- `GET /shopping-lists`
- `GET /shopping-lists/:id`
- `PUT /shopping-lists/:id/items/:itemId/toggle`

**UI Components:**
- `ShoppingListGeneratorPage`
- `ShoppingListViewPage`
- `ShoppingListsIndexPage`

**Database:**
- `ShoppingList` table
- `ShoppingListItem` table

**See:** `SHOPPING_LIST_EPIC.md`

---

#### F5: Recipe Photos
**Status:** MVP
**Flag:** `FEATURE_RECIPE_PHOTOS`
**Dependencies:** F2 (Recipes)

**Capabilities:**
- Upload recipe photo
- Display photo in list and detail views
- Delete photo

**Schema Changes:**
- Add `photoUrl` to Recipe

---

#### F6: Recipe Ratings
**Status:** MVP
**Flag:** `FEATURE_RECIPE_RATINGS`
**Dependencies:** F2 (Recipes)

**Capabilities:**
- Rate recipe (1-5 stars)
- View rating on recipe card
- Edit rating

**Schema Changes:**
- Add `rating` to Recipe
- Add `ratingNotes` to Recipe

---

#### F7: Ingredient Categories
**Status:** MVP (needed for shopping lists)
**Flag:** `FEATURE_INGREDIENT_CATEGORIES`
**Dependencies:** F1 (Ingredients)

**Capabilities:**
- Assign category to ingredient
- Manage categories (add, edit, reorder)
- Filter ingredients by category

**Schema Changes:**
- Add `category` to Ingredient
- Add `IngredientCategory` table (optional)

---

### Advanced Features (Post-MVP)

#### F8: Serving Overrides
**Status:** Post-MVP
**Flag:** `FEATURE_SERVING_OVERRIDES`
**Dependencies:** F3 (Meal Planning)

**Capabilities:**
- Override servings per meal
- Auto-scale ingredients in shopping list

**Schema Changes:**
- Add `servingOverride` to MealPlan

---

#### F9: Recipe Import
**Status:** Post-MVP
**Flag:** `FEATURE_RECIPE_IMPORT`
**Dependencies:** F2 (Recipes)

**Capabilities:**
- Import recipe from URL
- Parse common recipe formats
- Import from JSON

---

#### F10: Data Export
**Status:** Post-MVP
**Flag:** `FEATURE_DATA_EXPORT`
**Dependencies:** All

**Capabilities:**
- Export all data to JSON
- Export recipes to PDF
- Backup database

---

## Feature Flag Implementation

### Configuration File: `config/features.ts`

```typescript
export interface FeatureFlags {
  // POC Features (always enabled for POC)
  FEATURE_INGREDIENTS: boolean;
  FEATURE_RECIPES: boolean;
  FEATURE_MEAL_PLANNING: boolean;

  // MVP Features (disabled in POC)
  FEATURE_SHOPPING_LISTS: boolean;
  FEATURE_RECIPE_PHOTOS: boolean;
  FEATURE_RECIPE_RATINGS: boolean;
  FEATURE_INGREDIENT_CATEGORIES: boolean;

  // Advanced Features (disabled until post-MVP)
  FEATURE_SERVING_OVERRIDES: boolean;
  FEATURE_RECIPE_IMPORT: boolean;
  FEATURE_DATA_EXPORT: boolean;
}

// POC Configuration
export const POC_FEATURES: FeatureFlags = {
  FEATURE_INGREDIENTS: true,
  FEATURE_RECIPES: true,
  FEATURE_MEAL_PLANNING: true,
  FEATURE_SHOPPING_LISTS: false,
  FEATURE_RECIPE_PHOTOS: false,
  FEATURE_RECIPE_RATINGS: false,
  FEATURE_INGREDIENT_CATEGORIES: false,
  FEATURE_SERVING_OVERRIDES: false,
  FEATURE_RECIPE_IMPORT: false,
  FEATURE_DATA_EXPORT: false,
};

// MVP Configuration
export const MVP_FEATURES: FeatureFlags = {
  ...POC_FEATURES,
  FEATURE_SHOPPING_LISTS: true,
  FEATURE_RECIPE_PHOTOS: true,
  FEATURE_RECIPE_RATINGS: true,
  FEATURE_INGREDIENT_CATEGORIES: true,
};

// Load from environment or config file
export function getFeatureFlags(): FeatureFlags {
  const env = process.env.NODE_ENV || 'development';

  if (env === 'poc') return POC_FEATURES;
  if (env === 'mvp') return MVP_FEATURES;

  // Development: enable all
  return Object.keys(POC_FEATURES).reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {} as FeatureFlags);
}
```

---

### React Hook: `useFeature()`

```typescript
import { createContext, useContext } from 'react';
import { FeatureFlags } from '../config/features';

const FeatureContext = createContext<FeatureFlags | null>(null);

export function useFeature(feature: keyof FeatureFlags): boolean {
  const features = useContext(FeatureContext);
  if (!features) throw new Error('FeatureContext not provided');
  return features[feature];
}

// Usage in components
function RecipeDetailPage() {
  const hasRatings = useFeature('FEATURE_RECIPE_RATINGS');
  const hasPhotos = useFeature('FEATURE_RECIPE_PHOTOS');

  return (
    <div>
      {hasPhotos && <RecipePhoto />}
      <RecipeInfo />
      {hasRatings && <RecipeRating />}
    </div>
  );
}
```

---

### Navigation with Feature Flags

```typescript
function Navigation() {
  const hasShoppingLists = useFeature('FEATURE_SHOPPING_LISTS');

  return (
    <nav>
      <NavLink to="/recipes">Recipes</NavLink>
      <NavLink to="/meal-planner">Meal Planner</NavLink>
      {hasShoppingLists && (
        <NavLink to="/shopping-lists">Shopping Lists</NavLink>
      )}
    </nav>
  );
}
```

---

### Route Protection with Feature Flags

```typescript
function ProtectedRoute({ feature, children }) {
  const isEnabled = useFeature(feature);

  if (!isEnabled) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// In App.tsx
<Routes>
  <Route path="/recipes" element={<RecipeListPage />} />
  <Route path="/meal-planner" element={<MealPlannerPage />} />
  <Route
    path="/shopping-lists"
    element={
      <ProtectedRoute feature="FEATURE_SHOPPING_LISTS">
        <ShoppingListsPage />
      </ProtectedRoute>
    }
  />
</Routes>
```

---

### Backend Feature Flags

```typescript
// middleware/featureGuard.ts
export function requireFeature(feature: keyof FeatureFlags) {
  return (req, res, next) => {
    const features = getFeatureFlags();

    if (!features[feature]) {
      return res.status(404).json({
        error: 'Feature not available',
        feature: feature
      });
    }

    next();
  };
}

// routes/shoppingLists.ts
router.get('/shopping-lists',
  requireFeature('FEATURE_SHOPPING_LISTS'),
  async (req, res) => {
    // ... implementation
  }
);
```

---

## Feature Development Workflow

### Adding a New Feature

1. **Define Feature Scope**
   - Create feature document (e.g., `SHOPPING_LIST_EPIC.md`)
   - Define API endpoints
   - Define UI components
   - Define database schema changes

2. **Add Feature Flag**
   - Add to `FeatureFlags` interface
   - Set to `false` by default
   - Enable in development environment

3. **Implement Backend**
   - Create service in `src/services/[feature]Service.ts`
   - Create routes in `src/routes/[feature].ts`
   - Add feature flag guard to routes
   - Write tests

4. **Implement Frontend**
   - Create components in `src/components/[feature]/`
   - Create pages in `src/pages/[feature]/`
   - Add routes with feature protection
   - Add navigation items with feature checks
   - Write tests

5. **Test with Flag Disabled**
   - Verify app works without feature
   - Verify no broken links or errors
   - Verify graceful degradation

6. **Enable Feature**
   - Set flag to `true` in appropriate config
   - Test feature functionality
   - Deploy

---

## Component Organization by Feature

```
src/
├── features/
│   ├── ingredients/
│   │   ├── components/
│   │   │   ├── IngredientList.tsx
│   │   │   ├── IngredientForm.tsx
│   │   │   └── IngredientSearch.tsx
│   │   ├── pages/
│   │   │   └── IngredientManagePage.tsx
│   │   ├── services/
│   │   │   └── ingredientService.ts
│   │   └── index.ts (exports)
│   │
│   ├── recipes/
│   │   ├── components/
│   │   │   ├── RecipeCard.tsx
│   │   │   ├── RecipeForm.tsx
│   │   │   └── IngredientRowInput.tsx
│   │   ├── pages/
│   │   │   ├── RecipeListPage.tsx
│   │   │   ├── RecipeDetailPage.tsx
│   │   │   └── RecipeFormPage.tsx
│   │   ├── services/
│   │   │   └── recipeService.ts
│   │   └── index.ts
│   │
│   ├── meal-planning/
│   │   ├── components/
│   │   │   ├── WeeklyCalendar.tsx
│   │   │   ├── MealCard.tsx
│   │   │   └── AddMealModal.tsx
│   │   ├── pages/
│   │   │   └── MealPlannerPage.tsx
│   │   ├── services/
│   │   │   └── mealPlanService.ts
│   │   └── index.ts
│   │
│   └── shopping-lists/  (disabled in POC)
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── index.ts
│
├── shared/
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Navigation.tsx
│   │   └── Button.tsx
│   └── hooks/
│       └── useFeature.ts
│
└── config/
    └── features.ts
```

---

## POC Feature Order

### Week 1: Day 1-3 (POC Sprint)

**Day 1:**
1. F0: Core Infrastructure (backend + frontend scaffolding)
2. F1: Ingredient Management (basic create/list)
3. F2: Recipe Management (backend only)

**Day 2:**
4. F2: Recipe Management (frontend)
5. F2: Recipe CRUD complete
6. Basic styling

**Day 3:**
7. F3: Meal Planning (calendar + add/remove)
8. Testing
9. Demo prep

---

## MVP Feature Order

### Week 2: Day 4-10 (MVP Sprint)

**Priority 1 (Days 4-6):**
- F7: Ingredient Categories (needed for F4)
- F4: Shopping Lists (core MVP feature)

**Priority 2 (Days 7-8):**
- F5: Recipe Photos
- F6: Recipe Ratings

**Priority 3 (Days 9-10):**
- Polish and bug fixes
- UX improvements
- Performance optimization

---

## Testing Strategy by Feature

### Feature Testing Checklist

For each feature:
- [ ] Unit tests for service layer
- [ ] Integration tests for API endpoints
- [ ] Component tests for UI
- [ ] E2E tests for user stories
- [ ] Test with feature flag ON
- [ ] Test with feature flag OFF
- [ ] Test feature dependencies

---

## Benefits of Feature Flag Architecture

### Development
✅ Work on multiple features in parallel
✅ Deploy features before they're ready (dark launch)
✅ Easy rollback if feature has issues
✅ Progressive testing (enable for QA, then staging, then production)

### Product
✅ Control feature releases independently
✅ A/B test features with subsets of users
✅ Fast feature toggling (no code deploy needed)
✅ Clear feature roadmap and status

### Maintenance
✅ Easy to identify what each feature does
✅ Clear dependencies between features
✅ Easy to remove features if not used
✅ Reduced code complexity (modular)

---

## Feature Status Dashboard (Future)

Could build admin UI to see and toggle features:

```
Feature Status
─────────────────────────────────────────
✅ F1: Ingredients         [Enabled]
✅ F2: Recipes             [Enabled]
✅ F3: Meal Planning       [Enabled]
🔲 F4: Shopping Lists     [Disabled] → [Enable]
🔲 F5: Recipe Photos      [Disabled] → [Enable]
🔲 F6: Recipe Ratings     [Disabled] → [Enable]
🔲 F7: Categories         [Disabled] → [Enable]
```

---

## Migration from POC to MVP

### Current POC State
```typescript
const features = {
  FEATURE_INGREDIENTS: true,
  FEATURE_RECIPES: true,
  FEATURE_MEAL_PLANNING: true,
  // All others: false
};
```

### To Enable Shopping Lists (First MVP Feature)
```typescript
const features = {
  ...POC_FEATURES,
  FEATURE_SHOPPING_LISTS: true,
};
```

**Steps:**
1. Set `FEATURE_SHOPPING_LISTS: true` in config
2. Restart app
3. Shopping list nav item appears
4. Shopping list routes are accessible
5. Shopping list API endpoints work

**That's it!** No code changes in other features.

---

## Recommended Feature Flag Library (Future)

For production, consider:
- **LaunchDarkly** (SaaS, powerful but overkill for single-user)
- **Unleash** (self-hosted, open source)
- **Custom solution** (what we're building - perfect for POC/MVP)

For now: Simple config file is sufficient!

---

**Next Steps:**
1. Implement basic feature flag system (1 hour)
2. Organize code by feature (ongoing)
3. Build POC features in order (F1 → F2 → F3)
4. Add MVP features with flags (F4, F5, F6, F7)

**Document Owner:** Tech Lead + Project Coordinator
