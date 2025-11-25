# Meal Planner - Documentation Index

**Last Updated:** November 25, 2025
**Architecture:** Single-User Installable Application (Browser-Based UI)

---

## 📋 Quick Navigation

### For New Team Members
1. Start with **ARCHITECTURE_TRANSITION.md** (this explains the pivot)
2. Review **UX_DESIGN_OVERVIEW.md** for the vision
3. Read **SINGLE_USER_SCHEMA.md** for database design
4. Check **MIGRATION_STRATEGY.md** for implementation plan

### For Developers
- **Database:** `DATABASE_SETUP.md` → `ER_DIAGRAM.md` → `SINGLE_USER_SCHEMA.md`
- **Backend:** `MIGRATION_STRATEGY.md` (Service Layer section)
- **Frontend:** `SCREEN_MOCKUPS.md` → `USER_FLOWS.md` → `UX_RECOMMENDATIONS.md`

### For Product/UX
- **UX_DESIGN_OVERVIEW.md** - Design strategy
- **SCREEN_MOCKUPS.md** - Detailed wireframes
- **USER_FLOWS.md** - User journeys
- **UX_RECOMMENDATIONS.md** - Implementation priorities

---

## 🎯 Current Architecture: Single-User Local Application

**Important:** This application is being restructured from a multi-user SaaS web app to a **single-user installable application** that users run locally on their own computers. Users interact via a browser, but there is:
- ❌ No authentication/login
- ❌ No user accounts
- ❌ No cloud hosting required
- ✅ Local SQLite database
- ✅ Local-first data ownership
- ✅ Browser-based UI
- ✅ Desktop app patterns

---

## 📁 Documentation Organization

### 1. Architecture & Design (Current State)

#### **UX/Design Documentation** ✅ NEW
| File | Purpose | Status |
|------|---------|--------|
| `UX_DESIGN_OVERVIEW.md` | Overall UX strategy for single-user app | Complete |
| `USER_FLOWS.md` | Detailed user journeys and interaction flows | Complete |
| `SCREEN_MOCKUPS.md` | Wireframes and specifications for all key screens | Complete |
| `UX_RECOMMENDATIONS.md` | Implementation roadmap and priorities | Complete |

**Created by:** UX/XD Agent
**Summary:** Comprehensive UX design for single-user local application with desktop patterns, keyboard shortcuts, local-first philosophy, and no authentication overhead.

---

#### **Database & Data Engineering** ✅ NEW
| File | Purpose | Status |
|------|---------|--------|
| `DATABASE_SCHEMA_ANALYSIS.md` | Analysis of current multi-user schema | Complete |
| `SINGLE_USER_SCHEMA.md` | New single-user schema design | Complete |
| `MIGRATION_STRATEGY.md` | Migration guide from multi-user to single-user | Complete |
| `DATABASE_SETUP.md` | SQLite setup, backup, maintenance | Complete |
| `ER_DIAGRAM.md` | Entity-relationship diagrams (Mermaid + text) | Complete |
| `SCHEMA_QUICK_REFERENCE.md` | Side-by-side schema comparison | Complete |
| `DATA_ENGINEERING_SUMMARY.md` | Executive summary of data work | Complete |

**Schema File:**
- `backend/prisma/schema-single-user.prisma` - New schema (ready to use)
- `backend/prisma/schema.prisma` - Old multi-user schema (to be replaced)

**Created by:** Data Engineer Agent
**Summary:** Complete database redesign removing all multi-user complexity. 7 of 10 models simplified, userId removed throughout, all features preserved. Migration timeline: 1-2 days.

---

### 2. Legacy Documentation (Multi-User Era) ⚠️ NEEDS UPDATE

