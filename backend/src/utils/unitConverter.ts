import { Quantity, VolumeUnit, MassUnit, Unit } from './types';

// Re-export types for convenience
export type { Unit, VolumeUnit, MassUnit } from './types';

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
 * E.g., 2 cups to ml: convertQuantity(2, 'cup', 'ml') -> 473.18
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

  // Get conversion factor
  const conversionFactor = fromType === 'volume'
    ? VOLUME_TO_ML[fromUnit as VolumeUnit] / VOLUME_TO_ML[toUnit as VolumeUnit]
    : MASS_TO_G[fromUnit as MassUnit] / MASS_TO_G[toUnit as MassUnit];

  const result = quantity * conversionFactor;

  // Round to 2 decimal places
  return Math.round(result * 100) / 100;
}

/**
 * Convert a quantity to base units (ml for volume, g for mass)
 */
export function toBaseUnits(quantity: Quantity, unit: Unit): { value: number; unit: 'ml' | 'g' } {
  const type = getMeasurementType(unit);

  if (type === 'volume') {
    const factor = VOLUME_TO_ML[unit as VolumeUnit];
    const value = quantity * factor;
    return { value: Math.round(value * 100) / 100, unit: 'ml' };
  } else {
    const factor = MASS_TO_G[unit as MassUnit];
    const value = quantity * factor;
    return { value: Math.round(value * 100) / 100, unit: 'g' };
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

  // Round to 2 decimal places
  return Math.round(result * 100) / 100;
}

/**
 * Format a quantity with unit for display
 */
export function formatQuantityWithUnit(
  quantity: Quantity,
  unit: Unit,
  options: {
    style?: 'short' | 'long'; // 'cup' vs 'cups'
    decimalPlaces?: number;
  } = {}
): string {
  const places = options.decimalPlaces ?? 2;
  const qStr = quantity.toFixed(places).replace(/\.?0+$/, '');

  const unitStr = options.style === 'long'
    ? pluralizeUnit(unit, quantity)
    : unit;

  return `${qStr} ${unitStr}`;
}

/**
 * Pluralize a unit if needed
 */
function pluralizeUnit(unit: Unit, quantity: Quantity): string {
  const plural = Math.abs(quantity) !== 1;

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
