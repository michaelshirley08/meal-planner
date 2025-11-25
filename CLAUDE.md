# Meal Planner Project Memory

**Last Updated:** November 25, 2025
**Project Path:** `/home/mike/meal-planner`

---

## Project Overview

**Type:** Single-user local meal planning application
**Architecture:** Browser-based UI, local-first data storage
**Stack:**
- Backend: Node.js, Express, Prisma, SQLite
- Frontend: React, TypeScript, Vite
- Database: SQLite (local file)

**Key Decision:** Transitioned from multi-user SaaS to single-user installable app (no authentication needed)

---

## Current Status (November 25, 2025)

### Phase: GitHub Repository Setup & Sprint Planning - COMPLETE ✅

**Completed:**
- ✅ GitHub Actions configured
- ✅ Git repository initialized (main branch)
- ✅ Development workflow documented (GITHUB_WORKFLOW.md)
- ✅ Technical standards defined (TECHNICAL_STANDARDS.md)
- ✅ Quick reference created (DEVELOPER_QUICK_REFERENCE.md)
- ✅ All agents consulted (Tech Lead, Junior Engineer, QA, Data Engineer)
- ✅ Agent-specific documentation created (~200 KB)
- ✅ Sprint planning complete with task assignments
- ✅ .gitignore configured

**Next Phase:** Phase 1 - Critical Foundations (Week 1, ~8 hours)
- Create CI/CD workflows
- Configure branch protection
- Create README, CONTRIBUTING, LICENSE
- Initial commit to GitHub
- Team training

---

## Repository Information

**Git Status:**
- Main branch: `main`
- Repository initialized but not yet pushed to GitHub
- Remote URL: To be configured

**Branch Strategy:**
- `main` - Production-ready (protected)
- `develop` - Integration branch (protected)
- `feature/*` - Feature branches (daily work)

**Branch Naming:** `<type>/MP-<ticket>-<description>`
- Types: feature, fix, refactor, test, docs, chore

---

## Development Workflow

