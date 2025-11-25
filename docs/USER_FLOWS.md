# User Flows - Single-User Meal Planner

## Overview

This document details the key user journeys through the Meal Planner application. Since this is a single-user local application, these flows emphasize direct access, minimal friction, and productivity-focused interactions.

## Flow Conventions

```
[Screen/Page] → User Action → [Next Screen]
├─ Decision Point → [Alternative Path]
└─ Success/Error → [Outcome]
```

---

## 1. First-Time User Experience (Onboarding)

### Goal
Get new users productive within 5 minutes of installation.

### Flow
```
1. User installs application on their computer
   └─ Installation wizard completes

2. [Launch Icon] → User clicks application icon
   └─ Backend server starts automatically
   └─ Default browser opens to localhost:3000

3. [Welcome Screen]
   ├─ Displays: "Welcome to Your Personal Meal Planner"
   ├─ Shows: Brief 1-line description
   ├─ 3 Sample recipes pre-loaded (visible in background)
   └─ Options:
       ├─ [Start Tour] → Quick 4-step interactive tutorial
       ├─ [Skip to Dashboard] → Immediately access app
       └─ [Browse Sample Recipes] → View example recipes

4a. IF user selects [Start Tour]:
    Step 1: Dashboard overview
    └─ Tooltip: "This is your home. See upcoming meals and quick actions."

    Step 2: Recipes section
    └─ Tooltip: "Manage your recipe collection here. These are sample recipes."

    Step 3: Meal Plan
    └─ Tooltip: "Plan your week by adding recipes to the calendar."

    Step 4: Shopping List
    └─ Tooltip: "Generate shopping lists from your meal plans."

    → [Dashboard] with "Get Started" panel

4b. IF user selects [Skip to Dashboard]:
    → [Dashboard] immediately

5. [Dashboard]
   ├─ "Get Started" panel visible (dismissible)
   ├─ Quick Actions:
   │   ├─ [Create Your First Recipe]
   │   ├─ [Plan This Week]
   │   └─ [View Sample Recipes]
   └─ User begins using app
```

### Success Criteria
- User reaches dashboard in <30 seconds
- User creates first recipe in <5 minutes
- User plans first meal in <10 minutes

---

## 2. Recipe Creation Flow

### Goal
Add a new recipe to the library quickly and intuitively.

### Flow
```
1. Entry Points (any of):
   ├─ Dashboard → [Create Recipe] button
   ├─ Recipes page → [+ New Recipe] button
   └─ Keyboard shortcut: Ctrl/Cmd + N (from recipes page)

2. [Recipe Form - Empty State]
   ├─ Cursor auto-focuses on "Recipe Name" field
   └─ Form sections visible:
       ├─ Basic Info (expanded by default)
       ├─ Ingredients (collapsed)
       ├─ Instructions (collapsed)
       └─ Advanced Options (collapsed)

3. User enters Recipe Name
   └─ Example placeholder: "e.g., Spaghetti Carbonara"

4. User fills Basic Info:
   ├─ Description (optional)
   ├─ Default Servings (default: 4)
   └─ [Show More] → Expands: Cuisine Type, Prep Time, Cook Time, Photo

5. User clicks [+ Add Ingredients] or expands Ingredients section

6. [Ingredients Section - Expanded]
   ├─ [+ Add Ingredient] button
   └─ Click to add first ingredient

7. [Ingredient Input Row]
   ├─ Autocomplete ingredient name
   │   └─ Typing shows suggestions from ingredient library
   │   └─ If not found: "Create new ingredient: [name]"
   ├─ Quantity input (accepts fractions: "1/2", "1 1/2", decimals)
   ├─ Unit dropdown (cup, tsp, oz, g, etc.)
   ├─ Prep notes (optional): "diced", "chopped", etc.
   └─ [Remove] button (icon)

8. User adds multiple ingredients
   ├─ Click [+ Add Ingredient] for each
   └─ Ingredients display in order added
   └─ Drag handles allow reordering

9. User clicks [+ Add Instructions] or expands Instructions section

10. [Instructions Section - Expanded]
    ├─ [+ Add Step] button
    └─ Click to add first instruction

11. [Instruction Input]
    ├─ Step number auto-assigned (1, 2, 3...)
    ├─ Multi-line text area
    ├─ [Remove] button
    └─ Drag handle for reordering

12. User adds multiple steps
    └─ Steps numbered automatically

13. User clicks [Save Recipe]

14. Validation:
    ├─ IF valid → Save to database
    │   └─ Success toast: "Recipe saved!"
    │   └─ → [Recipe Detail Page] for new recipe
    │
    └─ IF invalid → Show inline errors
        ├─ Missing required fields highlighted
        └─ User corrects → Returns to step 13

15. [Recipe Detail Page]
    ├─ Displays saved recipe
    ├─ Options visible:
    │   ├─ [Edit Recipe]
    │   ├─ [Add to Meal Plan]
    │   ├─ [Delete Recipe]
    │   └─ [Back to Recipes]
    └─ Success!
```

