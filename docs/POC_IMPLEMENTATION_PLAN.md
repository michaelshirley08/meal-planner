# POC Implementation Plan - 3 Day Sprint

**Status:** Ready to Execute
**Timeline:** November 26-28, 2025 (3 days)
**Team:** Backend Dev + Frontend Dev + QA
**Goal:** Working POC with recipes and meal planning

---

## Day 1: Backend Foundation (8 hours)

### Morning (4 hours): Database & Schema

**Hour 1-2: Database Setup**
- [ ] Copy `schema-poc.prisma` to `schema.prisma` (or rename)
- [ ] Update `.env` with DATABASE_URL (SQLite)
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push` (creates tables)
- [ ] Verify all 5 tables created correctly
- [ ] Seed with 2-3 sample recipes (optional but helpful)

**Hour 3-4: Service Layer - Recipe Management**
- [ ] Create `src/services/recipeService.ts`
- [ ] Implement `createRecipe(data)` - Create recipe with ingredients & instructions
- [ ] Implement `getRecipe(id)` - Get recipe with ingredients & instructions
- [ ] Implement `getAllRecipes()` - List all recipes
- [ ] Implement `updateRecipe(id, data)` - Update recipe
- [ ] Implement `deleteRecipe(id)` - Delete recipe
- [ ] Implement `searchRecipes(query)` - Simple name search

**Deliverable:** Recipe CRUD complete

---

### Afternoon (4 hours): API Routes

**Hour 5-6: Recipe Endpoints**
- [ ] Create `src/routes/recipes.ts`
- [ ] `GET /recipes` - List all recipes
- [ ] `GET /recipes/search?q=pasta` - Search by name
- [ ] `GET /recipes/:id` - Get recipe details
- [ ] `POST /recipes` - Create recipe
- [ ] `PUT /recipes/:id` - Update recipe
- [ ] `DELETE /recipes/:id` - Delete recipe
- [ ] Test all endpoints with curl or Postman

**Hour 7: Meal Plan Service**
- [ ] Create `src/services/mealPlanService.ts`
- [ ] Implement `getMealPlans(startDate, endDate)` - Get meals for date range
- [ ] Implement `createMealPlan(data)` - Schedule a meal
- [ ] Implement `deleteMealPlan(id)` - Remove meal from calendar

**Hour 8: Meal Plan Endpoints**
- [ ] Create `src/routes/mealPlans.ts`
- [ ] `GET /meal-plans?startDate=X&endDate=Y` - Get week of meals
- [ ] `POST /meal-plans` - Add meal to calendar
- [ ] `DELETE /meal-plans/:id` - Remove meal
- [ ] Test all endpoints
- [ ] Update `src/index.ts` to register routes

**Deliverable:** 11 API endpoints working

---

## Day 2: Frontend (8 hours)

### Morning (4 hours): Recipe Management UI

**Hour 1-2: Recipe List & Detail**
- [ ] Create `src/pages/RecipeListPage.tsx`
  - Grid/table of recipes
  - Search bar
  - "New Recipe" button
- [ ] Create `src/pages/RecipeDetailPage.tsx`
  - Recipe name, description, servings
  - Ingredients list with quantities
  - Instructions list
  - Edit/Delete buttons
- [ ] Create API service `src/services/api.ts`
  - `getRecipes()`
  - `getRecipe(id)`
  - `deleteRecipe(id)`
- [ ] Wire up routes in React Router

**Hour 3-4: Recipe Form**
- [ ] Create `src/pages/RecipeFormPage.tsx`
  - Form for name, description, servings
  - Dynamic ingredient rows (add/remove)
  - Dynamic instruction steps (add/remove)
  - Fraction input for quantities
  - Save/Cancel buttons
- [ ] Add `createRecipe(data)` to API service
- [ ] Add `updateRecipe(id, data)` to API service
- [ ] Handle form submission
- [ ] Basic validation (name required, etc.)

**Deliverable:** Recipe management UI complete

---

### Afternoon (4 hours): Basic Styling

**Hour 5-6: Layout & Navigation**
- [ ] Create `src/components/Layout.tsx`
  - Header with navigation
  - Simple sidebar or nav bar
  - Main content area
- [ ] Add navigation links:
  - "Recipes"
  - "Meal Planner"
- [ ] Apply basic CSS or Tailwind
- [ ] Ensure mobile-friendly layout

**Hour 7-8: Component Styling**
- [ ] Style recipe cards/list items
- [ ] Style recipe detail view
- [ ] Style recipe form
  - Ingredient rows look good
  - Instruction steps numbered
- [ ] Add loading states
- [ ] Add error messages
- [ ] Basic color scheme (simple, functional)

**Deliverable:** Styled, functional recipe management

---

## Day 3: Meal Planning + Testing (8 hours)

### Morning (4 hours): Meal Planner UI

**Hour 1-2: Calendar Component**
- [ ] Create `src/pages/MealPlannerPage.tsx`
- [ ] Create `src/components/WeeklyCalendar.tsx`
  - 7 columns (days of week)
  - 4 rows (breakfast, lunch, dinner, snack)
  - Grid layout with CSS Grid or table
  - Show current week's dates
- [ ] Week navigation (prev/next buttons)
- [ ] Empty slots show "+" button

**Hour 3-4: Add/Remove Meals**
- [ ] Create `src/components/AddMealModal.tsx`
  - Recipe selector (dropdown or search)
  - Meal type selector (if not pre-filled)
  - Date selector (if not pre-filled)
  - Add button
- [ ] Create meal card component
  - Show recipe name
  - Show meal time
  - Remove button (X)
- [ ] Wire up to API:
  - `getMealPlans(startDate, endDate)`
  - `createMealPlan(data)`
  - `deleteMealPlan(id)`
- [ ] Implement add meal flow
- [ ] Implement remove meal flow

**Deliverable:** Meal planner calendar working

---

### Afternoon (4 hours): Testing & Bug Fixes

**Hour 5-6: End-to-End Testing**
- [ ] Test user story 1: Create recipe with 3 ingredients
- [ ] Test user story 2: View recipe detail
- [ ] Test user story 3: Edit recipe
- [ ] Test user story 4: Delete recipe
- [ ] Test user story 5: Search recipes
- [ ] Test user story 6: View weekly calendar
- [ ] Test user story 7: Add recipe to Monday dinner
- [ ] Test user story 8: Remove meal from calendar
- [ ] Test user story 9: Navigate weeks

**Hour 7: Bug Fixes**
- [ ] Fix any critical bugs found in testing
- [ ] Ensure data persists (app restart test)
- [ ] Verify no console errors
- [ ] Test error handling (invalid input, network errors)

**Hour 8: Polish & Demo Prep**
- [ ] Quick UI polish (spacing, alignment)
- [ ] Add loading spinners where needed
- [ ] Add success/error toasts
- [ ] Create demo data (3-5 recipes, some meals planned)
- [ ] Prepare demo script
- [ ] Document known issues/limitations

**Deliverable:** POC ready to demo

---

## Success Checklist

### Must Work (Critical)
- [x] User can create a recipe
- [x] User can view recipe list
- [x] User can view recipe details
- [x] User can edit a recipe
- [x] User can delete a recipe
- [x] User can search recipes by name
- [x] User can view weekly meal calendar
- [x] User can add recipe to meal slot
- [x] User can remove meal from calendar
- [x] User can navigate weeks (prev/next)
- [x] Data persists after app restart
- [x] No critical bugs or crashes

### Nice to Have (Can Defer)
- [ ] Recipe photos
- [ ] Recipe ratings
- [ ] Drag-and-drop meals
- [ ] Keyboard shortcuts
- [ ] Beautiful UI (functional is fine)

---

## Team Assignments

### Backend Developer (Day 1)
- Database schema and migrations
- Recipe CRUD service and routes
- Meal plan service and routes
- Testing with curl/Postman

### Frontend Developer (Day 2-3)
- Recipe management UI (Day 2 morning)
- Basic styling (Day 2 afternoon)
- Meal planner calendar (Day 3 morning)
- Integration testing (Day 3 afternoon)

### Project Coordinator
- Track daily progress
- Unblock developers
- Enforce scope (say no to additions)
- Prepare demo

### QA (Day 3 afternoon)
- End-to-end testing
- Bug reporting
- Demo dry run

---

## Daily Standup Questions

### Each Morning Ask:
1. What did you complete yesterday?
2. What are you working on today?
3. Any blockers?
4. Are we on track for 3-day timeline?

### Each Evening Check:
1. Did we hit today's goals?
2. Do we need to cut scope tomorrow?
3. Any risks to timeline?

---

## Scope Protection Rules

### If Anyone Asks to Add:
- "Can we add recipe photos?" → NO, defer
- "Should we add ratings?" → NO, defer
- "What about serving overrides?" → NO, defer
- "Can we style it better?" → Day 2 afternoon only
- "Should we add more fields?" → NO, defer

### Only Say Yes If:
- It blocks a critical user story
- It prevents a show-stopper bug
- It takes <30 minutes

---

## Technical Setup

### Backend Repository Structure
```
backend/
├── prisma/
│   └── schema-poc.prisma → schema.prisma
├── src/
│   ├── index.ts (Express app)
│   ├── services/
│   │   ├── recipeService.ts (NEW)
│   │   └── mealPlanService.ts (NEW)
│   ├── routes/
│   │   ├── recipes.ts (NEW)
│   │   └── mealPlans.ts (NEW)
│   └── utils/
│       ├── fractionParser.ts (exists)
│       ├── fractionMath.ts (exists)
│       └── quantityUtils.ts (exists)
├── package.json
└── .env
```

### Frontend Repository Structure
```
frontend/
├── src/
│   ├── pages/
│   │   ├── RecipeListPage.tsx (NEW)
│   │   ├── RecipeDetailPage.tsx (NEW)
│   │   ├── RecipeFormPage.tsx (NEW)
│   │   └── MealPlannerPage.tsx (NEW)
│   ├── components/
│   │   ├── Layout.tsx (NEW)
│   │   ├── WeeklyCalendar.tsx (NEW)
│   │   ├── AddMealModal.tsx (NEW)
│   │   └── ... (other components)
│   ├── services/
│   │   └── api.ts (NEW - API calls)
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

