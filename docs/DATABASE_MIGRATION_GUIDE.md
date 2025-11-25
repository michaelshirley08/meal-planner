# Database Migration Guide

**Purpose:** Safely create, test, and deploy schema changes to production

**Target Audience:** Development team creating database migrations

**Database:** Prisma with SQLite

---

## Quick Start (2 minutes)

### Creating a Migration

```bash
cd backend

# Make schema.prisma changes

# Create migration
npx prisma migrate dev --name add_feature_name

# Git tracks migration file automatically
# Nothing more needed for low-risk changes
```

### Testing a Migration

```bash
# Make backup
cp prisma/dev.db prisma/dev.db.backup

# Run migration (done above with migrate dev)
# Verify it worked
npx prisma studio  # Visual check

# Test rollback
npx prisma migrate resolve --rolled-back migration_name

# Restore backup
cp prisma/dev.db.backup prisma/dev.db
```

### Documenting in PR

```markdown
## Database Changes

- **Migration Name:** `20231125_140530_add_user_preferences`
- **Change Type:** ADD TABLE
- **Risk Level:** LOW
- **Tested:** YES (local SQLite)
- **Data Impact:** No existing data affected
- **Breaking Changes:** NO
```

---

## Full Process (10 minutes)

### 1. Plan Your Change

Before writing code:

**Ask yourself:**
- What data are you adding/changing/removing?
- Will existing records break?
- How will this affect queries?
- Can it be rolled back?
- Does anyone else need to know about this?

**Risk Assessment:**

```
Is this a DESTRUCTIVE change?
├─ Deleting a table? → CRITICAL RISK
├─ Deleting a column? → CRITICAL RISK
├─ Removing cascade delete? → HIGH RISK
├─ Changing a column type? → HIGH RISK
├─ Removing a unique constraint? → HIGH RISK
├─ Removing an optional column? → MEDIUM RISK
└─ Adding an optional column? → LOW RISK
```

### 2. Make Schema Changes

Edit `/backend/prisma/schema.prisma`:

```prisma
// Example: Adding optional field
model Recipe {
  id              Int     @id @default(autoincrement())
  // ... existing fields ...
  isFavorite      Boolean @default(false)  // NEW field
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### 3. Create Migration

```bash
cd /home/mike/meal-planner/backend

# Prisma detects schema changes and creates migration
npx prisma migrate dev --name add_is_favorite_field

# You'll be asked to resolve any issues
# New migration file created in: prisma/migrations/YYYYMMDD_HHMMSS_name/migration.sql
```

### 4. Review Generated Migration

Check `/backend/prisma/migrations/[timestamp]_[name]/migration.sql`:

```sql
-- For adding optional column:
ALTER TABLE "recipes" ADD COLUMN "isFavorite" BOOLEAN NOT NULL DEFAULT false;

-- For removing column:
ALTER TABLE "recipes" DROP COLUMN "deprecated_field";

-- For renaming column:
ALTER TABLE "recipes" RENAME COLUMN "old_name" TO "new_name";
```

**Verify it matches your intent!**

### 5. Test the Migration

**Forward test:**
```bash
# Already done by migrate dev above
# But verify with studio if unsure
npx prisma studio
```

**Backward test (rollback):**
```bash
# Make a backup first
cp prisma/dev.db prisma/dev.db.backup

# Test rollback
npx prisma migrate resolve migration_name --rolled-back

# Verify it worked
npx prisma db push  # Reapply if testing

# You should be able to both apply AND revert the migration
```

**Data integrity test (for risky changes):**
```bash
# If you modified existing data, verify it's valid
npx prisma studio

# Check:
# - Can existing records still be queried?
# - Are foreign keys still valid?
# - Are unique constraints satisfied?
# - Are NOT NULL columns populated?
```

### 6. Update Code if Needed

If schema changed in breaking way:

```typescript
// Old code might break
const recipe = await db.recipe.findUnique({
  where: { id: 1 },
  select: { name: true, oldField: true }  // oldField doesn't exist!
});

// Fix it
const recipe = await db.recipe.findUnique({
  where: { id: 1 },
  select: { name: true, newField: true }
});
```

### 7. Create PR with Migration

**Branch name:**
```
feature/MP-123-add-favorites
```

**PR description template:**

```markdown
## Summary
Add ability to mark recipes as favorites.

## Changes Made
- Added `isFavorite` field to Recipe model
- Created migration to add column
- Updated RecipeService to handle favorite logic
- Added tests for favorite functionality

