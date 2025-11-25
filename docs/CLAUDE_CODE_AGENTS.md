# Claude Code Sub-Agent Recommendations (MVP - No Pantry)

## Overview

With pantry management descoped to Phase 8 (post-MVP), we can streamline the agent assignments. Here's the updated breakdown:

---

## Agent 1: Database & Core Models (Foundation)
**Timeline:** Week 1-3
**Focus:** Database schema, migrations, core data models

### Tasks
- Set up PostgreSQL with all tables (EXCEPT pantry_items)
- Implement database migrations
- Create ORM models (Prisma/SQLAlchemy)
- Write database seed scripts
- Add indexes and constraints

### Tables to Create
✅ users
✅ recipes
✅ recipe_ingredients
✅ ingredients
✅ meal_plan
✅ recipe_ratings
✅ categories
✅ shopping_list_checks (basic version)
❌ pantry_items (Phase 8)

### Key Files
- Database schema SQL
- Migration scripts
- ORM model definitions
- Seed data scripts

**Why separate:** Database work is foundational and should be solid before other work begins.

---

## Agent 2: Fraction & Unit System (Math Library)
**Timeline:** Week 2-4 (can overlap with Agent 1)
**Focus:** Fraction parsing, arithmetic, and unit conversion

### Tasks
- Build fraction parser (handles 1/2, 1 1/2, 0.5)
- Implement fraction arithmetic (add, multiply, reduce)
- Create unit conversion system
- Write comprehensive tests
- Handle edge cases

### Key Deliverables
- `fractionParser.ts/py` - Parse string to fraction object
- `fractionMath.ts/py` - Add, multiply, reduce operations
- `unitConverter.ts/py` - Volume/mass conversions
- Test suite with 50+ test cases

### Example API
```typescript
// Fraction operations
parseQuantity("1 1/2") → { whole: 1, num: 1, denom: 2 }
addQuantities(q1, q2) → Quantity
multiplyQuantity(q, 1.5) → Quantity

// Unit conversion
volumeToMl({ whole: 2, num: 0, denom: 1 }, "cup") → 473.176
massToGrams({ whole: 1, num: 0, denom: 1 }, "lb") → 453.592
```

**Why separate:** This is a self-contained mathematical system that many other components depend on. Test it thoroughly in isolation.

---

## Agent 3: Recipe Management (Backend + Frontend)
**Timeline:** Week 4-6
**Focus:** Recipe CRUD operations

### Tasks
- Implement recipe API endpoints
- Build ingredient search with autocomplete
- Create recipe creation wizard (frontend)
- Implement recipe detail views
- Add image upload functionality

### Backend Endpoints
```
GET    /recipes
GET    /recipes/:id
POST   /recipes
PUT    /recipes/:id
DELETE /recipes/:id

GET    /ingredients/search?q=...
GET    /ingredients/:id
POST   /ingredients
```

### Frontend Components
- RecipeList
- RecipeDetail
- RecipeCreationWizard (4 steps)
- IngredientSearch (autocomplete)
- QuantityInput (fraction support)
- InstructionEditor (reorderable)

**Dependencies:** Needs Agent 1 & 2 complete

---

## Agent 4: Meal Planning (Backend + Frontend)
**Timeline:** Week 7-9
**Focus:** Calendar and meal scheduling

### Tasks
- Implement meal plan API endpoints
- Build weekly calendar component
- Add drag-and-drop functionality
- Create meal detail overlays
- Implement servings override logic

### Backend Endpoints
```
GET    /meal-plan?start_date=...&end_date=...
POST   /meal-plan
PUT    /meal-plan/:id
DELETE /meal-plan/:id
POST   /meal-plan/:id/reschedule
```

### Frontend Components
- WeeklyCalendar (grid layout)
- MealCard (recipe display)
- QuickAddModal
- MealDetailOverlay
- RecipeBox (sidebar with favorites)

**Dependencies:** Needs Agent 3 complete

---

## Agent 5: Shopping List Engine (Complex Algorithm)
**Timeline:** Week 10-13
**Focus:** The most complex part - aggregation logic (SIMPLIFIED WITHOUT PANTRY)

