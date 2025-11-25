# QA Specialist Journal

This journal tracks all testing work completed by the QA Specialist agent across sessions. Each entry documents test execution (not analysis!), bugs found, and validation results.

**Purpose:** Maintain continuity across sessions and track quality metrics over time.

**Remember:** Focus on EXECUTION not ANALYSIS. Document what you tested, not what could be tested.

---

<!-- Entries will be appended below this line -->

---
## Task Reflection - November 25, 2025, 11:15 AM

### Assignment
Provide critical QA perspective on GitHub Workflow document. Assess testing requirements, merge gates, coverage standards, and define what QA needs to do the job effectively.

### What I Actually Did
ANALYSIS PHASE (No tests executed - this was requirements analysis, not test execution):
- Reviewed GITHUB_WORKFLOW.md (607 lines) - identified 5 critical gaps and 7 major deficiencies
- Analyzed existing test structure:
  * Backend: Jest with 4 test files (fractionParser, fractionMath, unitConverter, integration)
  * Frontend: Playwright with 5 E2E test files, known issue: login.spec.ts has skipped test
  * Vitest configured for frontend unit tests
- Examined package.json configurations - Jest and Vitest properly configured
- Created comprehensive QA perspective document (6,000+ word critical analysis)

DELIVERABLES CREATED:
1. **QA Workflow Analysis Document** (/tmp/qa-workflow-analysis.md)
   - Executive summary identifying 5 critical gaps
   - Section-by-section analysis of all workflow sections
   - Detailed recommendations for each gap
   - Tool recommendations and implementation timeline

2. **QA Specialist Agent Instructions** (/home/mike/meal-planner/.claude/agents/qa-specialist.md)
   - Clear authority definition (what I can/cannot do)
   - Test standards with examples (good vs bad tests)
   - PR validation checklist with detailed criteria
   - Common issue handling (flaky tests, environment issues, coverage)
   - Post-merge regression testing process
   - Weekly reporting template

### Key Findings

CRITICAL GAPS IN WORKFLOW (Blocking effective QA):
1. **No flaky test strategy** - E2E tests block merges randomly, no retry logic
2. **No test environment specification** - "Tests pass locally, fail in CI" confusion inevitable
3. **QA role undefined** - Can't enforce standards or block bad tests
4. **Coverage metric is vague** - 80% could mean meaningless code paths tested
5. **Merge gate failures undefined** - What happens when tests fail for non-code reasons?

INSUFFICIENT CURRENT REQUIREMENTS:
- "E2E tests if applicable" is too vague (when IS it applicable?)
- "All tests pass" doesn't account for flaky tests or environment issues
- "80% coverage" doesn't specify statement vs branch coverage
- Test environment completely unspecified (Node version? DB version? Timeouts?)
- Regression testing marked as "should" not "must"

WORKFLOW STRENGTHS VERIFIED:
- Protected branch rules are solid
- Branch naming conventions are clear
- PR template is comprehensive
- CI/CD structure is reasonable
- Code review checklist exists (though QA section is minimal)

### What Went Well
- Identified specific, actionable gaps with evidence from existing code
- Created agent instructions that define QA authority clearly
- Provided practical examples (good vs bad tests, comment templates)
- Included known project issues (skipped login test, coverage concerns)
- Created implementable checklist for PR validation
- Included quick-reference commands and escalation process

### What Didn't Go Well
- Had to infer QA role from context (it's undefined in original workflow)
- Couldn't verify exact coverage baselines (no baseline reports available)
- Login E2E test is skipped - couldn't determine if environment or code issue
- No historical flaky test data to analyze

### Start Doing
- Define QA as explicit role with approval authority BEFORE code reaches review
- Measure coverage with branch coverage, not just statement coverage
- Document test environment specifications (Node/DB/browser versions)
- Add flaky test markers and retry strategy to CI/CD configuration
- Weekly QA metrics reporting to track quality trends

### Stop Doing
- Vague merge gate requirements ("if applicable", "should")
- Allowing tests to be skipped without documented reason
- Treating coverage as number instead of meaningful metric
- Making environmental assumptions about test runs
- Separating code review from test review (should be same PR review)

### Evidence
- GITHUB_WORKFLOW.md analyzed (607 lines, 7 sections reviewed)
- 4 backend test files examined (Jest, good patterns established)
- 5 frontend E2E test files reviewed (Playwright, 1 known issue: skipped login test)
- Frontend package.json verified (Vitest configured with proper settings)
- Backend package.json verified (Jest, coverage, watch mode configured)

FILES CREATED:
1. /home/mike/meal-planner/.claude/agents/qa-specialist.md - 500+ lines of actionable guidance
2. /tmp/qa-workflow-analysis.md - 6,000+ word comprehensive analysis (saved for reference)

### For Next Session
- Implement flaky test detection in CI/CD configuration
- Create baseline coverage metrics and trend tracking
- Document test environment specification in GITHUB_WORKFLOW.md updates
- Set up Codecov or similar coverage trend tracking
- Define QA approval authority in branch protection rules
- Create weekly QA metrics dashboard template

**CRITICAL BLOCKERS FOR FUTURE QA WORK:**
- Need authority to request changes on PRs (currently undefined)
- Need coverage baseline reports to enforce "no decrease" rule
- Need flaky test detection system (currently no strategy)
- Need test environment specification before next release