### Alternative Flows

#### Quick Create from Meal Planning
```
User is on Meal Plan page
└─ Clicks [+ Add Meal] on empty slot
    └─ Modal opens: [Select Recipe]
        ├─ Recipe list shown
        └─ [+ Create New Recipe] link at top
            └─ Opens Recipe Form in modal/new tab
            └─ After save → Returns to meal selection
                └─ New recipe pre-selected
```

#### Import Recipe (Future)
```
User has recipe URL or text
└─ [Import Recipe] button
    └─ [Import Modal]
        ├─ Paste URL or text
        ├─ AI/parser extracts ingredients & instructions
        └─ Opens Recipe Form with pre-filled data
            └─ User reviews/edits → Saves
```

---

## 3. Meal Planning Flow

### Goal
Plan the week's meals efficiently using saved recipes.

### Flow
```
1. Entry Points:
   ├─ Dashboard → [Plan Meals] button
   ├─ Navigation → [Meal Plan] link
   └─ Recipe Detail → [Add to Meal Plan] button

2. [Meal Plan Page - Weekly Calendar]
   ├─ Displays current week (Mon-Sun or Sun-Sat per settings)
   ├─ Grid: 7 days × 4 meal types (Breakfast, Lunch, Dinner, Snack)
   ├─ Navigation:
   │   ├─ [← Previous Week]
   │   ├─ [This Week] (if viewing past/future week)
   │   └─ [Next Week →]
   └─ Each cell shows:
       ├─ Existing meal (if planned)
       └─ Empty: [+ Add Meal] button (visible on hover)

3. User clicks [+ Add Meal] on empty slot
   └─ Date and meal type pre-selected

4. [Add Meal Modal] opens
   ├─ Header: "Add Meal - Monday, June 5 - Dinner"
   ├─ Recipe Selection:
   │   ├─ Search bar (autocomplete)
   │   └─ Recipe list below:
   │       ├─ Frequent recipes shown first
   │       ├─ Shows: Recipe name, servings, prep time
   │       └─ Click to select
   ├─ Servings Override (optional):
   │   ├─ Default: Recipe's default servings (4)
   │   └─ User can change: "Serving 6 people?"
   ├─ Notes (optional):
   │   └─ Text area: "e.g., Dinner party with friends"
   └─ Actions:
       ├─ [Cancel] → Close modal
       └─ [Add Meal] → Save and close

5. User searches for recipe
   ├─ Types in search bar
   └─ Results filter in real-time
       └─ Shows matching recipes

6. User clicks a recipe from list
   └─ Recipe selected (highlighted)

7. User adjusts servings (optional)
   └─ Changes from 4 to 6

8. User clicks [Add Meal]

9. Validation & Save:
   ├─ Recipe must be selected (required)
   └─ IF valid:
       ├─ Save to database
       ├─ Close modal
       ├─ Success toast: "Meal added to Tuesday dinner"
       └─ → [Meal Plan Page] updates with new meal card

10. [Meal Plan Page - Updated]
    └─ New meal visible in calendar cell:
        ├─ Recipe name
        ├─ Serving count (if overridden)
        ├─ Hover reveals:
        │   ├─ [✓ Mark Complete]
        │   ├─ [✎ Edit]
        │   └─ [× Remove]
        └─ Checkmark icon if marked complete

11. User continues adding meals
    └─ Repeat steps 3-10 for other time slots

12. User marks meal as complete (after cooking)
    └─ Clicks checkmark icon
        └─ Visual change: Meal card shows completed state (strikethrough or checkmark)
        └─ Toast: "Meal marked as complete"
```

