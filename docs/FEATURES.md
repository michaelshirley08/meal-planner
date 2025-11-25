# Features Overview (MVP - No Pantry)

## Core MVP Features

### 1. Recipe Management

**Create & Edit Recipes**
- Multi-step creation wizard
- Support for fractional quantities (1/2, 1 1/2, 3/4)
- Mixed unit types (volume and mass)
- Ingredient autocomplete search
- Reorderable ingredients and instructions
- Recipe photos
- Cuisine type classification
- Prep and cook time tracking
- Default servings

**Recipe Details**
- Complete ingredient list with quantities
- Step-by-step instructions
- Recipe metadata (times, servings, ratings)
- Average rating display
- Times made counter
- User notes

**Recipe Discovery**
- Search by name, ingredients, or cuisine
- Filter by rating, cuisine type, cook time
- Sort by various criteria
- Recently used recipes
- Favorite recipes
- Highly-rated recipes

### 2. Ingredient System

**Comprehensive Ingredient Database**
- Searchable ingredient library
- Autocomplete suggestions
- Ingredient aliases (cilantro/coriander)
- Category classification (Produce, Meat, Dairy, etc.)
- Typical measurement type (volume or mass)
- Usage tracking (used in X recipes)

**Ingredient Management**
- Create custom ingredients
- Edit ingredient details
- Merge duplicate ingredients
- Soft delete (preserves recipe integrity)
- Bulk operations (category reassignment)
- Import/export ingredient lists

**Category Management**
- Customizable categories
- Reorderable (defines shopping list order)
- Color coding
- System and user categories

### 3. Meal Planning

**Weekly Calendar View**
- 7-day grid layout
- Four meal types: Breakfast, Lunch, Dinner, Snack
- Visual recipe cards with photos
- Quick navigation (previous/next week)
- Month and year views (optional)

**Meal Scheduling**
- Quick add: Click slot to add meal
- Drag and drop: Move meals between slots
- Recipe box sidebar with favorites and recent
- Search and add from recipe library
- Random meal suggestions

**Meal Management**
- View meal details
- Override recipe servings
- Add meal notes
- Reschedule meals
- Remove from calendar
- Mark as completed

### 4. Shopping List Generation

**Intelligent Aggregation**
- Generate from date range
- Aggregate same ingredients across recipes
- Unit conversion within measurement type
- Separate volume and mass (when needed)
- Scale quantities based on servings overrides
- Group by store category/aisle

**Shopping List Display**
- Organized by category
- Show which recipes use each ingredient
- Quantity breakdowns
- Preparation notes (diced, sliced, etc.)
- Mixed measurement type handling
- Estimated conversions (when applicable)

**Interactive Features**
- Check/uncheck items
- Swipe actions (mobile)
- Expand to see recipe details
- Export options (print, email, copy)

**Note:** MVP does not include pantry checking. Shopping lists show full required quantities for all ingredients.

### 5. Rating & Favorites

**Recipe Ratings**
- 1-5 star rating system
- Text notes with ratings
- Date cooked tracking
- Personal rating history
- Average rating calculation

**Rating Triggers**
- Prompt after meal date passes
- Rate from meal detail view
- Rate from recipe page
- Multiple ratings per recipe over time

**Favorites & History**
- Mark recipes as favorites
- Quick access to favorites
- Cooking history by date
- Times made counter
- "Try again" suggestions (recipes rated 3+ stars, not made recently)

### 6. Measurement System

**Fraction Support**
- Input: Simple fractions (1/2), mixed numbers (1 1/2), decimals (0.5)
- Display: Automatic formatting
- Arithmetic: Add, multiply, reduce fractions
- Precision: Practical fraction rounding

**Unit Conversion**
- Volume units: cup, tbsp, tsp, fl oz, ml, L
- Mass units: g, kg, oz, lb
- Automatic conversion to base units
- Display in preferred units
- Both volume and mass support

