# Recipe & Meal Planning Application

## Project Overview

A comprehensive meal planning and recipe management application that allows users to create recipes with precise measurements, plan meals on a calendar, generate shopping lists with intelligent ingredient aggregation, and manage pantry inventory.

## Core Features

- **Recipe Management**: Create, edit, and store recipes with support for fractional measurements, mixed units (metric/imperial), and detailed preparation notes
- **Meal Planning Calendar**: Visual weekly/monthly calendar with drag-and-drop meal scheduling
- **Intelligent Shopping Lists**: Automatic aggregation of ingredients across multiple recipes with unit conversion and pantry checking
- **Pantry Management**: Track ingredients on hand with auto-replenish features for staples
- **Rating System**: Rate recipes and track cooking history
- **Unit Flexibility**: Support for both volume and mass measurements with automatic conversion

## Key Technical Challenges

1. **Fraction Mathematics**: Parsing and storing fractional quantities (1/2, 1 1/2, 3/4) with proper arithmetic operations
2. **Unit Conversion**: Converting between metric and imperial units while handling volume/mass separation
3. **Ingredient Aggregation**: Combining ingredients from multiple recipes with different units and measurement types
4. **Pantry Integration**: Smart shopping list generation that accounts for existing pantry inventory

## Documentation Structure

- `DATABASE_SCHEMA.md` - Complete database design and relationships
- `API_SPECIFICATION.md` - API endpoints and request/response formats
- `FEATURES.md` - Detailed feature descriptions and user interactions
- `USER_FLOWS.md` - Step-by-step user interaction flows
- `MEASUREMENT_SYSTEM.md` - Fraction parsing, storage, and unit conversion logic
- `SHOPPING_LIST_ALGORITHM.md` - Complex aggregation and combination logic
- `EDGE_CASES.md` - Edge case handling and solutions
- `TECHNICAL_ARCHITECTURE.md` - System architecture and tech stack
- `DEVELOPMENT_PHASES.md` - Suggested implementation roadmap

## Quick Start

1. Review `DATABASE_SCHEMA.md` to understand data structure
2. Read `TECHNICAL_ARCHITECTURE.md` for technology choices
3. Follow `DEVELOPMENT_PHASES.md` for implementation order
4. Reference `MEASUREMENT_SYSTEM.md` for the fraction/conversion system

## Technology Stack

**Frontend:**
- React or Vue.js for web application
- React Native for mobile apps
- FullCalendar or react-big-calendar for calendar views
- react-beautiful-dnd for drag-and-drop functionality

**Backend:**
- PostgreSQL database
- REST or GraphQL API
- Node.js or Python backend

**Key Libraries:**
- Fraction.js or custom parser for fraction mathematics
- convert-units (extended) for unit conversion
- Algolia or ElasticSearch for ingredient autocomplete

## Target Users

- Home cooks planning weekly meals
- Families coordinating meal prep
- Individuals tracking recipes and pantry inventory
- Anyone looking to streamline grocery shopping

## Development Priority

1. Core data models and API
2. Recipe creation and management
3. Ingredient system with autocomplete
4. Basic meal planning calendar
5. Shopping list generation
6. Rating and favorites system
7. Advanced features (category management, enhanced search)
8. Future: Pantry management, multi-user, unit preferences
