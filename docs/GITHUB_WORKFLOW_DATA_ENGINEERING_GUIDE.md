# GitHub Workflow: Data Engineering Perspective

**Date:** November 25, 2025
**For:** Project Coordinator & Development Team
**From:** Data Engineering Analysis

---

## Executive Summary

The GitHub workflow (`GITHUB_WORKFLOW.md`) is **excellent for code management** but **inadequate for database management**.

Current state: One sentence about migrations (line 593).
Needed: A complete data safety framework.

**Key Risk:** Database changes follow different rules than code changes. A bad code commit can be reverted. A bad migration can permanently delete customer data.

**Solution:** Add data safety gates to the existing workflow to prevent data disasters.

---

## What's Missing from the Workflow

### 1. Schema Change Review Process

**Current mention:** Line 169 - "Requires database migration" (vague)

**Problem:** No explicit review criteria for schema changes. Code reviewers focus on code, not data safety.

**What's Needed:**
- Explicit schema review checklist
- Data Engineer approval requirement
- Risk categorization (low/medium/high/critical)
- Testing requirements for migrations

### 2. Migration Testing Requirements

**Current mention:** None

**Problem:** PRs test code and linting, but don't test migrations. Migrations might fail in production.

**What's Needed:**
- Migration validation in CI/CD
- Test database for migration verification
- Rollback testing before merge
- Data integrity verification post-migration

### 3. Rollback Procedures

**Current mention:** None (code only mentions `git revert`)

**Problem:** If a migration fails, there's no documented recovery procedure.

**What's Needed:**
- Migration rollback strategy for each PR
- Backup procedures before deployments
- Recovery time estimates
- Tested rollback scripts

### 4. Data Safety Gates

**Current mention:** None

**Problem:** Any developer can merge a schema change that causes data loss.

**What's Needed:**
- Blocking approval process for destructive changes
- Backup verification before merge
- Tech Lead approval for critical changes
- Communication plan for risky migrations

### 5. Migration Naming Convention

**Current mention:** None

**Problem:** Migrations have auto-generated names. No way to track what changed or when.

**What's Needed:**
- Timestamp + descriptive naming standard
- PR documentation linking code to migrations
- Changelog tracking schema versions

### 6. Cascading Delete Documentation

**Current mention:** None (critical oversight)

**Problem:** The schema uses `onDelete: Cascade` everywhere. Silent data loss risk.

**What's Needed:**
- Explicit review of cascade rules
- Audit trail design
- Recovery mechanism for deleted data
- Soft delete alternatives

---

## Integration with Current Workflow

### Minimal Changes Required

These changes require NO new branches or processes. Just enhanced checklists and approval requirements.

#### 1. Update PR Template (Lines 143-147)

**Current:**
```markdown
## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactoring
```

**Add:**
```markdown
## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactoring
- [ ] Database schema change  <-- NEW
```

#### 2. Add Database Changes Section (After Line 169)

**Current:**
```markdown
## Dependencies
- None
OR
- Requires PR #XX to be merged first
- Requires database migration
```

**Enhance:**
```markdown
## Dependencies
- None
OR
- Requires PR #XX to be merged first
- Requires database migration

## Database Changes
- [ ] No database changes
- [ ] Schema changes included
  - Migration tested locally: YES/NO
  - Rollback procedure documented: YES/NO
  - Data impact: [describe]
  - Risk level: LOW / MEDIUM / HIGH / CRITICAL
```

#### 3. Update Code Review Checklist (Lines 209-225)

**Add to "What to Look For":**

```markdown
**For PRs with Database Changes:**
- [ ] Migration script is present
- [ ] Migration has been tested on local database
- [ ] Migration handles existing data correctly
- [ ] Rollback procedure is documented
- [ ] Data safety risks are addressed
- [ ] No cascading deletes without justification
- [ ] Breaking changes are documented
```

#### 4. Add Data Engineer Review Requirement (Before Line 265)

**Current merge requirements:**
```
1. All tests pass (CI/CD green)
2. At least 1 approval from reviewer
3. All conversations resolved
4. Branch is up to date with target branch
```

**Add:**
```
For PRs with schema changes:
5. Data Engineer approval required (separate from code review)
6. Migration validation passed in CI/CD
```

#### 5. Update FAQ (Lines 592-593)

**Current:**
```
Q: How do I handle database migrations in PRs?
A: Include migration scripts, document in PR description, coordinate with team.
```

