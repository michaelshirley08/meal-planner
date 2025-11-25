# Developer Quick Reference

**One-page reference for daily development**

---

## Starting New Work

```bash
# 1. Update develop branch
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/MP-123-short-description

# 3. Make your changes...
```

---

## Before Creating PR

```bash
# Run ALL these commands (in order):
npm test                 # All tests must pass
npm run lint             # No linting errors
npm run build            # Build must succeed

# Then self-review your changes
git diff develop
```

---

## Creating a PR

```bash
# Push your branch
git push -u origin feature/MP-123-description

# Create PR using GitHub CLI
gh pr create --title "[MP-123] Brief description" \
  --body "$(cat <<'EOF'
## Summary
What this PR does in 2-3 sentences

## Changes Made
- [ ] Change 1
- [ ] Change 2

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed

🤖 Generated with Claude Code
EOF
)"
```

---

## Commit Message Format

```
<type>(<scope>): <subject>

<body - explain WHY>

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types:** feat, fix, refactor, test, docs, style, perf, chore

**Example:**
```
feat(recipes): add search and filter to recipe list

Users can now search recipes by title and filter by category.
Uses debounced input to avoid excessive API calls.

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Branch Naming

```
<type>/MP-<ticket>-<description>

Examples:
feature/MP-123-recipe-search
fix/MP-456-auth-bug
refactor/MP-789-service-layer
test/MP-101-e2e-tests
docs/MP-202-api-docs
```

---

## Code Review Checklist

**Before requesting review:**
- [ ] Tests pass locally
- [ ] Linter passes (no errors)
- [ ] Build succeeds
- [ ] Self-reviewed all changes
- [ ] No console.log or debug code
- [ ] Documentation updated

**Reviewer checks:**
- [ ] Code follows TECHNICAL_STANDARDS.md
- [ ] Tests cover changes
- [ ] No security issues
- [ ] Error handling present
- [ ] Architecture patterns respected

---

## Common Commands

```bash
# See what changed
git status
git diff

# Run tests
npm test                    # All tests
npm test -- recipes         # Specific test
npm test -- --coverage      # With coverage

# Linting
npm run lint                # Check for errors
npm run lint:fix            # Auto-fix

# Building
npm run build               # Production build
npm run dev                 # Development server

# Git operations
git log --oneline -10       # Recent commits
git stash                   # Save changes temporarily
git stash pop               # Restore stashed changes
```

---

## Coverage Requirements

- **New features:** 80% coverage minimum
- **Bug fixes:** Add regression test
- **Refactoring:** All tests still pass

**Check coverage:**
```bash
npm test -- --coverage
```

---

## When to Ask for Help

**Ask Tech Lead BEFORE:**
- Making architectural decisions
- Adding external dependencies
- Changing database schema
- Making breaking API changes
- Unsure about design pattern

**Ask Tech Lead AFTER (if stuck):**
- Merge conflicts appear
- CI fails unexpectedly
- Test strategy unclear
- PR gets "Request Changes"

---

## PR Size Guidelines

- **Small:** < 100 lines (quick review)
- **Medium:** 100-400 lines (normal review)
- **Large:** > 400 lines (break into smaller PRs)

If your PR is > 400 lines, consider splitting it.

---

## Test Coverage Measurement

```bash
# Run with coverage report
npm test -- --coverage

# View HTML report
open coverage/index.html

# Coverage must be >= 80% for new code
```

---

## Database Migrations

**Before changing schema:**
1. Read docs/DATABASE_MIGRATION_GUIDE.md
2. Create migration script
3. Test rollback procedure
4. Get Data Engineer review

**Migration naming:**
```
YYYYMMDDHHMMSS_description.sql
20251125103000_add_recipe_categories.sql
```

---

## Emergency Procedures

**I accidentally committed to main:**
```bash
# DON'T PANIC!
git reset --soft HEAD~1  # Undo commit, keep changes
git checkout -b feature/MP-XXX-fix
# Create proper PR
```

**I need to undo my last commit:**
```bash
git reset --soft HEAD~1  # Keep changes
# OR
git reset --hard HEAD~1  # Discard changes
```

**My branch is out of date:**
```bash
git checkout develop
git pull origin develop
git checkout feature/MP-123-my-branch
git merge develop
# Resolve conflicts if any
git push
```

---

## Links

- **GitHub Workflow:** `/GITHUB_WORKFLOW.md`
- **Technical Standards:** `/TECHNICAL_STANDARDS.md`
- **Database Guide:** `/docs/DATABASE_MIGRATION_GUIDE.md`
- **Documentation Index:** `/docs/DOCUMENTATION_INDEX.md`

---

**Questions? Ask in team chat or create a GitHub Discussion.**
