# Screen Mockups & Wireframes - Single-User Meal Planner

## Overview

This document provides detailed wireframes and component-level specifications for all major screens in the Meal Planner application. These mockups use ASCII art for structure and include detailed annotations for behavior, styling, and interactions.

---

## Screen 1: Welcome/First-Run Screen

### Purpose
First screen shown to new users after installation. Sets expectations and provides quick onboarding.

### Wireframe
```
┌────────────────────────────────────────────────────────────────────┐
│  🍽️  Meal Planner                                    [Skip Tour]   │
└────────────────────────────────────────────────────────────────────┘
│                                                                      │
│                                                                      │
│                   Welcome to Your Personal                           │
│                      Meal Planner                                    │
│                                                                      │
│          Plan meals, manage recipes, generate shopping lists         │
│                    — all on your computer                            │
│                                                                      │
│                                                                      │
│              ┌──────────────┐  ┌──────────────┐                     │
│              │  Start Tour  │  │ Get Started  │                     │
│              └──────────────┘  └──────────────┘                     │
│                                                                      │
│                                                                      │
│         ┌────────────────────────────────────────────┐              │
│         │  3 sample recipes included to get started  │              │
│         │                                             │              │
│         │  [🍝 Pasta]  [🍕 Pizza]  [🥗 Salad]       │              │
│         └────────────────────────────────────────────┘              │
│                                                                      │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
```

### Component Specifications

**Header**
- App name with icon (logo)
- [Skip Tour] link (top-right, subtle)

**Hero Section**
- H1: "Welcome to Your Personal Meal Planner" (32px, bold)
- Subtitle: "Plan meals, manage recipes..." (18px, gray)
- Emphasis on "your computer" (local-first messaging)

**Primary CTAs**
- [Start Tour] - Secondary button (outlined)
- [Get Started] - Primary button (filled, green)
- Buttons: 160px wide, 48px tall, side-by-side

**Sample Recipes Preview**
- Card container with 3 recipe cards
- Each card: Icon, recipe name, clickable
- Provides tangible sense of what's included

### Interactions
- [Skip Tour] → Navigate to Dashboard
- [Start Tour] → Launch 4-step interactive tour
- [Get Started] → Navigate to Dashboard
- Click recipe card → Open recipe detail (sample)

### Responsive Behavior
- **Desktop**: As shown, centered layout
- **Tablet**: Maintain layout, reduce spacing
- **Mobile**: Stack buttons vertically, show 1 recipe card with carousel

---

## Screen 2: Dashboard (Home)

### Purpose
Central hub for quick actions, overview of upcoming meals, and frequent recipes.

### Wireframe
```
┌────────────────────────────────────────────────────────────────────────┐
│ 🍽️ Meal Planner    [Home] [Recipes] [Meal Plan] [Shopping]  [⚙️] [📤] │
└────────────────────────────────────────────────────────────────────────┘

┌─ Dashboard ──────────────────────────────────────────────────────────┐
│                                                                        │
│  ┌─ Quick Actions ──────────────────────┐                            │
│  │                                       │                            │
│  │  ┌──────────────┐  ┌──────────────┐  │                            │
│  │  │ + New Recipe │  │  Plan Meals  │  │                            │
│  │  └──────────────┘  └──────────────┘  │                            │
│  │                                       │                            │
│  │  ┌──────────────┐  ┌──────────────┐  │                            │
│  │  │Shopping List │  │Export Recipes│  │                            │
│  │  └──────────────┘  └──────────────┘  │                            │
│  │                                       │                            │
│  └───────────────────────────────────────┘                            │
│                                                                        │
│  ┌─ Upcoming Meals (Next 7 Days) ───────────────────────────────┐    │
│  │                                                               │    │
│  │  Mon, Jun 5  • Dinner     Spaghetti Carbonara         [→]   │    │
│  │  Tue, Jun 6  • Breakfast  Pancakes                    [→]   │    │
│  │  Tue, Jun 6  • Dinner     Grilled Chicken             [→]   │    │
│  │  Wed, Jun 7  • Lunch      Caesar Salad                [→]   │    │
│  │  Thu, Jun 8  • Dinner     Tacos                       [→]   │    │
│  │                                                               │    │
│  │  [View Full Meal Plan]                                       │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                        │
│  ┌─ Frequent Recipes ──────────────────────────────────────────┐      │
│  │                                                              │      │
│  │  • Spaghetti Carbonara          15 times  •  ⭐ 4.5   [→]   │      │
│  │  • Chicken Stir Fry              12 times  •  ⭐ 4.8   [→]   │      │
│  │  • Margherita Pizza              10 times  •  ⭐ 4.2   [→]   │      │
│  │  • Caesar Salad                   8 times  •  ⭐ 4.6   [→]   │      │
│  │  • Beef Tacos                     7 times  •  ⭐ 4.4   [→]   │      │
│  │                                                              │      │
│  │  [View All Recipes]                                          │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Specifications

**Global Navigation Bar**
- Fixed at top, 64px height
- App logo/name (left)
- Main nav links: Home, Recipes, Meal Plan, Shopping (center)
- Icons: Settings (⚙️), Export (📤) (right)
- Background: White (#FFFFFF), subtle shadow

**Quick Actions Section**
- Card container with 4 action buttons
- 2×2 grid layout
- Each button: Icon + label
- Buttons: 180px × 80px, hover effect (lift/shadow)
- Colors: Primary green background

**Upcoming Meals Section**
- Card with list of next 5 upcoming meals
- Each row:
  - Date (formatted: "Mon, Jun 5")
  - Meal type badge (colored: Breakfast=yellow, Lunch=green, Dinner=coral, Snack=blue)
  - Recipe name
  - Arrow icon (→) for quick navigation
- Row hover: Background highlight
- Footer link: "View Full Meal Plan"

**Frequent Recipes Section**
- Card with list of top 5 frequent recipes
- Each row:
  - Bullet point
  - Recipe name (clickable)
  - Usage count: "15 times"
  - Rating: ⭐ 4.5
  - Arrow icon (→)
- Row hover: Background highlight
- Footer link: "View All Recipes"

### Layout Grid
- 3-column responsive grid (2-1 ratio)
- Left column (2/3 width): Quick Actions, Upcoming Meals
- Right column (1/3 width): Frequent Recipes
- 24px gap between cards

### Interactions
- Click any quick action → Navigate to respective page
- Click meal row → Navigate to recipe detail
- Click recipe row → Navigate to recipe detail
- Hover effects: Subtle lift + shadow on cards/buttons

### Empty States
- No upcoming meals: "No meals planned yet. Plan your week!"
- No recipes: "No recipes yet. Add your first recipe!"

### Responsive Behavior
- **Desktop (>1280px)**: As shown, 3-column grid
- **Laptop (1024-1279px)**: 2-column grid, stack Frequent Recipes
- **Tablet (<1024px)**: Single column, cards full-width
- **Mobile (<768px)**: Single column, simplified quick actions (2 buttons max)

---

## Screen 3: Recipe List Page

### Purpose
Browse, search, and manage recipe collection.

### Wireframe
```
┌────────────────────────────────────────────────────────────────────────┐
│ 🍽️ Meal Planner    [Home] [Recipes] [Meal Plan] [Shopping]  [⚙️] [📤] │
└────────────────────────────────────────────────────────────────────────┘

