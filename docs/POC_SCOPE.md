# POC Scope - Meal Planner Single-User App

**Date:** November 25, 2025
**Status:** Approved by Product Owner
**Goal:** Get to working POC as fast as possible

---

## Core Principle: Ruthless Simplification

**POC Goal:** Prove the core concept works
**Timeline:** 2-3 days maximum
**Success:** User can manage recipes and plan meals

---

## ✅ IN SCOPE for POC

### 1. Recipe Management
- Create recipe (name, description, servings)
- Add ingredients with quantities (fractions supported)
- Add cooking instructions
- List all recipes
- View recipe details
- Edit recipe
- Delete recipe
- Simple search (by name)

**UI Screens:**
- Recipe list view
- Recipe detail view
- Recipe create/edit form

### 2. Meal Planning
- Weekly calendar view (7 days)
- Add recipe to a meal slot (date + meal type)
- View meals for the week
- Remove meal from calendar
- Navigate weeks (previous/next)

**Meal Types:**
- Breakfast
- Lunch
- Dinner
- Snack

**UI Screens:**
- Weekly meal planner calendar

### 3. Core Infrastructure
- Local SQLite database
- Backend API (Node.js/Express)
- Frontend (React)
- No authentication needed
- Runs locally (localhost)

---

## ❌ OUT OF SCOPE for POC

**Explicitly Deferred:**

### Shopping Lists (Epic - Future)
- ❌ Generate shopping list from meal plan
- ❌ Aggregate ingredients
- ❌ Save/name shopping lists
- ❌ Check off items
- ❌ Pantry checking

→ **See SHOPPING_LIST_EPIC.md for future refinement**

### Recipe Features
- ❌ Recipe photos
- ❌ Recipe ratings
- ❌ Cuisine type
- ❌ Prep/cook times
- ❌ Serving overrides per meal
- ❌ Advanced search/filter

### UX Polish
- ❌ Welcome screen
- ❌ Keyboard shortcuts
- ❌ Drag-and-drop on calendar
- ❌ Data export/import
- ❌ Settings page

### Nice-to-Haves
- ❌ Ingredient categories
- ❌ Ingredient autocomplete
- ❌ Recipe sharing
- ❌ Cooking history

---

## Database Schema (POC - Simplified)

```prisma
// Absolute minimum for POC

model Recipe {
  id              Int                 @id @default(autoincrement())
  name            String
  description     String?
  defaultServings Int                 @default(4)
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt
  ingredients     RecipeIngredient[]
  instructions    RecipeInstruction[]
  mealPlans       MealPlan[]

  @@map("recipes")
}

model Ingredient {
  id                Int                @id @default(autoincrement())
  name              String             @unique
  createdAt         DateTime           @default(now())
  recipeIngredients RecipeIngredient[]

  @@map("ingredients")
}

model RecipeIngredient {
  id            Int        @id @default(autoincrement())
  recipeId      Int
  ingredientId  Int
  quantityWhole Int
  quantityNum   Int
  quantityDenom Int
  unit          String
  displayOrder  Int
  recipe        Recipe     @relation(fields: [recipeId], references: [id], onDelete: Cascade)
  ingredient    Ingredient @relation(fields: [ingredientId], references: [id])

  @@unique([recipeId, ingredientId])
  @@map("recipe_ingredients")
}

model RecipeInstruction {
  id           Int    @id @default(autoincrement())
  recipeId     Int
  stepNumber   Int
  text         String
  displayOrder Int
  recipe       Recipe @relation(fields: [recipeId], references: [id], onDelete: Cascade)

  @@unique([recipeId, stepNumber])
  @@map("recipe_instructions")
}

model MealPlan {
  id        Int      @id @default(autoincrement())
  recipeId  Int
  date      DateTime
  mealType  String   // breakfast, lunch, dinner, snack
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  recipe    Recipe   @relation(fields: [recipeId], references: [id], onDelete: Cascade)

  @@unique([recipeId, date, mealType])
  @@map("meal_plans")
}
```

