import { Quantity, VolumeUnit, MassUnit, Unit } from './types';
import { multiplyQuantity, formatQuantity } from './fractionMath';

/**
 * Convert volume units to milliliters
 */
const VOLUME_TO_ML: Record<VolumeUnit, number> = {
  'ml': 1,
  'L': 1000,
  'tsp': 4.92892,
  'tbsp': 14.7868,
  'fl oz': 29.5735,
  'cup': 236.588
};

/**
 * Convert mass units to grams
 */
const MASS_TO_G: Record<MassUnit, number> = {
  'g': 1,
  'kg': 1000,
  'oz': 28.3495,
  'lb': 453.592
};

export type MeasurementType = 'volume' | 'mass';

/**
 * Determine if a unit is volume or mass
 */
export function getMeasurementType(unit: Unit): MeasurementType {
  if (unit in VOLUME_TO_ML) {
    return 'volume';
  }
  if (unit in MASS_TO_G) {
    return 'mass';
  }
  throw new Error(`Unknown unit: ${unit}`);
}

/**
 * Get all volume units
 */
export function getVolumeUnits(): VolumeUnit[] {
  return Object.keys(VOLUME_TO_ML) as VolumeUnit[];
}

/**
 * Get all mass units
 */
export function getMassUnits(): MassUnit[] {
  return Object.keys(MASS_TO_G) as MassUnit[];
}

/**
 * Convert a quantity from one unit to another (within the same measurement type)
 * E.g., 2 cups to ml: convertQuantity({ whole: 2, num: 0, denom: 1 }, 'cup', 'ml') -> { whole: 473, num: 176, denom: 1000 }
 *
 * @throws Error if units are of different measurement types
 */
export function convertQuantity(
  quantity: Quantity,
  fromUnit: Unit,
  toUnit: Unit
): Quantity {
  const fromType = getMeasurementType(fromUnit);
  const toType = getMeasurementType(toUnit);

  if (fromType !== toType) {
    throw new Error(
      `Cannot convert between ${fromType} and ${toType} units. ${fromUnit} is ${fromType}, ${toUnit} is ${toType}.`
    );
  }

  if (fromUnit === toUnit) {
    return quantity;
  }

  // Get conversion factors
  const conversionFactor = fromType === 'volume'
    ? VOLUME_TO_ML[fromUnit as VolumeUnit] / VOLUME_TO_ML[toUnit as VolumeUnit]
    : MASS_TO_G[fromUnit as MassUnit] / MASS_TO_G[toUnit as MassUnit];

  return multiplyQuantity(quantity, conversionFactor);
}

/**
 * Convert a quantity to base units (ml for volume, g for mass)
 */
export function toBaseUnits(quantity: Quantity, unit: Unit): { value: number; unit: 'ml' | 'g' } {
  const type = getMeasurementType(unit);

  if (type === 'volume') {
    const factor = VOLUME_TO_ML[unit as VolumeUnit];
    const total = (quantity.whole * quantity.denom + quantity.num) / quantity.denom * factor;
    return { value: total, unit: 'ml' };
  } else {
    const factor = MASS_TO_G[unit as MassUnit];
    const total = (quantity.whole * quantity.denom + quantity.num) / quantity.denom * factor;
    return { value: total, unit: 'g' };
  }
}

/**
 * Convert from base units back to a target unit
 * Useful for aggregating multiple ingredients and displaying in a preferred unit
 */
export function fromBaseUnits(
  baseValue: number,
  baseUnit: 'ml' | 'g',
  targetUnit: Unit
): Quantity {
  const type = getMeasurementType(targetUnit);

  if (baseUnit === 'ml' && type !== 'volume') {
    throw new Error(`Cannot convert ml to ${targetUnit}`);
  }
  if (baseUnit === 'g' && type !== 'mass') {
    throw new Error(`Cannot convert g to ${targetUnit}`);
  }

  const conversionFactor = baseUnit === 'ml'
    ? 1 / VOLUME_TO_ML[targetUnit as VolumeUnit]
    : 1 / MASS_TO_G[targetUnit as MassUnit];

  const result = baseValue * conversionFactor;

  // Convert decimal to quantity
  return decimalToQuantity(result);
}

/**
 * Convert a decimal number to a Quantity with practical rounding
 */
function decimalToQuantity(value: number): Quantity {
  const whole = Math.floor(value);
  const decimal = value - whole;

  // Common practical fractions for cooking
  // Rounded to nearest 1/16th for precision
  const commonFractions: Array<[number, number, number]> = [
    [1, 16, 0.0625],
    [1, 8, 0.125],
    [3, 16, 0.1875],
    [1, 4, 0.25],
    [5, 16, 0.3125],
    [3, 8, 0.375],
    [7, 16, 0.4375],
    [1, 2, 0.5],
    [9, 16, 0.5625],
    [5, 8, 0.625],
    [11, 16, 0.6875],
    [3, 4, 0.75],
    [13, 16, 0.8125],
    [7, 8, 0.875],
    [15, 16, 0.9375]
  ];

  // Find closest fraction
  let bestFraction: [number, number, number] = [0, 1, 0];
  let bestDiff = 1;

  for (const frac of commonFractions) {
    const diff = Math.abs(decimal - frac[2]);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestFraction = frac;
    }
  }

  return {
    whole,
    num: bestFraction[0],
    denom: bestFraction[1]
  };
}

/**
 * Format a quantity with unit for display
 */
export function formatQuantityWithUnit(
  quantity: Quantity,
  unit: Unit,
  options: {
    style?: 'short' | 'long'; // 'cup' vs 'cups'
    format?: 'fraction' | 'decimal';
  } = {}
): string {
  const qStr = formatQuantity(quantity, options.format);

  const unitStr = options.style === 'long'
    ? pluralizeUnit(unit, quantity)
    : unit;

  return `${qStr} ${unitStr}`;
}

/**
 * Pluralize a unit if needed
 */
function pluralizeUnit(unit: Unit, quantity: Quantity): string {
  const total = quantity.whole + quantity.num / quantity.denom;
  const plural = Math.abs(total) !== 1;

  const pluralMap: Record<Unit, string> = {
    'ml': plural ? 'ml' : 'ml',
    'L': plural ? 'liters' : 'liter',
    'tsp': plural ? 'teaspoons' : 'teaspoon',
    'tbsp': plural ? 'tablespoons' : 'tablespoon',
    'fl oz': plural ? 'fluid ounces' : 'fluid ounce',
    'cup': plural ? 'cups' : 'cup',
    'g': plural ? 'g' : 'g',
    'kg': plural ? 'kg' : 'kg',
    'oz': plural ? 'ounces' : 'ounce',
    'lb': plural ? 'pounds' : 'pound'
  };

  return pluralMap[unit];
}