### Tasks
- Implement shopping list generation algorithm
- Build ingredient aggregation logic
- Handle mixed measurement types
- Create category grouping
- Implement check/uncheck state management
- Write extensive tests for all edge cases

### Backend Endpoints
```
POST   /shopping-list/generate
GET    /shopping-list/checks?start_date=...&end_date=...
POST   /shopping-list/checks
```

### Algorithm Steps (Simplified)
1. Query meals in date range
2. Extract all recipe ingredients with servings adjustments
3. Group by ingredient_id and measurement_type
4. Aggregate quantities (convert to common units)
5. ~~Check pantry inventory~~ (REMOVED - Phase 8)
6. Group by category
7. Format for display

### Key Simplifications
❌ No pantry checking
❌ No auto-replenish logic
❌ No "already have" calculations
❌ No "add to pantry" functionality

✅ Still complex: aggregation, unit conversion, mixed types
✅ All quantities shown in full
✅ Category grouping
✅ Recipe breakdown

**Why separate:** Still algorithmically complex despite removing pantry. Should be developed by someone comfortable with complex logic and edge cases.

**Dependencies:** Needs Agent 1, 2, 4 complete

---

## Agent 6: Ratings & Favorites (Enhancement)
**Timeline:** Week 14-15
**Focus:** Rating system and favorites

### Tasks
- Implement ratings API
- Build rating components
- Add favorites functionality
- Create cooking history views
- Implement rating triggers

### Backend Endpoints
```
POST   /recipes/:id/ratings
PUT    /recipes/:id/ratings/:rating_id
GET    /recipes/:id/ratings
GET    /recipes/favorites
```

### Frontend Components
- RatingModal (star rating)
- RatingHistory
- FavoritesPage
- RatingTriggers (after meal completion)

**Dependencies:** Needs Agent 3 complete

---

## Agent 7: Enhanced Features (Polish)
**Timeline:** Week 16-18
**Focus:** Advanced features and UI refinements

### Tasks
- Ingredient library page
- Category management
- Bulk ingredient operations
- Advanced search filters
- Mobile responsive improvements
- Drag-and-drop enhancements

### Backend Endpoints
```
GET    /ingredients/library
POST   /ingredients/merge
GET    /categories
POST   /categories
PUT    /categories/:id
POST   /categories/reorder
```

### Frontend Components
- IngredientLibrary
- CategoryManagement
- BulkOperations
- AdvancedSearch
- Mobile optimizations

**Dependencies:** Can work in parallel with Agent 6

---

## Agent 8: Testing & DevOps (Quality & Deployment)
**Timeline:** Week 19-20
**Focus:** Testing infrastructure and deployment

### Tasks
- Set up CI/CD pipeline
- Write E2E tests for critical flows
- Performance testing
- Set up monitoring (Sentry, etc.)
- Configure production deployment
- Documentation completion

### Testing Priorities
1. Recipe creation flow
2. Meal planning workflow
3. Shopping list generation (all edge cases)
4. Ratings and favorites
5. Mobile responsiveness

### Infrastructure
- GitHub Actions CI/CD
- Docker containers
- Production deployment (Vercel + Railway/AWS)
- Monitoring and logging

**Why separate:** Can work in parallel once core features are stable.

---

## Updated Workflow

### Phase 1 (Weeks 1-6): Foundation
```
Week 1-3: Agent 1 (Database)
Week 2-4: Agent 2 (Fractions) - overlaps with Agent 1
Week 4-6: Agent 3 (Recipes)
```

### Phase 2 (Weeks 7-13): Core Features
```
Week 7-9:  Agent 4 (Meal Planning)
Week 10-13: Agent 5 (Shopping Lists) - CRITICAL, ALLOW EXTRA TIME
```

### Phase 3 (Weeks 14-20): Enhancement & Launch
```
Week 14-15: Agent 6 (Ratings)
Week 16-18: Agent 7 (Enhanced Features)
Week 19-20: Agent 8 (Testing & Deploy)
```

