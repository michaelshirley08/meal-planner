# Architecture Transition: Multi-User to Single-User

**Date:** November 25, 2025
**Status:** Transition Planned - Documentation Complete

---

## Executive Summary

The Meal Planner application is transitioning from a **multi-user SaaS web application** to a **single-user installable application** that users run locally on their own computers. While users still interact via a browser, the fundamental architecture shifts from cloud-hosted multi-tenancy to local-first single-user ownership.

This document explains the reasoning, impact, and transition plan for this architectural change.

---

## The Pivot: Why Single-User?

### Original Architecture (Multi-User SaaS)
- Cloud-hosted web application
- User authentication (JWT)
- Multi-tenancy with userId isolation
- PostgreSQL database (cloud)
- User accounts and registration
- Authentication middleware throughout

### New Architecture (Single-User Local)
- Locally installable application
- No authentication required
- Single user per installation
- SQLite database (local file)
- Direct access to all features
- Desktop application patterns

### Rationale for Change

1. **Simplified User Experience**
   - No login/registration barriers
   - Instant access to all features
   - No password management
   - No forgotten password flows

2. **Privacy & Data Ownership**
   - User's data stays on their computer
   - No cloud server dependencies
   - Complete data control
   - Easy backup and portability

3. **Reduced Complexity**
   - No authentication system to maintain
   - No multi-user isolation logic
   - Simpler database schema
   - Fewer security concerns (single user)

4. **Better Local Performance**
   - No network latency
   - Instant data access
   - Works offline by default
   - Native-like responsiveness

5. **Desktop App Market Fit**
   - Many users prefer local meal planning tools
   - Similar to successful apps (Paprika, Mela)
   - Data portability is a selling point
   - Lower hosting costs for developer

---

## Architecture Comparison

### Before: Multi-User SaaS

```
┌─────────────────────────────────────────────┐
│            Cloud Infrastructure              │
├─────────────────────────────────────────────┤
│  Load Balancer                              │
│  ├── Web Server (Node.js/Express)          │
│  │   ├── Auth Middleware (JWT)             │
│  │   ├── User Isolation (userId filters)   │
│  │   └── Multi-tenant Logic                │
│  └── PostgreSQL Database (Cloud)           │
│      ├── users table (auth)                │
│      ├── recipes (userId FK)               │
│      ├── meal_plans (userId FK)            │
│      └── ... (all tables have userId)      │
└─────────────────────────────────────────────┘
         ↕ HTTPS
┌─────────────────────────────────────────────┐
│       User's Browser (React SPA)            │
│  ├── Login/Register Pages                  │
│  ├── Auth State Management                 │
│  ├── JWT Token Storage                     │
│  └── Protected Routes                      │
└─────────────────────────────────────────────┘
```

**Characteristics:**
- Network-dependent
- Requires internet connection
- Authentication required for all operations
- Data in cloud (privacy concerns)
- Hosting costs scale with users

---

### After: Single-User Local

```
┌─────────────────────────────────────────────┐
│         User's Computer (Local)             │
├─────────────────────────────────────────────┤
│  Local Web Server (Node.js/Express)        │
│  ├── No Auth Middleware                    │
│  ├── Direct Data Access                    │
│  └── Simple CRUD Operations                │
│                                             │
│  SQLite Database (Local File)              │
│  ├── recipes (no userId)                   │
│  ├── meal_plans (no userId)                │
│  └── ... (simplified schema)               │
└─────────────────────────────────────────────┘
         ↕ localhost:3000
┌─────────────────────────────────────────────┐
│     User's Browser (React SPA)              │
│  ├── No Login Required                     │
│  ├── Direct Access to All Features         │
│  ├── Desktop Patterns (shortcuts, menus)   │
│  └── Local Data Management                 │
└─────────────────────────────────────────────┘
```

**Characteristics:**
- Offline-first
- No internet required
- No authentication needed
- Data on user's computer (full privacy)
- Zero hosting costs

---

## Impact Analysis

### Database Schema

**Changes Required:**
- Remove `users` table entirely
- Remove `userId` foreign keys from 7 tables
- Simplify 6 unique constraints
- Remove 4 indexes
- Update cascade delete rules

