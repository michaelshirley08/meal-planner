import { parseQuantity } from './fractionUtils';
import type { RecipeForm, MealPlanForm } from '../types';

export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  if (!url) return true; // Optional field
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate recipe form data
 */
export function validateRecipeForm(data: RecipeForm): ValidationErrors {
  const errors: ValidationErrors = {};

  // Name validation
  if (!data.name || !data.name.trim()) {
    errors.name = 'Recipe name is required';
  } else if (data.name.length > 200) {
    errors.name = 'Recipe name must be less than 200 characters';
  }

  // Servings validation
  if (!data.defaultServings || data.defaultServings < 1) {
    errors.defaultServings = 'Servings must be at least 1';
  } else if (data.defaultServings > 100) {
    errors.defaultServings = 'Servings cannot exceed 100';
  }

  // Prep time validation
  if (data.prepTime !== undefined) {
    const prepTime = typeof data.prepTime === 'string' ? parseInt(data.prepTime) : data.prepTime;
    if (prepTime < 0) {
      errors.prepTime = 'Prep time cannot be negative';
    } else if (prepTime > 1440) {
      errors.prepTime = 'Prep time cannot exceed 24 hours (1440 minutes)';
    }
  }

  // Cook time validation
  if (data.cookTime !== undefined) {
    const cookTime = typeof data.cookTime === 'string' ? parseInt(data.cookTime) : data.cookTime;
    if (cookTime < 0) {
      errors.cookTime = 'Cook time cannot be negative';
    } else if (cookTime > 1440) {
      errors.cookTime = 'Cook time cannot exceed 24 hours (1440 minutes)';
    }
  }

  // Image URL validation
  if (data.imageUrl && !isValidUrl(data.imageUrl)) {
    errors.imageUrl = 'Please enter a valid URL';
  }

  // Description validation
  if (data.description && data.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  // Instructions validation
  if (data.instructions && data.instructions.length > 10000) {
    errors.instructions = 'Instructions must be less than 10000 characters';
  }

  // Ingredients validation
  if (!data.ingredients || data.ingredients.length === 0) {
    errors.ingredients = 'At least one ingredient is required';
  } else {
    data.ingredients.forEach((ingredient, index) => {
      // Validate quantity format
      try {
        if (!ingredient.quantity || !ingredient.quantity.trim()) {
          errors[`ingredients.${index}.quantity`] = 'Quantity is required';
        } else {
          parseQuantity(ingredient.quantity);
        }
      } catch {
        errors[`ingredients.${index}.quantity`] = 'Invalid quantity format (use 1, 1/2, or 1 1/2)';
      }

      // Validate unit
      if (!ingredient.unit || !ingredient.unit.trim()) {
        errors[`ingredients.${index}.unit`] = 'Unit is required';
      } else if (ingredient.unit.length > 50) {
        errors[`ingredients.${index}.unit`] = 'Unit must be less than 50 characters';
      }

      // Validate ingredientId
      if (!ingredient.ingredientId || ingredient.ingredientId <= 0) {
        errors[`ingredients.${index}.ingredientId`] = 'Please select a valid ingredient';
      }

      // Validate prep note length
      if (ingredient.prepNote && ingredient.prepNote.length > 200) {
        errors[`ingredients.${index}.prepNote`] = 'Prep note must be less than 200 characters';
      }
    });
  }

  return errors;
}

/**
 * Validate meal plan form data
 */
export function validateMealPlanForm(data: MealPlanForm): ValidationErrors {
  const errors: ValidationErrors = {};

  // Recipe ID validation
  if (!data.recipeId || data.recipeId <= 0) {
    errors.recipeId = 'Please select a recipe';
  }

  // Date validation
  if (!data.date || !data.date.trim()) {
    errors.date = 'Date is required';
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.date)) {
      errors.date = 'Date must be in YYYY-MM-DD format';
    }
  }

  // Meal type validation
  const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  if (!data.mealType || !validMealTypes.includes(data.mealType)) {
    errors.mealType = 'Please select a valid meal type';
  }

  // Serving override validation
  if (data.servingOverride !== undefined) {
    if (data.servingOverride < 1) {
      errors.servingOverride = 'Servings must be at least 1';
    } else if (data.servingOverride > 100) {
      errors.servingOverride = 'Servings cannot exceed 100';
    }
  }

  // Notes validation
  if (data.notes && data.notes.length > 500) {
    errors.notes = 'Notes must be less than 500 characters';
  }

  return errors;
}

/**
 * Check if validation errors object has any errors
 */
export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Get first error message from validation errors
 */
export function getFirstError(errors: ValidationErrors): string | null {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!password) {
    errors.password = 'Password is required';
    return errors;
  }

  if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (password.length > 128) {
    errors.password = 'Password must be less than 128 characters';
  }

  // Optional: Add strength requirements
  // if (!/[A-Z]/.test(password)) {
  //   errors.password = 'Password must contain at least one uppercase letter';
  // }
  // if (!/[a-z]/.test(password)) {
  //   errors.password = 'Password must contain at least one lowercase letter';
  // }
  // if (!/[0-9]/.test(password)) {
  //   errors.password = 'Password must contain at least one number';
  // }

  return errors;
}

/**
 * Validate username
 */
export function validateUsername(username: string): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!username || !username.trim()) {
    errors.username = 'Username is required';
    return errors;
  }

  if (username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  if (username.length > 50) {
    errors.username = 'Username must be less than 50 characters';
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
  }

  return errors;
}