┌─ Recipes ────────────────────────────────────────────────────────────┐
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  🔍 Search recipes...                           [+ New Recipe]  │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌─ Filters ─────────────────────────────────────────────────────┐    │
│  │  Cuisine: [All ▾]   Sort: [Name ▾]   View: [⊞ Grid] [☰ List] │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                        │
│  Showing 24 recipes                                                    │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │   [Photo]    │  │   [Photo]    │  │   [Photo]    │                │
│  │              │  │              │  │              │                │
│  │              │  │              │  │              │                │
│  │ Spaghetti    │  │ Chicken      │  │ Caesar       │                │
│  │ Carbonara    │  │ Stir Fry     │  │ Salad        │                │
│  │              │  │              │  │              │                │
│  │ Italian      │  │ Asian        │  │ American     │                │
│  │ 4 servings   │  │ 4 servings   │  │ 4 servings   │                │
│  │ ⭐ 4.5 • 15× │  │ ⭐ 4.8 • 12× │  │ ⭐ 4.6 • 8×  │                │
│  │              │  │              │  │              │                │
│  │ [View] [✎]   │  │ [View] [✎]   │  │ [View] [✎]   │                │
│  └──────────────┘  └──────────────┘  └──────────────┘                │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │   [Photo]    │  │   [Photo]    │  │   [Photo]    │                │
│  │              │  │              │  │              │                │
│  │   ...        │  │   ...        │  │   ...        │                │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Specifications

**Search Bar**
- Full-width input field
- Left icon: 🔍 (magnifying glass)
- Placeholder: "Search recipes..."
- Real-time filtering (debounced, 300ms)
- Right button: [+ New Recipe] (primary green button)
- Height: 56px

**Filter Bar**
- 3 controls in row:
  1. **Cuisine Dropdown**: "All", "Italian", "Asian", "Mexican", etc.
  2. **Sort Dropdown**: "Name", "Recent", "Rating", "Most Used", "Prep Time"
  3. **View Toggle**: Grid vs List view (icon buttons)
- Height: 48px
- Dropdowns: Rounded, subtle shadow

**Recipe Cards (Grid View)**
- 3-4 columns (responsive)
- Each card:
  - Photo placeholder (16:9 ratio, 240px × 135px)
  - Recipe name (18px, bold)
  - Cuisine tag (small badge)
  - Meta row: Servings, Rating, Times made
  - Hover actions: [View] [Edit] buttons appear
- Card size: 280px × 340px
- Padding: 16px
- Border-radius: 8px
- Shadow on hover: Subtle lift

**Recipe Rows (List View)**
- Single column, full-width rows
- Each row:
  - Small thumbnail (80px × 60px)
  - Recipe name
  - Meta info inline
  - Action buttons (right-aligned)
- Row height: 80px
- Divider between rows

**Results Count**
- "Showing X recipes" (small text, gray)
- Updates with filters

### Interactions
- Type in search → Real-time filter
- Select cuisine → Filter list
- Change sort → Reorder list
- Click card/row → Navigate to Recipe Detail
- Click [View] → Navigate to Recipe Detail
- Click [Edit] → Navigate to Recipe Form (edit mode)
- Click [+ New Recipe] → Navigate to Recipe Form (create mode)
- Toggle view → Switch grid/list layout

### Empty States
- No recipes: "No recipes yet. Create your first recipe!"
- No search results: "No recipes found for '[query]'. Try a different search."

### Responsive Behavior
- **Desktop (>1280px)**: 4 columns
- **Laptop (1024-1279px)**: 3 columns
- **Tablet (768-1023px)**: 2 columns
- **Mobile (<768px)**: 1 column, list view only

---

## Screen 4: Recipe Detail Page

### Purpose
View full recipe details with options to edit, add to meal plan, or delete.