**Tables:** 5 (Recipe, Ingredient, RecipeIngredient, RecipeInstruction, MealPlan)

**Removed from POC:**
- User (no auth)
- RecipeRating (defer)
- IngredientCategory (defer)
- IngredientCustomization (defer)
- ShoppingList (defer - see epic)
- ShoppingListItem (defer - see epic)

---

## API Endpoints (POC - Minimal)

### Recipes
- `GET /recipes` - List all recipes
- `GET /recipes/:id` - Get recipe details
- `POST /recipes` - Create recipe
- `PUT /recipes/:id` - Update recipe
- `DELETE /recipes/:id` - Delete recipe
- `GET /recipes/search?q=pasta` - Simple search

### Ingredients
- `GET /ingredients` - List all ingredients
- `POST /ingredients` - Create ingredient (if not exists)

### Meal Plans
- `GET /meal-plans?startDate=2024-11-25&endDate=2024-12-01` - Get week
- `POST /meal-plans` - Add meal to calendar
- `DELETE /meal-plans/:id` - Remove meal

**Total Endpoints:** 11 (vs 28 in full system)

---

## UI Screens (POC - Minimal)

1. **Recipe List Page**
   - Table/grid of recipes
   - Search bar
   - "New Recipe" button

2. **Recipe Detail Page**
   - Recipe name and description
   - Ingredients list
   - Instructions
   - Edit/Delete buttons
   - "Add to Meal Plan" button

3. **Recipe Form (Create/Edit)**
   - Name, description, servings
   - Ingredient rows (ingredient, quantity, unit)
   - Instruction steps
   - Save/Cancel buttons

4. **Weekly Meal Planner**
   - 7-day grid (columns)
   - 4 meal types (rows)
   - Meal cards in slots
   - "Add Meal" button in empty slots
   - Week navigation (prev/next)

5. **Add Meal Modal**
   - Recipe dropdown/search
   - Meal type selector
   - Date selector
   - Add button

**Total Screens:** 5 (vs 10+ in full design)

---

## User Stories (POC Only)

### Recipe Management
1. As a user, I can create a recipe with ingredients and instructions
2. As a user, I can view all my recipes
3. As a user, I can edit a recipe
4. As a user, I can delete a recipe
5. As a user, I can search recipes by name

### Meal Planning
6. As a user, I can see a weekly meal calendar
7. As a user, I can add a recipe to a meal slot
8. As a user, I can remove a meal from the calendar
9. As a user, I can navigate between weeks

**Total Stories:** 9 (vs 30+ for full MVP)

---

## Success Criteria

### POC is successful when:
- [ ] User can create a recipe with 3 ingredients and 3 steps
- [ ] User can view recipe in detail view
- [ ] User can add that recipe to Monday dinner
- [ ] User can see the recipe on the calendar
- [ ] User can remove the recipe from the calendar
- [ ] User can navigate to next week
- [ ] App runs locally on localhost:3000
- [ ] No crashes or critical bugs
- [ ] Data persists between app restarts

### POC is NOT about:
- ❌ Polish or beauty
- ❌ All edge cases handled
- ❌ Perfect UX
- ❌ Complete features
- ❌ Shopping lists (deferred!)

---

## Implementation Timeline

### Day 1: Database + Backend
- **Hours 1-2:** Create simplified schema
- **Hours 3-4:** Recipe CRUD endpoints
- **Hours 5-6:** Meal plan endpoints
- **Hours 7-8:** Test all endpoints

### Day 2: Frontend
- **Hours 1-3:** Recipe list and detail views
- **Hours 4-6:** Recipe create/edit form
- **Hours 7-8:** Basic styling

### Day 3: Meal Planning + Testing
- **Hours 1-4:** Meal planner calendar UI
- **Hours 5-6:** Add/remove meal functionality
- **Hours 7-8:** End-to-end testing and bug fixes

**Total Time:** 24 hours = 3 days

---

## What We Learn from POC

