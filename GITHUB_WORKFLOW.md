# GitHub Workflow & Development Practices

**Version:** 1.0
**Date:** November 25, 2025
**Status:** Active

---

## Overview

This document defines the development workflow for the Meal Planner project using GitHub for version control, code review, and collaboration.

---

## Branch Strategy

### Main Branches

- **`main`** - Production-ready code. Always deployable.
  - Protected branch (no direct commits)
  - Requires PR approval before merge
  - All tests must pass
  - Code review required

- **`develop`** - Integration branch for features
  - Where feature branches merge into
  - Should be stable but may have work in progress
  - Regular integration testing happens here

### Feature Branches

**Naming Convention:**
```
<type>/<ticket-id>-<short-description>

Examples:
- feature/MP-123-recipe-list-ui
- fix/MP-456-auth-bug
- refactor/MP-789-database-schema
- docs/MP-101-api-documentation
- test/MP-202-e2e-meal-planning
```

**Types:**
- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `refactor/` - Code refactoring without behavior change
- `test/` - Adding or updating tests
- `docs/` - Documentation changes
- `chore/` - Maintenance tasks (dependencies, config, etc.)

---

## Development Workflow

### 1. Starting New Work

```bash
# Update your local develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/MP-123-recipe-list-ui

# Make your changes...
```

### 2. Making Commits

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body>

