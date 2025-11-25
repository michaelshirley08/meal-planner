import {
  getMeasurementType,
  getVolumeUnits,
  getMassUnits,
  convertQuantity,
  toBaseUnits,
} from '../unitConverter.js';

describe('unitConverter', () => {
  describe('getMeasurementType', () => {
    it('should identify volume units', () => {
      expect(getMeasurementType('ml')).toBe('volume');
      expect(getMeasurementType('L')).toBe('volume');
      expect(getMeasurementType('tsp')).toBe('volume');
      expect(getMeasurementType('tbsp')).toBe('volume');
      expect(getMeasurementType('fl oz')).toBe('volume');
      expect(getMeasurementType('cup')).toBe('volume');
    });

    it('should identify mass units', () => {
      expect(getMeasurementType('g')).toBe('mass');
      expect(getMeasurementType('kg')).toBe('mass');
      expect(getMeasurementType('oz')).toBe('mass');
      expect(getMeasurementType('lb')).toBe('mass');
    });

    it('should throw on unknown unit', () => {
      expect(() => getMeasurementType('invalid' as unknown as string)).toThrow('Unknown unit');
    });
  });

  describe('getVolumeUnits and getMassUnits', () => {
    it('should return lists of units', () => {
      const volumeUnits = getVolumeUnits();
      expect(volumeUnits).toContain('cup');
      expect(volumeUnits).toContain('ml');
      expect(volumeUnits).toContain('tbsp');

      const massUnits = getMassUnits();
      expect(massUnits).toContain('g');
      expect(massUnits).toContain('lb');
      expect(massUnits).toContain('oz');
    });
  });

  describe('convertQuantity', () => {
    it('should convert cups to milliliters', () => {
      const result = convertQuantity({ whole: 1, num: 0, denom: 1 }, 'cup', 'ml');
      expect(result.whole).toBe(236);
      // Allow some tolerance for floating point
      expect(result.num / result.denom).toBeCloseTo(0.588, 1);
    });

    it('should convert liters to cups', () => {
      const result = convertQuantity({ whole: 1, num: 0, denom: 1 }, 'L', 'cup');
      expect(result.whole).toBe(4);
      // 1L = ~4.227 cups
    });

    it('should convert tablespoons to teaspoons', () => {
      const result = convertQuantity({ whole: 1, num: 0, denom: 1 }, 'tbsp', 'tsp');
      expect(result.whole).toBe(3);
      expect(result.num).toBe(0);
    });

    it('should convert pounds to grams', () => {
      const result = convertQuantity({ whole: 1, num: 0, denom: 1 }, 'lb', 'g');
      expect(result.whole).toBe(453);
      // 1 lb = 453.592g
    });

    it('should convert ounces to grams', () => {
      const result = convertQuantity({ whole: 1, num: 0, denom: 1 }, 'oz', 'g');
      expect(result.whole).toBe(28);
      // 1 oz = 28.3495g
    });

    it('should handle same unit conversion (no-op)', () => {
      const qty = { whole: 2, num: 1, denom: 2 };
      const result = convertQuantity(qty, 'cup', 'cup');
      expect(result).toEqual(qty);
    });

    it('should throw when converting between volume and mass', () => {
      expect(() => convertQuantity(
        { whole: 1, num: 0, denom: 1 },
        'cup',
        'g'
      )).toThrow('Cannot convert between');
    });

    it('should convert fractions correctly', () => {
      const result = convertQuantity({ whole: 0, num: 1, denom: 2 }, 'cup', 'ml');
      // 0.5 cups = ~118.3 ml
      expect(result.whole).toBe(118);
    });
  });

  describe('toBaseUnits', () => {
    it('should convert volume to ml', () => {
      const result = toBaseUnits({ whole: 1, num: 0, denom: 1 }, 'cup');
      expect(result.unit).toBe('ml');
      expect(result.value).toBeCloseTo(236.588, 0);
    });

    it('should convert mass to grams', () => {
      const result = toBaseUnits({ whole: 1, num: 0, denom: 1 }, 'lb');
      expect(result.unit).toBe('g');
      expect(result.value).toBeCloseTo(453.592, 0);
    });

    it('should handle fractions', () => {
      const result = toBaseUnits({ whole: 0, num: 1, denom: 2 }, 'cup');
      expect(result.unit).toBe('ml');
      expect(result.value).toBeCloseTo(118.294, 0);
    });
  });

  describe('fromBaseUnits', () => {
    it('should convert ml back to cups', () => {
      const result = fromBaseUnits(236.588, 'ml', 'cup');
      expect(result.whole).toBe(1);
    });

    it('should convert grams back to pounds', () => {
      const result = fromBaseUnits(453.592, 'g', 'lb');
      expect(result.whole).toBe(1);
    });

    it('should throw on unit mismatch', () => {
      expect(() => fromBaseUnits(100, 'ml', 'g')).toThrow();
      expect(() => fromBaseUnits(100, 'g', 'cup')).toThrow();
    });
  });

  describe('practical cooking scenarios', () => {
    it('should aggregate 2 cups and 1 tbsp to ml', () => {
      const cup2 = toBaseUnits({ whole: 2, num: 0, denom: 1 }, 'cup');
      const tbsp1 = toBaseUnits({ whole: 1, num: 0, denom: 1 }, 'tbsp');
      const total = cup2.value + tbsp1.value;
      // 2 cups + 1 tbsp = ~488ml
      expect(total).toBeCloseTo(488.3, 0);
    });

    it('should handle recipe scaling (2x)', () => {
      const scaled = convertQuantity(
        { whole: 1, num: 1, denom: 2 },
        'cup',
        'ml'
      );
      // 1.5 cups = ~354.9ml
      expect(scaled.whole).toBe(354);
    });
  });
});