**Expand:**
```
Q: How do I handle database migrations in PRs?
A: See MIGRATION_GUIDE.md for complete instructions. Summary:
   1. Generate migration: npx prisma migrate dev --name description
   2. Document in PR: Add "## Database Changes" section with risk level
   3. Test locally: Verify migration runs and can be rolled back
   4. Request Data Engineer review: Tag @data-engineer
   5. Merge only after: Data Engineer approval + CI/CD passes

Q: What if my migration is high-risk?
A: Notify Tech Lead before starting. Create migration rollback test.
   Provide detailed data impact analysis. Schedule deployment carefully.

Q: What if I accidentally committed to main?
A: Create urgent issue. For code: revert immediately.
   For schema: check if migration was applied. If yes: notify team,
   prepare rollback, test recovery on backup.

Q: How do I test migrations locally?
A: Create with: npx prisma migrate dev --name feature_name
   Test with real data: cp dev.db dev.db.backup && prisma migrate reset
   Test rollback: npx prisma migrate resolve [name] --rolled-back
```

---

## New Documents to Create

### 1. DATABASE_MIGRATION_GUIDE.md

**Location:** `/home/mike/meal-planner/docs/`

**Contents:**
- How to create a migration
- How to test a migration
- How to document a migration in PR
- Rollback procedures
- Data safety checklist
- Common mistakes and prevention

### 2. MIGRATION_REVIEW_CHECKLIST.md

**Location:** `/home/mike/meal-planner/docs/`

**Contents:**
- Safety checks (backup, forward, backward)
- Correctness checks (SQL, indexes, types)
- Compatibility checks (code, queries, tests)
- Documentation checks
- Risk assessment matrix

### 3. SCHEMA_CHANGE_FAQ.md

**Location:** `/home/mike/meal-planner/docs/`

**Contents:**
- Common schema changes and how to handle them
- Dangerous patterns to avoid
- Best practices for data migrations
- Recovery procedures

### 4. DISASTER_RECOVERY_PLAN.md

**Location:** `/home/mike/meal-planner/docs/`

**Contents:**
- Backup procedures
- Restore procedures
- How to recover from failed migration
- Data loss recovery (if possible)
- Incident communication plan

---

## Risk Matrix: What Requires What

| Change Type | Risk Level | Review Time | Approval | Test | Rollback | Communication |
|---|---|---|---|---|---|---|
| Add optional column | LOW | 5 min | Code review only | Local | Auto | None |
| Remove optional column | MEDIUM | 15 min | Code + Data Eng | Local + Test DB | Auto | Changelog |
| Add NOT NULL column | MEDIUM | 15 min | Code + Data Eng | Test DB | Auto | Documentation |
| Change column type | HIGH | 30 min | Code + Data Eng | Test DB + Data test | Manual | Tech Lead notified |
| Remove cascade delete | HIGH | 30 min | Code + Data Eng | Test DB + Migration rollback | Manual | Discuss with team |
| Delete table | CRITICAL | 60+ min | Code + Data + Tech Lead | Production-like | Manual + Backup | Full team notified |
| Delete column | CRITICAL | 60+ min | Code + Data + Tech Lead | Production-like | Manual + Backup | Full team notified |

---

## Data Engineer's Role in GitHub Workflow

### When Activated

1. **PR created with schema.prisma changes** → Auto-review needed
2. **PR marked "Database Changes: YES"** → Detailed analysis
3. **Destructive change detected** → Blocking review
4. **Feature requires new table** → Design input

### What They Do

1. **Review**: Check migration safety and data integrity
2. **Test**: Validate migration works on test database
3. **Approve/Block**: Gate to prevent data loss
4. **Document**: Create migration rollback plan

### Approval Criteria

**APPROVE when:**
- Migration script present and tested
- Data safety checks pass
- Rollback procedure documented
- No data loss risk

**REQUEST CHANGES when:**
- Migration script missing
- Unsafe cascade delete
- No rollback plan
- Data loss risk

**BLOCK when:**
- Critical data loss risk
- Unsafe cascade delete
- Breaking change without coordination
- Migration fails on test DB
- No backup plan

---

## Implementation Checklist

### Week 1: Update Workflow

- [ ] Update GITHUB_WORKFLOW.md with data sections
- [ ] Add database questions to PR template
- [ ] Expand FAQ with migration guidance
- [ ] Update merge requirements for schema changes
- [ ] Create MIGRATION_REVIEW_CHECKLIST.md
- [ ] Update .claude/agents/data-engineer.md (complete)

