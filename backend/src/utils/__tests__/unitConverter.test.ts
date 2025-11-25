import {
  getMeasurementType,
  getVolumeUnits,
  getMassUnits,
  convertQuantity,
  toBaseUnits,
  fromBaseUnits,
  formatQuantityWithUnit,
} from '../unitConverter';

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
      expect(() => getMeasurementType('invalid' as unknown as import('../unitConverter').Unit)).toThrow('Unknown unit');
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
      const result = convertQuantity(1, 'cup', 'ml');
      expect(result).toBeCloseTo(236.59, 1);
    });

    it('should convert liters to cups', () => {
      const result = convertQuantity(1, 'L', 'cup');
      expect(result).toBeCloseTo(4.23, 1);
    });

    it('should convert tablespoons to teaspoons', () => {
      const result = convertQuantity(1, 'tbsp', 'tsp');
      expect(result).toBeCloseTo(3, 1);
    });

    it('should convert pounds to grams', () => {
      const result = convertQuantity(1, 'lb', 'g');
      expect(result).toBeCloseTo(453.59, 1);
    });

    it('should convert ounces to grams', () => {
      const result = convertQuantity(1, 'oz', 'g');
      expect(result).toBeCloseTo(28.35, 1);
    });

    it('should handle same unit conversion (no-op)', () => {
      const qty = 2.5;
      const result = convertQuantity(qty, 'cup', 'cup');
      expect(result).toBe(qty);
    });

    it('should throw when converting between volume and mass', () => {
      expect(() => convertQuantity(1, 'cup', 'g')).toThrow('Cannot convert between');
    });

    it('should convert decimal quantities correctly', () => {
      const result = convertQuantity(0.5, 'cup', 'ml');
      expect(result).toBeCloseTo(118.29, 1);
    });

    it('should round to 2 decimal places', () => {
      const result = convertQuantity(1, 'tsp', 'ml');
      expect(result).toBe(4.93);
    });
  });

  describe('toBaseUnits', () => {
    it('should convert volume to ml', () => {
      const result = toBaseUnits(1, 'cup');
      expect(result.unit).toBe('ml');
      expect(result.value).toBeCloseTo(236.59, 1);
    });

    it('should convert mass to grams', () => {
      const result = toBaseUnits(1, 'lb');
      expect(result.unit).toBe('g');
      expect(result.value).toBeCloseTo(453.59, 1);
    });

    it('should handle decimal quantities', () => {
      const result = toBaseUnits(0.5, 'cup');
      expect(result.unit).toBe('ml');
      expect(result.value).toBeCloseTo(118.29, 1);
    });

    it('should round to 2 decimal places', () => {
      const result = toBaseUnits(1, 'tsp');
      expect(result.value).toBe(4.93);
    });
  });

  describe('fromBaseUnits', () => {
    it('should convert ml back to cups', () => {
      const result = fromBaseUnits(236.59, 'ml', 'cup');
      expect(result).toBeCloseTo(1, 1);
    });

    it('should convert grams back to pounds', () => {
      const result = fromBaseUnits(453.59, 'g', 'lb');
      expect(result).toBeCloseTo(1, 1);
    });

    it('should throw on unit mismatch', () => {
      expect(() => fromBaseUnits(100, 'ml', 'g')).toThrow();
      expect(() => fromBaseUnits(100, 'g', 'cup')).toThrow();
    });

    it('should round to 2 decimal places', () => {
      const result = fromBaseUnits(10, 'ml', 'tsp');
      expect(result).toBe(2.03);
    });
  });

  describe('formatQuantityWithUnit', () => {
    it('should format with short style', () => {
      expect(formatQuantityWithUnit(2, 'cup')).toBe('2 cup');
      expect(formatQuantityWithUnit(1.5, 'tsp')).toBe('1.5 tsp');
    });

    it('should format with long style and pluralization', () => {
      expect(formatQuantityWithUnit(1, 'cup', { style: 'long' })).toBe('1 cup');
      expect(formatQuantityWithUnit(2, 'cup', { style: 'long' })).toBe('2 cups');
      expect(formatQuantityWithUnit(0.5, 'tsp', { style: 'long' })).toBe('0.5 teaspoons');
    });

    it('should remove trailing zeros', () => {
      expect(formatQuantityWithUnit(2, 'cup')).toBe('2 cup');
      expect(formatQuantityWithUnit(1.5, 'cup')).toBe('1.5 cup');
    });

    it('should respect decimal places option', () => {
      expect(formatQuantityWithUnit(1.5, 'cup', { decimalPlaces: 0 })).toBe('2 cup');
      expect(formatQuantityWithUnit(1.567, 'cup', { decimalPlaces: 3 })).toBe('1.567 cup');
    });
  });

  describe('practical cooking scenarios', () => {
    it('should aggregate 2 cups and 1 tbsp to ml', () => {
      const cup2 = toBaseUnits(2, 'cup');
      const tbsp1 = toBaseUnits(1, 'tbsp');
      const total = cup2.value + tbsp1.value;
      expect(total).toBeCloseTo(487.96, 1);
    });

    it('should handle recipe scaling (1.5x)', () => {
      const scaled = convertQuantity(1.5, 'cup', 'ml');
      expect(scaled).toBeCloseTo(354.88, 1);
    });

    it('should handle small decimal quantities', () => {
      const result = convertQuantity(0.25, 'tsp', 'ml');
      expect(result).toBeCloseTo(1.23, 1);
    });

    it('should handle large quantities', () => {
      const result = convertQuantity(100, 'g', 'kg');
      expect(result).toBe(0.1);
    });
  });
});