## Type of Change
- [x] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Refactoring
- [x] Database schema change

## Database Changes

- **Migration Name:** `20231125_140530_add_is_favorite_field`
- **Change Type:** ADD COLUMN
- **Destructive:** NO
- **Tested:** YES (local SQLite)
- **Rollback:** Tested and working
- **Data Impact:** No existing data affected (optional field with default)
- **Risk Level:** LOW
- **Breaking Changes:** NO (new optional field, no code changes required)

### Migration Summary
Adds new optional `isFavorite` field to recipes table with default value false.
Fully backward compatible. Existing queries continue to work unchanged.

## Testing
- [x] Unit tests pass locally
- [x] Integration tests pass
- [x] Migration tested locally
- [x] Migration rollback tested
- [x] E2E tests pass (if applicable)
- [x] Manual testing completed

### Manual Testing Steps:
1. Create a new recipe
2. Verify `isFavorite` defaults to false
3. Query recipe and confirm field exists
4. Test favorite toggle functionality
5. Verify existing recipes still work

## Dependencies
- None

## Notes for Reviewers
This is a simple additive change with no data loss risk. Migration is tested and reversible.
```

### 8. Respond to Reviews

**If Data Engineer requests changes:**

```
Data Engineer: "Please verify this works with existing data"

Response: "Tested with: cp dev.db dev.db.backup && npx prisma migrate reset"
           "All existing recipes loaded correctly with new field."
```

**If Code Reviewer finds issues:**

```
Code Reviewer: "This query uses the old field name"

Response: Fix code, run tests, push fix
          "Updated query to use new field name. All tests passing."
```

### 9. Merge and Deploy

After approval:

```bash
# Merge PR to develop
# Code review + Data Engineer approval required

# Deploy to production
# Backup database before deployment
# Run migration: npx prisma migrate deploy
# Verify: npx prisma studio or health check query

# If issues: Run rollback: npx prisma migrate resolve name --rolled-back
```

---

## Risk Levels & Requirements

### LOW RISK: Quick Review

**Examples:** Adding optional field, adding index, creating new table

**What's needed:**
- Migration script (automatic)
- Tested locally
- Code review

**Example:**
```
Feature: Add tags field to recipes
Migration: alter table recipes add column tags text;
Risk: LOW (optional field with default)
Approval: Code reviewer only
```

### MEDIUM RISK: Detailed Review

**Examples:** Removing optional field, renaming column, making column required

**What's needed:**
- Migration script tested on local data
- Data impact documented
- Code review + Data Engineer review
- Rollback tested

**Example:**
```
Feature: Remove deprecated notes field
Migration: alter table recipes drop column notes;
Risk: MEDIUM (deleting data, but optional field)
Approval: Code reviewer + Data Engineer
Backup: Yes, tested rollback
```

### HIGH RISK: Thorough Review + Testing

**Examples:** Changing column type, removing NOT NULL, changing cascade delete behavior

**What's needed:**
- Migration tested on production-like data
- Full data migration script (if type change)
- Data Engineer review required
- Rollback tested and documented
- Tech Lead awareness

**Example:**
```
Feature: Convert recipe servings to decimal
Migration:
  alter table recipes add column servings_new real;
  update recipes set servings_new = cast(servings as real);
  alter table recipes drop column servings;
  alter table recipes rename column servings_new to servings;