### Wireframe
```
┌────────────────────────────────────────────────────────────────────────┐
│ 🍽️ Meal Planner    [Home] [Recipes] [Meal Plan] [Shopping]  [⚙️] [📤] │
└────────────────────────────────────────────────────────────────────────┘

┌─ Recipes > Spaghetti Carbonara ──────────────────────────────────────┐
│                                                                        │
│  [← Back to Recipes]                                                   │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │               [Recipe Photo - Full Width]                       │   │
│  │                                                                 │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  ┌─ Recipe Header ───────────────────────────────────────────────┐    │
│  │                                                                │    │
│  │  Spaghetti Carbonara                    [Edit] [🗑️] [⋮ More] │    │
│  │                                                                │    │
│  │  ⭐⭐⭐⭐☆ 4.5 (Made 15 times)              Italian            │    │
│  │                                                                │    │
│  │  Classic Italian pasta with eggs, cheese, and pancetta         │    │
│  │                                                                │    │
│  │  🕐 Prep: 15 min  •  🍳 Cook: 20 min  •  🍽️ Servings: 4       │    │
│  │                                                                │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                        │
│  ┌─ Ingredients ─────────────────────────────────────────────────┐    │
│  │                                                                │    │
│  │  Servings:  [-]  4  [+]                                        │    │
│  │                                                                │    │
│  │  ☐  1 lb       Spaghetti                                       │    │
│  │  ☐  6          Eggs                                            │    │
│  │  ☐  1 cup      Pecorino Romano cheese (grated)                │    │
│  │  ☐  8 oz       Pancetta (diced)                                │    │
│  │  ☐  2 tsp      Black pepper (freshly ground)                   │    │
│  │  ☐  1 tsp      Salt                                            │    │
│  │                                                                │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                        │
│  ┌─ Instructions ────────────────────────────────────────────────┐    │
│  │                                                                │    │
│  │  ☐  1. Bring a large pot of salted water to boil. Cook        │    │
│  │        spaghetti according to package directions until al      │    │
│  │        dente. Reserve 1 cup pasta water before draining.       │    │
│  │                                                                │    │
│  │  ☐  2. While pasta cooks, fry pancetta in a large skillet     │    │
│  │        over medium heat until crispy, about 8 minutes.         │    │
│  │                                                                │    │
│  │  ☐  3. In a bowl, whisk together eggs, cheese, and pepper.    │    │
│  │                                                                │    │
│  │  ☐  4. Add hot drained pasta to skillet with pancetta.        │    │
│  │        Remove from heat. Pour egg mixture over pasta and       │    │
│  │        toss quickly. Add pasta water as needed to create       │    │
│  │        a creamy sauce.                                         │    │
│  │                                                                │    │
│  │  ☐  5. Serve immediately with extra cheese and pepper.        │    │
│  │                                                                │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────┐      │
│  │                  [Add to Meal Plan]                          │      │
│  └─────────────────────────────────────────────────────────────┘      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Specifications

**Breadcrumb Navigation**
- "Recipes > [Recipe Name]"
- Clickable links
- [← Back] button (left-aligned)

**Recipe Photo**
- Full-width hero image (max height: 400px)
- Object-fit: cover
- If no photo: Gradient placeholder with icon

**Recipe Header**
- Recipe name: H1 (32px, bold)
- Actions (right-aligned):
  - [Edit] button (secondary)
  - [Delete] icon button (🗑️)
  - [More] menu (⋮) → Duplicate, Export, etc.
- Rating display: Stars + numeric + times made
- Cuisine tag: Badge (colored)
- Description: 2-3 lines, 16px
- Meta icons: Prep time, cook time, servings

**Ingredients Section**
- Card with white background
- Serving adjuster:
  - [-] button, number display, [+] button
  - Inline, prominent at top
  - Buttons: 32px × 32px
- Ingredient list:
  - Checkbox (for shopping list)
  - Quantity (bold, scaled)
  - Ingredient name
  - Prep notes in parentheses (italic)
- Each ingredient: 1 row, 48px height
- Checkbox: 20px × 20px

**Instructions Section**
- Card with white background
- Numbered steps (large numbers)
- Checkbox per step (for cooking mode)
- Step text: 16px, readable line-height (1.6)
- Step spacing: 16px between steps

**Call-to-Action**
- [Add to Meal Plan] button
- Full-width, primary green
- Height: 56px
- Fixed at bottom on mobile (sticky)

### Interactions
- Click [← Back] → Navigate to Recipe List
- Click [Edit] → Navigate to Recipe Form (edit mode)
- Click [Delete] → Show confirmation dialog → Delete
- Click [+ Add to Meal Plan] → Open Add to Meal Plan modal
- Adjust servings [-]/[+] → Recalculate all ingredient quantities (instant)
- Check ingredient checkbox → Add to quick shopping list
- Check instruction checkbox → Mark step as complete (cooking mode)

### Scaling Behavior
When user adjusts servings from 4 to 6:
- "1 cup" → "1 1/2 cups"
- "6 eggs" → "9 eggs"
- "8 oz" → "12 oz"
- Updates instantly (<100ms)

### Responsive Behavior
- **Desktop**: As shown, centered max-width (960px)
- **Tablet**: Full-width, reduce spacing
- **Mobile**: Single column, sticky [Add to Meal Plan] button at bottom

---

## Screen 5: Recipe Form (Create/Edit)

### Purpose
Create new recipes or edit existing ones.

### Wireframe
```
┌────────────────────────────────────────────────────────────────────────┐
│ 🍽️ Meal Planner    [Home] [Recipes] [Meal Plan] [Shopping]  [⚙️] [📤] │
└────────────────────────────────────────────────────────────────────────┘