### Alternative Flows

#### Quick Add from Recipe Detail
```
[Recipe Detail Page]
└─ User clicks [Add to Meal Plan] button
    └─ [Add to Meal Plan Modal]
        ├─ Recipe pre-selected
        ├─ User selects:
        │   ├─ Date (date picker)
        │   └─ Meal type (dropdown)
        ├─ Servings & notes (optional)
        └─ [Add] → Saves and shows success
            └─ Option: "View Meal Plan" or "Stay Here"
```

#### Duplicate Meal
```
User hovers over existing meal card
└─ Clicks [⋮ More] menu
    └─ Selects [Duplicate Meal]
        └─ [Duplicate Modal]
            ├─ Pre-filled with current meal details
            ├─ User selects new date/meal type
            └─ [Duplicate] → Creates copy
                └─ Success toast: "Meal duplicated"
```

#### Drag & Drop (Advanced)
```
User clicks and holds meal card
└─ Drag begins (visual feedback)
    └─ Drops on different date/meal type slot
        ├─ IF slot empty → Move meal
        │   └─ Update saves automatically
        │   └─ Toast: "Meal moved"
        │
        └─ IF slot occupied → Show confirmation
            └─ "Replace existing meal?"
                ├─ [Cancel] → Return to original
                └─ [Replace] → Swap meals
```

#### Edit Meal
```
User clicks [✎ Edit] on meal card
└─ [Edit Meal Modal] (same as Add Meal)
    ├─ All fields pre-filled
    ├─ User can change:
    │   ├─ Recipe
    │   ├─ Servings
    │   └─ Notes
    └─ [Save] → Updates meal
        └─ Calendar refreshes
```

---

## 4. Shopping List Generation Flow

### Goal
Generate a consolidated shopping list from planned meals with minimal effort.

### Flow
```
1. Entry Points:
   ├─ Dashboard → [Shopping List] button
   ├─ Navigation → [Shopping] link
   └─ Meal Plan page → [Generate Shopping List] button

2. [Shopping List Page]
   ├─ Header: "Shopping List"
   ├─ Date Range Selector:
   │   ├─ Quick options:
   │   │   ├─ [This Week] (default, active)
   │   │   ├─ [Next Week]
   │   │   └─ [This Month]
   │   └─ [Custom Range] → Date pickers
   └─ If no meals in range:
       └─ Empty state: "No meals planned for this period"
           └─ [Plan Meals] button → Navigate to Meal Plan

3. IF meals exist in range:
   └─ Automatic generation begins
       └─ Loading indicator (brief, <500ms)

4. [Shopping List - Generated]
   ├─ Summary header:
   │   ├─ Date range: "June 5-11, 2024"
   │   ├─ Meal count: "21 meals planned"
   │   └─ Export options:
   │       ├─ [📋 Copy to Clipboard]
   │       ├─ [🖨️ Print]
   │       └─ [📄 Export PDF]
   │
   └─ Ingredients grouped by category:
       └─ For each category (e.g., Produce, Dairy, Meat):
           ├─ Category header with color code
           └─ Ingredient list:
               └─ Each ingredient:
                   ├─ Checkbox (unchecked by default)
                   ├─ Quantity (aggregated): "3 1/2 cups"
                   ├─ Ingredient name: "All-purpose flour"
                   ├─ Prep notes: "diced, chopped" (if any)
                   └─ Recipe references: "Used in: Pasta (×2), Pizza"

5. User checks off items while shopping
   └─ Clicks checkbox next to ingredient
       └─ Visual change:
           ├─ Strikethrough text
           ├─ Dimmed appearance
           └─ Checkbox shows checkmark
       └─ State persists (saved to database)
       └─ No explicit "save" needed

6. User continues checking items
   └─ Progress visible: "8 of 23 items checked"

7. Shopping complete
   └─ User has two options:
       ├─ Leave list as-is (for reference)
       └─ Click [Clear Completed] button
           └─ Confirmation: "Clear all checked items?"
               ├─ [Cancel]
               └─ [Clear] → Removes checked items from view

8. User exports/shares list (optional)
   └─ Clicks export option:

       a) [Copy to Clipboard]
          └─ Text format copied
          └─ Toast: "Shopping list copied!"
          └─ User can paste into notes app, message, etc.

       b) [Print]
          └─ Opens print dialog
          └─ Formatted print view
          └─ User prints or saves as PDF

       c) [Export PDF]
          └─ Downloads PDF file
          └─ Toast: "PDF downloaded"
```