Risk: HIGH (type change, affects all queries)
Approval: Code reviewer + Data Engineer + Tech Lead notified
Testing: Test data type conversion
Backup: Required, rollback fully tested
```

### CRITICAL RISK: Expert Review + Approvals

**Examples:** Deleting table, deleting column without backup, disabling cascade delete

**What's needed:**
- Expert review (Data Engineer + Tech Lead)
- Production-like testing
- Multiple rollback scenarios tested
- Backup and recovery plan
- Team communication plan
- Deployment window scheduled

**Example:**
```
Feature: Remove old audit table
Migration: drop table if exists audit_logs;
Risk: CRITICAL (permanent data loss)
Approval: Code reviewer + Data Engineer + Tech Lead
Backup: Required with restoration testing
Recovery: Full recovery procedure documented and tested
Communication: Notify entire team before deploying
Testing: Practice full rollback on backup
```

---

## Common Migration Patterns

### Pattern 1: Adding Optional Field

**Schema change:**
```prisma
model Recipe {
  // ...
  tags String?  // NEW optional field
}
```

**Generated migration:**
```sql
ALTER TABLE "recipes" ADD COLUMN "tags" TEXT;
```

**Why safe:** No existing data affected, queries don't break

**Risk:** LOW

**No rollback testing needed:** True

---

### Pattern 2: Adding Required Field

**Schema change:**
```prisma
model Recipe {
  // ...
  isActive Boolean  // NEW required field - NEEDS DEFAULT!
}
```

**Better schema:**
```prisma
model Recipe {
  // ...
  isActive Boolean @default(true)  // Required with default = safe
}
```

**Generated migration:**
```sql
ALTER TABLE "recipes" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
```

**Why safe:** Default value populates existing records

**Risk:** MEDIUM (if no default, migration fails)

**Rollback testing needed:** Yes

---

### Pattern 3: Renaming Column

**Schema change:**
```prisma
- description String?
+ notes String?  // Same field, new name
```

**Problem:** Prisma might drop old and create new!

**Safe approach:**
```prisma
model Recipe {
  // ...
  notes String? @map("description")  // Renamed in schema, not database
}
```

**Or manual migration** if you need database-level rename:
```sql
ALTER TABLE "recipes" RENAME COLUMN "description" TO "notes";
```

**Risk:** HIGH (requires manual migration)

**Rollback testing needed:** YES

---

### Pattern 4: Adding Foreign Key

**Schema change:**
```prisma
model Recipe {
  // ...
  categoryId Int?
  category Category? @relation(fields: [categoryId], references: [id])
}
```

**Generated migration:**
```sql
ALTER TABLE "recipes" ADD COLUMN "categoryId" INTEGER;
CREATE INDEX "recipes_categoryId_idx" ON "recipes"("categoryId");
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "categories"("id");
```

**Risk:** MEDIUM (adding constraint to existing data)

**Check before merging:**
- Do all existing recipes have valid categories? (Or is categoryId optional?)
- Will constraint be satisfied?

---

### Pattern 5: Removing Column

**Schema change:**
```prisma
- deprecatedField String?
```

**Generated migration:**
```sql
ALTER TABLE "recipes" DROP COLUMN "deprecatedField";
```

**Risk:** MEDIUM to CRITICAL (permanent data loss)

**Questions before approving:**
- Is this data really not needed?
- Is there a backup?
- Can users recover deleted data?
- Is there an audit log elsewhere?

---

### Pattern 6: Soft Delete (Safe Alternative to Hard Delete)

**Instead of deleting:**
```prisma
model Recipe {
  // ...
  deletedAt DateTime?  // null = active, set = deleted
  @@index([userId, deletedAt])  // For "active recipes" queries
}
```

**Then in queries:**
```typescript
// Get active recipes only
const recipes = await db.recipe.findMany({
  where: { userId, deletedAt: null }
});

// Get deleted recipes
const deleted = await db.recipe.findMany({
  where: { userId, deletedAt: { not: null } }
});

// To "delete"
await db.recipe.update({
  where: { id },
  data: { deletedAt: new Date() }
});

// To "undelete"
await db.recipe.update({
  where: { id },
  data: { deletedAt: null }
});
```

**Risk:** LOW (data preserved, recoverable)

**Recommendation:** Use soft deletes instead of hard deletes!

---

## Disaster Scenarios: How to Recover

### Scenario 1: Migration Has Syntax Error

**What happened:**
```
Migration runs: npx prisma migrate deploy
Error: SQL syntax error in migration.sql
Migration partially applied
Database in bad state
```

**Recovery:**
```bash
# Check what happened
npx prisma migrate status

# See which migrations applied, which failed
# Either:

# Option 1: Rollback the migration (if possible)
npx prisma migrate resolve migration_name --rolled-back
npx prisma db push  # Reapply good migrations

# Option 2: Fix migration SQL manually
# Edit: backend/prisma/migrations/[timestamp]/migration.sql
# Fix the SQL
# Re-run: npx prisma migrate deploy
```

**Prevention:**
- Test migration locally first
- Review SQL in generated migration
- Use `npx prisma migrate diff` to preview changes

---

### Scenario 2: Migration Deletes Wrong Data

**What happened:**
```
Migration: ALTER TABLE recipes DROP COLUMN description;
But app still queries description field
Queries fail
Users lose all recipe descriptions
```

**Recovery:**
```bash
# Restore from backup
# You took a backup, right?? (You should have!)

