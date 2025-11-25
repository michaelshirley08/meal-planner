# Development Phases & Roadmap (MVP - No Pantry)

## Overview

This document outlines the recommended implementation phases for the Recipe & Meal Planning application MVP. Pantry management has been descoped and will be added in a future release.

---

## Phase 1: Foundation & Core Data (Weeks 1-3)

### Goals
- Set up development environment
- Implement core data models
- Create basic CRUD operations
- Establish fraction and unit systems

### Deliverables

**Backend:**
- [ ] Project setup (Node.js/Python, PostgreSQL, Docker)
- [ ] Database schema implementation (without pantry tables)
- [ ] Database migrations
- [ ] Fraction parsing and arithmetic library
- [ ] Unit conversion system
- [ ] Authentication system (JWT)
- [ ] User registration and login

**Frontend:**
- [ ] Project setup (React/Vue)
- [ ] Routing structure
- [ ] Authentication UI (login, signup)
- [ ] Basic layout and navigation
- [ ] Reusable components (buttons, inputs, modals)

**API Endpoints:**
```
POST   /auth/register
POST   /auth/login
GET    /auth/me
```

**Testing:**
- Unit tests for fraction parsing
- Unit tests for unit conversion
- Database migration tests

**Success Metrics:**
- User can register and login
- Database schema is complete
- Fraction system works correctly

---

## Phase 2: Recipe Management (Weeks 4-6)

### Goals
- Complete recipe CRUD functionality
- Implement ingredient system
- Build recipe creation flow

### Deliverables

**Backend:**
- [ ] Ingredient search with autocomplete
- [ ] Recipe CRUD endpoints
- [ ] Recipe-ingredient relationship handling
- [ ] Ingredient creation and management
- [ ] Image upload for recipes

**Frontend:**
- [ ] Recipe list page
- [ ] Recipe detail page
- [ ] Recipe creation wizard (3-4 steps)
- [ ] Ingredient autocomplete search
- [ ] Quantity input with fraction support
- [ ] Dynamic unit dropdowns
- [ ] Instruction editor with reordering

**API Endpoints:**
```
GET    /recipes
GET    /recipes/:id
POST   /recipes
PUT    /recipes/:id
DELETE /recipes/:id

GET    /ingredients/search?q=...
GET    /ingredients/:id
POST   /ingredients
PUT    /ingredients/:id
```

**Testing:**
- Recipe creation flow E2E test
- Ingredient search functionality
- Fraction display in recipes
- Unit conversion in ingredient display

**Success Metrics:**
- User can create complete recipes
- Ingredient search returns relevant results
- Fractions display correctly
- Instructions can be reordered

---

## Phase 3: Meal Planning Calendar (Weeks 7-9)

### Goals
- Implement weekly calendar view
- Add/remove meals from calendar
- Basic meal scheduling

### Deliverables

**Backend:**
- [ ] Meal plan CRUD endpoints
- [ ] Date range queries
- [ ] Servings override logic

**Frontend:**
- [ ] Weekly calendar grid
- [ ] Month navigation
- [ ] Quick add meal modal
- [ ] Meal detail overlay
- [ ] Servings adjustment
- [ ] Basic drag-and-drop (optional for this phase)

**API Endpoints:**
```
GET    /meal-plan?start_date=...&end_date=...
POST   /meal-plan
PUT    /meal-plan/:id
DELETE /meal-plan/:id
POST   /meal-plan/:id/reschedule
```

**Testing:**
- Add meal to calendar
- Update meal servings
- Remove meal from calendar
- Date range filtering

**Success Metrics:**
- User can view weekly meal plan
- User can add/edit/remove meals
- Calendar displays correctly across months
- Servings can be overridden

---

## Phase 4: Shopping List Generation (Weeks 10-13)

### Goals
- Generate shopping lists from meal plans
- Implement ingredient aggregation algorithm
- Handle mixed measurement types

### Deliverables

**Backend:**
- [ ] Shopping list generation algorithm
- [ ] Ingredient aggregation logic
- [ ] Unit conversion for aggregation
- [ ] Mixed measurement type handling
- [ ] Category grouping
- [ ] Shopping list state management (check/uncheck)

**Frontend:**
- [ ] Shopping list view
- [ ] Category sections
- [ ] Ingredient breakdown (which recipes)
- [ ] Check/uncheck items
- [ ] Print/export options
- [ ] Recipe usage display

**API Endpoints:**
```
POST   /shopping-list/generate
GET    /shopping-list/checks?start_date=...&end_date=...
POST   /shopping-list/checks
```

