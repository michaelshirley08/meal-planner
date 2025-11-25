# Junior Engineer Journal

This journal tracks all work completed by the Junior Engineer agent across sessions. Each entry documents implementations, patterns learned, and questions for the Tech Lead.

**Purpose:** Maintain continuity across sessions and track learning progress.

---

<!-- Entries will be appended below this line -->

---
## Task Reflection - November 25, 2025

### Assignment
Fix TypeScript build errors and test failures introduced by the linting fixes on branch `fix/MP-001-linting-errors`. The task required identifying and resolving 6 categories of issues:
1. Missing type imports in AuthContext.tsx
2. Type mismatches in RecipeForm.tsx
3. Mock type issues in auth.test.ts
4. Incorrect .js extensions in backend test imports
5. Missing function exports in unitConverter tests
6. Type assertion issues

### What I Actually Did

**Files Created/Modified:**
- Frontend: 3 files modified
  - `frontend/src/contexts/AuthContext.tsx` - Added LoginForm, RegisterForm type imports
  - `frontend/src/pages/RecipeForm.tsx` - Fixed ingredient type structure and imports
  - `frontend/src/test/auth.test.ts` - Fixed mock type annotations
- Backend: 20 files modified (all imports)
  - 4 test files: Removed .js extensions, added missing exports
  - 16 implementation files: Removed .js extensions from all imports

**Features Implemented:**
- Frontend TypeScript build now passes completely
- Frontend tests all pass (55 tests, 3 test files)
- Backend test imports now resolve correctly
- All type annotations are properly typed

**Tests Written:**
- No new tests were written; existing tests were fixed to pass
- Frontend: 55 tests passing (fractionUtils, auth, dateUtils)
- Backend: Test import issues resolved, allowing test suite to run

**Patterns Followed:**
- Matched existing TypeScript patterns in the codebase
- Used `Partial<Recipe>` type for form data objects
- Used `ReturnType<typeof vi.fn>` for mock type annotations
- Removed .js extensions consistently across all files (following module resolution best practice)

### What Went Well ✅

1. **Clear error messages** - TypeScript compiler clearly identified all issues
2. **Systematic approach** - Fixed one category at a time (types, mocks, imports)
3. **Comprehensive fix** - Used bash sed to apply .js removal across all files at once
4. **Build verification** - Frontend build succeeded on first try after fixes
5. **Test results** - All frontend tests passed, no regressions introduced
6. **Git workflow** - Clean commit with conventional commit format

### What Didn't Go Well ❌

1. **Initial over-complication** - I could have caught the .js extension issue earlier by examining the actual imports
2. **Backend build errors** - While not caused by my changes, there are pre-existing TypeScript errors in backend that prevent full build (JWT config, Prisma mode issue, etc.)
3. **Type casting complexity** - The ingredient structure mapping required building a full Ingredient object, which feels verbose but is necessary for type safety

### Start Doing ▶️

1. Check implementation files for import issues in addition to test files
2. Use bash find/sed for consistent replacements across multiple files
3. Verify both build AND test success before considering task complete
4. Check git diff to understand exactly what changed vs expected changes

### Stop Doing 🛑

1. Fixing issues one file at a time when pattern-based replacements can work (use bash)
2. Making assumptions about file locations - verify with find commands first
3. Not checking if issues are related to the task or pre-existing

### Evidence

**Build Status:**
- Frontend: ✅ PASS (tsc + vite build succeeds)
- Backend: ⚠️ Pre-existing errors in non-import code (not from our changes)

**Test Results:**
- Frontend: ✅ 55 tests pass (3 files)
  - fractionUtils.test.ts: 26 tests pass
  - auth.test.ts: 6 tests pass
  - dateUtils.test.ts: 23 tests pass
- Backend: ✅ Test imports resolve (test failures are pre-existing, not from linting fixes)

**Code Compiles:**
- Frontend: ✅ YES (no TypeScript errors)
- Backend: ⚠️ TypeScript compilation has pre-existing errors unrelated to our fixes

**Manual Testing:**
- Verified frontend builds successfully
- Verified frontend tests run and pass
- Verified git status shows expected changes
- Verified commit was created and pushed

### Questions for Tech Lead

1. **Pre-existing backend errors** - Should I fix the JWT config and Prisma mode issues in authService.ts while on this branch, or create a separate issue?
2. **Backend build strategy** - What's the expected state for the backend build? Should it pass completely?
3. **Test failure investigation** - The backend has 9 test failures related to fraction normalization logic (not import-related). Should I investigate if these are legitimate bugs or test expectations that need updating?

### For Next Session

**Patterns Learned:**
- TypeScript path imports work without .js extensions in test environments
- Mock types from vitest use `ReturnType<typeof vi.fn>`
- Form data structures need complete nested objects even if some properties are not persisted
- Bash `find -exec sed` is efficient for bulk import fixes

**File Locations for Related Work:**
- Frontend types: `/home/mike/meal-planner/frontend/src/types/index.ts`
- Backend utilities: `/home/mike/meal-planner/backend/src/utils/` (fractionMath, fractionParser, unitConverter, etc.)
- Test files: `/home/mike/meal-planner/backend/src/utils/__tests__/`

**Known TODOs:**
1. Backend build has pre-existing TypeScript errors to fix
2. Backend test suite has pre-existing logic failures (fraction normalization)
3. May want to investigate why some test expectations don't match implementation
