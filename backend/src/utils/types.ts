/**
 * Represents a quantity as a fraction with a whole number part
 * Example: 1 1/2 = { whole: 1, num: 1, denom: 2 }
 * Example: 3/4 = { whole: 0, num: 3, denom: 4 }
 * Example: 2 = { whole: 2, num: 0, denom: 1 }
 */
export interface Quantity {
  whole: number;
  num: number;
  denom: number;
}

/**
 * Supported volume units (convert to milliliters)
 */
export type VolumeUnit = 'ml' | 'L' | 'tsp' | 'tbsp' | 'fl oz' | 'cup';

/**
 * Supported mass units (convert to grams)
 */
export type MassUnit = 'g' | 'kg' | 'oz' | 'lb';

/**
 * Any supported unit
 */
export type Unit = VolumeUnit | MassUnit;

/**
 * Represents a quantity with a unit
 */
export interface QuantityWithUnit {
  quantity: Quantity;
  unit: Unit;
}
