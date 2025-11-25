/**
 * Represents a quantity as a decimal number
 * Example: 1.5 (instead of 1 1/2)
 * Example: 0.75 (instead of 3/4)
 * Example: 2.0
 *
 * Quantities should be limited to 2 decimal places in user input
 * and should be validated to be between 0.01 and 9999.99
 */
export type Quantity = number;

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
