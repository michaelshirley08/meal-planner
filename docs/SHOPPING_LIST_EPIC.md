# Epic: Shopping List Feature

**Status:** Backlog (Post-POC)
**Priority:** High (First feature after POC)
**Estimated Effort:** 3-5 days
**Dependencies:** POC must be complete

---

## Epic Overview

Enable users to generate, save, and manage shopping lists based on their meal plans, with the ability to check off items they already have in their pantry.

---

## User Problem

**Current State (POC):**
- Users can plan meals for the week
- Users know which ingredients they need
- BUT they have to manually figure out what to buy

**Desired State:**
- Users click a button to generate shopping list from meal plan
- System aggregates ingredients across multiple recipes
- Users check off items they already have
- Users save the list with a name
- Users take the list to the grocery store

---

## User Workflow (Detailed)

### Flow 1: Generate Shopping List
1. User is viewing their weekly meal plan
2. User clicks "Generate Shopping List" button
3. System prompts for date range (defaults to current week)
4. User confirms date range
5. System generates list of all ingredients from meals in that range
6. System shows list organized by category (produce, dairy, etc.)
7. System shows quantity aggregation (e.g., "3 recipes need 4 cups flour total")

### Flow 2: Review Against Pantry
1. User has generated shopping list on screen
2. User goes to their physical pantry
3. For each ingredient on list:
   - If they have it: User checks "Already Have" checkbox
   - If they need it: User leaves unchecked
4. List now shows only items they need to buy

### Flow 3: Save and Name List
1. User clicks "Save List" button
2. System prompts for list name
3. User enters name (e.g., "Grocery Trip Nov 25" or "Weekly Shopping")
4. System saves list with name and date
5. User can now close app or continue

### Flow 4: Shopping at Store
1. User opens app at grocery store
2. User navigates to "Shopping Lists" section
3. User opens their saved list
4. As user shops, they check off each item they put in cart
5. List shows progress (e.g., "12 of 24 items checked")

### Flow 5: Complete Shopping Trip
1. User has checked off all items (or all they could get)
2. User clicks "Done" or "Archive"
3. System marks list as completed
4. User can reference completed lists later

---

## User Stories

### Epic: Shopping List Generation

#### Story 1: Generate Basic Shopping List
**As a** user
**I want to** generate a shopping list from my meal plan
**So that** I know what ingredients I need to buy

**Acceptance Criteria:**
- [ ] "Generate Shopping List" button visible on meal planner page
- [ ] User can select date range for list generation
- [ ] System shows all ingredients from meals in that range
- [ ] Ingredients are displayed with quantities
- [ ] List shows which recipe(s) use each ingredient

**Tasks:**
- [ ] Design shopping list generation UI
- [ ] Create API endpoint to aggregate ingredients
- [ ] Implement quantity aggregation logic (combine same ingredients)
- [ ] Handle unit conversions (2 cups + 500ml = X ml)
- [ ] Display ingredient list with quantities

---

#### Story 2: Organize by Category
**As a** user
**I want to** see shopping list organized by store category
**So that** I can shop efficiently aisle by aisle

**Acceptance Criteria:**
- [ ] Ingredients grouped by category (Produce, Dairy, Meat, etc.)
- [ ] Categories match typical grocery store layout
- [ ] User can customize category order
- [ ] Uncategorized items appear in "Other" section

**Tasks:**
- [ ] Add category field to ingredients
- [ ] Create default categories (Produce, Dairy, Meat, Pantry, etc.)
- [ ] Group shopping list items by category
- [ ] Allow category order customization

---

#### Story 3: Check Items Already in Pantry
**As a** user
**I want to** check off items I already have
**So that** I only see what I need to buy

**Acceptance Criteria:**
- [ ] Each item has "Already Have" checkbox
- [ ] Checked items stay visible but are visually distinguished (grayed out)
- [ ] User can toggle checkbox on/off
- [ ] Checkbox state persists if user closes app

