import { Quantity } from './types';

/**
 * Get greatest common divisor
 */
function getGCD(a: number, b: number): number {
  return b === 0 ? a : getGCD(b, a % b);
}

/**
 * Reduce a fraction to its simplest form
 */
function reduceFraction(num: number, denom: number): [number, number] {
  if (denom === 0) {
    throw new Error('Denominator cannot be zero');
  }
  const gcd = getGCD(Math.abs(num), Math.abs(denom));
  return [num / gcd, denom / gcd];
}

/**
 * Normalize a Quantity so the fractional part is less than 1
 * E.g., { whole: 1, num: 5, denom: 2 } -> { whole: 3, num: 1, denom: 2 }
 */
export function normalize(q: Quantity): Quantity {
  if (q.num === 0) {
    return { whole: q.whole, num: 0, denom: 1 };
  }

  // Handle negative numbers properly
  let { whole, num, denom } = q;

  // Ensure denom is positive
  if (denom < 0) {
    num = -num;
    denom = -denom;
  }

  // Move excess from numerator to whole
  if (Math.abs(num) >= Math.abs(denom)) {
    whole += Math.floor(num / denom);
    num = num % denom;
  }

  // Reduce the fraction
  if (num !== 0) {
    const [reducedNum, reducedDenom] = reduceFraction(num, denom);
    num = reducedNum;
    denom = reducedDenom;
  }

  return { whole, num, denom };
}

/**
 * Add two quantities
 * E.g., { whole: 1, num: 1, denom: 2 } + { whole: 0, num: 1, denom: 4 } = { whole: 1, num: 3, denom: 4 }
 */
export function addQuantities(q1: Quantity, q2: Quantity): Quantity {
  // Convert to common denominator
  const lcm = (q1.denom * q2.denom) / getGCD(q1.denom, q2.denom);

  const num1 = (q1.whole * q1.denom + q1.num) * (lcm / q1.denom);
  const num2 = (q2.whole * q2.denom + q2.num) * (lcm / q2.denom);

  const resultNum = num1 + num2;
  const result = {
    whole: 0,
    num: resultNum,
    denom: lcm
  };

  return normalize(result);
}

/**
 * Subtract q2 from q1
 */
export function subtractQuantities(q1: Quantity, q2: Quantity): Quantity {
  const negatedQ2: Quantity = {
    whole: -q2.whole,
    num: -q2.num,
    denom: q2.denom
  };
  return addQuantities(q1, negatedQ2);
}

/**
 * Multiply a quantity by a scalar
 * E.g., { whole: 1, num: 1, denom: 2 } * 2 = { whole: 3, num: 0, denom: 1 }
 */
export function multiplyQuantity(q: Quantity, scalar: number): Quantity {
  // Convert quantity to improper fraction
  const numerator = (q.whole * q.denom + q.num) * scalar;
  const denom = q.denom;

  const result = {
    whole: 0,
    num: numerator,
    denom
  };

  return normalize(result);
}

/**
 * Divide a quantity by a scalar
 */
export function divideQuantity(q: Quantity, scalar: number): Quantity {
  if (scalar === 0) {
    throw new Error('Cannot divide by zero');
  }
  return multiplyQuantity(q, 1 / scalar);
}

/**
 * Compare two quantities
 * Returns: -1 if q1 < q2, 0 if q1 === q2, 1 if q1 > q2
 */
export function compareQuantities(q1: Quantity, q2: Quantity): number {
  const val1 = q1.whole + q1.num / q1.denom;
  const val2 = q2.whole + q2.num / q2.denom;

  if (val1 < val2) return -1;
  if (val1 > val2) return 1;
  return 0;
}

/**
 * Format a quantity as a string
 * E.g., { whole: 1, num: 1, denom: 2 } -> "1 1/2"
 * E.g., { whole: 0, num: 1, denom: 2 } -> "1/2"
 * E.g., { whole: 2, num: 0, denom: 1 } -> "2"
 */
export function formatQuantity(q: Quantity, format: 'fraction' | 'decimal' | 'auto' = 'auto'): string {
  const normalized = normalize(q);

  if (format === 'decimal' || (format === 'auto' && normalized.num === 0)) {
    const decimal = normalized.whole + normalized.num / normalized.denom;
    return decimal.toString();
  }

  // Format as fraction
  let result = '';

  if (normalized.whole > 0) {
    result += normalized.whole;
  }

  if (normalized.num > 0) {
    if (result) result += ' ';
    result += `${normalized.num}/${normalized.denom}`;
  }

  if (result === '') {
    return '0';
  }

  return result;
}
