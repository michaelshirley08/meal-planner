# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ START HERE - Context Summary

**At the start of each new session, review `/home/mike/meal-planner/last-session.txt`**

This file contains a complete summary of:
- Project status and technical decisions made
- Bugs fixed and tests written
- Files modified and their locations
- Pending tasks and known issues
- Team structure (Lead Engineer + QA Agent)

The summary is essential for continuity between sessions.

---

## Project Status

**CURRENT STATE:** Frontend is operational with React/TypeScript. Authentication (register/login) has been fixed and verified. Playwright browser testing infrastructure is in place with 17 test specs. Professional team structure established with Lead Engineer and QA Agent roles.

**Previous Status:** Planning and specification documents created - implementation now 40%+ complete.

## Project Overview

A comprehensive meal planning and recipe management application with:
- Recipe creation with fractional measurements and mixed units
- Weekly/monthly meal planning calendar with drag-and-drop
- Intelligent shopping list generation with ingredient aggregation
- Ingredient database with autocomplete
- Recipe rating system and cooking history
- Support for both metric and imperial units

**Key Challenge:** Precise fraction mathematics (1/2, 1 1/2, 3/4) combined with unit conversion across metric/imperial and volume/mass.

## Architecture Overview

### Technology Stack
- **Frontend:** React/Vue with calendar library (FullCalendar or react-big-calendar)
- **Backend:** Node.js or Python with REST API
- **Database:** PostgreSQL
- **Key Libraries:** Fraction.js (or custom), convert-units (extended)

### Core Systems to Implement

1. **Fraction System** - Parse and perform arithmetic on fractional quantities (1/2, 1 1/2 cups)
2. **Unit Converter** - Convert between metric/imperial, volume/mass
3. **Shopping List Algorithm** - Aggregate ingredients across recipes with unit conversion and scaling
4. **Meal Planning Calendar** - Visual scheduling with drag-and-drop support

### Database Entities
- **users** - Authentication and user preferences
- **recipes** - Recipe metadata (name, servings, times, cuisine)
- **recipe_ingredients** - Quantity + measurement unit + preparation notes
- **ingredients** - Global ingredient library with categories and aliases
- **meal_plan** - Scheduled meals with optional serving overrides
- **recipe_ratings** - User ratings, notes, and cooking history
- **categories** - Ingredient categories (customizable order for shopping lists)
- **shopping_list_checks** - Tracking checked items

Note: Pantry management (pantry_items table) is descoped to Phase 8 (post-MVP)

## Development Phases & Commands

The project follows a phased approach (see DEVELOPMENT_PHASES.md for details):

### Phase 1: Foundation & Core Data (Weeks 1-3)
- Setup: `npm init` (Node) or Python project setup
- Database migration: Database schema with fraction/unit system
- Testing: `npm test` for fraction and unit conversion tests

### Phase 2: Recipe Management (Weeks 4-6)
- Recipe CRUD API endpoints
- Ingredient autocomplete search
- Image upload support

### Phase 3: Meal Planning (Weeks 7-8)
- Calendar interface with drag-and-drop
- Meal scheduling and management

### Phase 4: Shopping List (Weeks 9-10)
- Intelligent aggregation algorithm
- Category-based grouping

### Phase 5: Ratings & History (Weeks 11-12)
- Recipe ratings and notes
- Cooking history tracking

### Phase 6: Search & Discovery (Weeks 13-14)
- Full-text recipe search
- Filtering and sorting

### Phase 7: Polish & Refine (Weeks 15-16)
- UI/UX refinement
- Performance optimization

### Phase 8: Pantry Management (Future)
- Pantry tracking and integration

## Key Files & Documentation

- **README.md** - Project overview and quick start guide
- **FEATURES.md** - Detailed feature specifications (MVP scope)
- **DEVELOPMENT_PHASES.md** - Week-by-week implementation roadmap
- **CLAUDE_CODE_AGENTS.md** - Sub-agent task assignments
- **CHANGES_SUMMARY.md** - Recent planning updates
- **MVP_SCOPE_PANTRY_DESCOPED.md** - Scope decisions and rationale

## Important Design Patterns

### Fraction Handling
Fractions should be stored/calculated as objects with numerator, denominator, and whole number parts, not decimals. This preserves precision for display and arithmetic.

Example: `1 1/2 cups` = `{ whole: 1, num: 1, denom: 2 }`

### Unit System
- **Volume units:** cup, tbsp, tsp, fl oz, ml, L
- **Mass units:** g, kg, oz, lb
- Keep volume and mass separate in shopping lists; don't force conversions between them

### Shopping List Aggregation
When combining ingredients from multiple recipes:
1. Group same ingredients
2. Convert quantities to base units (ml for volume, grams for mass)
3. Add quantities
4. Convert back to user's preferred units
5. Scale based on serving overrides per meal

### User Preferences
Store user preferences for:
- Unit system (metric, US standard, imperial)
- Temperature preference (F/C)
- Display format (fractions, decimals, or both)

## Code Organization Recommendations

Once implementation begins, organize as:
```
project/
├── frontend/          # React/Vue application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
├── backend/          # Node.js/Python API
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/    # Fraction, unit, shopping list logic
│   │   └── migrations/
│   └── package.json / requirements.txt
└── docs/            # Specification documents
```

## Testing Strategy

### Priority Order
1. **Fraction System** - Unit tests with 50+ test cases
2. **Unit Conversion** - Volume/mass conversion tests
3. **Shopping List Aggregation** - Complex scenario tests
4. **Recipe CRUD** - API integration tests
5. **Meal Planning** - E2E tests for critical flows

### Commands (Once Implemented)
- `npm test` - Run all unit tests
- `npm run test:integration` - API and integration tests
- `npm run test:e2e` - End-to-end tests

## Implementation Notes

### For the Fraction/Unit System Team
Start with comprehensive unit tests before building UI. The mathematical foundation must be solid and well-tested. Reference MEASUREMENT_SYSTEM.md (if created) for detailed requirements.

### For the Recipe Management Team
Build on top of the fraction/unit system. Recipe creation flow is the critical path for MVP.

### For the Meal Planning Team
Calendar performance matters - implement pagination/virtualization for large meal plans.

### For the Shopping List Team
This is algorithmically complex. Thoroughly test edge cases around mixed measurement types and serving overrides.

## Performance Considerations

- Target page load: <2 seconds
- Implement image lazy loading for recipe photos
- Use database indexes on frequently queried fields (user_id, recipe_id)
- Pagination for large recipe/ingredient lists
- Consider code splitting for frontend bundles

## MVP Scope Constraints

**Included in MVP:**
- Recipe creation with fractions
- Meal planning calendar
- Shopping list generation
- Ingredient database with autocomplete
- Recipe ratings and history
- User preferences

**Explicitly NOT in MVP:**
- Pantry management (Phase 8)
- Recipe import from URLs
- Nutrition tracking
- Cost tracking
- Social features
- Mobile native app

This constraint keeps scope manageable and allows faster MVP launch.
