# Data Engineer Perspective: GitHub Workflow Analysis

**Date:** November 25, 2025
**Database:** SQLite (local single-user)
**Current Schema:** Multi-user with cascading deletes

---

## Critical Findings: What's Missing from the Workflow

The current GitHub workflow document (`GITHUB_WORKFLOW.md`) addresses **code changes** well but is **dangerously silent on database migrations and schema changes**. This creates significant risk for data loss and deployment failures.

### Current Gap Analysis

**Line 169 (Dependencies section):**
```markdown
- Requires database migration
```

This is the ONLY mention of database migrations in the entire 600+ line workflow document. This is insufficient for preventing data disasters.

**Lines 592-593 (FAQ):**
```
Q: How do I handle database migrations in PRs?
A: Include migration scripts, document in PR description, coordinate with team.
```

This brief answer leaves critical details unspecified, creating ambiguity and risk.

---

## Core Data Engineering Concerns & Solutions

### 1. DATABASE MIGRATION STRATEGY

#### What's Needed

Database changes follow a fundamentally different risk profile than code changes:
- **Code bugs** can be fixed with a new deploy
- **Database bugs** can cause permanent data loss
- **Migrations** must work forwards AND backwards
- **Schema changes** affect ALL subsequent queries

#### Current Workflow Issues

1. **No migration approval process** - Code reviews happen, but database migrations aren't separately reviewed
2. **No migration testing requirements** - PRs only test code and linting, not migration success
3. **No rollback procedure defined** - While code has rollback (git revert), databases have no recovery strategy
4. **No safety gates for destructive changes** - Dropping columns, renaming tables isn't flagged as high-risk
5. **CI/CD doesn't validate migrations** - Tests pass but migrations might fail in production

#### Recommended Solution

Create a **Database Migration Approval Gate**:

```
PR with schema changes:
  ├─ Code review (as normal)
  ├─ Database schema review (separate checklist)
  │  ├─ Is migration destructive? (YES = requires extra care)
  │  ├─ Can it be executed without downtime?
  │  ├─ Does rollback plan exist?
  │  └─ Is backwards compatibility maintained?
  ├─ Automated migration test (runs migration on test database)
  ├─ Data safety verification
  └─ Only then: merge and deploy
```

---

### 2. SCHEMA CHANGE REVIEW CHECKLIST

#### What Could Go Wrong

With the current schema at `/home/mike/meal-planner/backend/prisma/schema.prisma`:

| Change Type | Risk | Current Protection | Need |
|---|---|---|---|
| Add NOT NULL column | High | None | Default value or backfill plan |
| Drop column | Critical | None | Explicit approval + backup |
| Rename table | High | None | Migration script validation |
| Rename column | High | None | Data mapping verification |
| Change type (Int→String) | Critical | None | Data conversion testing |
| Add foreign key | Medium | None | Constraint validation on existing data |
| Remove foreign key | Medium | None | Data consistency check |
| Change cascade delete | Critical | None | Review data impact |

#### Current Schema Risks

The existing schema uses **cascading deletes extensively**:

```prisma
// Deleting a User cascades to:
user            User       @relation(fields: [userId], references: [id], onDelete: Cascade)
```

When a User is deleted:
- All their Recipes deleted
- All RecipeRatings deleted
- All MealPlans deleted
- All IngredientCustomizations deleted
- All ShoppingListItems deleted

**No audit trail. No recovery. Permanent data loss.**

#### Recommended Review Checklist

Before approving ANY schema change PR:

```
SCHEMA CHANGE REVIEW CHECKLIST
□ Is this a breaking change? (YES = document in CHANGELOG)
□ Can existing data support this change?
□ If adding NOT NULL: is there a default or backfill query?
□ If dropping column: is it logged/backed up elsewhere?
□ If changing types: what happens to existing values?
□ If adding FK: will all existing records have valid references?
□ If cascade delete: what data will be permanently lost?
□ Has migration been tested against production-like data?
□ Is there a rollback procedure?
□ Does migration preserve backwards compatibility?
□ Are indexes correct for new queries?
```

---

### 3. DATA SAFETY GATES

#### Issue: No Data Loss Prevention

The workflow protects code but not data. A developer could:

