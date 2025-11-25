import type { Quantity } from '../types';

/**
 * Parse a string like "1.5", "2", or "0.75" into a Quantity (number)
 * Rejects fractions like "1/2" or "1 1/2"
 */
export function parseQuantity(input: string): Quantity {
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

  if (rounded < 0.01) {
    throw new Error('Quantity must be at least 0.01');
  }

  if (rounded > 9999.99) {
    throw new Error('Quantity must be less than 10000');
  }

  return rounded;
}

/**
 * Format a Quantity (number) as a string like "1.5", "2", or "0.75"
 * Removes trailing zeros
 */
export function formatQuantity(qty: Quantity): string {
  // Round to 2 decimal places and remove trailing zeros
  return qty.toFixed(2).replace(/\.?0+$/, '');
}

/**
 * Convert Quantity to decimal for calculations (already a number, but kept for compatibility)
 */
export function quantityToDecimal(qty: Quantity): number {
  return qty;
}

/**
 * Add two quantities together
 */
export function addQuantities(a: Quantity, b: Quantity): Quantity {
  const sum = a + b;
  return Math.round(sum * 100) / 100;
}

/**
 * Multiply a quantity by a scalar
 */
export function multiplyQuantity(qty: Quantity, factor: number): Quantity {
  const result = qty * factor;
  return Math.round(result * 100) / 100;
}

/**
 * Divide a quantity by a scalar
 */
export function divideQuantity(qty: Quantity, divisor: number): Quantity {
  if (divisor === 0) {
    throw new Error('Cannot divide by zero');
  }
  const result = qty / divisor;
  return Math.round(result * 100) / 100;
}

/**
 * DEPRECATED: Kept for backward compatibility
 * Reduce a fraction to lowest terms - no longer needed with decimal quantities
 */
export function reduceFraction(qty: Quantity): Quantity {
  return qty;
}