### Phase 4 (Weeks 21-23): Future
```
Week 21-23: Pantry Management (Agent 9)
```

---

## Critical Paths

### Must Complete Before Agent 5 (Shopping Lists)
- ✅ Agent 1: Database models
- ✅ Agent 2: Fraction system working
- ✅ Agent 3: Recipes and ingredients
- ✅ Agent 4: Meal planning with servings override

### Agent 5 Success Criteria
- [ ] Aggregates ingredients correctly
- [ ] Handles mixed units (volume/mass separate)
- [ ] Scales for servings overrides
- [ ] Groups by category correctly
- [ ] Shows recipe breakdown
- [ ] Check/uncheck state persists
- [ ] Performance: < 3 seconds for 1 week of meals
- [ ] Tests pass for all edge cases

**Important:** Agent 5 is still complex! Don't underestimate.

---

## Agent Pairing Recommendations

### Solo Agents (Can Work Alone)
- Agent 1: Database (experienced backend dev)
- Agent 2: Fractions (strong math/algorithms)
- Agent 8: DevOps (experienced DevOps engineer)

### Paired Agents (Benefit from Pair Programming)
- Agent 3: Recipe Management (backend + frontend pair)
- Agent 4: Meal Planning (backend + frontend pair)
- Agent 5: Shopping Lists (2 backend devs for algorithm complexity)
- Agent 6: Ratings (can be solo if needed)
- Agent 7: Enhanced Features (frontend + backend pair)

---

## Skill Requirements

### Agent 1 (Database)
- ⭐⭐⭐ SQL and PostgreSQL
- ⭐⭐⭐ Database design
- ⭐⭐ ORM usage (Prisma/SQLAlchemy)

### Agent 2 (Fractions)
- ⭐⭐⭐ Algorithm design
- ⭐⭐⭐ Unit testing
- ⭐⭐ Mathematics
- ⭐⭐ TypeScript or Python

### Agent 3 (Recipes)
- ⭐⭐⭐ REST API design
- ⭐⭐⭐ React or Vue.js
- ⭐⭐ Form handling
- ⭐⭐ Image upload

### Agent 4 (Meal Planning)
- ⭐⭐⭐ React or Vue.js
- ⭐⭐ Drag-and-drop libraries
- ⭐⭐ Calendar components
- ⭐⭐ REST API integration

### Agent 5 (Shopping Lists)
- ⭐⭐⭐ Complex algorithms
- ⭐⭐⭐ Unit testing
- ⭐⭐⭐ Edge case handling
- ⭐⭐ Performance optimization
- **Most critical agent!**

### Agent 6 (Ratings)
- ⭐⭐ REST API design
- ⭐⭐ React or Vue.js
- ⭐ Database triggers

### Agent 7 (Enhanced)
- ⭐⭐⭐ React or Vue.js
- ⭐⭐ UI/UX polish
- ⭐⭐ Mobile responsive design

### Agent 8 (DevOps)
- ⭐⭐⭐ CI/CD pipelines
- ⭐⭐⭐ Docker
- ⭐⭐ Testing frameworks
- ⭐⭐ Monitoring tools

---

## Handoff Documents

### For Each Agent

**Agent 1:**
- DATABASE_SCHEMA.md
- README.md

**Agent 2:**
- MEASUREMENT_SYSTEM.md
- EDGE_CASES.md (fraction-related)

**Agent 3:**
- API_SPECIFICATION.md (Recipes, Ingredients)
- USER_FLOWS.md (Recipe creation)
- MEASUREMENT_SYSTEM.md (for quantity inputs)

**Agent 4:**
- API_SPECIFICATION.md (Meal Plan)
- USER_FLOWS.md (Meal planning)

**Agent 5:**
- SHOPPING_LIST_ALGORITHM.md
- MEASUREMENT_SYSTEM.md
- EDGE_CASES.md (shopping list section)
- **Critical:** Review MVP_SCOPE_PANTRY_DESCOPED.md

**Agent 6:**
- API_SPECIFICATION.md (Ratings)
- USER_FLOWS.md (Rating flows)

