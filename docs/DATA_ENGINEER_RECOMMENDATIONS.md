# Data Engineer Recommendations: Protecting the Meal Planner Database

**Date:** November 25, 2025
**From:** Data Engineering Analysis
**Status:** Ready for implementation
**Priority:** HIGH (prevents data disasters)

---

## TL;DR

The GitHub workflow is missing database safety safeguards. This document provides:

1. What's wrong (9 critical gaps)
2. How to fix it (4 documents created)
3. What the team needs (10 implementation steps)
4. How to prevent disasters (data safety framework)

**Time to implement:** 2-4 weeks
**Effort:** Low (mostly documentation, minimal code changes)
**Impact:** Prevents permanent data loss

---

## The Problem in One Picture

```
Current Process:
  Developer → Code Review → Merge → Deploy

  What could go wrong with the database?
  ✅ Code gets reviewed
  ❌ Schema changes don't get special review
  ❌ Migrations aren't tested
  ❌ Cascade delete isn't questioned
  ❌ No rollback plan
  ❌ No backup verification

Result: Silent data loss possible.
```

---

## 9 Critical Gaps in Current Workflow

### Gap 1: No Schema Change Review

**Current:** PR mentions "Requires database migration" (1 sentence, line 593)

**Missing:** How to review schema safety

**Impact:** Risky schema changes could merge without data safety check

**Fix:** Add Data Engineer approval requirement to PR checklist

---

### Gap 2: No Migration Testing

**Current:** PR tests code, linting, builds

**Missing:** Tests that migration actually works

**Impact:** Migration might fail in production

**Fix:** Add `npx prisma migrate dev` step to local testing checklist

---

### Gap 3: No Rollback Procedure

**Current:** Code has `git revert`, databases don't

**Missing:** How to recover from bad migration

**Impact:** Failed migration with no recovery plan = data loss

**Fix:** Require rollback testing before merge approval

---

### Gap 4: No Cascade Delete Documentation

**Current:** Schema uses `onDelete: Cascade` throughout (no commentary)

**Missing:** Recognition that Cascade = permanent data loss

**Impact:** User deletes account → all their data gone → no recovery

**Fix:** Add Data Engineer review of cascade rules

---

### Gap 5: No Migration Naming Convention

**Current:** Migrations get auto-named with timestamps only

**Missing:** Descriptive naming to track what changed

**Impact:** Can't track which migration caused a problem

**Fix:** Implement naming standard: `YYYYMMDD_HHMMSS_descriptive_name`

---

### Gap 6: No Risk Categorization

**Current:** All schema changes treated equally

**Missing:** Risk assessment (adding column = low risk, deleting table = critical)

**Impact:** Critical changes get quick review, get missed

**Fix:** Implement 4-tier risk matrix (LOW/MEDIUM/HIGH/CRITICAL)

---

### Gap 7: No Backup Gate

**Current:** PR process doesn't mention backups

**Missing:** Verification that backup exists before production deploy

**Impact:** If migration fails, no way to recover

**Fix:** Add "Backup verified" step to deploy checklist

---

### Gap 8: No Data Impact Documentation

**Current:** PR template doesn't have section for data changes

**Missing:** Required description of what data will change

**Impact:** Reviewers don't understand data safety implications

**Fix:** Add "Database Changes" section to PR template

---

### Gap 9: No Approval Gate for Critical Changes

**Current:** Any developer can merge schema change

**Missing:** Requirement for Data Engineer approval on risky changes

**Impact:** High-risk change merged without expert review

**Fix:** Add approval requirement for MEDIUM/HIGH/CRITICAL changes

---

## What I Created for You

### 1. Data Engineer Agent Instructions
**File:** `/home/mike/meal-planner/.claude/agents/data-engineer.md`

Comprehensive role definition including:
- Core responsibilities
- PR review checklists
- Risk classification matrix
- Migration review checklist
- Red flags for blocking merges
- Communication guidelines

### 2. GitHub Workflow Data Engineering Analysis
**File:** `/home/mike/meal-planner/docs/DATA_ENGINEER_GITHUB_PERSPECTIVE.md`

Detailed analysis including:
- What's missing from the workflow
- Integration points with existing process
- Real-world disaster scenarios
- Recommendations for each gap
- Implementation checklist

### 3. GitHub Workflow Integration Guide
**File:** `/home/mike/meal-planner/docs/GITHUB_WORKFLOW_DATA_ENGINEERING_GUIDE.md`

Actionable guide including:
- Minimal changes needed to workflow
- Updated PR template sections
- Updated review checklist items
- Risk matrix (when each approval is needed)
- Implementation timeline

### 4. Database Migration Guide
**File:** `/home/mike/meal-planner/docs/DATABASE_MIGRATION_GUIDE.md`

Step-by-step guide including:
- Quick start (2 minutes)
- Full process (10 minutes)
- Common migration patterns
- Disaster recovery scenarios
- Pre-merge checklist

---

## Current Schema: Data Loss Risks

Your current schema at `/home/mike/meal-planner/backend/prisma/schema.prisma` has these data loss risks:

### Risk 1: Cascade Delete Chain