┌─ Create Recipe ──────────────────────────────────────────────────────┐
│                                                                        │
│  [← Cancel]                                            [Save Recipe]  │
│                                                                        │
│  ┌─ Basic Information ──────────────────────────────────────────┐     │
│  │                                                               │     │
│  │  Recipe Name *                                                │     │
│  │  ┌──────────────────────────────────────────────────────┐    │     │
│  │  │ Spaghetti Carbonara                                   │    │     │
│  │  └──────────────────────────────────────────────────────┘    │     │
│  │                                                               │     │
│  │  Description                                                  │     │
│  │  ┌──────────────────────────────────────────────────────┐    │     │
│  │  │ Classic Italian pasta with...                         │    │     │
│  │  │                                                        │    │     │
│  │  └──────────────────────────────────────────────────────┘    │     │
│  │                                                               │     │
│  │  Servings *          Prep Time (min)      Cook Time (min)    │     │
│  │  ┌─────┐             ┌─────┐              ┌─────┐           │     │
│  │  │  4  │             │ 15  │              │ 20  │           │     │
│  │  └─────┘             └─────┘              └─────┘           │     │
│  │                                                               │     │
│  │  ▼ Show More Options                                          │     │
│  │                                                               │     │
│  └───────────────────────────────────────────────────────────────┘     │
│                                                                        │
│  ┌─ Ingredients ────────────────────────────────────────────────┐     │
│  │                                                               │     │
│  │  ┌─────────────────────────────────────────────────────────┐ │     │
│  │  │ ⋮  1 lb      Spaghetti                         [✕]      │ │     │
│  │  └─────────────────────────────────────────────────────────┘ │     │
│  │                                                               │     │
│  │  ┌─────────────────────────────────────────────────────────┐ │     │
│  │  │ ⋮  6         Eggs                              [✕]      │ │     │
│  │  └─────────────────────────────────────────────────────────┘ │     │
│  │                                                               │     │
│  │  ┌─────────────────────────────────────────────────────────┐ │     │
│  │  │ ⋮  1 cup     Pecorino Romano (grated)         [✕]      │ │     │
│  │  └─────────────────────────────────────────────────────────┘ │     │
│  │                                                               │     │
│  │  [+ Add Ingredient]                                           │     │
│  │                                                               │     │
│  └───────────────────────────────────────────────────────────────┘     │
│                                                                        │
│  ┌─ Instructions ───────────────────────────────────────────────┐     │
│  │                                                               │     │
│  │  ┌─────────────────────────────────────────────────────────┐ │     │
│  │  │ ⋮  1.  Bring a large pot of salted water to boil...   │ │     │
│  │  │                                               [✕]       │ │     │
│  │  └─────────────────────────────────────────────────────────┘ │     │
│  │                                                               │     │
│  │  ┌─────────────────────────────────────────────────────────┐ │     │
│  │  │ ⋮  2.  While pasta cooks, fry pancetta in a large...  │ │     │
│  │  │                                               [✕]       │ │     │
│  │  └─────────────────────────────────────────────────────────┘ │     │
│  │                                                               │     │
│  │  [+ Add Step]                                                 │     │
│  │                                                               │     │
│  └───────────────────────────────────────────────────────────────┘     │
│                                                                        │
│                                         [Cancel]  [Save Recipe]        │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Specifications

**Form Header**
- [← Cancel] link (left)
- [Save Recipe] button (right, primary green)
- Title: "Create Recipe" or "Edit Recipe"

**Basic Information Section**
- Collapsible card (expanded by default)
- Fields:
  1. **Recipe Name** (required): Text input, full-width
  2. **Description**: Multi-line textarea, 3 rows
  3. **Servings** (required): Number input, default 4
  4. **Prep Time**: Number input (minutes)
  5. **Cook Time**: Number input (minutes)
- Expandable "Show More Options":
  - Cuisine Type: Dropdown
  - Photo URL: Text input (or file upload)

**Ingredients Section**
- Collapsible card
- List of ingredient rows:
  - Each row:
    - Drag handle (⋮) for reordering
    - Quantity input (accepts fractions)
    - Unit dropdown (cup, tsp, oz, g, etc.)
    - Ingredient autocomplete input
    - Prep notes input (optional)
    - Remove button [✕]
- [+ Add Ingredient] button at bottom
- Minimum 1 ingredient required

**Ingredient Input Row (Detail)**
```
┌─────────────────────────────────────────────────────────────┐
│ ⋮  [1 1/2] [cup▾] [Flour (autocomplete)] [(sifted)] [✕]   │
└─────────────────────────────────────────────────────────────┘
   │    │      │            │                    │        │
   │    │      │            │                    │        Remove
   │    │      │            │                    Prep notes (optional)
   │    │      │            Ingredient name (autocomplete)
   │    │      Unit (dropdown)
   │    Quantity (supports fractions: 1/2, 1 1/2, 2)
   Drag handle
```

**Instructions Section**
- Collapsible card
- List of instruction rows:
  - Each row:
    - Drag handle (⋮) for reordering
    - Step number (auto-assigned)
    - Multi-line text area
    - Remove button [✕]
- [+ Add Step] button at bottom
- Minimum 1 step required

**Form Actions**
- Bottom sticky bar (on mobile)
- [Cancel] button (secondary, gray)
- [Save Recipe] button (primary green)

### Validation Rules
- **Recipe Name**: Required, 3-100 characters
- **Servings**: Required, positive integer
- **Ingredients**: At least 1 required
- **Instructions**: At least 1 required
- Real-time validation (show errors on blur)
- Form-level validation on submit

### Error Display
- Inline errors below fields (red text, 14px)
- Example: "Recipe name is required"
- Highlight invalid fields (red border)

### Interactions
- Click [← Cancel] → Confirm if unsaved changes → Navigate back
- Click [Save Recipe] → Validate → Save → Navigate to Recipe Detail
- Click [+ Add Ingredient] → Add new empty ingredient row
- Click [+ Add Step] → Add new empty instruction row
- Click [✕] on row → Remove row (with confirmation if >1 item)
- Drag row → Reorder ingredients/instructions (visual feedback)
- Type in ingredient name → Autocomplete suggestions appear
- Quantity input:
  - Accepts: "1", "1/2", "1 1/2", "0.5"
  - Displays as fraction: "1 1/2"

### Auto-save (Future Enhancement)
- Draft saved every 30 seconds
- "Draft saved" indicator (subtle, top-right)
- Restore draft on return to form

### Responsive Behavior
- **Desktop**: As shown, centered (960px max-width)
- **Tablet**: Full-width, maintain layout
- **Mobile**: Single column, sticky save button at bottom

---

## Screen 6: Weekly Meal Plan Calendar

### Purpose
Visual calendar view for planning meals across the week.