### Alternative Flows

#### Quick Generate from Meal Plan
```
[Meal Plan Page]
└─ User clicks [Generate Shopping List] (in header)
    └─ Current week auto-selected
    └─ → [Shopping List Page] with week's items
```

#### Change Date Range
```
[Shopping List Page]
└─ User clicks [Custom Range]
    └─ [Date Range Picker]
        ├─ Start date picker
        ├─ End date picker
        └─ [Update] button
            └─ Regenerates list for new range
                └─ List updates with new ingredients
```

#### Manual Ingredient Addition (Future)
```
User needs item not in meal plan
└─ Clicks [+ Add Item] button
    └─ [Add Item Modal]
        ├─ Ingredient search/create
        ├─ Quantity & unit
        └─ [Add] → Appears in "Other" category
```

---

## 5. Recipe Discovery & Management Flow

### Goal
Quickly find, view, and manage recipes in the library.

### Flow
```
1. User navigates to Recipes page
   └─ Navigation → [Recipes]

2. [Recipe List Page]
   ├─ Search bar at top (prominent)
   ├─ Filter options:
   │   ├─ Cuisine type dropdown
   │   ├─ Sort by: (Name, Recent, Rating, Most Used)
   │   └─ [Clear Filters]
   ├─ View toggle:
   │   ├─ [Grid View] (cards)
   │   └─ [List View] (compact)
   └─ Recipe cards/rows:
       └─ Each shows:
           ├─ Recipe photo (if available)
           ├─ Recipe name
           ├─ Quick meta: "4 servings • 30 min • ★4.5"
           ├─ Tags: Cuisine type
           └─ Hover reveals:
               ├─ [View]
               ├─ [Edit]
               └─ [Delete]

3a. User searches for recipe:
    └─ Types in search bar: "pasta"
        └─ Real-time filtering
        └─ Results update as typing
        └─ Shows: "5 recipes found for 'pasta'"

3b. User filters by cuisine:
    └─ Selects "Italian" from dropdown
        └─ List filters instantly
        └─ Shows: "8 Italian recipes"

3c. User sorts:
    └─ Changes sort to "Most Used"
        └─ List reorders
        └─ Frequent recipes appear first

4. User clicks on recipe card
   └─ → [Recipe Detail Page]

5. [Recipe Detail Page]
   ├─ Header:
   │   ├─ Recipe name (large)
   │   ├─ Recipe photo
   │   ├─ Quick actions:
   │   │   ├─ [Edit Recipe]
   │   │   ├─ [Add to Meal Plan]
   │   │   ├─ [Delete Recipe]
   │   │   └─ [⋮ More]
   │   └─ Meta info:
   │       ├─ Servings: 4 (adjustable)
   │       ├─ Prep: 15 min, Cook: 30 min
   │       ├─ Rating: ★★★★☆ (4.2) - 5 times made
   │       └─ Cuisine: Italian
   │
   ├─ Description:
   │   └─ Full description text
   │
   ├─ Ingredients Section:
   │   ├─ Serving adjuster: [-] 4 [+]
   │   │   └─ Quantities scale in real-time
   │   └─ Ingredient list:
   │       └─ Each ingredient:
   │           ├─ Checkbox (for shopping)
   │           ├─ Quantity (scaled): "2 cups"
   │           ├─ Ingredient name: "Flour"
   │           └─ Prep note: "sifted"
   │
   ├─ Instructions Section:
   │   └─ Numbered steps:
   │       └─ Each step:
   │           ├─ Step number
   │           ├─ Instruction text
   │           └─ Checkbox (for cooking mode)
   │
   └─ Footer Actions:
       ├─ [Add to Meal Plan]
       └─ [Back to Recipes]

6a. User adjusts servings:
    └─ Clicks [+] to increase to 6
        └─ All ingredient quantities recalculate
        └─ "2 cups flour" → "3 cups flour"
        └─ Visual update instant (<100ms)

6b. User adds to meal plan:
    └─ Clicks [Add to Meal Plan]
        └─ → Follow "Meal Planning Flow" (Section 3)
        └─ After adding → Returns to recipe detail
        └─ Success toast: "Added to meal plan"

6c. User edits recipe:
    └─ Clicks [Edit Recipe]
        └─ → [Recipe Form] (pre-filled)
        └─ → Follow "Recipe Creation Flow" (Section 2, edit mode)

6d. User deletes recipe:
    └─ Clicks [Delete Recipe]
        └─ Confirmation dialog:
            ├─ "Delete 'Pasta Carbonara'? This cannot be undone."
            ├─ Warning if used in meal plans:
            │   └─ "This recipe is used in 3 upcoming meals."
            └─ Actions:
                ├─ [Cancel]
                └─ [Delete] (red, dangerous action)
                    └─ Delete from database
                    └─ Remove from meal plans
                    └─ Toast: "Recipe deleted"
                    └─ → [Recipe List Page]
```

