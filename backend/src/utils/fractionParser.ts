import { Quantity } from './types';

/**
 * Parse a string representation of a quantity into a Quantity object
 * Handles:
 * - "2" -> { whole: 2, num: 0, denom: 1 }
 * - "1/2" -> { whole: 0, num: 1, denom: 2 }
 * - "1 1/2" -> { whole: 1, num: 1, denom: 2 }
 * - "0.5" -> { whole: 0, num: 1, denom: 2 }
 * - "1.5" -> { whole: 1, num: 1, denom: 2 }
 */
export function parseQuantity(input: string): Quantity {
  const trimmed = input.trim();

  // Handle empty string
  if (!trimmed) {
    throw new Error('Empty quantity string');
  }

  // Check if it's a mixed number (e.g., "1 1/2")
  const mixedMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const [, whole, num, denom] = mixedMatch;
    const denomNum = parseInt(denom, 10);
    if (denomNum === 0) {
      throw new Error('Denominator cannot be zero');
    }
    return {
      whole: parseInt(whole, 10),
      num: parseInt(num, 10),
      denom: denomNum
    };
  }

  // Check if it's a simple fraction (e.g., "1/2")
  const fractionMatch = trimmed.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const [, num, denom] = fractionMatch;
    const denomNum = parseInt(denom, 10);
    if (denomNum === 0) {
      throw new Error('Denominator cannot be zero');
    }
    return {
      whole: 0,
      num: parseInt(num, 10),
      denom: denomNum
    };
  }

  // Check if it's a decimal (e.g., "1.5" or "0.5")
  const decimalMatch = trimmed.match(/^(\d+)\.(\d+)$/);
  if (decimalMatch) {
    const [, wholePart, decimalPart] = decimalMatch;
    return decimalToQuantity(
      parseInt(wholePart, 10),
      decimalPart
    );
  }

  // Check if it's a simple integer
  const intMatch = trimmed.match(/^\d+$/);
  if (intMatch) {
    return {
      whole: parseInt(trimmed, 10),
      num: 0,
      denom: 1
    };
  }

  throw new Error(`Invalid quantity format: "${input}"`);
}

/**
 * Convert decimal representation to Quantity
 * E.g., "5" (from 1.5) becomes { whole: 1, num: 1, denom: 2 }
 */
function decimalToQuantity(whole: number, decimalPart: string): Quantity {
  // Convert decimal to fraction
  // "5" (from 1.5) -> 5/10 = 1/2
  // "25" (from 1.25) -> 25/100 = 1/4
  // "333" (from 1.333) -> approximated to nearest fraction

  const denominator = Math.pow(10, decimalPart.length);
  let numerator = parseInt(decimalPart, 10);

  // Reduce the fraction
  const gcd = getGCD(numerator, denominator);
  numerator /= gcd;
  const reducedDenom = denominator / gcd;

  // If numerator >= denominator, add to whole and adjust
  if (numerator >= reducedDenom) {
    whole += Math.floor(numerator / reducedDenom);
    numerator = numerator % reducedDenom;
  }

  return {
    whole,
    num: numerator,
    denom: reducedDenom
  };
}

/**
 * Get greatest common divisor
 */
function getGCD(a: number, b: number): number {
  return b === 0 ? a : getGCD(b, a % b);
}

/**
 * Convert a Quantity to its decimal representation
 * E.g., { whole: 1, num: 1, denom: 2 } -> 1.5
 */
export function quantityToDecimal(q: Quantity): number {
  return q.whole + q.num / q.denom;
}