**Tasks:**
- [ ] Add "alreadyHave" field to shopping list items
- [ ] Create checkbox UI component
- [ ] Implement toggle functionality
- [ ] Style checked items differently
- [ ] Persist state in database

---

#### Story 4: Save and Name Shopping List
**As a** user
**I want to** save my shopping list with a name
**So that** I can access it later

**Acceptance Criteria:**
- [ ] "Save List" button visible on shopping list page
- [ ] User prompted for list name
- [ ] List saved with name, date range, and current state
- [ ] User can access saved lists from "Shopping Lists" page
- [ ] Saved lists show creation date

**Tasks:**
- [ ] Create ShoppingList table in database
- [ ] Create "Save List" UI flow
- [ ] Implement save functionality
- [ ] Create "Shopping Lists" page to view saved lists
- [ ] Display list of saved shopping lists

---

#### Story 5: Use List While Shopping
**As a** user
**I want to** check off items as I shop
**So that** I track my shopping progress

**Acceptance Criteria:**
- [ ] User can open saved shopping list
- [ ] Each item has checkbox for "In Cart"
- [ ] Progress indicator shows X of Y items checked
- [ ] Checked items stay visible but marked differently
- [ ] Changes save automatically

**Tasks:**
- [ ] Add "checked" field to shopping list items
- [ ] Create progress indicator component
- [ ] Implement auto-save on checkbox change
- [ ] Show visual feedback for checked items

---

#### Story 6: View Past Shopping Lists
**As a** user
**I want to** view my past shopping lists
**So that** I can reference what I bought previously

**Acceptance Criteria:**
- [ ] "Shopping Lists" page shows all lists (current and past)
- [ ] Lists show name, date range, and status
- [ ] User can filter by status (active, completed, archived)
- [ ] User can open any past list to view details
- [ ] Past lists are read-only (or with "Edit" option)

**Tasks:**
- [ ] Add status field to ShoppingList (active, completed, archived)
- [ ] Create list view with filters
- [ ] Implement list detail view
- [ ] Add "Archive" functionality

---

### Advanced Stories (Post-MVP)

#### Story 7: Edit Shopping List
**As a** user
**I want to** add or remove items from my shopping list
**So that** I can include things not in my meal plan

**Acceptance Criteria:**
- [ ] User can add custom items to list
- [ ] User can remove items from list
- [ ] User can edit quantities
- [ ] Changes are saved

---

#### Story 8: Share Shopping List
**As a** user
**I want to** share my shopping list with family
**So that** someone else can do the shopping

**Acceptance Criteria:**
- [ ] "Share" button generates sharable link or text
- [ ] Recipient can view list (read-only)
- [ ] List updates in real-time if shared live

---

#### Story 9: Recipe References
**As a** user
**I want to** see which recipes need each ingredient
**So that** I understand why I'm buying it

**Acceptance Criteria:**
- [ ] Each ingredient shows list of recipes using it
- [ ] User can click recipe name to view recipe
- [ ] Quantities shown per recipe

---

## Database Schema

### ShoppingList Table
```prisma
model ShoppingList {
  id          Int                  @id @default(autoincrement())
  name        String               // "Grocery Trip Nov 25"
  startDate   DateTime             // Date range for meal plan
  endDate     DateTime
  status      String               @default("active") // active, completed, archived
  createdAt   DateTime             @default(now())
  completedAt DateTime?
  items       ShoppingListItem[]

  @@map("shopping_lists")
}
```

### ShoppingListItem Table
```prisma
model ShoppingListItem {
  id              Int           @id @default(autoincrement())
  shoppingListId  Int
  ingredientId    Int?          // Can be null for custom items
  ingredientName  String        // Denormalized for performance
  quantityWhole   Int
  quantityNum     Int
  quantityDenom   Int
  unit            String
  category        String?       // Produce, Dairy, etc.
  alreadyHave     Boolean       @default(false)
  checked         Boolean       @default(false)
  notes           String?       // "diced", "organic", etc.
  recipeNames     String?       // JSON array of recipe names
  displayOrder    Int
  shoppingList    ShoppingList  @relation(fields: [shoppingListId], references: [id], onDelete: Cascade)

  @@map("shopping_list_items")
}
```

