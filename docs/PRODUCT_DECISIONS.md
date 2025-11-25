# Product Decisions - Meal Planner Single-User App

**Date:** November 25, 2025
**Status:** Approved by Product Owner
**Focus:** POC → MVP (Scope Limitation Critical)

---

## Decision Summary

| Feature | Decision | Rationale |
|---------|----------|-----------|
| IngredientCustomization | Simplify (Option 1) | Keep it simple for POC/MVP |
| RecipeRating | One rating per recipe | Remove cooking history complexity |
| Shopping List Persistence | Persist with save/name flow | Core user workflow (see details below) |
| Data Import/Export | Defer (focus on schema) | Not needed for POC/MVP |
| Future Cloud Sync | Local only | Keep scope limited for now |

---

## Core Principle: Scope Limitation

**Goal:** Get to basic POC, then MVP
**Approach:** Simplify everything, defer non-essential features
**Timeline:** Focus on what's needed for functional single-user app

---

## Detailed Decisions

### 1. IngredientCustomization - SIMPLIFY ✅

**Decision:** Option 1 - Keep it simple

**Implementation:**
- Keep the basic structure in schema for now
- Don't build complex customization UI
- User can set preferred unit per ingredient (simple)
- No advanced customization features

**Schema Impact:** Minimal - keep IngredientCustomization table but simplified
**Timeline:** Include in Phase 1 (database migration)

---

### 2. RecipeRating - SIMPLIFY TO ONE RATING ✅

**Decision:** One rating per recipe (remove cooking history)

**What This Means:**
- ❌ Remove multiple ratings per recipe by date
- ✅ Single rating field per recipe
- ❌ No cooking history tracking
- ❌ No "times made" counter
- ❌ No date made tracking

**Schema Changes Required:**
```prisma
// BEFORE (multi-rating with history)
model RecipeRating {
  id        Int      @id @default(autoincrement())
  recipeId  Int
  rating    Int      // 1-5
  notes     String?
  dateMade  DateTime
  recipe    Recipe   @relation(fields: [recipeId], references: [id])

  @@unique([recipeId, dateMade])  // Multiple ratings per recipe
}

// AFTER (single rating)
model Recipe {
  id              Int      @id @default(autoincrement())
  name            String
  // ... other fields
  rating          Int?     // 1-5 (nullable, single rating)
  ratingNotes     String?  // Optional notes about the rating
  // ...
}

// Delete RecipeRating table entirely
```

**Benefits:**
- Simpler schema (one less table)
- Simpler UI (just a star rating component)
- Faster implementation
- Easier to understand

**Timeline:** Include in Phase 1 (database migration)

---

### 3. Shopping List Persistence - PERSIST WITH WORKFLOW ✅

**Decision:** Persist shopping lists with name and save functionality