### Wireframe
```
┌────────────────────────────────────────────────────────────────────────┐
│ 🍽️ Meal Planner    [Home] [Recipes] [Meal Plan] [Shopping]  [⚙️] [📤] │
└────────────────────────────────────────────────────────────────────────┘

┌─ Meal Plan ──────────────────────────────────────────────────────────┐
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  [← Previous]   Week of Monday, June 5, 2024   [Next →]       │   │
│  │                    [This Week]                                  │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  [Generate Shopping List]                                              │
│                                                                        │
│  ┌────────┬────────┬────────┬────────┬────────┬────────┬────────┐    │
│  │  Mon 5 │ Tue 6  │ Wed 7  │ Thu 8  │ Fri 9  │ Sat 10 │ Sun 11 │    │
│  ├────────┼────────┼────────┼────────┼────────┼────────┼────────┤    │
│  │Breakfst│Breakfst│Breakfst│Breakfst│Breakfst│Breakfst│Breakfst│    │
│  │        │        │        │        │        │        │        │    │
│  │ [+]    │Pancakes│  [+]   │  [+]   │  [+]   │Waffles │  [+]   │    │
│  │        │ ☑️      │        │        │        │        │        │    │
│  ├────────┼────────┼────────┼────────┼────────┼────────┼────────┤    │
│  │ Lunch  │ Lunch  │ Lunch  │ Lunch  │ Lunch  │ Lunch  │ Lunch  │    │
│  │        │        │        │        │        │        │        │    │
│  │ [+]    │  [+]   │Caesar  │  [+]   │  [+]   │  [+]   │  [+]   │    │
│  │        │        │Salad   │        │        │        │        │    │
│  ├────────┼────────┼────────┼────────┼────────┼────────┼────────┤    │
│  │ Dinner │ Dinner │ Dinner │ Dinner │ Dinner │ Dinner │ Dinner │    │
│  │        │        │        │        │        │        │        │    │
│  │Spaghet │Chicken │  [+]   │ Tacos  │  [+]   │  [+]   │  [+]   │    │
│  │Carbonar│Stir Fry│        │        │        │        │        │    │
│  ├────────┼────────┼────────┼────────┼────────┼────────┼────────┤    │
│  │ Snack  │ Snack  │ Snack  │ Snack  │ Snack  │ Snack  │ Snack  │    │
│  │        │        │        │        │        │        │        │    │
│  │ [+]    │  [+]   │  [+]   │  [+]   │  [+]   │  [+]   │  [+]   │    │
│  │        │        │        │        │        │        │        │    │
│  └────────┴────────┴────────┴────────┴────────┴────────┴────────┘    │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Specifications

**Week Navigation**
- Card at top
- [← Previous] button (left)
- "Week of [date]" (center, bold)
- [Next →] button (right)
- [This Week] button (center, below date) - only shows if not current week
- Buttons: 120px × 40px

**Calendar Grid**
- 7 columns (days) × 4 rows (meal types)
- Header row: Day names + dates
- Each cell: 160px × 120px (minimum)
- Borders: 1px solid #E0E0E0

**Meal Type Row Headers**
- Left column: "Breakfast", "Lunch", "Dinner", "Snack"
- Colored badges:
  - Breakfast: #FFE082 (light yellow)
  - Lunch: #81C784 (light green)
  - Dinner: #FF8A65 (light coral)
  - Snack: #90CAF9 (light blue)

**Empty Cell**
- Shows [+] button (centered)
- Button: 48px × 48px, circular, dashed border
- Hover: Solid border, background color
- Click: Opens Add Meal modal

**Filled Cell (Meal Card)**
- Recipe name (truncated if >20 chars)
- Servings indicator (if overridden): "6 servings"
- Completed checkmark (if marked complete): ☑️
- Hover reveals action buttons:
  - [✎ Edit]
  - [✕ Remove]
  - [⋮ More] → Duplicate, View Recipe
- Background: White (#FFFFFF)
- Border-left: 4px colored bar (meal type color)
- Padding: 12px

**Meal Card Detail**
```
┌──────────────────┐
│ ◼️ Spaghetti     │  ← 4px colored bar (meal type)
│    Carbonara     │  ← Recipe name (bold)
│                  │
│    6 servings    │  ← Override indicator (if applicable)
│    ☑️ Complete   │  ← Completion status
│                  │
│  [✎] [✕] [⋮]    │  ← Actions on hover
└──────────────────┘
```

**Shopping List Button**
- [Generate Shopping List] button
- Top-right of page
- Secondary style (outlined)
- Click: Navigate to Shopping List with current week

### Interactions
- Click [← Previous] → Load previous week
- Click [Next →] → Load next week
- Click [This Week] → Return to current week
- Click [+] in empty cell → Open Add Meal modal (date + meal type pre-selected)
- Click meal card → Open meal detail/edit modal
- Hover meal card → Show action buttons
- Click [✎ Edit] → Open Edit Meal modal
- Click [✕ Remove] → Confirm → Delete meal
- Click [⋮ More] → Show context menu (Duplicate, View Recipe, Mark Complete)
- Click [Generate Shopping List] → Navigate to Shopping List page with week's data

### Drag & Drop (Future)
- Drag meal card → Drop on different cell → Move meal
- Visual feedback: Card follows cursor, drop zones highlight
- Drop validation: Confirm if target occupied

### Empty State
- If no meals planned: "No meals planned this week. Start adding meals!"
- [Plan This Week] button

### Responsive Behavior
- **Desktop (>1280px)**: As shown, 7-column grid
- **Laptop (1024-1279px)**: Smaller cells, condensed text
- **Tablet (768-1023px)**: Horizontal scroll enabled, maintain grid
- **Mobile (<768px)**: Switch to single-day view with navigation
  - Day selector dropdown
  - Vertical list of meal types
  - Swipe left/right to change days

---

## Screen 7: Shopping List Page

### Purpose
Display aggregated ingredients from meal plans, organized by category, with check-off functionality.

### Wireframe
```
┌────────────────────────────────────────────────────────────────────────┐
│ 🍽️ Meal Planner    [Home] [Recipes] [Meal Plan] [Shopping]  [⚙️] [📤] │
└────────────────────────────────────────────────────────────────────────┘

