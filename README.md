# Meal Planner

A single-user local meal planning application for managing recipes, planning weekly meals, and organizing ingredients. Built with React, TypeScript, Node.js, and SQLite.

## Overview

Meal Planner is a browser-based desktop application that runs locally on your computer. All your recipes, meal plans, and data stay on your machine—no cloud hosting or accounts required.

**Current Status:** POC Phase - Core recipe management and meal planning features

## Features

### Current (POC)
- **Recipe Management**: Create, edit, search, and organize recipes
- **Ingredient Tracking**: Manage ingredients with quantity and units
- **Weekly Meal Planning**: Drag-and-drop meal planning calendar
- **Local Storage**: All data stored locally using SQLite

### Planned (MVP)
- Shopping list generation
- Recipe photos and ratings
- Enhanced search and filtering

### Future
- Pantry management
- Advanced meal planning features
- Desktop app packaging (Electron/Tauri)

## Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express
- **Database**: SQLite with Prisma ORM
- **Language**: TypeScript
- **Testing**: Jest

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Custom components
- **Testing**: Vitest + Playwright
- **Routing**: React Router

## Quick Start

### Prerequisites
- Node.js 20 or higher
- npm 9 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meal-planner
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up the database**
   ```bash
   cp .env.example .env
   npm run db:generate
   npm run db:migrate
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Development

**Start the backend server:**
```bash
cd backend
npm run dev
```
Backend runs on http://localhost:3000

**Start the frontend dev server:**
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

### Testing

**Backend tests:**
```bash
cd backend
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
```

**Frontend tests:**
```bash
cd frontend
npm test                 # Unit tests
npm run test:e2e         # E2E tests (requires backend running)
```

**All tests:**
```bash
# From project root (after implementing scripts)
npm test
```

### Building for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Project Structure

```
meal-planner/
├── backend/              # Node.js Express API
│   ├── src/
│   │   ├── controllers/  # HTTP request handlers
│   │   ├── services/     # Business logic
│   │   ├── repositories/ # Database access
│   │   ├── models/       # Type definitions
│   │   └── middleware/   # Express middleware
│   ├── prisma/           # Database schema and migrations
│   └── test/             # Backend tests
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page-level components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API clients
│   │   └── types/        # TypeScript types
│   └── tests/            # Frontend tests
├── docs/                 # Documentation
└── .github/              # GitHub workflows and templates
```

## Documentation

- **[GITHUB_WORKFLOW.md](./GITHUB_WORKFLOW.md)** - Development workflow and Git practices
- **[TECHNICAL_STANDARDS.md](./TECHNICAL_STANDARDS.md)** - Code standards and conventions
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute to this project
- **[DEVELOPER_QUICK_REFERENCE.md](./DEVELOPER_QUICK_REFERENCE.md)** - Quick command reference
- **[docs/](./docs/)** - Additional documentation

## Development Workflow

This project follows a Git Flow variant with feature branches, PR reviews, and automated testing.

**Quick workflow:**
```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/MP-123-description

# Make changes, commit with conventional commits
git add .
git commit -m "feat(recipes): add search functionality"

# Push and create PR
git push -u origin feature/MP-123-description
gh pr create --title "[MP-123] Add search" --body "..."
```

See [GITHUB_WORKFLOW.md](./GITHUB_WORKFLOW.md) for complete workflow details.

## Code Quality

### Standards
- TypeScript strict mode enabled
- ESLint for code linting
- Prettier for code formatting (coming soon)
- 80% minimum test coverage for new features

### Pre-Merge Requirements
- ✅ All tests pass
- ✅ Linter passes with no errors
- ✅ Build succeeds
- ✅ Code review approved
- ✅ Test coverage maintained

See [TECHNICAL_STANDARDS.md](./TECHNICAL_STANDARDS.md) for detailed standards.

## Database

**Schema**: SQLite database with Prisma ORM

**Key tables:**
- `Recipe` - Recipe details and metadata
- `Ingredient` - Ingredient definitions
- `RecipeIngredient` - Recipe-ingredient relationships
- `RecipeInstruction` - Step-by-step instructions
- `MealPlan` - Weekly meal planning

**Migrations**: Database changes require migration scripts. See [docs/DATABASE_MIGRATION_GUIDE.md](./docs/DATABASE_MIGRATION_GUIDE.md)

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Quick checklist:**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linter and tests locally
6. Create a pull request
7. Wait for review

## Testing

### Test Types
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and services
- **E2E Tests**: Test complete user flows

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend unit tests
cd frontend
npm test

# Frontend E2E tests (requires backend running)
cd frontend
npm run test:e2e
```

## License

[MIT](./LICENSE) - See LICENSE file for details

## Architecture

**Single-user local application:**
- No authentication required (single user)
- Data stored locally in SQLite database
- Browser-based UI
- Backend API runs locally

**Design principles:**
- Local-first data storage
- Privacy by design (data never leaves your computer)
- Simple setup (no complex configuration)
- Extensible architecture for future features

## Support

For questions, issues, or feature requests:
- Create an issue on GitHub
- Check existing documentation in [docs/](./docs/)
- Review [GITHUB_WORKFLOW.md](./GITHUB_WORKFLOW.md) for development questions

## Roadmap

### Phase 1: POC (Current) - 3 days
- ✅ Backend API setup
- ✅ Frontend React app
- ✅ Basic recipe CRUD
- ✅ Meal planning calendar
- ⏳ GitHub workflows and CI/CD

### Phase 2: MVP - 2 weeks
- Shopping list generation
- Recipe photos
- Recipe ratings and reviews
- Enhanced search

### Phase 3: Full Product - 1 month
- Pantry management
- Advanced features
- Desktop packaging
- Installer for easy distribution

---

**Built with [Claude Code](https://claude.com/claude-code)**