```prisma
// When User is deleted, cascades to:
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
```

**Impact:** Deleting a user cascades to delete:
- All their Recipes
- All RecipeRatings
- All MealPlans
- All IngredientCustomizations
- All ShoppingListItems

**Severity:** CRITICAL (permanent data loss, no audit trail)

**Recommendation:** Soft delete or audit logging

### Risk 2: No Audit Trail

```prisma
// No tracking of deletions
// No `deletedAt` fields for recovery
// No audit log table for debugging
```

**Impact:** If data is deleted, it's gone forever

**Severity:** HIGH (no recovery mechanism)

**Recommendation:** Add `deletedAt DateTime?` to key models

### Risk 3: Missing Constraints

```prisma
// Some relationships missing onDelete strategy
recipe Recipe @relation(fields: [recipeId], references: [id])
// Should this be Cascade? SetNull? Required?
```

**Impact:** Unclear what happens if recipe deleted

**Severity:** MEDIUM (data integrity risk)

**Recommendation:** Explicitly define all cascade rules

---

## Implementation Timeline

### Phase 1: Documentation (Week 1)

**Tasks:**
- [ ] Review all 4 created documents
- [ ] Update GITHUB_WORKFLOW.md with data sections
- [ ] Add migration guide link to workflow
- [ ] Update PR template with Database Changes section

**Deliverables:**
- Updated GITHUB_WORKFLOW.md
- Team notified of changes

**Time:** 4-6 hours

---

### Phase 2: Team Training (Week 2)

**Tasks:**
- [ ] Present analysis to development team
- [ ] Walk through migration process
- [ ] Discuss risk categories
- [ ] Review disaster scenarios
- [ ] Answer questions

**Deliverables:**
- Team trained on process
- Questions documented
- Team agreement on approach

**Time:** 2-3 hours

---

### Phase 3: Tool Integration (Week 3-4)

**Tasks:**
- [ ] Set up migration testing in CI/CD
- [ ] Create test database for validation
- [ ] Add schema validation step
- [ ] Setup backup verification
- [ ] Document deploy checklist

**Deliverables:**
- CI/CD validates migrations before merge
- Backup verification before deploy
- Automated schema change detection

**Time:** 8-12 hours

---

### Phase 4: Ongoing Practice (Continuous)

**Tasks:**
- [ ] Review all schema change PRs as Data Engineer
- [ ] Provide feedback on migration risk assessment
- [ ] Document lessons learned
- [ ] Update guides based on real experience

**Deliverables:**
- No data loss in production
- Team confidence in migration process
- Continuous improvement

---

## Quick Implementation Steps

### Step 1: Update GITHUB_WORKFLOW.md

Add three sections:

**1A. PR Template Addition (After line 147)**
```markdown
## Database Changes
- [ ] No database changes
- [ ] Schema changes included
  - Migration tested locally: YES/NO
  - Rollback documented: YES/NO
  - Risk Level: LOW / MEDIUM / HIGH / CRITICAL
```

**1B. Code Review Addition (After line 215)**
```markdown
**For PRs with Database Changes:**
- [ ] Migration script present
- [ ] Migration tested on local database
- [ ] Migration handles existing data correctly
- [ ] Rollback procedure documented
- [ ] No cascading deletes without justification
```

**1C. FAQ Update (Lines 592-593)**
```
Q: How do I handle database migrations in PRs?
A: See DATABASE_MIGRATION_GUIDE.md. Summary:
   1. Generate: npx prisma migrate dev --name description
   2. Test: Verify migration works and can rollback
   3. Document: Add "Database Changes" section to PR
   4. Request review: Tag data engineer
   5. Approve: Code review + data engineer approval
```

---

### Step 2: Create Migration Testing in CI/CD

Add to GitHub Actions workflow:

```yaml
- name: Test database migration
  if: contains(github.event.pull_request.title, '[DB]')
  run: |
    cd backend
    cp prisma/dev.db prisma/dev.db.backup
    npx prisma migrate dev --skip-generate
    npx prisma migrate resolve --rolled-back $(git show --name-only | grep migrations)
    cp prisma/dev.db.backup prisma/dev.db
```

---

### Step 3: Document Approval Requirements

Create APPROVAL_MATRIX.md:

```markdown
## Schema Change Approval Matrix

### LOW RISK
Examples: Adding optional field, adding index
Approvals needed: Code reviewer only
Timeline: Can merge within 24 hours

### MEDIUM RISK
Examples: Removing optional field, changing default
Approvals needed: Code reviewer + Data Engineer
Timeline: Can merge within 48 hours

### HIGH RISK
Examples: Removing NOT NULL, changing type
Approvals needed: Code reviewer + Data Engineer
Timeline: Can merge within 72 hours
Requirements: Production-like testing

### CRITICAL RISK
Examples: Deleting table, disabling cascade delete
Approvals needed: Code reviewer + Data Engineer + Tech Lead
Timeline: Scheduled deployment window
Requirements: Backup + recovery testing
```

---

### Step 4: Create Disaster Recovery Plan

Create DISASTER_RECOVERY.md with:
- How to detect failed migration
- How to rollback
- How to restore from backup
- How to communicate incident
- Post-incident review process