**User Workflow (Every 1-2 Weeks):**
1. User clicks "Create Shopping List"
2. Selects date range (e.g., next week's meals)
3. System generates initial list from meal plan ingredients
4. User reviews list and checks off items they already have in pantry
5. User can name the list (e.g., "Grocery Trip Nov 25")
6. User saves the list
7. User takes saved list to grocery store
8. (Optionally) User checks off items while shopping

**Schema Implications - NEW FEATURE REQUIRED:**

⚠️ **IMPORTANT:** The current schema only supports checking items, NOT saving named lists!

**Current Schema (Insufficient):**
```prisma
model ShoppingListItem {
  id           Int      @id @default(autoincrement())
  ingredientId Int
  checked      Boolean  @default(false)

  @@unique([ingredientId])
}
```

**Required Schema for This Workflow:**
```prisma
model ShoppingList {
  id          Int                  @id @default(autoincrement())
  name        String               // "Grocery Trip Nov 25"
  startDate   DateTime             // Date range start
  endDate     DateTime             // Date range end
  createdAt   DateTime             @default(now())
  items       ShoppingListItem[]
}

model ShoppingListItem {
  id              Int           @id @default(autoincrement())
  shoppingListId  Int
  ingredientId    Int
  ingredientName  String        // Denormalized for display
  quantity        String        // "2 1/2 cups"
  unit            String
  checked         Boolean       @default(false)
  alreadyHave     Boolean       @default(false)  // Checked off as "have in pantry"
  recipe          String?       // Which recipe(s) need this
  shoppingList    ShoppingList  @relation(fields: [shoppingListId], references: [id])
}
```

**Questions for Product Owner:**
1. Should users be able to save multiple shopping lists?
2. Can users edit a saved list (add/remove items)?
3. Should old lists be kept for reference or auto-deleted?
4. Is there a "current" shopping list vs "archived" lists?

**Scope Assessment:**
- ⚠️ This is MORE complex than current schema
- 🎯 BUT it's a core feature for the user workflow
- 📊 Adds 2 tables (ShoppingList + refactored ShoppingListItem)

**Recommendation:**
- **For POC:** Implement basic version (create, view, check off)
- **For MVP:** Add naming, saving, multiple lists
- **Defer:** Edit saved lists, archive management

**Timeline:** Phase 1 (schema) + Phase 2 (backend) + Phase 3 (UI)

---

### 4. Data Import/Export - DEFER ✅

**Decision:** Focus on schema now, build import/export later

**What This Means:**
- ❌ No import from other apps (for now)
- ❌ No export to JSON/CSV (for now)
- ❌ No recipe sharing (for now)
- ✅ Manual database backup only (SQLite file)

**When to Revisit:** Post-MVP (Phase 6-7)

**Schema Impact:** None (no changes needed)

---

### 5. Future Cloud Sync - LOCAL ONLY ✅

**Decision:** Keep everything local for now

**What This Means:**
- ✅ SQLite database file on user's computer
- ✅ No cloud storage integration
- ✅ No sync between devices
- ✅ No backup to cloud (manual backup only)

**Benefits:**
- Simpler architecture
- Faster development
- No authentication needed (already decided)
- No cloud infrastructure costs
- Better privacy

**When to Revisit:** Post-MVP if user demand exists

**Schema Impact:** None (SQLite is already the choice)

---

## Schema Update Required

Based on shopping list decision, the Data Engineer's proposed schema needs updates:

### Changes Needed:

1. **Remove RecipeRating Table** → Move rating to Recipe model
2. **Add ShoppingList Table** → For named, saved lists
3. **Refactor ShoppingListItem Table** → Associate with ShoppingList, add fields

### Priority:
- **Critical for POC:** Items 1 & 2
- **Can defer:** Advanced shopping list features

---

## POC/MVP Scope Definition

### POC (Proof of Concept) - Week 1-2
**Goal:** Basic functionality works
- ✅ Create recipes
- ✅ Plan meals on calendar
- ✅ Generate shopping list from meal plan
- ✅ Check off items
- ✅ Basic save/load

**Out of Scope:**
- Named/saved shopping lists (defer to MVP)
- Cooking history
- Import/export
- Advanced features

### MVP (Minimum Viable Product) - Week 3-4
**Goal:** Usable by real users
- ✅ Everything in POC
- ✅ Named shopping lists
- ✅ Save multiple lists
- ✅ Welcome screen
- ✅ Basic data management
- ✅ Polish and bug fixes

**Out of Scope:**
- Import/export (Phase 6)
- Cloud sync (Post-MVP)
- Advanced pantry features (Phase 8)
- Recipe sharing

---

## Implementation Priorities

### Phase 1: Database Schema (Day 1) - UPDATED
- Implement single-user schema
- Simplify RecipeRating (move to Recipe)
- Add ShoppingList table
- Update ShoppingListItem structure
- Migration scripts

### Phase 2: Core Backend (Day 1-2)
- Recipe CRUD
- Meal plan CRUD
- Basic shopping list generation
- **Defer:** Named list save/load (add in MVP)

### Phase 3: Core Frontend (Day 2-3)
- Recipe management UI
- Meal planning calendar
- Shopping list view
- Check off functionality
- **Defer:** Save/name lists UI (add in MVP)

### Phase 4: POC Testing (Day 3)
- End-to-end testing
- Core workflows verified
- Bug fixes

### Phase 5: MVP Features (Week 2)
- Named shopping lists
- Save/load functionality
- Welcome screen
- Data management
- Polish

---

## Action Items

### Immediate (Today)
- [ ] Update Data Engineer's schema to reflect decisions
- [ ] Remove RecipeRating table, add rating to Recipe
- [ ] Design ShoppingList + ShoppingListItem structure
- [ ] Update MIGRATION_STRATEGY.md with changes
- [ ] Update ER_DIAGRAM.md

### Next (Tomorrow)
- [ ] Begin Phase 1: Database migration
- [ ] Implement simplified schema
- [ ] Update backend services

---

## Questions Still Open

### Shopping List Feature
1. **Multiple lists?** Can user save many lists or just one "current" list?
2. **Edit saved lists?** Can user modify a saved list or is it read-only?
3. **List lifecycle?** Auto-delete old lists? Keep history?
4. **"Already have" vs "checked off while shopping"?** Two separate states?

### POC vs MVP Boundary
5. **When to add saved lists?** POC or MVP?
   - **Recommendation:** Basic generation in POC, save/name in MVP

---

## Decision Log

| Date | Decision | Made By | Impact |
|------|----------|---------|--------|
| Nov 25, 2025 | Simplify IngredientCustomization | Product Owner | Low - Keep simple |
| Nov 25, 2025 | One rating per recipe | Product Owner | Medium - Remove table |
| Nov 25, 2025 | Persist shopping lists | Product Owner | High - New feature |
| Nov 25, 2025 | Defer import/export | Product Owner | Low - Not in MVP |
| Nov 25, 2025 | Local only (no cloud) | Product Owner | Low - Already planned |

---

## Success Criteria (POC)

POC is successful when:
- [ ] User can create a recipe
- [ ] User can add recipe to meal plan
- [ ] User can generate shopping list from meals
- [ ] User can check off items
- [ ] App runs locally without authentication
- [ ] Basic UI is functional (not polished)

---

## Success Criteria (MVP)

MVP is successful when:
- [ ] Everything in POC works
- [ ] User can name and save shopping lists
- [ ] User can view past shopping lists
- [ ] Welcome screen guides new users
- [ ] App is stable and bug-free
- [ ] UI is polished and usable
- [ ] Ready for user testing

---

**Next Steps:** Update schema and begin Phase 1 implementation
**Document Owner:** Product Owner + Project Coordinator