### Ingredient Table (Add Category)
```prisma
model Ingredient {
  id                Int                @id @default(autoincrement())
  name              String             @unique
  category          String?            // NEW: Produce, Dairy, Meat, etc.
  typicalUnit       String?            // cup, lb, oz, etc.
  createdAt         DateTime           @default(now())
  recipeIngredients RecipeIngredient[]

  @@map("ingredients")
}
```

---

## API Endpoints

### Shopping Lists
- `POST /shopping-lists/generate` - Generate list from date range
  - Body: `{ startDate, endDate }`
  - Returns: Generated shopping list (not saved yet)

- `POST /shopping-lists` - Save a shopping list
  - Body: `{ name, startDate, endDate, items[] }`
  - Returns: Saved shopping list with ID

- `GET /shopping-lists` - Get all shopping lists
  - Query: `?status=active` (optional filter)
  - Returns: Array of shopping lists

- `GET /shopping-lists/:id` - Get specific shopping list
  - Returns: Shopping list with items

- `PUT /shopping-lists/:id` - Update shopping list name/status
  - Body: `{ name?, status? }`

- `DELETE /shopping-lists/:id` - Delete shopping list

- `POST /shopping-lists/:id/items/:itemId/toggle-have` - Toggle "already have"
  - Returns: Updated item

- `POST /shopping-lists/:id/items/:itemId/toggle-checked` - Toggle "checked"
  - Returns: Updated item

- `POST /shopping-lists/:id/complete` - Mark list as completed

**Total New Endpoints:** 9

---

## UI Components

### ShoppingListGenerator
- Date range picker
- "Generate" button
- Loading state
- Error handling

### ShoppingListView
- Category sections (collapsible)
- Item rows with checkboxes
- Progress indicator
- "Save List" button
- "Share" button (future)

### ShoppingListItem
- Ingredient name
- Quantity display (with unit)
- Two checkboxes: "Already Have" and "In Cart"
- Recipe references (expandable)
- Notes display

### ShoppingListsIndex
- List of saved shopping lists
- Filter by status
- Create new list button
- Search/filter

---

## Business Logic

### Ingredient Aggregation Algorithm

```typescript
function aggregateIngredients(mealPlans: MealPlan[]): AggregatedIngredient[] {
  const ingredientMap = new Map();

  for (const meal of mealPlans) {
    const recipe = meal.recipe;
    const servingFactor = meal.servingOverride
      ? meal.servingOverride / recipe.defaultServings
      : 1;

    for (const ingredient of recipe.ingredients) {
      const key = `${ingredient.ingredientId}_${ingredient.unit}`;

      if (!ingredientMap.has(key)) {
        ingredientMap.set(key, {
          ingredientId: ingredient.ingredientId,
          ingredientName: ingredient.ingredient.name,
          quantity: { whole: 0, num: 0, denom: 1 },
          unit: ingredient.unit,
          category: ingredient.ingredient.category,
          recipes: []
        });
      }

      const aggregated = ingredientMap.get(key);

      // Scale quantity by serving factor
      const scaledQty = multiplyQuantity(
        dbToQuantity(ingredient.quantityWhole, ingredient.quantityNum, ingredient.quantityDenom),
        servingFactor
      );

      // Add to aggregated quantity
      aggregated.quantity = addQuantities(aggregated.quantity, scaledQty);
      aggregated.recipes.push(recipe.name);
    }
  }

  return Array.from(ingredientMap.values())
    .sort((a, b) => categoryOrder(a.category) - categoryOrder(b.category));
}
```