### Week 2: Documentation

- [ ] Create DATABASE_MIGRATION_GUIDE.md
- [ ] Create SCHEMA_CHANGE_FAQ.md
- [ ] Create DISASTER_RECOVERY_PLAN.md
- [ ] Create data engineer onboarding guide
- [ ] Add migration examples to documentation

### Week 3: Team Training

- [ ] Present to development team
- [ ] Walk through migration process
- [ ] Discuss risk categories
- [ ] Practice review scenarios
- [ ] Establish communication protocols

### Week 4: CI/CD Integration

- [ ] Add migration testing to GitHub Actions
- [ ] Create test database setup
- [ ] Add schema validation to CI/CD
- [ ] Setup backup verification
- [ ] Create deployment checklist

---

## Critical Risks Being Addressed

### Risk 1: Accidental Data Loss via Cascade Delete

**Scenario:**
```
Developer removes onDelete: Cascade from User → Recipe
Reviewer focuses on code, misses data impact
Migration merges
Deploy happens
Queries break because recipes still exist without users
```

**Prevention:**
- Data Engineer explicitly reviews cascade rules
- Test migration with real data scenarios
- Document data impact for team awareness

### Risk 2: Migration Failure in Production

**Scenario:**
```
Migration works locally but fails on production data
Schema change partially applied
Database in inconsistent state
No rollback procedure prepared
Data corruption
```

**Prevention:**
- Migration tested on production-like data before merge
- Rollback script prepared and tested
- Backup taken before deployment
- Monitoring in place post-migration

### Risk 3: Schema Conflicts with Multiple Developers

**Scenario:**
```
Developer A: Adds column X
Developer B: Adds column X (same name, different branch)
Merge A first
Merge B later
Migration conflict
Two columns with same name or duplicate definition
```

**Prevention:**
- PR requires migration naming with timestamps
- CI/CD validates no duplicate migrations
- Team coordinates on major schema changes

### Risk 4: Breaking Change Without Coordination

**Scenario:**
```
Schema changes column name
Code doesn't update queries
Deploy happens
API errors start
```

**Prevention:**
- Data Engineer requires code review to validate queries updated
- PR template requires "Database Changes" section
- Migration documented with breaking change flag

---

## How This Protects the Team

| Concern | Without Gates | With Gates |
|---|---|---|
| **Data Loss** | Possible via cascade delete | Prevented by explicit review |
| **Migration Failure** | Fails in production | Caught before merge |
| **Rollback** | Manual, untested | Prepared and validated |
| **Communication** | Ad hoc | Structured via checklist |
| **Testing** | Code only | Code + migration validated |
| **Responsibility** | Unclear | Data Engineer owns gate |
| **Recovery** | Unknown | Documented procedure |

---

## Next Steps

1. **Today**: Review this analysis
2. **This Week**: Update GITHUB_WORKFLOW.md with enhancements
3. **Next Week**: Create supporting documentation
4. **Two Weeks**: Present to team and train
5. **One Month**: Full CI/CD integration

The goal: **Make it impossible to accidentally lose data through a bad migration.**

---

## Questions to Resolve

1. **Backup Strategy**: How are production databases backed up? Frequency? Recovery time?
2. **Staging DB**: Is there a staging environment that's a copy of production?
3. **Deployment Window**: Can migrations be deployed separately from code?
4. **Approval Authority**: Who has final say on blocking a risky migration? (Data Engineer? Tech Lead? Both?)
5. **Communication**: How does team get notified of major schema changes?
6. **Audit Trail**: Should we log all schema changes? All data modifications?

---

## Reference Documents

- **Current Workflow:** `/home/mike/meal-planner/GITHUB_WORKFLOW.md`
- **Data Engineer Analysis:** `/home/mike/meal-planner/docs/DATA_ENGINEER_GITHUB_PERSPECTIVE.md`
- **Data Engineer Instructions:** `/home/mike/meal-planner/.claude/agents/data-engineer.md`
- **Current Schema:** `/home/mike/meal-planner/backend/prisma/schema.prisma`

---

## Remember

**Database changes are not code changes.**

A bad code commit can be reverted with git.
A bad migration can permanently delete user data.

These safeguards exist to give developers confidence that their database changes are safe. They're not bureaucracy - they're protection.