🤖 Generated with Claude Code (https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Examples:**
```
feat(recipes): add recipe list page with search and filters

Implemented RecipeList component that fetches and displays all recipes.
Added search bar and category filters. Integrated with GET /recipes API.

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

```
fix(auth): resolve 500 error on login endpoint

Fixed null reference error in auth middleware when validating tokens.
Added proper error handling for expired tokens.

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `test` - Adding/updating tests
- `docs` - Documentation
- `style` - Code style changes (formatting, semicolons, etc.)
- `perf` - Performance improvements
- `chore` - Maintenance tasks

### 3. Pushing Your Branch

```bash
# First push
git push -u origin feature/MP-123-recipe-list-ui

# Subsequent pushes
git push
```

### 4. Creating a Pull Request

**PR Title Format:**
```
[MP-123] Add recipe list page with search and filters
```

**PR Description Template:**
```markdown
## Summary
Brief description of what this PR does (2-3 sentences)

## Changes Made
- [ ] Added RecipeList component
- [ ] Implemented search functionality
- [ ] Added category filters
- [ ] Integrated with GET /recipes API
- [ ] Added unit tests for RecipeList

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Unit tests pass locally
- [ ] Integration tests pass
- [ ] E2E tests pass (if applicable)
- [ ] Manual testing completed

### Manual Testing Steps:
1. Navigate to /recipes
2. Verify recipes load and display
3. Test search functionality
4. Test category filters
5. Verify responsive design

## Screenshots (if applicable)
[Add screenshots of UI changes]

## Dependencies
- None
OR
- Requires PR #XX to be merged first
- Requires database migration

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No console errors or warnings
- [ ] No breaking changes (or documented if necessary)

## Notes for Reviewers
[Any specific areas you want reviewers to focus on]

🤖 Generated with Claude Code
```

---

## Code Review Process

### For Authors

**Before Requesting Review:**
1. ✅ Run all tests locally: `npm test`
2. ✅ Run linter: `npm run lint`
3. ✅ Build succeeds: `npm run build`
4. ✅ Self-review your own code
5. ✅ Check for console errors
6. ✅ Update documentation if needed
7. ✅ Add/update tests for your changes

**During Review:**
- Respond to all comments
- Make requested changes promptly
- Re-request review after changes
- Keep discussions professional and constructive

### For Reviewers

**What to Look For:**
1. **Functionality** - Does it work as intended?
2. **Code Quality** - Is it clean, readable, maintainable?
3. **Tests** - Are there sufficient tests?
4. **Performance** - Any performance concerns?
5. **Security** - Any security vulnerabilities?
6. **Standards** - Does it follow project conventions?

**Review Checklist:**
- [ ] Code is clear and easy to understand
- [ ] No obvious bugs or edge cases missed
- [ ] Tests cover the new/changed functionality
- [ ] Error handling is appropriate
- [ ] No hardcoded values (use constants/config)
- [ ] Documentation is updated
- [ ] No unnecessary complexity
- [ ] Follows established patterns

**Approval Types:**
- ✅ **Approve** - Code is good to merge
- 💬 **Comment** - Suggestions but not blocking
- ❌ **Request Changes** - Must be addressed before merge

**Response Time:**
- **Critical fixes:** Within 2 hours
- **Normal PRs:** Within 24 hours
- **Large PRs:** Within 48 hours

---

## Testing Requirements

### Before Merging

All PRs must pass:
1. **Unit Tests** - All existing + new tests pass
2. **Integration Tests** - API endpoints work correctly
3. **E2E Tests** - Critical user flows work (if applicable)
4. **Build** - Code compiles without errors
5. **Linter** - No linting errors

### Test Coverage Guidelines

- **New Features:** Minimum 80% coverage for new code
- **Bug Fixes:** Add regression test that catches the bug
- **Refactoring:** All existing tests must still pass

---

## Merging Strategy

### Merge Process

1. ✅ All tests pass (CI/CD green)
2. ✅ At least 1 approval from reviewer
3. ✅ All conversations resolved
4. ✅ Branch is up to date with target branch
5. ✅ Squash and merge (keeps history clean)

### Squash Merge

Use "Squash and Merge" to keep main/develop history clean:
```
Final commit message:
[MP-123] Add recipe list page (#45)

Combined all commits from feature branch into single commit.
Includes search, filters, and unit tests.
```

### After Merge

```bash
# Delete remote branch (GitHub can do this automatically)
git push origin --delete feature/MP-123-recipe-list-ui

# Update your local branches
git checkout develop
git pull origin develop

# Delete local feature branch
git branch -d feature/MP-123-recipe-list-ui
```

---

## Protected Branch Rules

### `main` Branch

- ❌ No direct commits
- ✅ Require pull request
- ✅ Require 1 approval
- ✅ Require status checks to pass
  - All tests must pass
  - Build must succeed
  - Linter must pass
- ✅ Require conversation resolution
- ✅ Require branch to be up to date
- ❌ No force push
- ❌ No deletion

### `develop` Branch

- ❌ No direct commits (except emergency hotfixes)
- ✅ Require pull request
- ✅ Require status checks to pass
- ❌ No force push
- ❌ No deletion

---

## CI/CD Pipeline (GitHub Actions)

### On Push to Any Branch

- Run unit tests
- Run linter
- Build project
- Report status to PR

### On PR to `develop`

- All of the above, plus:
- Run integration tests
- Check test coverage
- Security scan
- Build documentation

### On Merge to `main`

- All of the above, plus:
- Run E2E tests
- Create release tag
- Deploy to production (if configured)

---

## Hotfix Process

For critical production bugs that need immediate fix:

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/MP-999-critical-bug

# Make fix and test thoroughly
# ...

# Create PR to main (expedited review)
# After merge to main, also merge to develop
git checkout develop
git pull origin main
git push origin develop
```

**Hotfix Requirements:**
- Must include regression test
- Requires immediate review (< 2 hours)
- Must be deployed ASAP
- Document in incident log

---

## Regression Testing

After merging to `develop`, QA specialist should:

1. Run full E2E test suite
2. Manual smoke testing of affected features
3. Check for unintended side effects
4. Report any issues immediately

**Regression Test Schedule:**
- After each feature merge: Quick smoke test
- Before release to main: Full regression suite
- After hotfix: Full regression suite

---

## Release Process

### Creating a Release

1. Create release branch from `develop`
   ```bash
   git checkout -b release/v1.2.0 develop
   ```

2. Update version numbers
   - `package.json`
   - `CHANGELOG.md`
   - Documentation

3. Final testing on release branch
   - Full E2E test suite
   - Performance testing
   - Security scan

4. Merge release branch to `main`
   ```bash
   git checkout main
   git merge --no-ff release/v1.2.0
   git tag -a v1.2.0 -m "Release version 1.2.0"
   git push origin main --tags
   ```

5. Merge release branch back to `develop`
   ```bash
   git checkout develop
   git merge --no-ff release/v1.2.0
   git push origin develop
   ```

6. Delete release branch
   ```bash
   git branch -d release/v1.2.0
   ```

---

## Best Practices

### Do's ✅

- **Write meaningful commit messages** - Future you will thank you
- **Keep PRs small** - Easier to review (< 400 lines changed)
- **Test before pushing** - Don't rely on CI to catch basic errors
- **Review your own code first** - Catch obvious issues before others see
- **Respond to comments promptly** - Keep PRs moving
- **Keep branches up to date** - Merge develop regularly to avoid conflicts
- **Delete merged branches** - Keep repository clean
- **Write tests** - They catch bugs and document behavior

### Don'ts ❌

- **Don't commit directly to main or develop** - Always use PRs
- **Don't force push to shared branches** - You'll overwrite others' work
- **Don't commit secrets** - Use environment variables
- **Don't commit node_modules** - Use .gitignore
- **Don't commit commented-out code** - Delete it (git has history)
- **Don't skip tests** - They exist for a reason
- **Don't approve without reviewing** - You're accountable too
- **Don't create giant PRs** - Break into smaller chunks

---

## Git Hygiene

### Keep Branches Short-Lived

- Feature branches should live < 3 days
- Merge or rebase frequently to stay updated
- Delete branches after merge

### Resolve Conflicts Promptly

```bash
# Update your branch with latest develop
git checkout develop
git pull origin develop
git checkout feature/MP-123-recipe-list-ui
git merge develop

# Resolve conflicts, test, push
git push
```

### Clean Commit History

Use interactive rebase to clean up before PR:
```bash
# Squash/reorder last 5 commits
git rebase -i HEAD~5

# Force push to your feature branch (OK for feature branches only!)
git push --force-with-lease
```

---

## Emergency Procedures

### Rollback a Bad Deploy

```bash
# Revert the merge commit on main
git checkout main
git revert -m 1 <merge-commit-sha>
git push origin main

# Or reset to previous tag
git reset --hard v1.1.0
git push --force origin main  # Use with extreme caution!
```

### Fix a Broken Develop Branch

```bash
# Create fix branch
git checkout -b fix/broken-develop develop

# Fix the issue, test thoroughly
# Create PR back to develop (expedited review)
```

---

## Tools & Commands

### Useful Git Commands

```bash
# See what changed
git status
git diff

# View commit history
git log --oneline --graph --decorate --all

# See who changed a file
git blame <file>

# Find when a bug was introduced
git bisect start

# Stash uncommitted changes
git stash
git stash pop

# Cherry-pick a specific commit
git cherry-pick <commit-sha>

# View all branches
git branch -a

# Clean up deleted remote branches
git fetch --prune
```

### GitHub CLI Commands

```bash
# Create PR
gh pr create --title "[MP-123] Add feature" --body "Description"

# View PR status
gh pr status

# Checkout a PR locally
gh pr checkout 123

# Merge a PR
gh pr merge 123 --squash

# List open PRs
gh pr list
```

---

## FAQ

**Q: How big should a PR be?**
A: Aim for < 400 lines changed. If bigger, break into multiple PRs.

**Q: How long should code review take?**
A: Normal PRs within 24 hours. Critical fixes within 2 hours.

**Q: Can I merge my own PR?**
A: Only if approved by another team member and all checks pass.

**Q: What if tests fail in CI but pass locally?**
A: Environment difference. Check CI logs, fix the issue, don't skip tests.

**Q: Should I rebase or merge?**
A: Merge develop into your feature branch. Squash when merging to develop.

**Q: What if I accidentally committed to main?**
A: Create a revert commit immediately and notify team.

**Q: How do I handle database migrations in PRs?**
A: Include migration scripts, document in PR description, coordinate with team.

---

## References

- [Git Book](https://git-scm.com/book/en/v2)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [PR Best Practices](https://github.com/blog/1943-how-to-write-the-perfect-pull-request)

---

**Questions? Ask in team chat or create a discussion on GitHub.**