**Commit Format:**
```
<type>(<scope>): <subject>

<body explaining WHY>

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

**PR Requirements:**
- All tests pass locally
- Linter passes (no errors)
- Build succeeds
- Self-review completed
- At least 1 approval

**Code Review:**
- Normal PRs: 24 hour response time
- Critical fixes: 2 hour response time
- Tech Lead approves architecture/patterns
- QA approves test coverage
- Data Engineer approves schema changes

**Test Coverage:** 80% minimum for new features

---

## Team Structure

**Agents (Claude Code):**
1. **Tech Lead** - Architecture, design, standards enforcement, code review
2. **Junior Engineer** - Implementation, bug fixes, feature development
3. **QA Specialist** - Testing, quality gates, test coverage validation
4. **Data Engineer** - Database schema, migrations, data safety
5. **UX Designer** - User experience, design system, wireframes

**All agent instructions updated with GitHub workflow compliance**

---

## Key Documentation Locations

**Workflow & Standards:**
- `GITHUB_WORKFLOW.md` - Complete development workflow (15 pages)
- `TECHNICAL_STANDARDS.md` - Code standards and conventions (20 pages)
- `DEVELOPER_QUICK_REFERENCE.md` - Daily commands cheat sheet (3 pages)

**Planning:**
- `TEAM_MEETING_GITHUB_SPRINT_KICKOFF.md` - Sprint planning with assignments
- `GITHUB_REPOSITORY_PLAN.md` - What goes in git vs. archive
- `COORDINATION_COMPLETE_GITHUB_READY.md` - Final status report

**Agent Instructions:**
- `.claude/agents/tech-lead.md`
- `.claude/agents/junior-engineer.md`
- `.claude/agents/qa-specialist.md`
- `.claude/agents/data-engineer.md`
- `.claude/agents/ux-designer.md`

**Specialized Guides:**
- `docs/DATABASE_MIGRATION_GUIDE.md` - Database change process (18 KB)
- `docs/DATA_ENGINEER_RECOMMENDATIONS.md` - Database safety requirements
- `QA_PERSPECTIVE_SUMMARY.md` - QA requirements and concerns
- `QA_SETUP_INDEX.md` - QA documentation index

**Project Documentation:**
- `docs/DOCUMENTATION_INDEX.md` - Master index of all docs
- `docs/ARCHITECTURE_TRANSITION.md` - Multi-user to single-user transition
- `docs/POC_SCOPE.md` - POC definition (recipes + meal planning only)
- `docs/DEVELOPMENT_PHASES.md` - Implementation roadmap
- `docs/SINGLE_USER_SCHEMA.md` - Database schema design
- `docs/UX_DESIGN_OVERVIEW.md` - UX strategy
- `docs/SCREEN_MOCKUPS.md` - UI wireframes (10 screens)
- `docs/USER_FLOWS.md` - User journeys (9 flows)

---

## Critical Decisions Made

### Architecture
- ✅ Single-user only (no authentication)
- ✅ Local-first (SQLite database)
- ✅ Browser-based UI (React frontend)
- ✅ No cloud hosting required
- ✅ Data stays on user's computer

### Development Practices
- ✅ Git Flow variant (feature/develop/main)
- ✅ Conventional Commits format
- ✅ Squash and merge strategy
- ✅ Protected branches (no direct commits to main/develop)
- ✅ Mandatory code review (1 approval minimum)
- ✅ Automated testing gates (tests must pass)

### Quality Standards
- ✅ TypeScript strict mode
- ✅ Prettier for formatting
- ✅ ESLint for linting
- ✅ 80% test coverage for new features
- ✅ Database migrations require Data Engineer approval
- ✅ QA can REQUEST CHANGES but not approve code

### Database
- ✅ SQLite for local storage
- ✅ Prisma ORM
- ✅ Migration naming: `YYYYMMDDHHMMSS_description.sql`
- ✅ Rollback procedures required
- ✅ Risk classification (LOW/MEDIUM/HIGH/CRITICAL)

---

## Project Scope

### POC Scope (Current Focus)
**Timeline:** 3 days
**Features:**
1. Ingredient Management (create/list)
2. Recipe Management (CRUD + search)
3. Meal Planning (weekly calendar + add/remove meals)

**Database:** 5 tables (Recipe, Ingredient, RecipeIngredient, RecipeInstruction, MealPlan)

**NOT in POC:**
- Shopping lists (deferred to MVP)
- Recipe photos
- Recipe ratings
- Pantry management

### MVP Scope (Post-POC)
- Add shopping list generation
- Recipe photos and ratings
- Enhanced features

### Full Product (Future)
- Pantry management
- Advanced features
- Desktop app packaging (Electron/Tauri)

---

## Implementation Roadmap

### Phase 1: Critical Foundations (Week 1) - NEXT
**Time:** 8 hours
**Tasks:**
- Implement CI/CD workflows (`.github/workflows/`)
- Configure branch protection rules
- Create README.md, CONTRIBUTING.md, LICENSE
- Create PR template
- Initial commit and push to GitHub

**Owner:** Tech Lead + Coordinator

### Phase 2: Quality Gates (Week 2)
**Time:** 12 hours
**Tasks:**
- Set up test coverage reporting
- Implement pre-commit hooks (Husky)
- Database migration process
- PR automation
- Simplified PR template

**Owner:** Multiple (coordinated)

### Phase 3: Enhancement (Week 3-4)
**Time:** 10 hours
**Tasks:**
- Automated dependency updates
- Commit message linter
- Performance testing
- Automated changelog
- Issue templates

---

## Agent Feedback Summary

### Tech Lead (Grade: B-)
- Workflow is comprehensive and well-structured
- Identified 5 critical gaps (now addressed)
- Needs CI/CD implementation and coverage enforcement
- Created comprehensive review checklist

### Junior Engineer (70% ready)
- Clear on branch naming and commit format
- Needs simplified PR template for small changes
- Wants conflict resolution guide (provided)
- Pre-flight checklist created

### QA Specialist (Critical gaps identified)
- Cannot validate PRs without: flaky test strategy, test environment specs, QA authority, clear coverage definition
- Created comprehensive testing requirements documentation
- Defined QA approval criteria

### Data Engineer (9 critical safety gaps)
- Created 18 KB migration guide
- Defined risk classification matrix
- Established migration approval process
- Documented rollback procedures
- Identified cascade delete risks

---

## Files to Include in Git

**Application Code:**
- `backend/` - All source code
- `frontend/` - All source code
- Configuration files
- Package files

**Documentation:**
- `docs/` - Current documentation
- Root workflow/standards docs
- `.claude/agents/` - Agent instructions

**GitHub-Specific:**
- `.github/workflows/` - CI/CD
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/ISSUE_TEMPLATE/`