---

## Environment Setup

### Backend `.env`
```
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:3000
```

### Install Commands
```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma db push

# Frontend
cd frontend
npm install
npm run dev
```

---

## Testing Checklist (Day 3)

### Recipe Management
- [ ] Create recipe with name, description, 3 ingredients, 3 steps
- [ ] View recipe in list
- [ ] Click recipe to see details
- [ ] Edit recipe (change name, add ingredient)
- [ ] Delete recipe
- [ ] Search for recipe by name
- [ ] Create another recipe

### Meal Planning
- [ ] View current week's calendar
- [ ] Add first recipe to Monday breakfast
- [ ] Add second recipe to Monday dinner
- [ ] View meals on calendar
- [ ] Navigate to next week
- [ ] Navigate back to current week
- [ ] Remove meal from calendar

### Data Persistence
- [ ] Close app (Ctrl+C both frontend and backend)
- [ ] Restart app
- [ ] Verify recipes still exist
- [ ] Verify meals still on calendar

### Error Handling
- [ ] Try to create recipe with no name (should fail)
- [ ] Try to add meal with no recipe selected (should fail)
- [ ] Try to navigate to invalid recipe ID (should handle gracefully)

---

## Known Limitations (Expected)

### POC Will NOT Have:
- Recipe photos
- Recipe ratings or reviews
- Serving adjustments per meal
- Shopping list generation
- Drag-and-drop on calendar
- Keyboard shortcuts
- Import/export
- Advanced search or filters
- Ingredient autocomplete with suggestions
- Beautiful polished UI

**This is expected and acceptable for POC!**

---

## Definition of Done

### POC is DONE when:
- [ ] All 12 must-work items checked ✅
- [ ] Demo runs smoothly (can show all 9 user stories)
- [ ] No critical bugs (app doesn't crash)
- [ ] Data persists correctly
- [ ] README has setup instructions
- [ ] Code is committed to git

---

## Next Steps After POC

1. **Demo to Stakeholders** (Day 4)
   - Show working POC
   - Gather feedback
   - Validate assumptions

2. **Retrospective** (Day 4)
   - What went well?
   - What took longer than expected?
   - What should we add to MVP?

3. **Refine Shopping List Epic** (Day 4-5)
   - Review SHOPPING_LIST_EPIC.md
   - Prioritize features
   - Estimate effort

4. **Plan MVP Sprint** (Week 2)
   - Add shopping list feature
   - Add recipe photos
   - Add ratings
   - Polish UI

---

**Ready to Start:** Yes!
**Next Action:** Backend dev begins Day 1, Hour 1
**Document Owner:** Project Coordinator