### Technical Validation
- ✅ Fraction system works for ingredient quantities
- ✅ SQLite performance is acceptable
- ✅ React + Node.js stack works
- ✅ Local-first architecture is viable

### UX Validation
- ✅ Recipe creation flow makes sense
- ✅ Meal planning calendar is intuitive
- ✅ Core workflow is valuable to users

### Scope Validation
- ✅ Identify what's actually needed for MVP
- ✅ Discover missing features or pain points
- ✅ Validate assumptions about user behavior

---

## After POC: Next Steps

### Immediate (Day 4)
1. Demo POC to stakeholders
2. Gather feedback
3. Refine MVP scope based on learnings
4. Prioritize remaining features

### Short-term (Week 2)
1. **Shopping List Epic** - Refine requirements (see SHOPPING_LIST_EPIC.md)
2. **MVP Features** - Add based on priority
3. **Polish** - Improve UX based on POC feedback
4. **Testing** - More thorough testing

### Medium-term (Week 3-4)
1. Implement shopping list feature
2. Add recipe photos
3. Add ratings
4. Welcome screen
5. Data export/import

---

## Dependencies

### To Start POC Development:
- [x] Product decisions made ✅
- [x] Schema simplified ✅
- [ ] Schema file created
- [ ] Backend scaffolding ready
- [ ] Frontend scaffolding ready

### External Dependencies:
- None! Everything is local

---

## Risk Assessment

### Low Risk ✅
- Technical implementation (straightforward)
- Schema design (well-defined)
- Timeline (realistic for scope)

### Medium Risk ⚠️
- Scope creep (must resist adding features)
- Estimation accuracy (might take 4 days instead of 3)

### Mitigation
- **Scope creep:** Review this document before adding anything
- **Timeline slip:** Daily check-ins, cut scope if needed

---

## Team Assignments

### Backend Developer
- Database schema and migrations
- API endpoints (11 total)
- Business logic in services
- Testing endpoints

### Frontend Developer
- 5 UI screens
- Recipe management components
- Meal planner calendar
- Basic styling (functional, not pretty)

### QA (Day 3)
- End-to-end testing
- Core user stories verification
- Bug reporting

### Project Coordinator
- Track progress
- Enforce scope boundaries
- Demo preparation

---

## Scope Enforcement

### Before Adding ANY Feature, Ask:
1. Is this required to prove the core concept?
2. Can we demonstrate value without this?
3. Would POC fail without this?

### If "No" to Any → DEFER IT!

### Examples:
- "Can we add recipe photos?" → NO (defer)
- "Should we add drag-and-drop?" → NO (defer)
- "What about serving overrides?" → NO (defer)
- "Can users rate recipes?" → NO (defer)

---

## Definition of Done (POC)

### Code
- [ ] All 11 API endpoints work
- [ ] 5 UI screens implemented
- [ ] Database schema deployed
- [ ] App runs without errors

### Testing
- [ ] All 9 user stories can be demonstrated
- [ ] No critical bugs
- [ ] Data persists correctly

### Documentation
- [ ] README with setup instructions
- [ ] API endpoint documentation
- [ ] Known limitations documented

### Demo-Ready
- [ ] Can create recipe in under 2 minutes
- [ ] Can plan a week of meals in under 5 minutes
- [ ] App is presentable (functional, not pretty is OK)

---

## Out of Scope Parking Lot

**Good Ideas for Later:**
- Recipe photos and galleries
- Recipe ratings and reviews
- Serving size adjustments per meal
- Drag-and-drop meal planning
- Recipe import from URLs
- Nutrition information
- Cost tracking
- Ingredient autocomplete with fuzzy search
- Recipe tags and categories
- Print-friendly views
- Dark mode

**Epic for Next Phase:**
- Shopping list generation (see SHOPPING_LIST_EPIC.md)

---

**Status:** Ready to begin implementation
**Next Step:** Create simplified schema and start Day 1 backend work
**Document Owner:** Product Owner + Project Coordinator