**Tables Affected:**
1. ✅ `Recipe` - Remove userId
2. ✅ `RecipeRating` - Remove userId
3. ✅ `MealPlan` - Remove userId
4. ✅ `IngredientCategory` - Remove userId
5. ✅ `IngredientCustomization` - Remove userId
6. ✅ `ShoppingListItem` - Remove userId
7. ❌ `User` - Delete entire table

**Tables Unchanged:**
1. ✅ `Ingredient` - Already user-agnostic
2. ✅ `RecipeIngredient` - Via Recipe relation
3. ✅ `RecipeInstruction` - Via Recipe relation

**Impact:** Low - All features preserved, schema simplified

---

### Backend Services

**Files to Delete:**
- `src/services/authService.ts`
- `src/middleware/authMiddleware.ts`
- `src/routes/auth.ts`

**Files to Modify (~40 methods):**
- `src/services/recipeService.ts` - Remove userId parameter
- `src/services/ingredientService.ts` - Remove userId parameter
- `src/services/mealPlanService.ts` - Remove userId parameter
- `src/services/shoppingListService.ts` - Remove userId parameter

**Code Example:**

Before (Multi-User):
```typescript
async function getRecipe(userId: number, recipeId: number) {
  return await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      userId: userId  // User isolation
    }
  });
}
```

After (Single-User):
```typescript
async function getRecipe(recipeId: number) {
  return await prisma.recipe.findFirst({
    where: { id: recipeId }  // Direct access
  });
}
```

**Impact:** Medium - Significant code changes but straightforward

---

### API Routes

**Changes Required:**
- Remove `authMiddleware` from all routes
- Remove JWT token extraction
- Simplify endpoint signatures
- Update service method calls

**Example:**

Before (Multi-User):
```typescript
router.get('/recipes', authMiddleware, async (req, res) => {
  const userId = req.user.id;  // From JWT
  const recipes = await recipeService.getRecipes(userId);
  res.json(recipes);
});
```

After (Single-User):
```typescript
router.get('/recipes', async (req, res) => {
  const recipes = await recipeService.getRecipes();
  res.json(recipes);
});
```

**Impact:** Low - Simple mechanical changes

---

### Frontend Application

**Files to Delete:**
- Login page component
- Register page component
- Auth context/state
- JWT token management
- Protected route wrapper

**Files to Modify:**
- API service layer (remove Authorization header)
- Route configuration (remove auth guards)
- App initialization (no login check)

**Code Example:**