# If you have backup:
cp recipes.db.backup recipes.db

# Or manual recovery if no backup:
# 1. Rollback: npx prisma migrate resolve migration_name --rolled-back
# 2. Restore lost data from: audit log, cloud backup, user recovery service
# 3. Re-deploy migration only after data is safe
```

**Prevention:**
- Test migration impacts all queries
- Document data impact in PR
- Get Data Engineer approval
- Require backup before destructive changes

---

### Scenario 3: Migration Breaks Type Compatibility

**What happened:**
```prisma
// Schema change: Int -> String
servings Int
// Changes to:
servings String  // Can't convert automatically!
```

**Generated migration tries:**
```sql
ALTER TABLE "recipes" MODIFY COLUMN "servings" VARCHAR;
```

**But values are integers!**

**Recovery:**
```sql
-- Correct migration:
ALTER TABLE "recipes" ADD COLUMN "servings_str" VARCHAR;
UPDATE "recipes" SET "servings_str" = CAST("servings" AS VARCHAR);
ALTER TABLE "recipes" DROP COLUMN "servings";
ALTER TABLE "recipes" RENAME COLUMN "servings_str" TO "servings";

-- Then test:
SELECT * FROM recipes WHERE servings LIKE '%'; -- Should work now
```

**Prevention:**
- Don't change column types without planning
- Create intermediate column
- Use data conversion script
- Test with actual data values

---

## Checklist: Before Merging a Migration PR

Use this checklist for EVERY migration:

### Safety (MUST be YES)

- [ ] Migration script is present and in correct format
- [ ] Migration has been tested locally
- [ ] Migration can be rolled back (tested)
- [ ] No data will be permanently lost
- [ ] Existing data satisfies new constraints

### Correctness (MUST be YES)

- [ ] SQL syntax is correct
- [ ] All expected indexes created
- [ ] All expected constraints added
- [ ] Default values correct
- [ ] Type conversions handled

### Compatibility (MUST be YES)

- [ ] Code changes handle new schema
- [ ] All queries updated for new/removed fields
- [ ] Tests pass with new schema
- [ ] No breaking changes without documentation
- [ ] Backward compatibility maintained (if possible)

### Documentation (MUST be YES)

- [ ] Migration documented in PR
- [ ] Risk level assessed
- [ ] Data impact explained
- [ ] Rollback procedure described
- [ ] Any breaking changes documented

### Approval (MUST be YES)

- [ ] Code reviewer approved
- [ ] Data Engineer approved (if schema changes)
- [ ] Tech Lead notified (if high/critical risk)

---

## Rollback Procedure Template

For every critical migration, document rollback:

```markdown
## Rollback Procedure

If this migration needs to be reverted in production:

1. **Notify Team**
   - Alert via Slack: "#database" channel
   - Create incident ticket
   - Document issue encountered

2. **Assess Damage**
   ```bash
   npx prisma studio
   # Check: Is data inconsistent?
   # Check: Are queries failing?
   # Estimate: How much data lost/broken?
   ```

3. **Decide on Approach**
   - If < 5 minutes applied: Rollback immediately
   - If > 5 minutes applied: Assess data impact first
   - If data corrupted: Restore from backup instead

4. **Execute Rollback**
   ```bash
   # Check status
   npx prisma migrate status

   # Revert migration
   npx prisma migrate resolve 20231125_add_field --rolled-back

   # Verify
   npx prisma db push
   npx prisma studio
   ```

5. **Verify Success**
   - Check application queries work
   - Check data integrity
   - Confirm no errors in logs

6. **Post-Incident**
   - Document what went wrong
   - Create issue to fix and retest
   - Schedule retry with better testing

**Estimated Rollback Time:** 15 minutes
**Data Loss Risk:** Low (assuming backup available)
```

---

## Key Takeaways

1. **Always test migrations locally first**
2. **Always plan rollback before merging**
3. **Always backup before production deployment**
4. **Always document data impact**
5. **Always get Data Engineer approval**
6. **Never silently delete data**
7. **Never change types without migration**
8. **Never cascade delete without thought**

## Getting Help

If you're unsure about a migration:

1. **Ask in #database channel** - Ask Data Engineer
2. **Review this guide** - Likely has your pattern
3. **Test thoroughly** - Backup and rollback locally
4. **Request review** - Tag Data Engineer in PR
5. **Don't rush** - Better to get it right

**Remember: Bad code can be fixed. Bad migrations lose data forever.**