**Testing:**
- Generate list from multiple recipes
- Aggregate same ingredient from different recipes
- Handle mixed volume/mass correctly
- Category grouping
- Check state persistence

**Success Metrics:**
- Shopping list aggregates ingredients correctly
- Mixed units are handled properly
- Categories display in correct order
- Check states persist during shopping session

**Known Complexity:**
This phase contains the most complex logic. Allow extra time for:
- Aggregation algorithm
- Edge case handling
- Testing various scenarios

**Note:** Pantry integration is descoped for MVP. Shopping lists show full quantities without pantry subtraction.

---

## Phase 5: Ratings & Favorites (Weeks 14-15)

### Goals
- Recipe rating system
- Cooking history tracking
- Favorites collection

### Deliverables

**Backend:**
- [ ] Rating CRUD endpoints
- [ ] Average rating calculation
- [ ] Times made counter
- [ ] Rating triggers (after meal completion)

**Frontend:**
- [ ] Rating modal
- [ ] Star rating component
- [ ] Rating history display
- [ ] Favorites page
- [ ] Filter by rating
- [ ] "Try again" suggestions

**API Endpoints:**
```
POST   /recipes/:id/ratings
PUT    /recipes/:id/ratings/:rating_id
GET    /recipes/:id/ratings
GET    /recipes/favorites
GET    /recipes/highly-rated
```

**Testing:**
- Add rating to recipe
- Average rating calculation
- Times made increment
- Favorites filtering

**Success Metrics:**
- User can rate recipes
- Ratings affect recipe recommendations
- Favorites are easily accessible
- Cooking history is tracked

---

## Phase 6: Enhanced Features (Weeks 16-18)

### Goals
- Advanced ingredient management
- Category customization
- Search improvements
- Mobile optimization

### Deliverables

**Backend:**
- [ ] Ingredient merge functionality
- [ ] Category management endpoints
- [ ] Enhanced search
- [ ] Bulk operations

**Frontend:**
- [ ] Ingredient library page
- [ ] Category management page
- [ ] Bulk ingredient operations
- [ ] Advanced search filters
- [ ] Mobile responsive improvements
- [ ] Touch-optimized interactions
- [ ] Drag-and-drop for calendar

**API Endpoints:**
```
GET    /ingredients/library
POST   /ingredients/merge
GET    /categories
POST   /categories
PUT    /categories/:id
POST   /categories/reorder
```

**Testing:**
- Merge ingredients
- Reorder categories
- Bulk operations
- Mobile interactions
- Search performance

**Success Metrics:**
- Ingredient management is efficient
- Categories can be customized
- Search is fast and accurate
- Mobile experience is smooth

---

## Phase 7: Polish & Production (Weeks 19-20)

### Goals
- Performance optimization
- Error handling improvements
- User experience refinements
- Production readiness

### Deliverables

**Backend:**
- [ ] Query optimization
- [ ] Caching implementation
- [ ] Rate limiting
- [ ] Error handling improvements
- [ ] Logging and monitoring

**Frontend:**
- [ ] Loading states
- [ ] Error boundaries
- [ ] Optimistic updates
- [ ] Performance optimization
- [ ] Accessibility improvements

**Infrastructure:**
- [ ] Production deployment setup
- [ ] CI/CD pipeline
- [ ] Monitoring tools
- [ ] Backup strategy
- [ ] Documentation completion

**Testing:**
- Performance testing
- Load testing
- Security audit
- Accessibility audit
- Cross-browser testing

**Success Metrics:**
- Page load < 2 seconds
- API response < 500ms (p95)
- Zero critical bugs
- WCAG AA compliance
- Production deployment successful

---

## Future Phases (Post-MVP)

### Phase 8: Pantry Management (Weeks 21-23)

**Why later:** Pantry management adds significant complexity to shopping list generation. Building it after MVP allows us to:
- Gather user feedback on core features
- Understand real-world shopping list usage patterns
- Validate the aggregation algorithm works correctly
- Add pantry features based on actual user needs

**Features:**
- [ ] Pantry inventory tracking
- [ ] Pantry CRUD operations
- [ ] Auto-replenish items
- [ ] Pantry integration with shopping lists
- [ ] "Used some" functionality
- [ ] Bulk add from shopping list

**Database Changes:**
```sql
CREATE TABLE pantry_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    ingredient_id INTEGER NOT NULL REFERENCES ingredients(id),
    quantity_whole INTEGER DEFAULT 0,
    quantity_numerator INTEGER DEFAULT 0,
    quantity_denominator INTEGER DEFAULT 1,
    measurement_type VARCHAR(10) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    auto_replenish BOOLEAN DEFAULT false
);
```

