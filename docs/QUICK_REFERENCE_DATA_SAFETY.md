# Quick Reference: Database Safety in GitHub Workflow

**Keep this page open while reviewing schema change PRs.**

---

## PR Review Checklist (60 seconds)

Does this PR have schema.prisma changes?

```
YES → Answer these 4 questions:

1. MIGRATION PRESENT?
   [ ] Migration script exists in prisma/migrations/
   [ ] Does it match the schema change?
   [ ] Can it be rolled back?

   If NO to any: REQUEST CHANGES

2. DATA SAFE?
   [ ] Existing records preserved?
   [ ] Foreign keys satisfied?
   [ ] Cascading deletes intentional?

   If NO to any: REQUEST CHANGES

3. RISK LEVEL?
   [ ] LOW (add optional field) → 5 min review
   [ ] MEDIUM (remove optional field) → 15 min review
   [ ] HIGH (change type, remove NOT NULL) → 30 min review
   [ ] CRITICAL (delete table, disable cascade) → BLOCK until approved by Tech Lead

4. DOCUMENTED?
   [ ] PR has "Database Changes" section?
   [ ] Risk level stated?
   [ ] Data impact explained?
   [ ] Rollback documented?

   If NO to any: REQUEST CHANGES

NO → Standard code review (no special data checks)
```

---

## Approval Matrix (Quick Decision)

| Risk Level | Review Time | Approval Needed | Can Merge? |
|---|---|---|---|
| LOW | 5 min | Code reviewer | YES |
| MEDIUM | 15 min | Code + Data Engineer | YES |
| HIGH | 30 min | Code + Data Engineer + testing | YES |
| CRITICAL | 60+ min | Code + Data + Tech Lead + backup | NO (discuss first) |

---

## Risk Level Examples

### LOW RISK (Quick Approve)
```prisma
+ tags String?  // Adding optional field
+ @@index([created])  // Adding index
```
Approval: Code review only

### MEDIUM RISK (Detailed Review)
```prisma
- deprecatedField String?  // Removing optional field
```
Approval: Code + Data Engineer

### HIGH RISK (Thorough Review)
```prisma
userId Int?
- user User @relation(..., onDelete: Cascade)
+ user User @relation(...)  // Removing cascade delete
```
Approval: Code + Data Engineer + testing

### CRITICAL RISK (Block & Escalate)
```prisma
- model Archive { ... }  // Deleting table
- userId Int  // Deleting column
```
Approval: STOP - Need Tech Lead + backup + recovery plan

---

## Red Flags (BLOCK Immediately)

| Flag | What to Do |
|---|---|
| No migration script for schema change | REQUEST CHANGES |
| Cascade delete being added without explanation | REQUEST CHANGES |
| Destructive change with no backup plan | REQUEST CHANGES |
| Migration not tested locally | REQUEST CHANGES |
| No rollback procedure documented | REQUEST CHANGES |
| Type change with no data mapping | BLOCK |
| Critical change without Tech Lead notice | BLOCK |
| Failed migration in previous PR | BLOCK + ROOT CAUSE |

---

## Comment Templates

### For Low-Risk Approvals
```
Approved! This is a safe additive change with no data loss risk.
Migration tested locally, backward compatible. ✓
```

### For Requesting Changes
```
Data Engineer Review: This migration needs one more thing...

[ Issue 1 ]
- What's wrong
- How to fix it
- Why it matters

[ Issue 2 ]
...

Please address these and re-request review.
```

### For Blocking a Merge
```
BLOCKING: Data Safety Issue

Risk Level: CRITICAL

Issue: [ Specific problem ]

Why this matters: [ Impact ]

How to fix: [ Solution options ]

This cannot merge until:
1. [ Requirement 1 ]
2. [ Requirement 2 ]

Let me know if you have questions.
```

---

## Migration Checklist (Copy-Paste)

```markdown
## Database Migration Checklist

- [ ] Migration script present and tested
- [ ] Migration has been tested locally with rollback
- [ ] All existing data is preserved
- [ ] Foreign key constraints satisfied
- [ ] No cascading deletes without justification
- [ ] Code changes match schema changes
- [ ] Queries updated for new/removed fields
- [ ] Tests pass with new schema
- [ ] Risk level assessed (LOW/MEDIUM/HIGH/CRITICAL)
- [ ] Data impact documented in PR
- [ ] Breaking changes noted (if any)
- [ ] Rollback procedure described
```

---

## Common Decisions (Fast Path)

**Question: Should I approve?**

```
Does PR have schema changes?

NO → Standard code review. Approve if code is good.

YES → Does it have a migration script?

  NO → REQUEST CHANGES: Need migration script

  YES → Is migration tested?

    NO → REQUEST CHANGES: Test locally first

    YES → What's the risk level?

      LOW (optional field) → APPROVE
      MEDIUM (remove optional) → Check for 3 things, then APPROVE
      HIGH (type change) → Need production-like testing. APPROVE after review.
      CRITICAL (delete table) → BLOCK. Need Tech Lead + backup plan.
```

---

## Questions to Ask Developer

### For All Schema Changes
1. "Is there a migration script?"
2. "Was it tested locally?"
3. "Can it be rolled back?"

### For Risky Changes
1. "Why is this change necessary?"
2. "How does existing data handle this?"
3. "What if this fails in production?"
4. "How will we recover?"

### For Cascade Delete Changes
1. "Is this cascade delete intentional?"
2. "What data will be deleted?"
3. "Is there a way to recover?"
4. "Could this be accidental?"

---

## After Merge

**Your responsibility doesn't end at approval!**

- Keep Migration Guide handy during implementation review
- Check that migration works on staging/production
- Verify rollback procedure was tested
- Monitor for post-deployment issues
- Document any problems for future reference

---

## When to Get Help

| Situation | Who to Ask |
|---|---|
| Unsure about risk level | Tech Lead |
| Complex migration | Data Engineer (agent) |
| Need to block a merge | Tech Lead for final decision |
| Code questions | Code reviewer |
| Schema design questions | Data Architect |

---

## Key Principles

1. **Database changes ≠ Code changes**
   - Code: Can revert with git
   - Database: Can cause permanent data loss

2. **Test before merge, not after**
   - Migration must be tested locally
   - Rollback must be tested locally
   - Everything verified before production

3. **Documentation is protection**
   - Document why change was needed
   - Document what data changes
   - Document how to recover if wrong

4. **Be conservative with data**
   - Err on the side of caution
   - Ask questions first
   - Better slow than sorry

5. **No silent data loss**
   - Every cascade delete is intentional
   - Every data migration is verified
   - Every failure has recovery plan

---

## Reference

**Full Guides:**
- DATABASE_MIGRATION_GUIDE.md (for developers)
- .claude/agents/data-engineer.md (for reviewers)
- DATA_ENGINEER_RECOMMENDATIONS.md (for coordinators)

**Key Files:**
- Current schema: `/home/mike/meal-planner/backend/prisma/schema.prisma`
- Migrations: `/home/mike/meal-planner/backend/prisma/migrations/`

**Remember:** Your job is preventing data loss. Everything else is secondary.