**User Preferences**
- Preferred unit system (metric, US standard, imperial)
- Temperature preference (F/C)
- Display format (fractions, decimals, both)
- Per-ingredient-type preferences

### 7. Search & Discovery

**Recipe Search**
- Full-text search
- Filter by cuisine, rating, time
- Sort by relevance, date, rating, name
- Recent recipes
- Frequently made recipes

**Ingredient Search**
- Autocomplete with aliases
- Filter by category
- Filter by measurement type
- Prioritize common ingredients

**Smart Suggestions**
- Random meal suggestions
- Based on cooking history
- Based on ratings

---

## User Experience Features

### Responsive Design
- Mobile-optimized layouts
- Touch-friendly interactions
- Swipe gestures
- Bottom navigation (mobile)
- Sidebar navigation (desktop)

### Drag & Drop
- Reorder recipe ingredients
- Reorder instructions
- Move meals on calendar
- Intuitive visual feedback

### Accessibility
- Keyboard navigation
- Screen reader support
- ARIA labels
- Color contrast compliance (WCAG AA)
- Focus indicators

### Performance
- Fast page loads (<2 seconds)
- Optimistic UI updates
- Image lazy loading
- Code splitting

---

## Technical Features

### Authentication & Security
- JWT-based authentication
- Secure password storage (bcrypt)
- Session management
- CSRF protection
- SQL injection prevention
- XSS protection

### Data Management
- Relational database (PostgreSQL)
- Soft deletes for data integrity
- Transaction support
- Audit trails (created/updated timestamps)
- Data validation

### API Design
- RESTful endpoints
- Consistent response format
- Pagination support
- Error handling
- Rate limiting
- API documentation

### Testing
- Unit tests for business logic
- Integration tests for APIs
- E2E tests for critical flows
- Performance testing
- Accessibility testing

---

## Future Features (Post-MVP)

### Pantry Management (Phase 8)

**Why Later:** Pantry adds complexity to shopping lists. After MVP launch, we'll better understand:
- How users actually shop
- Which pantry features are most needed
- Real-world usage patterns

**Planned Pantry Features:**
- Inventory tracking with quantities
- "Used some" functionality (subtract quantities)
- Auto-replenish items (staples like oil, salt)
- Shopping list integration (subtract pantry items)
- Bulk add from shopping list
- Low stock warnings
- Expiration tracking (optional)

**Pantry-Enhanced Shopping Lists:**
- Show items already in pantry
- Calculate remaining needed quantities
- "Add checked items to pantry" button
- Auto-replenish indicators

### Recipe Import
- Import from URLs
- Parse popular recipe sites
- OCR for recipe cards/books
- Import from other apps

### Meal Prep Mode
- Batch cooking planning
- Ingredient consolidation
- Storage instructions
- Reheating instructions

### Nutrition Information
- Calorie tracking
- Macro breakdown
- Dietary information
- Nutrition goals

### Cost Tracking
- Price per ingredient
- Cost per meal
- Budget planning
- Price comparison

### Social Features
- Share recipes publicly
- Follow other users
- Recipe collections/cookbooks
- Comments and reviews
- Recipe recommendations

### Integrations
- Smart home devices
- Voice assistants (Alexa, Google)
- Fitness apps
- Grocery delivery services
- Calendar apps

### AI-Powered Features
- Recipe suggestions based on pantry (requires pantry feature)
- Automatic meal plan generation
- Smart substitution suggestions
- Dietary restriction compliance
- Ingredient recognition from photos

### Multi-User/Household
- Shared meal plans
- Individual preferences
- Separate ratings
- Shopping list collaboration
- Permission management

### Advanced Analytics
- Cooking statistics
- Favorite cuisines
- Cost analysis
- Waste reduction tracking
- Recipe success rates

---

## Feature Comparison Matrix