**API Endpoints:**
```
GET    /pantry
POST   /pantry
PUT    /pantry/:id
DELETE /pantry/:id
POST   /pantry/:id/subtract
POST   /shopping-list/add-to-pantry
```

### Phase 9: Advanced Features (Weeks 24+)

**Possible Features:**
- [ ] Recipe import from URLs
- [ ] Meal prep mode (batch cooking)
- [ ] Nutrition information
- [ ] Cost tracking per meal
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Recipe collections/cookbooks
- [ ] Collaborative meal planning

---

## Timeline Summary

| Phase | Duration | Focus | Status |
|-------|----------|-------|--------|
| 1 | 3 weeks | Foundation | MVP |
| 2 | 3 weeks | Recipes | MVP |
| 3 | 3 weeks | Meal Planning | MVP |
| 4 | 4 weeks | Shopping Lists | MVP |
| 5 | 2 weeks | Ratings | MVP |
| 6 | 3 weeks | Enhanced | MVP |
| 7 | 2 weeks | Polish | MVP |
| **Total** | **20 weeks** | **MVP Launch** | - |
| 8 | 3 weeks | Pantry | Future |
| 9 | Ongoing | Advanced | Future |

**Note:** Timeline assumes 2 developers working full-time. MVP is now 20 weeks instead of 22 weeks.

---

## Updated Success Metrics by Phase

### Phase 1-2 (Foundation + Recipes)
- 10 test users successfully create 5+ recipes each
- Average recipe creation time < 10 minutes
- Zero critical bugs in auth/recipe creation

### Phase 3-4 (Meal Planning + Shopping)
- 80% of test users successfully plan a week of meals
- Shopping list generation < 3 seconds
- 95% accuracy in ingredient aggregation
- Shopping lists show correct quantities without pantry

### Phase 5-6 (Ratings + Enhanced)
- 70% of users rate cooked recipes
- Times made counter accurate
- Ingredient management is intuitive

### Phase 7 (Launch)
- 90%+ positive feedback from beta users
- Page load times < 2 seconds
- Zero critical production bugs in first week
- 100 active users within first month

---

## Development Team Structure (Updated)

### Recommended Team

**Phase 1-2 (Foundation):**
- 1 Full-stack developer
- 1 Frontend developer (optional)

**Phase 3-6 (Core Features):**
- 2 Full-stack developers OR
- 1 Backend + 1 Frontend developer
- 1 QA engineer (part-time)

**Phase 7 (Polish):**
- Same as Phase 3-6
- 1 DevOps engineer (for deployment)

**Phase 8+ (Future):**
- Add developers as needed for new features

---

## Risk Management (Updated)

### High-Risk Areas (No Change)

**1. Shopping List Aggregation (Phase 4)**
- Complex algorithm with many edge cases
- **Mitigation:** Allocate extra time, extensive testing
- **Benefit of descoping pantry:** Simpler algorithm, fewer edge cases

**2. Mobile Performance**
- Calendar view may be slow on mobile
- **Mitigation:** Optimize rendering, implement virtualization

### Reduced Risk

**1. Pantry Integration Complexity**
- ✅ **Risk eliminated for MVP** by descoping pantry
- Can add later with better understanding of user needs
- Simpler shopping list algorithm without pantry checks

---

## Benefits of Descoping Pantry

1. **Faster MVP Launch:** 20 weeks instead of 22 weeks
2. **Simpler Shopping Lists:** No pantry calculations needed
3. **Clearer User Testing:** Focus feedback on core features
4. **Reduced Complexity:** Fewer edge cases in aggregation
5. **Better Foundation:** Can design pantry features based on actual usage patterns

---

## Definition of Done (Updated)

For each phase, the following must be complete:

- [ ] All features implemented and working
- [ ] Unit tests written and passing (>80% coverage)
- [ ] Integration tests for critical paths
- [ ] API documentation updated
- [ ] UI/UX reviewed and approved
- [ ] Code reviewed by peer
- [ ] No critical or high-priority bugs
- [ ] Performance meets requirements
- [ ] Deployed to staging environment
- [ ] Demo completed with stakeholders
- [ ] ✅ No pantry dependencies in MVP phases

---

## Recommendations

1. **Start with Phase 1-2:** Get the foundation solid before moving to complex features
2. **Allocate extra time for Phase 4:** Shopping list aggregation is still complex (but simpler without pantry)
3. **Run user testing early:** After Phase 4, test with real users to validate need for pantry
4. **Keep scope flexible:** Be prepared to adjust Phase 8 based on feedback
5. **Document as you go:** Update documentation with any changes
6. **Celebrate milestones:** Each phase completion is a significant achievement!