### Unit Conversion Strategy
- **Same unit:** Add quantities directly (2 cups + 1 1/2 cups = 3 1/2 cups)
- **Different units, same type:** Convert to base unit, add, show both
  - Example: 2 cups + 500ml = 973ml (also show as "~4 cups")
- **Different types:** Keep separate, don't convert volume to mass

---

## Open Questions for Refinement

### User Experience
1. **Multiple "already have" states?**
   - Option A: Single checkbox (binary: have or don't have)
   - Option B: Multiple states (have enough, have some, don't have)
   - Recommendation: Option A (simpler)

2. **Edit generated list before saving?**
   - Can user add/remove items before first save?
   - Or only after save?
   - Recommendation: Only after save (simpler for POC)

3. **List lifecycle?**
   - Auto-archive completed lists after X days?
   - Keep all lists forever?
   - User-managed only?
   - Recommendation: Keep last 20 lists, archive older

4. **Multiple concurrent lists?**
   - Can user have multiple "active" lists?
   - Or only one "current" list at a time?
   - Recommendation: Multiple active lists

### Technical
5. **Unit conversion complexity?**
   - Handle all conversions automatically?
   - Show mixed units when can't convert?
   - Recommendation: Best effort conversion, show mixed when needed

6. **Performance with large lists?**
   - What if user plans 30 meals? (90+ ingredients)
   - Pagination? Virtualization?
   - Recommendation: Optimize if it becomes an issue

7. **Ingredient categories?**
   - Seed default categories?
   - User can customize?
   - Use common grocery store layout?
   - Recommendation: Seed 8-10 categories, allow customization

### Data
8. **Denormalization strategy?**
   - Store ingredient names in ShoppingListItem (fast, stale data risk)?
   - Or always join to Ingredient table (slower, always fresh)?
   - Recommendation: Denormalize for better UX (shopping list doesn't change if ingredient renamed)

---

## Dependencies

### Must Be Complete First:
- [x] POC (recipes and meal planning)
- [x] Fraction math system working
- [x] Unit conversion system working
- [ ] Ingredient categories defined

### Nice to Have:
- [ ] Serving overrides per meal (allows better aggregation)
- [ ] Recipe photos (better shopping list UX)

---

## Success Metrics

### Feature is successful when:
- [ ] 90% of test users successfully generate a shopping list
- [ ] Users save at least 1 list per week
- [ ] Users report it saves them time vs manual list
- [ ] Average shopping list has >10 items
- [ ] Users complete shopping trips with the list

---

## Implementation Estimate

### Database & Backend (1-2 days)
- Create ShoppingList and ShoppingListItem tables
- Implement aggregation algorithm
- Create 9 API endpoints
- Handle unit conversions
- Test aggregation logic

### Frontend (2-3 days)
- Shopping list generator UI
- Shopping list view with categories
- Checkboxes and progress indicator
- Save/name flow
- Shopping lists index page
- Item components

### Testing (0.5-1 day)
- End-to-end testing
- Aggregation edge cases
- Unit conversion edge cases
- UI/UX testing

**Total: 3-5 days**

---

## Risks

### High Risk
- **Aggregation complexity:** Combining ingredients with different units is non-trivial
  - Mitigation: Start with same-unit aggregation, add conversions incrementally

### Medium Risk
- **Performance:** Large shopping lists might be slow
  - Mitigation: Profile and optimize, consider pagination

### Low Risk
- **UI complexity:** Checkboxes and progress are straightforward
- **Database design:** Schema is well-defined

---

## Future Enhancements (Post-Epic)

- Smart suggestions (based on past lists)
- Price tracking integration
- Store layout mapping
- Barcode scanning
- Voice input for checking off items
- Nutritional information
- Recipe substitutions to reduce shopping items

---

**Status:** Ready for refinement after POC complete
**Next Step:** Complete POC, then schedule refinement session
**Document Owner:** Product Owner