### Alternative Flows

#### Quick Edit
```
[Recipe List Page]
└─ User hovers over recipe card
    └─ Clicks [Edit] icon
        └─ → [Recipe Form] (edit mode)
        └─ After save → Returns to list
```

#### Rate Recipe (After Cooking)
```
[Recipe Detail Page]
└─ User clicks rating stars
    └─ [Rate Recipe Modal]
        ├─ Star rating (1-5)
        ├─ Notes (optional): "Thoughts on this recipe?"
        ├─ Date made (defaults to today)
        └─ [Save Rating]
            └─ Updates average rating
            └─ Toast: "Rating saved"
```

---

## 6. Settings & Data Management Flow

### Goal
Configure preferences and manage data safely.

### Flow
```
1. User navigates to Settings
   └─ Navigation → [Settings] (gear icon)

2. [Settings Page]
   ├─ Tabbed or sectioned interface:
   │   ├─ Display
   │   ├─ Ingredients
   │   ├─ Meal Planning
   │   ├─ Data Management
   │   └─ About
   └─ Default: Display tab active

3. [Display Settings]
   ├─ Measurement System:
   │   └─ Radio buttons: (•) Metric  ( ) Imperial
   ├─ Date Format:
   │   └─ Dropdown: "MM/DD/YYYY" (default)
   ├─ First Day of Week:
   │   └─ Radio: ( ) Sunday  (•) Monday
   ├─ Default Servings:
   │   └─ Number input: [4]
   └─ Theme (future):
       └─ Radio: (•) Light  ( ) Dark  ( ) Auto

   └─ Changes save automatically
       └─ Toast: "Settings saved"

4. [Ingredients Settings]
   ├─ Manage Categories:
   │   └─ List of categories:
   │       └─ Each category:
   │           ├─ Name
   │           ├─ Color badge
   │           ├─ Drag handle (reorder)
   │           └─ Actions:
   │               ├─ [Edit] → Change name/color
   │               └─ [Delete] (if not system category)
   │
   └─ [+ Add Category]
       └─ [Add Category Modal]
           ├─ Name input
           ├─ Color picker
           └─ [Save]

5. [Meal Planning Settings]
   ├─ Default Meal Types:
   │   └─ Checkboxes:
   │       ├─ [✓] Breakfast
   │       ├─ [✓] Lunch
   │       ├─ [✓] Dinner
   │       └─ [✓] Snack
   │   └─ Note: "Unchecked meal types hidden from calendar"
   │
   └─ Planning Timeframe:
       └─ Dropdown: "1 Week" (default)

6. [Data Management Settings]
   ├─ Export Data:
   │   ├─ [Export Recipes] → Downloads JSON
   │   ├─ [Export Meal Plans] → Downloads JSON
   │   └─ [Export All Data] → Downloads complete backup
   │       └─ Click triggers download
   │       └─ Toast: "Data exported successfully"
   │
   ├─ Import Data:
   │   └─ [Import Data] → File picker
   │       └─ Select JSON file
   │       └─ Validation & preview
   │       └─ [Confirm Import]
   │           └─ Merges or replaces data
   │           └─ Success/error feedback
   │
   ├─ Auto-Backup:
   │   └─ Toggle: [✓] Enable daily backups
   │   └─ Location shown: "~/Documents/MealPlanner/Backups"
   │
   └─ Danger Zone:
       └─ [Clear All Data] (red button)
           └─ [Confirmation Dialog]
               ├─ Warning: "This will delete ALL recipes, meals, and data"
               ├─ "Type 'DELETE' to confirm"
               ├─ Text input for confirmation
               └─ Actions:
                   ├─ [Cancel]
                   └─ [Delete Everything] (disabled until typed correctly)
                       └─ Clears database
                       └─ Resets to welcome state
                       └─ Loads sample data

7. [About Settings]
   ├─ App version: "v1.0.0"
   ├─ Database location: "/path/to/meal-planner.db"
   ├─ [Help Documentation] → Opens help in new tab
   ├─ [Report Issue] → Opens issue form/email
   └─ License information
```