Before (Multi-User):
```typescript
// API call with auth
const response = await fetch('/api/recipes', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

After (Single-User):
```typescript
// Direct API call
const response = await fetch('/api/recipes');
```

**Impact:** Medium - Significant simplification

---

### User Experience

**Removed Flows:**
- ❌ User registration
- ❌ Login/logout
- ❌ Password reset
- ❌ Account settings (email, password)
- ❌ User profile

**New Flows:**
- ✅ Welcome screen (first run)
- ✅ Direct access to app
- ✅ Sample recipes on first run
- ✅ Data export/import
- ✅ Local backup management

**Impact:** High positive - Much simpler UX

---

## Migration Strategy

### Phase 1: Database Migration (Day 1)
**Duration:** 4-6 hours

1. Backup existing database
2. Create new schema file (schema-single-user.prisma)
3. Run migration script
4. Verify data integrity
5. Update database documentation

**Deliverables:**
- ✅ New schema deployed
- ✅ Data migrated (if applicable)
- ✅ Tests pass

---

### Phase 2: Backend Refactoring (Day 1-2)
**Duration:** 6-8 hours

1. Remove authentication services
2. Update all service methods
3. Update API routes
4. Remove auth middleware
5. Update tests

**Deliverables:**
- ✅ Auth code removed
- ✅ Services refactored
- ✅ API tests pass

---

### Phase 3: Frontend Updates (Day 2)
**Duration:** 4-7 hours

1. Remove login/register pages
2. Remove auth state management
3. Update API service calls
4. Remove protected routes
5. Add welcome screen
6. Update tests

**Deliverables:**
- ✅ Auth UI removed
- ✅ Welcome screen added
- ✅ App works without login

---

### Phase 4: Testing & Polish (Day 2-3)
**Duration:** 4-6 hours

1. End-to-end testing
2. User flow verification
3. Performance testing
4. Documentation updates
5. Bug fixes

**Deliverables:**
- ✅ All tests pass
- ✅ No regressions
- ✅ Documentation updated

---

## Risk Assessment

### Low Risk
- ✅ Database migration (well-documented, tested)
- ✅ Service refactoring (TypeScript catches errors)
- ✅ API simplification (fewer moving parts)

### Medium Risk
- ⚠️ Migration timeline (might take longer than estimated)
- ⚠️ Hidden auth dependencies (need thorough testing)
- ⚠️ User confusion (need clear communication about change)

### Mitigation Strategies
- Comprehensive testing at each phase
- Rollback plan (keep old schema/code temporarily)
- User communication (if existing users)
- Staged rollout (dev → staging → production)

---

## Benefits Summary

### For Users
- ✅ **Simpler onboarding** - No registration required
- ✅ **Better privacy** - Data stays local
- ✅ **Faster performance** - No network latency
- ✅ **Offline access** - Works without internet
- ✅ **Data portability** - Easy export/backup
- ✅ **No account management** - No passwords to remember

### For Developers
- ✅ **Reduced complexity** - ~1000 lines of code removed
- ✅ **Easier maintenance** - Fewer security concerns
- ✅ **Better testability** - Simpler test scenarios
- ✅ **Lower costs** - No hosting/server costs
- ✅ **Faster development** - No auth edge cases

### For the Product
- ✅ **Clear positioning** - Local-first tool vs cloud service
- ✅ **Competitive advantage** - Privacy-focused
- ✅ **Better UX** - Instant access
- ✅ **Market fit** - Matches successful competitors

---

## Success Criteria

The transition is successful when:

- [ ] No authentication code remains in codebase
- [ ] All API calls work without JWT tokens
- [ ] Database has no userId columns
- [ ] Frontend has no login/register pages
- [ ] App launches directly to main interface
- [ ] Welcome screen works for first-run users
- [ ] All existing features still function
- [ ] Performance is equal or better
- [ ] All tests pass
- [ ] Documentation is updated

---

## Timeline

| Phase | Duration | Completion |
|-------|----------|------------|
| Documentation | 1 day | ✅ Complete |
| Database Migration | 4-6 hours | ⏳ Pending |
| Backend Refactoring | 6-8 hours | ⏳ Pending |
| Frontend Updates | 4-7 hours | ⏳ Pending |
| Testing & Polish | 4-6 hours | ⏳ Pending |
| **Total** | **2-3 days** | **In Progress** |

---

## Rollback Plan

If major issues arise:

1. **Immediate Rollback** (< 1 hour)
   - Revert to old schema file
   - Restore database backup
   - Revert code changes (git)

2. **Partial Rollback** (2-4 hours)
   - Keep new schema
   - Re-add auth as optional
   - Support both modes temporarily

3. **Forward Fix** (varies)
   - Fix issues in new architecture
   - Continue with single-user approach

**Recommendation:** Commit to single-user, use forward fixes

---

## Communication Plan

### Internal Team
- Share this document
- Review design documents
- Align on timeline
- Address questions

### External Users (if applicable)
- Explain benefits of local-first approach
- Provide migration tool (export from old version)
- Clear documentation on new install process
- Support for questions

---

## Next Steps

1. **Review & Approve** this transition plan
2. **Schedule** implementation phases
3. **Begin** database migration (Phase 1)
4. **Execute** according to timeline
5. **Test** thoroughly at each phase
6. **Launch** new single-user version

---

## Questions?

For questions about this transition:
- **UX/Design:** See `UX_DESIGN_OVERVIEW.md`
- **Database:** See `DATA_ENGINEERING_SUMMARY.md`
- **Implementation:** See `MIGRATION_STRATEGY.md`
- **General:** Contact project coordinator

---

**Status:** Ready for implementation approval
**Next Review:** After Phase 1 completion
**Document Owner:** Project Coordinator