┌─ Shopping List ──────────────────────────────────────────────────────┐
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  Date Range:  [This Week ▾]            [📋 Copy] [🖨️ Print]   │   │
│  │  June 5-11, 2024  •  21 meals planned                         │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  Progress: 8 of 23 items checked          [Clear Completed]    │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌─ Produce ────────────────────────────────────────────────────┐     │
│  │                                                               │     │
│  │  ☐  3 1/2 cups    Tomatoes (diced)                           │     │
│  │                   Used in: Pasta Sauce, Pizza, Salad          │     │
│  │                                                               │     │
│  │  ☑  2 whole       Onions (diced)                             │     │
│  │                   Used in: Stir Fry, Tacos                    │     │
│  │                                                               │     │
│  │  ☐  1 1/2 cups    Bell Peppers (sliced)                      │     │
│  │                   Used in: Stir Fry                           │     │
│  │                                                               │     │
│  └───────────────────────────────────────────────────────────────┘     │
│                                                                        │
│  ┌─ Dairy ──────────────────────────────────────────────────────┐     │
│  │                                                               │     │
│  │  ☐  2 cups        Milk                                        │     │
│  │                   Used in: Pancakes, Waffles                  │     │
│  │                                                               │     │
│  │  ☑  1 1/2 cups    Cheddar Cheese (shredded)                  │     │
│  │                   Used in: Tacos, Pizza                       │     │
│  │                                                               │     │
│  └───────────────────────────────────────────────────────────────┘     │
│                                                                        │
│  ┌─ Meat & Seafood ─────────────────────────────────────────────┐     │
│  │                                                               │     │
│  │  ☐  2 lbs         Chicken Breast                              │     │
│  │                   Used in: Stir Fry, Salad                    │     │
│  │                                                               │     │
│  │  ☐  1 lb          Ground Beef                                 │     │
│  │                   Used in: Tacos                              │     │
│  │                                                               │     │
│  └───────────────────────────────────────────────────────────────┘     │
│                                                                        │
│  ┌─ Pantry ─────────────────────────────────────────────────────┐     │
│  │                                                               │     │
│  │  ☑  3 cups        All-purpose Flour                           │     │
│  │                   Used in: Pancakes, Waffles, Pizza           │     │
│  │                                                               │     │
│  │  ☐  1 cup         Olive Oil                                   │     │
│  │                   Used in: Pasta, Salad, Stir Fry             │     │
│  │                                                               │     │
│  └───────────────────────────────────────────────────────────────┘     │
│                                                                        │
│  [Back to Meal Plan]                                                   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Specifications

**Header Controls**
- Date range selector (dropdown)
  - Options: This Week, Next Week, This Month, Custom
- Summary: "June 5-11, 2024 • 21 meals planned"
- Export buttons:
  - [📋 Copy to Clipboard]
  - [🖨️ Print]
- Layout: Horizontal row, space-between

**Progress Bar**
- "X of Y items checked"
- Visual progress bar (green fill)
- [Clear Completed] button (right-aligned)
- Only visible if items checked

**Category Sections**
- Collapsible cards, each representing a category
- Header: Category name (bold, 18px) + category color badge
- Default: All expanded
- Click header to collapse/expand

**Ingredient Items**
- Each item row:
  - Checkbox (24px × 24px)
  - Quantity (bold): "3 1/2 cups"
  - Ingredient name: "Tomatoes"
  - Prep notes (italic): "(diced)"
  - Recipe references (small, gray): "Used in: Pasta Sauce, Pizza, Salad"
- Checked items:
  - Strikethrough text
  - Dimmed appearance (opacity: 0.5)
  - Checkbox filled
- Row height: 72px (with recipe refs) or 48px (without)
- Hover: Subtle background highlight

**Ingredient Item Detail**
```
┌──────────────────────────────────────────────────────────────┐
│  ☐  3 1/2 cups    Tomatoes (diced)                           │
│                   Used in: Pasta Sauce, Pizza, Salad          │
└──────────────────────────────────────────────────────────────┘
   │      │            │        │                │
   │      │            │        │                Recipe references (clickable)
   │      │            │        Prep notes (italic, gray)
   │      │            Ingredient name (bold)
   │      Quantity (bold, scaled)
   Checkbox (24px)
```

### Interactions
- Change date range → Regenerate list for new range
- Click checkbox → Toggle checked state (instant, saved to DB)
- Click ingredient name → Navigate to ingredient detail (future)
- Click recipe reference → Navigate to recipe detail
- Click [Copy to Clipboard] → Copy text version to clipboard → Toast: "Copied!"
- Click [Print] → Open print dialog with formatted list
- Click [Clear Completed] → Remove checked items from view → Confirm first
- Click category header → Collapse/expand category

### Text Export Format (Copy to Clipboard)
```
Shopping List - June 5-11, 2024

Produce:
- 3 1/2 cups Tomatoes (diced)
- 2 whole Onions (diced)
- 1 1/2 cups Bell Peppers (sliced)

Dairy:
- 2 cups Milk
- 1 1/2 cups Cheddar Cheese (shredded)

...
```

### Empty State
- No meals in range: "No meals planned for this period. Plan some meals to generate a shopping list."
- [Go to Meal Plan] button

### Responsive Behavior
- **Desktop**: As shown, centered (960px max-width)
- **Tablet**: Full-width, maintain layout
- **Mobile**: Single column, larger checkboxes (32px), simplified recipe refs

---

## Screen 8: Settings Page

### Purpose
Configure application preferences and manage data.