---

## 7. Error & Edge Case Flows

### Common Error Scenarios

#### Network Unavailable (Backend Down)
```
User opens app → Backend not running
└─ [Error Screen]
    ├─ "Unable to connect to Meal Planner"
    ├─ "The application may not be running."
    ├─ Troubleshooting:
    │   └─ "Try restarting the application"
    └─ [Retry Connection] button
        └─ Attempts reconnection every 5s
```

#### Database Locked/Corrupted
```
User performs action → Database error
└─ [Error Modal]
    ├─ "Database Error"
    ├─ "Unable to save changes. Your data may be locked."
    ├─ Actions:
    │   ├─ [Retry]
    │   └─ [Export Data] (backup before troubleshooting)
    └─ [Contact Support]
```

#### Validation Errors
```
User submits form → Validation fails
└─ Form stays open
    ├─ Error summary at top: "Please fix 3 errors"
    ├─ Fields with errors highlighted (red border)
    ├─ Inline error messages below fields
    └─ Scroll to first error
```

#### Accidental Delete Prevention
```
User tries to delete recipe used in future meals
└─ [Enhanced Confirmation]
    ├─ "This recipe is in 5 upcoming meals"
    ├─ "Delete it anyway? (This will remove it from meal plans)"
    ├─ [Cancel]
    └─ [Delete Anyway] (requires extra click)
```

---

## 8. Keyboard Shortcuts & Power User Flows

### Global Shortcuts
```
Ctrl/Cmd + N  → New Recipe (from Recipes page)
Ctrl/Cmd + S  → Save (in forms)
Ctrl/Cmd + F  → Focus search bar
Ctrl/Cmd + W  → Close modal/dialog
Ctrl/Cmd + ,  → Open Settings
Ctrl/Cmd + /  → Show keyboard shortcuts help

Escape        → Close modal/dialog
```

### Navigation Shortcuts
```
G then H      → Go to Home
G then R      → Go to Recipes
G then M      → Go to Meal Plan
G then S      → Go to Shopping List
```

### Quick Actions in Meal Plan
```
Click date/meal slot → Opens Add Meal modal
Double-click meal    → Opens Edit modal
Hover + E            → Edit
Hover + D            → Delete
Hover + C            → Mark complete
```

---

## 9. Mobile/Responsive Flows (Future)

### Simplified Mobile Experience
```
Mobile users access via phone browser
└─ Simplified navigation (bottom tab bar)
    ├─ Home
    ├─ Recipes (list view only)
    ├─ Meal Plan (day view default)
    └─ Shopping (check-off focus)
```

---

## Summary: Flow Optimization Opportunities

### Quickest Paths to Value
1. **Recipe to Meal Plan**: 2 clicks (Recipe detail → Add to Meal Plan → Select date)
2. **Meal Plan to Shopping**: 1 click (Meal Plan page → Generate Shopping List)
3. **New Recipe**: 3 clicks (Dashboard → Create Recipe → Save)

### Friction Points to Minimize
- Minimize form fields (use smart defaults)
- Autocomplete everywhere (recipes, ingredients)
- Inline editing where possible (no modal for simple changes)
- Real-time validation (prevent errors before submission)
- Persistent state (never lose unsaved work)

### Productivity Accelerators
- Duplicate meals (1-click copy)
- Bulk actions (select multiple → act)
- Keyboard shortcuts (power users)
- Recent items (show frequent recipes first)
- Smart suggestions (next meal, similar recipes)