---

## Risk: What Could Go Wrong If We Don't Do This

### Risk 1: Data Loss via Accidental Migration

```
Probability: Medium
Impact: Critical (permanent loss of user data)
Example: Developer deletes "deprecated" column that's actually used
Recovery: Possible if backup exists, difficult otherwise
Prevention: Data Engineer review before merge
```

### Risk 2: Cascade Delete Surprises

```
Probability: High
Impact: Critical (silent user data loss)
Example: User deletes account, all their recipes disappear
Recovery: Possible only with soft delete or audit trail
Prevention: Explicit cascade review
```

### Risk 3: Production Migration Failure

```
Probability: Medium
Impact: High (partial data inconsistency, service outage)
Example: Migration works locally but fails on production data
Recovery: Rollback or manual data repair
Prevention: Test on production-like data before deploy
```

### Risk 4: Breaking Change Without Coordination

```
Probability: High
Impact: High (API errors, confused clients)
Example: Schema changes column name, code not updated
Recovery: Hotfix and redeploy
Prevention: Code review validates code changes match schema
```

---

## Success Metrics

You'll know this is working when:

- **Metric 1: Zero data loss incidents** in production
- **Metric 2: All migrations rollback successfully** on first test
- **Metric 3: PRs with schema changes have documented risk** in PR description
- **Metric 4: Data Engineer reviews all schema change PRs** (tracked in comments)
- **Metric 5: Team asks Data Engineer before major changes** (before creating PR)
- **Metric 6: Rollback procedures exist for all MEDIUM+ risk migrations**
- **Metric 7: Cascade delete rules are intentional and documented**
- **Metric 8: Migration failures caught in testing, not production**

---

## Questions for Project Coordinator

Before implementing, clarify:

1. **Who is the Data Engineer?**
   - Is this an agent role (me)?
   - Or a team member role?
   - How do they get notified of schema change PRs?

2. **Backup Strategy**
   - How often are databases backed up?
   - Where are backups stored?
   - How quickly can we restore?
   - Are backups tested?

3. **Deployment Authority**
   - Who can approve merges to main?
   - Who can approve risky migrations?
   - Is Tech Lead approval needed for critical changes?

4. **CI/CD Capability**
   - Can we add migration testing steps?
   - Is there a test database environment?
   - Can we run backup verification?

5. **Communication**
   - How does team get notified of database changes?
   - Is there a #database Slack channel?
   - Should major migrations have deployment window?

6. **Audit Requirements**
   - Do we need to log all schema changes?
   - Do we need to track who made changes?
   - Are there compliance/audit requirements?

---

## Reference Documents

All created documents available at:

1. **Data Engineer Instructions** (Agent Role)
   - Location: `/home/mike/meal-planner/.claude/agents/data-engineer.md`
   - Purpose: Define how Data Engineer reviews schema changes

2. **GitHub Workflow Analysis** (Strategic)
   - Location: `/home/mike/meal-planner/docs/DATA_ENGINEER_GITHUB_PERSPECTIVE.md`
   - Purpose: Detailed analysis of gaps and risks

3. **GitHub Workflow Integration** (Tactical)
   - Location: `/home/mike/meal-planner/docs/GITHUB_WORKFLOW_DATA_ENGINEERING_GUIDE.md`
   - Purpose: How to implement changes to existing workflow

4. **Migration Guide** (Operational)
   - Location: `/home/mike/meal-planner/docs/DATABASE_MIGRATION_GUIDE.md`
   - Purpose: Step-by-step guide for developers

5. **This Document** (Recommendations)
   - Location: `/home/mike/meal-planner/docs/DATA_ENGINEER_RECOMMENDATIONS.md`
   - Purpose: Summary and implementation roadmap

---

## Next Steps

1. **This Week**
   - Read all 5 documents
   - Meet with team to discuss
   - Answer outstanding questions
   - Get approval to proceed

2. **Next Week**
   - Update GITHUB_WORKFLOW.md
   - Train development team
   - Set up CI/CD changes
   - Create approval matrix

3. **Following Week**
   - Review first few migration PRs as Data Engineer
   - Gather feedback
   - Refine process
   - Document lessons learned

4. **Ongoing**
   - Be the guardian of data safety
   - Stop risky migrations before they happen
   - Help team understand database safety
   - Build confidence in migration process

---

## Final Thoughts

The goal is not to slow down development. The goal is to prevent data disasters.

With these safeguards:
- Developers have confidence their migrations are safe
- Team knows who's responsible for database safety
- Risky changes get expert review before they cause damage
- Rollback procedures exist and are tested
- Data loss can be prevented, not just recovered from

**A good data engineer is invisible. Until the day a bad migration could have deleted all customer data - and doesn't.**

---

## Approval Signatures

**Data Engineer Analysis:** Prepared and ready for implementation

**Recommended Implementation Priority:** HIGH

**Risk of Inaction:** CRITICAL (data loss possible)

**Effort Required:** LOW (2-4 weeks, mostly documentation)

**ROI:** INFINITE (prevents even one data loss incident)