### Wireframe
```
┌────────────────────────────────────────────────────────────────────────┐
│ 🍽️ Meal Planner    [Home] [Recipes] [Meal Plan] [Shopping]  [⚙️] [📤] │
└────────────────────────────────────────────────────────────────────────┘

┌─ Settings ───────────────────────────────────────────────────────────┐
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ [Display] [Ingredients] [Meal Planning] [Data] [About]       │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                        │
│  ┌─ Display Settings ───────────────────────────────────────────┐     │
│  │                                                               │     │
│  │  Measurement System                                           │     │
│  │  ( ) Metric (kg, L, °C)  (•) Imperial (lb, cups, °F)         │     │
│  │                                                               │     │
│  │  Date Format                                                  │     │
│  │  [MM/DD/YYYY ▾]                                               │     │
│  │                                                               │     │
│  │  First Day of Week                                            │     │
│  │  ( ) Sunday  (•) Monday                                       │     │
│  │                                                               │     │
│  │  Default Servings                                             │     │
│  │  [4]                                                          │     │
│  │                                                               │     │
│  │  Theme (Coming Soon)                                          │     │
│  │  (•) Light  ( ) Dark  ( ) Auto                               │     │
│  │                                                               │     │
│  └───────────────────────────────────────────────────────────────┘     │
│                                                                        │
│  ┌─ Data Management ────────────────────────────────────────────┐     │
│  │                                                               │     │
│  │  Export Data                                                  │     │
│  │  ┌────────────────────┐  ┌────────────────────┐             │     │
│  │  │ Export Recipes     │  │ Export Meal Plans  │             │     │
│  │  └────────────────────┘  └────────────────────┘             │     │
│  │                                                               │     │
│  │  ┌────────────────────┐                                      │     │
│  │  │ Export All Data    │                                      │     │
│  │  └────────────────────┘                                      │     │
│  │                                                               │     │
│  │  ─────────────────────────────────────────────────────────   │     │
│  │                                                               │     │
│  │  Import Data                                                  │     │
│  │  ┌────────────────────┐                                      │     │
│  │  │ Import Data        │                                      │     │
│  │  └────────────────────┘                                      │     │
│  │                                                               │     │
│  │  ─────────────────────────────────────────────────────────   │     │
│  │                                                               │     │
│  │  Danger Zone                                                  │     │
│  │  ┌────────────────────────────────────────────────────────┐  │     │
│  │  │  ⚠️  Clear All Data                                    │  │     │
│  │  │                                                         │  │     │
│  │  │  This will permanently delete all recipes, meal        │  │     │
│  │  │  plans, and settings. This cannot be undone.           │  │     │
│  │  │                                                         │  │     │
│  │  │  [Clear All Data]                                       │  │     │
│  │  └────────────────────────────────────────────────────────┘  │     │
│  │                                                               │     │
│  └───────────────────────────────────────────────────────────────┘     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Specifications

**Tab Navigation**
- Horizontal tabs at top
- Tabs: Display, Ingredients, Meal Planning, Data, About
- Active tab: Underline + bold
- Click tab → Switch content below

**Display Settings Card**
- Radio buttons for binary choices (measurement system, first day of week)
- Dropdown for date format
- Number input for default servings
- Changes save automatically (no save button)
- Toast on save: "Settings saved"

**Data Management Card**
- Export buttons:
  - [Export Recipes] → Downloads JSON file (recipes.json)
  - [Export Meal Plans] → Downloads JSON file (meal-plans.json)
  - [Export All Data] → Downloads complete backup (meal-planner-backup.json)
- Import button:
  - [Import Data] → File picker → Validation → Preview → Confirm
- Danger Zone:
  - Red border card
  - Warning icon (⚠️)
  - Warning text (bold)
  - [Clear All Data] button (red, requires confirmation)

**Danger Zone Confirmation Dialog**
```
┌─────────────────────────────────────────────────────────┐
│  ⚠️  Clear All Data                                     │
│                                                          │
│  This will permanently delete:                           │
│  • All recipes (24 recipes)                              │
│  • All meal plans (15 meals)                             │
│  • All settings                                          │
│                                                          │
│  This action cannot be undone.                           │
│                                                          │
│  Type 'DELETE' to confirm:                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │                                                     │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  [Cancel]                    [Delete Everything]         │
│                              (disabled until typed)      │
└─────────────────────────────────────────────────────────┘
```

### Interactions
- Change setting → Auto-save → Toast confirmation
- Click [Export...] → Download file → Toast: "Data exported"
- Click [Import Data] → File picker → Validate JSON → Preview changes → [Confirm Import]
- Click [Clear All Data] → Open confirmation dialog
- In dialog: Type "DELETE" (case-sensitive) → Enable [Delete Everything] button
- Click [Delete Everything] → Clear database → Reset app → Show welcome screen

### Responsive Behavior
- **Desktop**: As shown, centered (960px max-width)
- **Tablet**: Full-width, maintain layout
- **Mobile**: Stack controls vertically, full-width buttons

---

## Screen 9: Add Meal Modal

### Purpose
Quick modal for adding a recipe to a specific date and meal type in the meal plan.

### Wireframe
```
                     ┌───────────────────────────────────────────┐
                     │  Add Meal - Monday, June 5 - Dinner   [✕] │
                     ├───────────────────────────────────────────┤
                     │                                            │
                     │  Select Recipe                             │
                     │  ┌──────────────────────────────────────┐ │
                     │  │ 🔍 Search recipes...                 │ │
                     │  └──────────────────────────────────────┘ │
                     │                                            │
                     │  ┌─────────────────────────────────────┐  │
                     │  │ Spaghetti Carbonara                 │  │ ← Selected
                     │  │ Italian • 4 servings • ⭐ 4.5       │  │   (highlighted)
                     │  ├─────────────────────────────────────┤  │
                     │  │ Chicken Stir Fry                    │  │
                     │  │ Asian • 4 servings • ⭐ 4.8         │  │
                     │  ├─────────────────────────────────────┤  │
                     │  │ Caesar Salad                        │  │
                     │  │ American • 4 servings • ⭐ 4.6      │  │
                     │  ├─────────────────────────────────────┤  │
                     │  │ Tacos                               │  │
                     │  │ Mexican • 4 servings • ⭐ 4.4       │  │
                     │  └─────────────────────────────────────┘  │
                     │                                            │
                     │  Servings                                  │
                     │  ┌───────┐                                │
                     │  │   4   │  (Default from recipe)          │
                     │  └───────┘                                │
                     │                                            │
                     │  Notes (optional)                          │
                     │  ┌──────────────────────────────────────┐ │
                     │  │ Dinner party with friends            │ │
                     │  └──────────────────────────────────────┘ │
                     │                                            │
                     │                                            │
                     │         [Cancel]      [Add Meal]           │
                     │                                            │
                     └───────────────────────────────────────────┘