#### **Phase Documentation**
| File | Purpose | Status |
|------|---------|--------|
| `PHASE_2_SUMMARY.md` | Recipe management (multi-user) | ⚠️ Outdated - references auth |
| `PHASE_3_SUMMARY.md` | Meal planning (multi-user) | ⚠️ Outdated - references userId |
| `backend/PHASE_2_SETUP.md` | Setup guide with authentication | ⚠️ Outdated - auth setup |
| `backend/PHASE_3_DOCS.md` | API docs with JWT auth | ⚠️ Outdated - auth headers |
| `backend/README.md` | Backend overview | ⚠️ Outdated - multi-user + wrong DB |

**Issues Found:**
- All reference JWT authentication (being removed)
- Document PostgreSQL but schema uses SQLite (inconsistency)
- Describe multi-user isolation with userId (being removed)
- Setup instructions include user registration/login (not needed)

**Action Required:** Update or archive these files

---

#### **General Documentation**
| File | Purpose | Status |
|------|---------|--------|
| `docs/README.md` | Project overview | ⚠️ Needs update for single-user |
| `docs/FEATURES.md` | MVP feature list | ⚠️ Review for single-user context |
| `DEVELOPMENT_PHASES.md` | Implementation roadmap | ⚠️ Review and update timeline |
| `MVP_SCOPE_PANTRY_DESCOPED.md` | Scope decisions | ✅ Still valid |
| `CHANGES_SUMMARY.md` | Recent changes | ✅ Still valid |
| `CLAUDE.md` | Claude Code guidance | ⚠️ Needs update for new architecture |
| `CLAUDE_CODE_AGENTS.md` | Agent task assignments | ⚠️ Review |

---

### 3. Journals & Session History

| File | Purpose | Status |
|------|---------|--------|
| `journals/tech-lead-journal.md` | Tech lead session notes | ✅ Active |
| `last-session.txt` | Last session summary | ✅ Active |
| `frontend/last-session.txt` | Frontend session summary | ✅ Active |

---

## 🔍 Documentation Inconsistencies Found

### Critical Inconsistencies

1. **Database Provider Mismatch**
   - **Documentation says:** PostgreSQL 13+
   - **Schema file uses:** SQLite
   - **Resolution:** SQLite is correct for single-user local app
   - **Action:** Update all PostgreSQL references to SQLite

2. **Architecture Mismatch**
   - **Documentation describes:** Multi-user SaaS with authentication
   - **New design:** Single-user local installable app
   - **Resolution:** Use new UX/Design and Data Engineering docs
   - **Action:** Archive or update legacy docs

3. **Authentication References**
   - **Pervasive throughout:** JWT tokens, authMiddleware, /auth endpoints
   - **New design:** No authentication needed
   - **Resolution:** Remove all auth references
   - **Action:** Follow MIGRATION_STRATEGY.md

---

## 📊 Implementation Status

### ✅ Completed
- [x] UX/Design documentation (4 files, ~145KB)
- [x] Data engineering documentation (7 files)
- [x] Single-user schema design
- [x] Migration strategy
- [x] ER diagrams
- [x] Documentation index (this file)

### 🚧 In Progress
- [ ] Update legacy documentation
- [ ] Archive outdated multi-user docs
- [ ] Update CLAUDE.md for new architecture

### ⏳ Pending Implementation
- [ ] Database migration (1-2 days)
- [ ] Service layer updates (3-6 hours)
- [ ] API routes updates (2-3 hours)
- [ ] Frontend updates (4-7 hours)
- [ ] End-to-end testing (2-4 hours)

**Total Estimated Time:** 1-2 days for complete migration

---

## 🎯 Key Design Decisions

### Architecture
- **Single-user only** - One user per installation
- **Local-first** - SQLite database, all data on user's computer
- **Browser-based UI** - React frontend, accessed via browser
- **No authentication** - Direct access to all features
- **Desktop patterns** - Keyboard shortcuts, native menus, window state

### Database
- **SQLite** - Perfect for local single-user app
- **No User table** - No authentication needed
- **Remove userId** - From 7 of 10 models
- **Preserve features** - All functionality maintained
- **Performance gain** - Simpler queries, fewer indexes