**Agent 7:**
- FEATURES.md
- USER_FLOWS.md

**Agent 8:**
- TECHNICAL_ARCHITECTURE.md
- DEVELOPMENT_PHASES.md

---

## Risk Management by Agent

### High Risk
- **Agent 5 (Shopping Lists):** Most complex algorithm
  - Mitigation: Allocate senior developer
  - Mitigation: Extra time buffer (4 weeks)
  - Mitigation: Extensive testing plan

### Medium Risk
- **Agent 2 (Fractions):** Mathematical complexity
  - Mitigation: Thorough test suite
  - Mitigation: Use existing fraction libraries as reference

- **Agent 4 (Meal Planning):** UI complexity with drag-and-drop
  - Mitigation: Use proven libraries (react-beautiful-dnd)
  - Mitigation: Fallback to click-based interaction

### Low Risk
- Agent 1, 3, 6, 7, 8: Standard development work

---

## Communication Between Agents

### Required Coordination

**Agent 2 → Agent 3:**
- Share fraction parser API
- Coordinate on quantity display format

**Agent 3 → Agent 4:**
- Share recipe data models
- Coordinate on servings override

**Agent 4 → Agent 5:**
- Share meal plan data structure
- Coordinate on servings calculation

**Agent 1 → All:**
- Database schema available to all
- Migration strategy communicated

---

## Success Metrics by Agent

### Agent 1
- [ ] All tables created and indexed
- [ ] Migrations run successfully
- [ ] Seed data loads correctly
- [ ] No database performance issues

### Agent 2
- [ ] 95%+ test coverage
- [ ] Handles all fraction formats
- [ ] Arithmetic is mathematically correct
- [ ] Unit conversions accurate to 0.1%

### Agent 3
- [ ] Recipe creation < 10 minutes avg
- [ ] Ingredient search < 200ms
- [ ] Zero data loss in creation flow
- [ ] Image upload works reliably

### Agent 4
- [ ] Calendar loads in < 1 second
- [ ] Drag-and-drop works smoothly
- [ ] No calendar display bugs
- [ ] Servings override works correctly

### Agent 5
- [ ] Shopping list generation < 3 seconds
- [ ] 100% accuracy in aggregation
- [ ] All edge cases handled
- [ ] Zero incorrect calculations

### Agent 6
- [ ] Rating submission < 500ms
- [ ] Average rating updates correctly
- [ ] Rating history loads quickly

### Agent 7
- [ ] Mobile responsive on all screens
- [ ] Ingredient merge works correctly
- [ ] Category reordering persists

### Agent 8
- [ ] CI/CD pipeline runs successfully
- [ ] All tests pass
- [ ] Production deployment successful
- [ ] Monitoring active

---

## Benefits of No Pantry (For Agents)

### Agent 5 (Shopping Lists) Benefits
- ✅ Simpler algorithm (no pantry calculations)
- ✅ Fewer edge cases to handle
- ✅ Easier testing scenarios
- ✅ Can focus on aggregation accuracy
- ✅ Less coordination needed with other agents

### Overall Team Benefits
- ✅ Clearer responsibilities (no Agent 6 for pantry)
- ✅ Faster iteration (fewer dependencies)
- ✅ Less code to maintain
- ✅ Easier debugging

---

## Future Agent 9: Pantry Management (Phase 8)

When pantry is added post-MVP:

### Tasks
- Create pantry_items table
- Implement pantry CRUD endpoints
- Build pantry UI components
- Integrate with Agent 5's shopping lists
- Add pantry subtraction logic
- Auto-replenish functionality

### Timeline
- 3 weeks post-MVP
- Can be assigned to Agent 5 developer (familiar with shopping lists)
- Or new agent if expanding team

---

## Conclusion

With pantry descoped:
- **7 agents instead of 8 for MVP**
- **20 weeks instead of 22 weeks**
- **Simpler Agent 5 (still complex, just less so)**
- **Clearer focus on core features**
- **Lower risk, faster launch**

Pantry comes later in Phase 8 as Agent 9, after validating MVP with users.