1. Create PR with schema change
2. Pass all code tests (tests don't validate migration)
3. Get 1 code review (reviewer focused on code, not data)
4. Merge to develop
5. Deploy to production
6. Discover migration deleted 6 months of user data

**This has zero safeguards.**

#### Recommended Safety Gates

```
Stage 1: Development (PR to develop)
├─ Migration script provided
├─ Migration tested locally (with real backup)
├─ Code tests pass
├─ Database schema reviewed
├─ Data impact documented
└─ Merge approved by 1 reviewer

Stage 2: Pre-Production (Before release to main)
├─ Migration tested on staging database
├─ Staging database is copy of production
├─ Data verification queries run
├─ Rollback script prepared and tested
├─ Backup taken before any schema change
└─ Merge to main approved by Tech Lead

Stage 3: Production Deployment
├─ Database backup created
├─ Migration logged with timestamp
├─ Rollback procedure documented
├─ Team notified before migration
├─ Post-migration data verification run
└─ Rollback executed if verification fails
```

---

### 4. MIGRATION NAMING CONVENTIONS

#### Current Situation
The workflow defines naming for branches, commits, PRs, and releases. **It does NOT define naming for migrations.**

Prisma generates migrations with timestamps:
```
20231125_add_user_preferences/
migration.sql
```

But there's no convention for:
- What each migration should do
- How to reference migrations in PRs
- How to track which migration corresponds to which feature

#### Recommended Convention

```
TIMESTAMP_DESCRIPTIVE_NAME/
  migration.sql

Examples:
20231125_140530_add_user_preferences/
  - Clear what changed
  - Timestamp prevents conflicts
  - Easy to track in git history

20231125_150000_remove_deprecated_fields/
  - Clearly indicates DESTRUCTIVE change
  - Searchable in git

20231126_120000_backfill_missing_values/
  - Indicates data migration rather than structure change
```

In PR description:
```markdown
## Database Changes
- Migration: `20231125_140530_add_user_preferences`
- Change: Adds new user_preferences table
- Destructive: NO
- Rollback: Supported via Prisma migration revert
```

---

### 5. TESTING REQUIREMENTS FOR MIGRATIONS

#### Current Testing (from GITHUB_WORKFLOW.md lines 243-247)

```
All PRs must pass:
1. Unit Tests
2. Integration Tests
3. E2E Tests
4. Build
5. Linter
```

**Missing: Database Migration Tests**

#### What Needs to Be Tested

1. **Forward Migration**
   - Does `prisma migrate deploy` succeed?
   - Is schema created correctly?
   - Are new columns populated?
   - Are indexes created?

2. **Data Integrity**
   - Do existing records still have valid references?
   - Are foreign key constraints satisfied?
   - Is data format compatible with new columns?

3. **Backwards Compatibility**
   - Can old code run against new schema?
   - Or do changes require coordinated deploy?

4. **Rollback**
   - Does `prisma migrate resolve` work?
   - Can we revert to previous schema?
   - Are backups created before migration?

#### Recommended CI/CD Addition

```yaml
On Push to Feature Branch:
  - Run: prisma migrate validate
  - Run: Unit/Integration/E2E tests
  - NEW: Run migration against test database
  - NEW: Verify schema matches expected state

On PR to develop:
  - Run: All of above
  - NEW: Database schema diff review
  - NEW: Check for destructive changes

On PR to main:
  - Run: All of above
  - NEW: Verify rollback procedure exists
  - NEW: Create backup script
```

---

### 6. WHAT DATA ENGINEER NEEDS IN AGENT INSTRUCTIONS

The Data Engineer agent (`data-engineer.md`) needs explicit guidance on:

#### A. Review Responsibilities

```
When reviewing schema change PRs:
1. Is there a migration script? (REQUIRED)
2. Is it tested? (REQUIRED)
3. Is data safe? (REQUIRED)
4. Is it reversible? (REQUIRED)
5. What happens if it fails? (REQUIRED)
```

#### B. Migration Review Process

```
PR with schema.prisma changes triggers:
1. Automated: Schema diff generated
2. Manual: Data Engineer reviews
3. Automated: Migration tested on test DB
4. Manual: Approval required before merge
```

#### C. Risk Categorization

```
LOW RISK: Adding optional columns, adding indexes
MEDIUM RISK: Removing optional columns, renaming columns
HIGH RISK: Removing NOT NULL columns, changing types
CRITICAL: Deleting tables, disabling cascade rules
```

#### D. Rollback Requirements

```
ALL migrations must have:
1. Forward script (migrate up)
2. Rollback script (migrate down)
3. Verification queries
4. Backup procedure
5. Recovery time estimate
```

---

## Integration Points with Current Workflow

### Where Database Changes Should Integrate

**Line 42 (Feature Branch Naming):**
```
refactor/MP-789-database-schema  ← Already covered!
```

**Improvement Needed:** Add guidance on nested changes.

```
When a feature requires schema changes:
- Feature branch: feature/MP-123-recipe-categories
- Includes: schema.prisma changes + migration
- Marked in PR: "Database Changes: YES"
- Reviewed by: Code Reviewer + Data Engineer
```

**Line 169 (PR Dependencies):**
```
- Requires database migration  ← Vague!
```

**Improvement:**
```
- Database Changes: YES
  - Migration: add_recipe_categories
  - Requires review by: Data Engineer
  - Rollback available: YES
  - Testing status: PASSED
```

**Line 592-593 (FAQ about migrations):**
```
Q: How do I handle database migrations in PRs?
A: Include migration scripts, document in PR description, coordinate with team.
```

**Expansion needed: (See Data Engineer Workflow section below)**

---

## Risks Without These Safeguards

### Real Scenario 1: Accidental Data Loss

```
Day 1: Developer adds isActive column to Recipe model
  - Adds migration: add_is_active_to_recipes
  - Tests pass
  - Merges to develop

Day 3: Similar feature in different branch
  - Changes same column
  - Merge conflict in migration
  - Manual merge creates invalid SQL

Day 5: Deploy to production
  - Migration fails on actual data
  - Rollback attempted
  - Data from Day 1-5 is lost

Result: Customer data permanently gone
Impact: "Why did my recipes disappear?"
```

### Real Scenario 2: Cascading Delete Horror

```
Current schema uses CASCADE everywhere.

Developer wants to add soft delete for audit trail:
  - PR removes CASCADE from User → Recipe
  - Code review: "Looks good!"
  - Data Engineer review: MISSING!

Merge succeeds. Deploy succeeds.

User deletes account → Recipes NOT deleted → ORPHANED
  - UI breaks trying to show deleted user's recipes
  - Cascade was protecting data consistency
  - Now we have referential integrity violation

Result: Production bug in core feature
```

### Real Scenario 3: Schema Drift

```
Developer makes migration on machine A
  - Works with their local SQLite

Another developer merges unrelated change
  - Now there are 2 unapplied migrations

Deploy happens with migration A applied
  - But machine B's migration still pending
  - Next person deploys and gets errors

Result: Deployment failures, team blocked
```

---

## Recommendations Summary

### IMMEDIATE (Add to Workflow)

1. **Add Database Change Review Checklist** to PR template
2. **Add Data Engineer approval** requirement for schema.prisma changes
3. **Add migration testing** to CI/CD pipeline
4. **Define migration naming convention**
5. **Create rollback procedure** template

### SHORT-TERM (Create New Docs)

1. **DATA_MIGRATION_GUIDE.md** - How to write safe migrations
2. **SCHEMA_REVIEW_CHECKLIST.md** - What to check in PRs
3. **DISASTER_RECOVERY.md** - Backup and restore procedures
4. **DATA_SAFETY_GATES.md** - Protection mechanisms

### LONG-TERM (Infrastructure)

1. **Automated migration testing** in CI/CD
2. **Database backup automation** before deploys
3. **Migration validation scripts** before production
4. **Audit logging** for all schema changes
5. **Data consistency checks** post-migration

---

## What The Data Engineer Agent Needs to Do

When instructed as the Data Engineer agent, focus on:

### 1. Review PRs with Schema Changes
```
Checklist:
- Is migration necessary?
- Is migration reversible?
- Does migration preserve data?
- Are constraints satisfied?
- Is performance acceptable?
- Does team need notification?
```

### 2. Validate Before Deployment
```
Gate:
- Backup exists?
- Migration tested?
- Rollback ready?
- Team notified?
- Proceed or block?
```

### 3. Create Safeguards
```
Docs:
- Schema change tracking
- Migration templates
- Rollback procedures
- Safety checklists
```

---

## Quick Reference: What's Missing

| Aspect | Current Workflow | Need to Add |
|---|---|---|
| **Migration strategy** | None | Defined process |
| **Schema review** | None | Explicit checklist |
| **Data safety gates** | None | Multi-stage approvals |
| **Migration naming** | None | Convention standard |
| **Migration testing** | None | CI/CD validation |
| **Rollback procedure** | None | Step-by-step guide |
| **Data Engineer role** | Implied | Explicit responsibility |
| **Risk categorization** | None | Change type matrix |
| **Audit logging** | None | Migration tracking |
| **Disaster recovery** | None | Backup/restore guide |

---

## Conclusion

The current GitHub workflow is **excellent for code management** but **inadequate for database management**. Adding data safety gates transforms it from "we hope migrations work" to "we know migrations are safe."

Key insight: **Database changes are not code changes.** They require different review, testing, and approval processes to prevent data loss.

The Data Engineer agent must be positioned to **stop unsafe migrations before they reach production**.