### UX Philosophy
- **Radical simplification** - Remove login/register flows
- **Instant access** - No barriers to entry
- **Local data ownership** - User controls their data
- **Desktop feel** - Native-like performance and shortcuts
- **Privacy by design** - Data never leaves user's computer

---

## 📖 Reading Order by Role

### Product Manager / Stakeholder
1. `ARCHITECTURE_TRANSITION.md` ← **Start here** (explains the pivot)
2. `UX_DESIGN_OVERVIEW.md` - Vision and strategy
3. `DATA_ENGINEERING_SUMMARY.md` - Technical changes summary
4. `UX_RECOMMENDATIONS.md` - Implementation priorities
5. `MIGRATION_STRATEGY.md` - Timeline and effort

### UX/UI Designer
1. `UX_DESIGN_OVERVIEW.md` - Design philosophy
2. `SCREEN_MOCKUPS.md` - Detailed wireframes (78KB!)
3. `USER_FLOWS.md` - User journeys
4. `UX_RECOMMENDATIONS.md` - Enhancement ideas

### Backend Developer
1. `DATABASE_SCHEMA_ANALYSIS.md` - Current state
2. `SINGLE_USER_SCHEMA.md` - New design
3. `MIGRATION_STRATEGY.md` - Implementation guide (service layer section)
4. `DATABASE_SETUP.md` - SQLite setup
5. `ER_DIAGRAM.md` - Visual reference

### Frontend Developer
1. `UX_DESIGN_OVERVIEW.md` - Design system
2. `SCREEN_MOCKUPS.md` - Component specs
3. `USER_FLOWS.md` - Interaction patterns
4. `MIGRATION_STRATEGY.md` - Frontend section
5. `UX_RECOMMENDATIONS.md` - Features to implement

### QA / Tester
1. `USER_FLOWS.md` - Expected user journeys
2. `MIGRATION_STRATEGY.md` - Testing strategy section
3. `UX_RECOMMENDATIONS.md` - Success metrics
4. `FEATURES.md` - Feature checklist

---

## 🚀 Next Steps

### Immediate (This Week)
1. **Review and approve** new architecture documentation
2. **Answer design questions** in DATA_ENGINEERING_SUMMARY.md
3. **Update or archive** legacy multi-user documentation
4. **Create transition plan** for implementation phases

### Short-term (Next 2 Weeks)
1. **Database migration** - Implement single-user schema
2. **Service layer** - Remove userId parameters
3. **API routes** - Remove authentication middleware
4. **Frontend** - Remove login/register pages

### Medium-term (Next Month)
1. **Welcome screen** - First-run experience
2. **Keyboard shortcuts** - Desktop patterns
3. **Data export/import** - User data portability
4. **Polish and testing** - Ensure quality

---

## 📞 Questions & Support

### For Design Questions
Refer to: `UX_RECOMMENDATIONS.md` → Contact: UX/XD Agent

### For Database Questions
Refer to: `DATA_ENGINEERING_SUMMARY.md` → Contact: Data Engineer Agent

### For Implementation Questions
Refer to: `MIGRATION_STRATEGY.md` → Contact: Tech Lead

### For General Questions
Refer to: This file or project coordinator

---

## 📝 Document Status Legend

- ✅ **Complete** - Up-to-date and ready to use
- 🚧 **In Progress** - Being actively worked on
- ⚠️ **Needs Update** - Outdated, references old architecture
- 📦 **Archive** - Historical, no longer applicable
- 🔜 **Planned** - Not yet created

---

## 🔗 Related Resources

### External Documentation
- Prisma Schema Reference: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference
- React Best Practices: https://react.dev/learn
- SQLite Documentation: https://www.sqlite.org/docs.html

### Internal Code
- Backend: `/home/mike/meal-planner/backend/`
- Frontend: `/home/mike/meal-planner/frontend/`
- Schemas: `/home/mike/meal-planner/backend/prisma/`

---

**This index is maintained by the Project Coordinator. Last major update: November 25, 2025**
