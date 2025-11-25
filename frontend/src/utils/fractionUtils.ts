import type { Quantity } from '../types';

/**
 * Parse a string like "1 1/2", "1/2", "2.5", or "3" into a Quantity object
 */
export function parseQuantity(input: string): Quantity {
  const trimmed = input.trim();

  // Check for mixed number (e.g., "1 1/2")
  const mixedMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    return {
      whole: parseInt(mixedMatch[1]),
      num: parseInt(mixedMatch[2]),
      denom: parseInt(mixedMatch[3]),
    };
  }

  // Check for simple fraction (e.g., "1/2")
  const fractionMatch = trimmed.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    return {
      whole: 0,
      num: parseInt(fractionMatch[1]),
      denom: parseInt(fractionMatch[2]),
    };
  }

  // Check for decimal (e.g., "2.5")
  const decimalMatch = trimmed.match(/^(\d+)\.(\d+)$/);
  if (decimalMatch) {
    const decimal = parseFloat(trimmed);
    // Convert to fraction with denominator 10, 100, etc.
    const decimalPlaces = decimalMatch[2].length;
    const denom = Math.pow(10, decimalPlaces);
    const num = Math.round(decimal * denom);
    return reduceFraction({ whole: 0, num, denom });
  }

  // Simple whole number
  const whole = parseInt(trimmed);
  if (!isNaN(whole)) {
    return { whole, num: 0, denom: 1 };
  }

  // Default to 0
  return { whole: 0, num: 0, denom: 1 };
}

/**
 * Format a Quantity object as a string like "1 1/2", "1/2", or "2"
 */
export function formatQuantity(qty: Quantity): string {
  const reduced = reduceFraction(qty);

  if (reduced.num === 0 || reduced.denom === 1) {
    return reduced.whole.toString();
  }

  if (reduced.whole === 0) {
    return `${reduced.num}/${reduced.denom}`;
  }

  return `${reduced.whole} ${reduced.num}/${reduced.denom}`;
}

/**
 * Reduce a fraction to lowest terms
 */
export function reduceFraction(qty: Quantity): Quantity {
  let { whole, num, denom } = qty;

  // Handle improper fractions
  if (num >= denom) {
    whole += Math.floor(num / denom);
    num = num % denom;
  }

  // If numerator is 0, denominator should be 1
  if (num === 0) {
    denom = 1;
  } else {
    // Find GCD and reduce
    const gcd = getGCD(num, denom);
    num = num / gcd;
    denom = denom / gcd;
  }

  return { whole, num, denom };
}

/**
 * Get the greatest common divisor
 */
function getGCD(a: number, b: number): number {
  return b === 0 ? a : getGCD(b, a % b);
}

/**
 * Convert Quantity to decimal for calculations
 */
export function quantityToDecimal(qty: Quantity): number {
  return qty.whole + (qty.num / qty.denom);
}

/**
 * Add two quantities together
 */
export function addQuantities(a: Quantity, b: Quantity): Quantity {
  const aDecimal = quantityToDecimal(a);
  const bDecimal = quantityToDecimal(b);
  const sum = aDecimal + bDecimal;

  // Convert back to fraction
  const whole = Math.floor(sum);
  const decimal = sum - whole;

  // Convert decimal to fraction (limit denominator to common values)
  const commonDenoms = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];
  let bestNum = 0;
  let bestDenom = 1;
  let bestError = Math.abs(decimal);

  for (const denom of commonDenoms) {
    const num = Math.round(decimal * denom);
    const error = Math.abs(decimal - num / denom);
    if (error < bestError && error < 0.01) {
      bestNum = num;
      bestDenom = denom;
      bestError = error;
    }
  }

  return reduceFraction({ whole, num: bestNum, denom: bestDenom });
}

/**
 * Multiply a quantity by a scalar
 */
export function multiplyQuantity(qty: Quantity, factor: number): Quantity {
  const decimal = quantityToDecimal(qty) * factor;
  const whole = Math.floor(decimal);
  const remaining = decimal - whole;

  // Convert to fraction
  const commonDenoms = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];
  let bestNum = 0;
  let bestDenom = 1;
  let bestError = Math.abs(remaining);

  for (const denom of commonDenoms) {
    const num = Math.round(remaining * denom);
    const error = Math.abs(remaining - num / denom);
    if (error < bestError && error < 0.01) {
      bestNum = num;
      bestDenom = denom;
      bestError = error;
    }
  }

  return reduceFraction({ whole, num: bestNum, denom: bestDenom });
}