| Feature | MVP | Post-MVP |
|---------|-----|----------|
| Recipe CRUD | ✅ | ✅ |
| Fractional quantities | ✅ | ✅ |
| Meal planning | ✅ | ✅ |
| Shopping list generation | ✅ | ✅ |
| Recipe ratings | ✅ | ✅ |
| Ingredient management | ✅ | ✅ |
| Category customization | ✅ | ✅ |
| Drag & drop calendar | ✅ | ✅ |
| **Pantry management** | ❌ | ✅ |
| **Pantry-aware shopping** | ❌ | ✅ |
| Mobile app | ❌ | 🔮 |
| Recipe import | ❌ | 🔮 |
| Nutrition tracking | ❌ | 🔮 |
| Cost tracking | ❌ | 🔮 |
| Social features | ❌ | 🔮 |
| AI recommendations | ❌ | 🔮 |
| Multi-user | ❌ | 🔮 |

**Legend:**
- ✅ Included
- ❌ Not included
- 🔮 Future consideration

---

## Key Differentiators (MVP)

What makes this application unique:

1. **Precise Fraction Handling**
   - True fractional arithmetic, not just display
   - Mixed number support
   - Practical rounding

2. **Smart Unit Aggregation**
   - Handles mixed volume/mass intelligently
   - Transparent about conversion limitations
   - User-friendly display of complex aggregations

3. **Flexible Meal Planning**
   - Multiple meals per day
   - Servings override per meal
   - Visual calendar interface

4. **Preparation Note Support**
   - Track how ingredients should be prepared
   - Group by preparation in shopping lists
   - Preserve preparation context

5. **Rating & History**
   - Track cooking history
   - Personal rating system
   - "Try again" suggestions

---

## Simplified User Stories (MVP)

**As a home cook, I want to:**
- Create recipes with precise fractional measurements
- Plan my meals for the week
- Generate a shopping list from my meal plan
- Check items off while shopping
- Rate recipes I've tried
- Find recipes I've made before

**As a family member, I want to:**
- See what's for dinner this week
- Add my favorite recipes to the meal plan
- Print the shopping list for grocery shopping
- Share recipes with the family

**As a busy professional, I want to:**
- Quickly plan a week of meals
- Generate shopping lists fast
- Rate recipes for future reference
- Export shopping lists to my phone

---

## What's NOT in MVP

To keep scope manageable, the MVP deliberately excludes:

1. **Pantry Management** - Added in Phase 8
   - Tracking what you have at home
   - Subtracting pantry from shopping lists
   - Auto-replenish items
   
2. **Recipe Import** - Future enhancement
   - Import from URLs
   - Parse other recipe formats
   
3. **Nutrition Tracking** - Future enhancement
   - Calorie information
   - Macro tracking
   
4. **Cost Tracking** - Future enhancement
   - Ingredient prices
   - Budget planning
   
5. **Social Features** - Future enhancement
   - Sharing recipes
   - Following users
   
6. **Mobile App** - Future enhancement
   - Native mobile experience
   - Offline mode

---

## Benefits of Focused MVP

1. **Faster Launch:** 20 weeks instead of 22+ weeks
2. **Core Value First:** Focus on recipe creation and meal planning
3. **Simpler Testing:** Fewer features to test thoroughly
4. **Better User Feedback:** Users can focus feedback on core features
5. **Iterative Improvement:** Add pantry and other features based on real needs
6. **Lower Risk:** Simpler codebase, fewer bugs
7. **Cost Effective:** Less development time for initial launch

---

## Post-MVP Roadmap

### Immediate Priority (Phase 8)
1. Pantry management
2. Pantry-integrated shopping lists

### Short Term (3-6 months)
1. Recipe import from URLs
2. Mobile app development
3. Performance optimizations

### Medium Term (6-12 months)
1. Nutrition information
2. Cost tracking
3. Social features

### Long Term (12+ months)
1. AI-powered features
2. Advanced integrations
3. Multi-user households
