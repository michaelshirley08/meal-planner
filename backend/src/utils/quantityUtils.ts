import { Quantity } from './types';

/**
 * Utility to convert database quantity fields to Quantity (number)
 * Database stores as: quantityWhole, quantityNum, quantityDenom (legacy fraction format)
 * Convert to decimal: whole + num/denom
 */
export function dbToQuantity(
  quantityWhole: number,
  quantityNum: number,
  quantityDenom: number
): Quantity {
  if (quantityDenom === 0) {
    throw new Error('Invalid quantity: denominator cannot be zero');
  }
  return quantityWhole + quantityNum / quantityDenom;
}

/**
 * Utility to convert Quantity (number) back to database fields
 * Store decimal as whole=floor(qty), num=(qty-floor(qty))*100, denom=100
 * This maintains backward compatibility with the database schema
 */
export function quantityToDb(quantity: Quantity): {
  quantityWhole: number;
  quantityNum: number;
  quantityDenom: number;
} {
  // Round to 2 decimal places first
  const rounded = Math.round(quantity * 100) / 100;
  validateQuantity(rounded);

  const whole = Math.floor(rounded);
  const fractional = rounded - whole;

  // Store fractional part as hundredths for 2 decimal places
  // e.g., 1.75 -> whole=1, num=75, denom=100
  const num = Math.round(fractional * 100);
  const denom = 100;

  return {
    quantityWhole: whole,
    quantityNum: num,
    quantityDenom: denom
  };
}

/**
 * Format a quantity for display
 * Removes trailing zeros and limits to 2 decimal places
 */
export function formatQuantityDisplay(quantity: Quantity): string {
  // Round to 2 decimal places first
  const rounded = Math.round(quantity * 100) / 100;

  // Format and remove trailing zeros
  const formatted = rounded.toFixed(2).replace(/\.?0+$/, '');
  return formatted;
}

/**
 * Parse quantity from API request (accepts "2", "1.5", "0.75")
 * Rejects fractions like "1/2" or "1 1/2"
 */
export function parseQuantityFromAPI(input: string): Quantity {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error('Empty quantity string');
  }

  // Check for fraction syntax (no longer supported)
  if (trimmed.includes('/')) {
    throw new Error('Fraction format not supported. Please use decimal format (e.g., "1.5" instead of "1 1/2")');
  }

  const parsed = parseFloat(trimmed);

  if (isNaN(parsed)) {
    throw new Error(`Invalid quantity format: "${input}". Expected a decimal number.`);
  }

  // Round to 2 decimal places
  const rounded = Math.round(parsed * 100) / 100;
  validateQuantity(rounded);

  return rounded;
}

/**
 * Validate a quantity value
 * Ensures it's within acceptable bounds
 */
export function validateQuantity(quantity: number): void {
  if (!Number.isFinite(quantity)) {
    throw new Error('Quantity must be a finite number');
  }

  if (quantity < 0.01) {
    throw new Error('Quantity must be at least 0.01');
  }

  if (quantity > 9999.99) {
    throw new Error('Quantity must be less than 10000');
  }

  // Check for more than 2 decimal places
  const rounded = Math.round(quantity * 100) / 100;
  if (Math.abs(quantity - rounded) > 0.001) {
    throw new Error('Quantity can have at most 2 decimal places');
  }
}

/**
 * Add two quantities
 */
export function addQuantities(q1: Quantity, q2: Quantity): Quantity {
  const result = q1 + q2;
  return Math.round(result * 100) / 100;
}

/**
 * Multiply a quantity by a scalar
 */
export function multiplyQuantity(q: Quantity, scalar: number): Quantity {
  const result = q * scalar;
  return Math.round(result * 100) / 100;
}

/**
 * Divide a quantity by a scalar
 */
export function divideQuantity(q: Quantity, scalar: number): Quantity {
  if (scalar === 0) {
    throw new Error('Cannot divide by zero');
  }
  const result = q / scalar;
  return Math.round(result * 100) / 100;
}