**Excluded (via .gitignore):**
- `node_modules/`
- `*.db`, `*.sqlite`
- `.env` files
- `dist/`, `build/`
- `coverage/`
- Log files

---

## Files to Archive (Not in Git)

**Create `archive/` directory for:**
- Historical session summaries (~15 files)
- Deprecated documentation (~8 files)
- Old workflow documents (~5 files)

Total: ~25-30 files to move to archive

---

## Common Commands

**Start new work:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/MP-123-description
```

**Before creating PR:**
```bash
npm test              # All tests pass
npm run lint          # No errors
npm run build         # Build succeeds
git diff develop      # Self-review changes
```

**Create PR:**
```bash
git push -u origin feature/MP-123-description
gh pr create --title "[MP-123] Description" --body "..."
```

**Test coverage:**
```bash
npm test -- --coverage
```

---

## Known Issues & Risks

### High Priority (Needs Phase 1)
1. No CI/CD workflows yet - tests don't run automatically
2. Branch protection not configured - could commit to main
3. No coverage enforcement - 80% is aspirational

### Medium Priority (Phase 2)
4. Flaky E2E tests could block PRs randomly
5. Test environment not fully specified
6. No pre-commit hooks - standards not enforced locally

### Mitigations in Place
- Comprehensive documentation created
- Agent feedback incorporated
- Clear implementation roadmap
- Team assignments defined

---

## Success Criteria

**Phase 1 Complete When:**
- ✅ CI/CD runs on every PR
- ✅ Branch protection prevents direct pushes to main/develop
- ✅ README and CONTRIBUTING created
- ✅ Initial commit pushed to GitHub
- ✅ Team can create PRs following workflow

**Project Ready When:**
- ✅ All quality gates operational
- ✅ First successful PR merged
- ✅ Team trained on workflow
- ✅ Database migration process proven
- ✅ Test coverage measured and reported

---

## Important Notes

### For Future Sessions

1. **Always check GITHUB_WORKFLOW.md** before git operations
2. **Database changes require migration script** - See DATABASE_MIGRATION_GUIDE.md
3. **Never commit directly to main or develop** - Use feature branches
4. **All PRs require approval** - Minimum 1 reviewer
5. **Tests are mandatory** - Cannot skip or bypass
6. **Coverage must be maintained** - 80% for new features
7. **Data Engineer approves schema changes** - Safety critical

### For Agents

- Agent instructions updated with GitHub compliance
- Branch naming: `<type>/MP-<ticket>-<description>`
- Commit format: Conventional Commits with Claude attribution
- PR template must be filled out
- Self-review before requesting review
- Wait for CI checks to pass

### For Coordinator

- Phase 1 is highest priority (blocks everything)
- Tech Lead owns CI/CD implementation
- All agents have assigned tasks for Week 1
- Team meeting document ready (TEAM_MEETING_GITHUB_SPRINT_KICKOFF.md)
- Final status report created (COORDINATION_COMPLETE_GITHUB_READY.md)

---

## Quick Links

**Most Important Documents:**
1. `/home/mike/meal-planner/TEAM_MEETING_GITHUB_SPRINT_KICKOFF.md` - START HERE
2. `/home/mike/meal-planner/COORDINATION_COMPLETE_GITHUB_READY.md` - Status report
3. `/home/mike/meal-planner/GITHUB_WORKFLOW.md` - Development workflow
4. `/home/mike/meal-planner/DEVELOPER_QUICK_REFERENCE.md` - Quick commands
5. `/home/mike/meal-planner/docs/DOCUMENTATION_INDEX.md` - Master doc index

**For Implementation:**
6. `/home/mike/meal-planner/TECHNICAL_STANDARDS.md` - Code standards
7. `/home/mike/meal-planner/docs/DATABASE_MIGRATION_GUIDE.md` - DB changes
8. `/home/mike/meal-planner/GITHUB_REPOSITORY_PLAN.md` - What goes where
---



