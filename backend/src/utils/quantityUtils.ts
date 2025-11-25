import { Quantity } from './types';
import { formatQuantity as formatQty } from './fractionMath';
import { parseQuantity } from './fractionParser';

/**
 * Utility to convert database quantity fields to Quantity object
 * Database stores as: quantityWhole, quantityNum, quantityDenom
 */
export function dbToQuantity(
  quantityWhole: number,
  quantityNum: number,
  quantityDenom: number
): Quantity {
  return {
    whole: quantityWhole,
    num: quantityNum,
    denom: quantityDenom
  };
}

/**
 * Utility to convert Quantity object back to database fields
 */
export function quantityToDb(quantity: Quantity): {
  quantityWhole: number;
  quantityNum: number;
  quantityDenom: number;
} {
  return {
    quantityWhole: quantity.whole,
    quantityNum: quantity.num,
    quantityDenom: quantity.denom
  };
}

/**
 * Format a quantity for display
 */
export function formatQuantityDisplay(quantity: Quantity): string {
  return formatQty(quantity, 'auto');
}

/**
 * Parse quantity from API request (can be "2", "1/2", "1 1/2", "1.5")
 */
export function parseQuantityFromAPI(input: string): Quantity {
  return parseQuantity(input);
}
