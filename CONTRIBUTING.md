# Contributing to Meal Planner

Thank you for your interest in contributing to Meal Planner! This document provides guidelines and instructions for contributing to the project.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Coding Standards](#coding-standards)
4. [Testing Requirements](#testing-requirements)
5. [Pull Request Process](#pull-request-process)
6. [Code Review](#code-review)
7. [Database Changes](#database-changes)

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm 9 or higher
- Git
- GitHub CLI (optional but recommended)

### Setup Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone <your-fork-url>
   cd meal-planner
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up the database**
   ```bash
   cd backend
   cp .env.example .env
   npm run db:generate
   npm run db:migrate
   ```

4. **Verify setup**
   ```bash
   # Run tests
   cd backend && npm test
   cd ../frontend && npm test
   ```

### First Time Contributors

If this is your first contribution:
1. Read through [GITHUB_WORKFLOW.md](./GITHUB_WORKFLOW.md) for our development workflow
2. Review [TECHNICAL_STANDARDS.md](./TECHNICAL_STANDARDS.md) for coding standards
3. Check [DEVELOPER_QUICK_REFERENCE.md](./DEVELOPER_QUICK_REFERENCE.md) for common commands
4. Look for issues labeled `good-first-issue` or `help-wanted`

## Development Workflow

We follow a Git Flow variant with feature branches and pull requests.

### Branch Strategy

**Main branches:**
- `main` - Production-ready code (protected)
- `develop` - Integration branch (protected)

**Feature branches:**
- Format: `<type>/<ticket-id>-<description>`
- Examples:
  - `feature/MP-123-recipe-search`
  - `fix/MP-456-meal-plan-bug`
  - `docs/MP-789-api-documentation`

### Starting New Work

```bash
# Update develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/MP-123-recipe-search

# Make your changes...
```

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

🤖 Generated with Claude Code (https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `test` - Test changes
- `docs` - Documentation
- `style` - Code style changes
- `perf` - Performance improvements
- `chore` - Maintenance tasks

**Example:**
```
feat(recipes): add search functionality with filters

Implemented search bar and category filters for recipe list.
Added debouncing for search input. Integrated with existing
GET /recipes endpoint.

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
```

See [GITHUB_WORKFLOW.md](./GITHUB_WORKFLOW.md) for more details.

## Coding Standards

### TypeScript
- Use strict mode
- Avoid `any` type (use `unknown` with type guards)
- Prefer interfaces over types for object shapes
- Use explicit return types for functions

### Code Style
- Use meaningful variable and function names
- Keep functions small and focused (single responsibility)
- Comment complex logic (explain WHY, not WHAT)
- No console.log in production code (use proper logging)
- Handle errors explicitly

### File Organization
- Follow existing project structure
- Place files in appropriate directories
- Use consistent naming conventions:
  - Components: `PascalCase.tsx`
  - Utilities: `camelCase.utils.ts`
  - Services: `camelCase.service.ts`
  - Tests: `filename.test.ts`

See [TECHNICAL_STANDARDS.md](./TECHNICAL_STANDARDS.md) for complete standards.

## Testing Requirements

### Test Coverage
- **New features**: Minimum 80% coverage for new code
- **Bug fixes**: Add regression test that catches the bug
- **Refactoring**: All existing tests must still pass

### Running Tests

**Backend:**
```bash
cd backend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
```

**Frontend:**
```bash
cd frontend
npm test                 # Unit tests
npm run test:e2e         # E2E tests (backend must be running)
```

### Writing Tests

**Unit tests:**
- Test business logic, not implementation details
- Use descriptive test names: `should return empty array when no recipes exist`
- Follow Arrange-Act-Assert pattern
- Mock external dependencies

**Integration tests:**
- Test API endpoints end-to-end
- Test error cases and edge cases
- Verify status codes and response bodies

**E2E tests:**
- Test critical user flows
- Keep tests focused and independent
- Clean up test data after each test

## Pull Request Process

### Before Creating a PR

**Run these checks locally:**
```bash
# Backend
cd backend
npm run lint              # No errors
npm test                  # All tests pass
npm run build             # Build succeeds

# Frontend
cd frontend
npm run lint              # No errors
npm test                  # All tests pass
npm run build             # Build succeeds
```

### Creating a Pull Request

1. **Push your branch**
   ```bash
   git push -u origin feature/MP-123-recipe-search
   ```

2. **Create PR using GitHub CLI** (recommended)
   ```bash
   gh pr create --title "[MP-123] Add recipe search" --body "..."
   ```

   Or create PR through GitHub web interface.

3. **Fill out PR template completely**
   - Provide clear summary
   - List all changes
   - Describe testing performed
   - Add screenshots for UI changes
   - Note any database changes
   - Check all checklist items

4. **Request review**
   - PRs require at least 1 approval
   - Tag relevant reviewers based on changes:
     - Architecture changes: Tech Lead
     - Database changes: Data Engineer
     - Test coverage: QA Specialist

### PR Size Guidelines
- **Small**: < 100 lines changed (quick review)
- **Medium**: 100-400 lines changed (normal review)
- **Large**: > 400 lines changed (consider splitting)

**Keep PRs small when possible!** Easier to review = faster approval.

### PR Requirements

Before merge, PRs must have:
- ✅ All CI checks passing (tests, lint, build)
- ✅ At least 1 approval from reviewer
- ✅ All review comments resolved
- ✅ Branch up to date with target branch
- ✅ No merge conflicts

## Code Review

### For Authors

**Responding to reviews:**
- Address all comments (reply or make changes)
- Mark conversations as resolved when fixed
- Re-request review after making changes
- Keep discussions professional and constructive

**Response time expectations:**
- Normal PRs: Respond within 24 hours
- Critical fixes: Respond within 2 hours

### For Reviewers

**What to review:**
1. **Functionality** - Does it work as intended?
2. **Code quality** - Clean, readable, maintainable?
3. **Tests** - Sufficient test coverage?
4. **Standards** - Follows project conventions?
5. **Security** - Any vulnerabilities?
6. **Performance** - Any concerns?

**Approval types:**
- ✅ **Approve** - Code is ready to merge
- 💬 **Comment** - Suggestions but not blocking
- ❌ **Request Changes** - Must be addressed before merge

**Response time expectations:**
- Normal PRs: Review within 24 hours
- Critical fixes: Review within 2 hours

See [GITHUB_WORKFLOW.md](./GITHUB_WORKFLOW.md) for detailed review guidelines.

## Database Changes

Database changes require special care and review.

### Requirements
- Include migration script in PR
- Document rollback procedure
- Classify risk level (LOW/MEDIUM/HIGH/CRITICAL)
- Requires Data Engineer approval for MEDIUM+ risk

### Creating a Migration

```bash
cd backend

# Create migration
npm run db:migrate

# Test migration
npm run db:generate
npm test
```

### Migration Checklist
- [ ] Migration script tested locally
- [ ] Rollback procedure documented
- [ ] Risk level assessed
- [ ] Breaking changes noted
- [ ] Data loss risk mitigated

See [docs/DATABASE_MIGRATION_GUIDE.md](./docs/DATABASE_MIGRATION_GUIDE.md) for complete guide.

## Best Practices

### Do's ✅
- Write clear, descriptive commit messages
- Keep PRs small and focused
- Test your changes thoroughly
- Add tests for new features
- Update documentation when needed
- Self-review your code before requesting review
- Respond to review comments promptly
- Keep your branch up to date with develop

### Don'ts ❌
- Don't commit directly to main or develop
- Don't commit secrets or credentials
- Don't skip tests or linting
- Don't create giant PRs (split them up!)
- Don't commit commented-out code
- Don't force push to shared branches
- Don't commit node_modules or build artifacts
- Don't merge without approval

## Getting Help

**If you're stuck:**
1. Check existing documentation (especially GITHUB_WORKFLOW.md)
2. Search closed issues for similar problems
3. Ask in GitHub Discussions
4. Create an issue describing your problem

**If you find a bug:**
1. Check if issue already exists
2. Create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)

**If you have a feature idea:**
1. Check if similar feature request exists
2. Create a feature request issue with:
   - Clear description of the feature
   - Use case / why it's needed
   - Proposed implementation (if you have ideas)

## Recognition

Contributors are recognized in:
- GitHub contributors list
- Release notes
- Project documentation

Thank you for contributing to Meal Planner!

## Additional Resources

- [GITHUB_WORKFLOW.md](./GITHUB_WORKFLOW.md) - Complete development workflow
- [TECHNICAL_STANDARDS.md](./TECHNICAL_STANDARDS.md) - Detailed coding standards
- [DEVELOPER_QUICK_REFERENCE.md](./DEVELOPER_QUICK_REFERENCE.md) - Quick command reference
- [docs/](./docs/) - Additional documentation
- [Conventional Commits](https://www.conventionalcommits.org/) - Commit message format
- [Git Book](https://git-scm.com/book/en/v2) - Git documentation

---

**Questions?** Create a GitHub Discussion or open an issue.