```

### Component Specifications

**Modal Overlay**
- Semi-transparent black background (rgba(0,0,0,0.5))
- Click outside → Close modal (with confirmation if changes made)

**Modal Container**
- Width: 560px
- Max-height: 80vh (scrollable if needed)
- Border-radius: 8px
- Shadow: Large, elevated

**Modal Header**
- Title: "Add Meal - [Day], [Date] - [Meal Type]"
- Close button [✕] (top-right)

**Recipe Search**
- Search input with icon
- Placeholder: "Search recipes..."
- Real-time filtering (debounced 300ms)

**Recipe List**
- Scrollable container (max-height: 300px)
- Each recipe row:
  - Recipe name (bold)
  - Meta info: Cuisine, servings, rating
  - Click to select (highlight with primary color background)
  - Height: 64px
- Shows frequent recipes first by default
- Search filters list

**Servings Input**
- Number input
- Default: Recipe's default servings
- Label: "(Default from recipe)" if unchanged

**Notes Input**
- Multi-line textarea (3 rows)
- Optional field
- Placeholder: "e.g., Dinner party, double batch"

**Modal Actions**
- [Cancel] button (left, secondary)
- [Add Meal] button (right, primary green)
- [Add Meal] disabled until recipe selected

### Interactions
- Type in search → Filter recipe list in real-time
- Click recipe row → Select recipe (highlight, enable [Add Meal])
- Change servings → Override default
- Enter notes → Optional context
- Click [Cancel] → Close modal (confirm if changes made)
- Click [Add Meal] → Validate → Save → Close modal → Update calendar → Toast
- Click [✕] or outside modal → Close (confirm if changes made)

### Validation
- Recipe selection: Required
- Servings: Must be positive integer
- Notes: Optional, max 500 characters

### Responsive Behavior
- **Desktop**: As shown, 560px modal
- **Tablet**: 90% viewport width, maintain layout
- **Mobile**: Full-screen modal, bottom sheet style

---

## Screen 10: Empty States

### Purpose
Guide users when no data exists for various sections.

### Examples

#### No Recipes
```
┌────────────────────────────────────────────────────────┐
│                                                         │
│                       📖                                │
│                                                         │
│              No recipes yet                             │
│                                                         │
│         Start building your recipe collection           │
│                                                         │
│              ┌─────────────────────┐                   │
│              │  Create First Recipe │                   │
│              └─────────────────────────┘                   │
│                                                         │
└────────────────────────────────────────────────────────┘
```

#### No Meals Planned
```
┌────────────────────────────────────────────────────────┐
│                                                         │
│                       📅                                │
│                                                         │
│           No meals planned this week                    │
│                                                         │
│     Start planning your meals for easy grocery shopping │
│                                                         │
│              ┌─────────────────────┐                   │
│              │   Plan This Week    │                   │
│              └─────────────────────────┘                   │
│                                                         │
└────────────────────────────────────────────────────────┘
```

#### No Search Results
```
┌────────────────────────────────────────────────────────┐
│                                                         │
│                       🔍                                │
│                                                         │
│         No recipes found for "quinoa"                   │
│                                                         │
│         Try a different search term or create a new     │
│         recipe                                          │
│                                                         │
│              ┌─────────────────────┐                   │
│              │   Create Recipe     │                   │
│              └─────────────────────────┘                   │
│                                                         │
└────────────────────────────────────────────────────────┘
```

### Empty State Specifications
- Icon (large, 64px, gray)
- Primary message (bold, 18px)
- Secondary message (regular, 16px, gray)
- Call-to-action button (primary style)
- Centered layout
- Generous vertical spacing (32px between elements)

---

## Common UI Components

### Button Styles

**Primary Button**
- Background: #4CAF50 (green)
- Text: White, bold
- Padding: 12px 24px
- Border-radius: 6px
- Hover: Darken 10%
- Shadow on hover

**Secondary Button**
- Background: Transparent
- Border: 2px solid #4CAF50
- Text: #4CAF50, bold
- Padding: 12px 24px
- Border-radius: 6px
- Hover: Background #4CAF50, text white

**Danger Button**
- Background: #F44336 (red)
- Text: White, bold
- Padding: 12px 24px
- Border-radius: 6px
- Hover: Darken 10%

### Input Fields

**Text Input**
- Border: 1px solid #E0E0E0
- Padding: 12px 16px
- Border-radius: 6px
- Font-size: 16px
- Focus: Border #4CAF50, 2px
- Error: Border #F44336, 2px

**Dropdown Select**
- Same as text input
- Chevron icon (right)
- Options: White background, hover highlight

**Checkbox**
- Size: 20px × 20px
- Border: 2px solid #757575
- Checked: Background #4CAF50, white checkmark
- Border-radius: 4px

### Toast Notifications

**Success Toast**
```
┌─────────────────────────────────────┐
│ ✓  Recipe saved successfully!       │
└─────────────────────────────────────┘
```
- Green background (#4CAF50)
- White text
- Auto-dismiss after 3 seconds
- Position: Top-right
- Animation: Slide in from right

**Error Toast**
- Red background (#F44336)
- Same structure as success

**Info Toast**
- Blue background (#2196F3)
- Same structure

---

## Accessibility Annotations

### Keyboard Navigation
- Tab order follows visual layout
- Focus indicators: 2px blue outline
- Skip to main content link (hidden until focused)
- Arrow keys navigate dropdown menus

### Screen Reader Support
- ARIA labels on all icon buttons
- ARIA-live regions for toasts
- Semantic HTML (nav, main, section, article)
- Alt text on all images

### Color Contrast
- All text meets WCAG AA (4.5:1)
- Large text meets AAA (7:1)
- Focus indicators meet 3:1

---

## Conclusion

These mockups and specifications provide a comprehensive blueprint for implementing the single-user Meal Planner interface. The design emphasizes:

1. **Simplicity**: No login, direct access to features
2. **Clarity**: Clear visual hierarchy, readable typography
3. **Productivity**: Keyboard shortcuts, quick actions, minimal clicks
4. **Accessibility**: WCAG compliant, keyboard navigable
5. **Responsiveness**: Works across devices from mobile to desktop

The consistent component library ensures visual cohesion across all screens while the detailed interaction specifications guide developers in creating intuitive, delightful user experiences.
