# Data Engineering & GitHub Workflow: Complete Reference

**Created:** November 25, 2025
**Purpose:** Central index for all data engineering documents focused on GitHub workflow safety

---

## Quick Navigation

### For Immediate Action
1. **Coordinator:** Start with [DATA_ENGINEER_RECOMMENDATIONS.md](#recommendations)
2. **Developers:** Start with [DATABASE_MIGRATION_GUIDE.md](#migration-guide)
3. **Tech Lead:** Start with [DATA_ENGINEER_GITHUB_PERSPECTIVE.md](#perspective)
4. **Data Engineer Agent:** Start with [.claude/agents/data-engineer.md](#agent)

### By Document Type

| Document | Length | Audience | Purpose |
|---|---|---|---|
| [Recommendations](#recommendations) | 20 min | Coordinator, Leadership | Implementation roadmap and business case |
| [GitHub Perspective](#perspective) | 25 min | Tech Lead, Architect | Deep analysis of workflow gaps |
| [Migration Guide](#migration-guide) | 30 min | Developers | How-to guide for safe migrations |
| [GitHub Integration Guide](#integration) | 20 min | Coordinator, Tech Lead | Specific changes to make to workflow |
| [Data Engineer Instructions](#agent) | 15 min | AI Agent, Team Lead | Agent role definition and approval criteria |

---

## Document Details

### DATA_ENGINEER_RECOMMENDATIONS.md {#recommendations}

**Location:** `/home/mike/meal-planner/docs/DATA_ENGINEER_RECOMMENDATIONS.md`

**For:** Project Coordinator, Leadership, Implementation Planning

**Why Read It:**
- Executive summary of the problem and solution
- 9 critical gaps in current workflow
- Risk analysis (what could go wrong)
- Implementation timeline and effort estimate
- Success metrics to know when you're done

**Key Sections:**
- TL;DR (1 paragraph summary)
- The Problem in One Picture
- 9 Critical Gaps (with impact)
- What Was Created For You
- Implementation Timeline (2-4 weeks)
- Questions for Project Coordinator
- Success Metrics

**Decision to Make:** Should we implement these safeguards? (Recommended: YES)

---

### DATA_ENGINEER_GITHUB_PERSPECTIVE.md {#perspective}

**Location:** `/home/mike/meal-planner/docs/DATA_ENGINEER_GITHUB_PERSPECTIVE.md`

**For:** Tech Lead, Data Architect, System Design Discussions

**Why Read It:**
- Understand what's missing from current workflow
- See how database changes differ from code changes
- Learn about current schema risks (cascading deletes)
- Understand integration points with existing process
- Get detailed risk scenarios

**Key Sections:**
- Critical Findings (gap analysis)
- Database Migration Strategy section
- Schema Change Review Checklist
- Data Safety Gates (multi-stage approval)
- Cascading Delete Documentation
- What Data Engineer Needs in Instructions
- Real Scenario Examples (1-3)
- Recommendations Summary

**Decision to Make:** What approach works for your team? (Recommended: Multi-stage gates)

---

### DATABASE_MIGRATION_GUIDE.md {#migration-guide}

**Location:** `/home/mike/meal-planner/docs/DATABASE_MIGRATION_GUIDE.md`

**For:** Developers creating migrations, Junior Engineer, Team members

**Why Read It:**
- Step-by-step guide to creating safe migrations
- Common migration patterns with examples
- Disaster recovery scenarios and solutions
- Pre-merge checklist
- How to test migrations locally

**Key Sections:**
- Quick Start (2 minutes)
- Full Process (10 minutes)
- Risk Levels & Requirements
- Common Migration Patterns (with SQL)
- Disaster Scenarios & Recovery
- Pre-merge Checklist
- Rollback Procedure Template
- Key Takeaways

**Who Uses This:** Every developer creating schema changes

**Usage Pattern:** Bookmark this, refer to it when creating migrations

---

### GITHUB_WORKFLOW_DATA_ENGINEERING_GUIDE.md {#integration}

**Location:** `/home/mike/meal-planner/docs/GITHUB_WORKFLOW_DATA_ENGINEERING_GUIDE.md`

**For:** Project Coordinator, Those implementing changes to GITHUB_WORKFLOW.md

**Why Read It:**
- See exactly what changes need to be made to workflow
- Get specific text for PR template updates
- Understand merge requirement changes
- See risk matrix for approval requirements
- Get implementation checklist

**Key Sections:**
- Executive Summary (1 paragraph)
- What's Missing from Workflow (5 items)
- Integration with Current Workflow (minimal changes)
- New Documents to Create
- Risk Matrix (what requires what)
- Data Engineer's Role
- Implementation Checklist
- Critical Risks Being Addressed

**Deliverable:** Updated GITHUB_WORKFLOW.md with data sections

---

### .claude/agents/data-engineer.md {#agent}

**Location:** `/home/mike/meal-planner/.claude/agents/data-engineer.md`

**For:** AI Data Engineer Agent, Team Lead reviewing schema changes, QA specialist

**Why Read It:**
- Understand the Data Engineer's role in GitHub workflow
- See specific approval criteria
- Learn how to review schema change PRs
- Understand risk classification
- Know when to BLOCK a merge

**Key Sections:**
- Your Core Responsibilities (4 areas)
- GitHub Workflow Integration
- What You MUST Check in PRs (4 checklists)
- Your Approval Criteria (Approve/Request/Block)
- Change Risk Classification (LOW/MEDIUM/HIGH/CRITICAL)
- Migration Review Checklist
- Red Flags: When to Block
- Success Criteria

**Usage Pattern:** This IS the job description for the Data Engineer role

---

## How These Documents Relate

```
HIERARCHY:

DATA_ENGINEER_RECOMMENDATIONS.md (Top Level)
    ├─ For: Coordinator & Leadership
    ├─ Defines: What to do, why, timeline, effort
    └─ Decision: Should we implement? → YES

    ├─ References: DATA_ENGINEER_GITHUB_PERSPECTIVE.md (Analysis)
    │   ├─ For: Tech Lead & Architect
    │   ├─ Defines: What's wrong, gaps, risks
    │   └─ Purpose: Technical justification
    │
    ├─ References: GITHUB_WORKFLOW_DATA_ENGINEERING_GUIDE.md (Tactical)
    │   ├─ For: Coordinator implementing changes
    │   ├─ Defines: Exact changes to make
    │   └─ Purpose: How to update workflow
    │
    └─ References: .claude/agents/data-engineer.md (Operational)
        ├─ For: Data Engineer (agent or person)
        ├─ Defines: Job, approval criteria, checklists
        └─ Purpose: Day-to-day guidelines

        └─ References: DATABASE_MIGRATION_GUIDE.md (Practical)
            ├─ For: Developers creating migrations
            ├─ Defines: Step-by-step process
            └─ Purpose: How to do it safely
```

---

## Implementation Roadmap

### Immediate (This Week)

**Read:**
- [ ] DATA_ENGINEER_RECOMMENDATIONS.md (30 min)
- [ ] DATA_ENGINEER_GITHUB_PERSPECTIVE.md (30 min)

**Decide:**
- [ ] Should we implement these safeguards?
- [ ] Who will be the Data Engineer?
- [ ] What's our approval authority?

**Outcome:** Green light to proceed

---

### Near-term (Week 1)

**Read:**
- [ ] GITHUB_WORKFLOW_DATA_ENGINEERING_GUIDE.md (30 min)

**Update:**
- [ ] `/home/mike/meal-planner/GITHUB_WORKFLOW.md`
  - Add "Database Changes" section to PR template
  - Add data questions to code review checklist
  - Expand FAQ about migrations
  - Update merge requirements

**Outcome:** Updated GITHUB_WORKFLOW.md

---

### Short-term (Week 2)

**Read:**
- [ ] DATABASE_MIGRATION_GUIDE.md (30 min)
- [ ] .claude/agents/data-engineer.md (20 min)

**Train:**
- [ ] Present to development team
- [ ] Walk through migration process
- [ ] Review risk categories
- [ ] Q&A session

**Outcome:** Team trained and ready

---

### Medium-term (Weeks 3-4)

**Implement:**
- [ ] Add migration testing to CI/CD
- [ ] Create test database
- [ ] Setup backup verification
- [ ] Create deployment checklist

**Practice:**
- [ ] Review first few PRs as Data Engineer
- [ ] Provide feedback on risk assessment
- [ ] Document lessons learned

**Outcome:** Full safeguards in place

---

### Ongoing

**Maintain:**
- [ ] Review all schema change PRs
- [ ] Block unsafe migrations
- [ ] Help team improve process
- [ ] Update guides based on experience

**Outcome:** Zero data loss incidents

---

## Key Concepts

### The Core Problem

```
Without data safeguards:
  Code changes ← Protected by PR review, tests, CI/CD
  Database changes ← NOT protected, can cause permanent data loss

Result: Database is the biggest risk to production stability
```

### The Solution

```
Add data-specific gates to the PR process:
  1. Developer includes migration with PR
  2. Code review (existing)
  3. Data Engineer review (NEW)
  4. Migration testing in CI/CD (NEW)
  5. Merge with data approval (NEW)
  6. Backup verification before deploy (NEW)
  7. Deploy safely with rollback plan (NEW)
```

### Why This Matters

```
Good code commit gone wrong → git revert (5 minutes)
Bad migration gone wrong → data loss (forever)

Database is not forgiving. It requires different rules.
```

---

## FAQ: About These Documents

**Q: Do I need to read all 5 documents?**
A: No. See "Quick Navigation" section above. Read only what's relevant to your role.

**Q: When should I read these?**
A: Coordinator reads Recommendations immediately. Team reads others during Week 1-2.

**Q: Are these documents permanent?**
A: They're the foundation. Update them as your process evolves based on real experience.

**Q: What if we don't implement these?**
A: You'll have the same workflow you have now - migrations without safeguards. See "Critical Risks" section for what could go wrong.

**Q: Can we use these without the Data Engineer agent?**
A: Yes! Just assign Data Engineer role to a team member. The guidelines work the same way.

**Q: What if our deployment process is different?**
A: The principles are the same. Adapt the specific steps to your deployment process.

---

## Current State of Database

### Schema Location
- **Current:** `/home/mike/meal-planner/backend/prisma/schema.prisma`
- **Type:** Prisma ORM with SQLite
- **Models:** 10 (User, Recipe, Ingredient, MealPlan, etc.)

### Known Risks
1. **Cascading Deletes:** User deletion cascades to all their data (CRITICAL)
2. **No Audit Trail:** Deleted data cannot be recovered
3. **No Soft Deletes:** No recovery mechanism for deleted records

### Recommended Next Steps
1. Implement safeguards in workflow (this document set)
2. Review cascade delete rules (future data engineer task)
3. Consider soft delete implementation (future enhancement)
4. Add audit logging (future enhancement)

---

## Contact & Questions

**For questions about:**

- **Workflow changes** → See GITHUB_WORKFLOW_DATA_ENGINEERING_GUIDE.md
- **Migration process** → See DATABASE_MIGRATION_GUIDE.md
- **Approval criteria** → See .claude/agents/data-engineer.md
- **Risk analysis** → See DATA_ENGINEER_GITHUB_PERSPECTIVE.md
- **Implementation plan** → See DATA_ENGINEER_RECOMMENDATIONS.md

---

## Document Manifest

| File | Size | Location | Created |
|---|---|---|---|
| DATA_ENGINEER_RECOMMENDATIONS.md | 15 KB | docs/ | 2025-11-25 |
| DATA_ENGINEER_GITHUB_PERSPECTIVE.md | 14 KB | docs/ | 2025-11-25 |
| GITHUB_WORKFLOW_DATA_ENGINEERING_GUIDE.md | 14 KB | docs/ | 2025-11-25 |
| DATABASE_MIGRATION_GUIDE.md | 16 KB | docs/ | 2025-11-25 |
| data-engineer.md | 11 KB | .claude/agents/ | 2025-11-25 |
| INDEX_DATA_ENGINEERING_GITHUB_WORKFLOW.md | This file | docs/ | 2025-11-25 |

**Total:** ~84 KB of comprehensive data engineering guidance

---

## Summary

These 5 documents + 1 index provide everything needed to:

1. **Understand** what's missing from the current workflow
2. **Decide** whether to implement safeguards
3. **Implement** changes to the GitHub workflow
4. **Train** the development team
5. **Execute** safe database migrations
6. **Review** schema changes as Data Engineer
7. **Prevent** data loss disasters

Choose your starting point above based on your role. Then proceed through the implementation roadmap.

**The goal:** Make it impossible to accidentally lose customer data through a bad migration.

---

**Questions?** See the specific document most relevant to your question.

**Ready to implement?** Start with DATA_ENGINEER_RECOMMENDATIONS.md, then GITHUB_WORKFLOW_DATA_ENGINEERING_GUIDE.md.
