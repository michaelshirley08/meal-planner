import {
  dbToQuantity,
  quantityToDb,
  formatQuantityDisplay,
  parseQuantityFromAPI,
  validateQuantity,
  addQuantities,
  multiplyQuantity,
  divideQuantity,
} from '../quantityUtils';

describe('quantityUtils', () => {
  describe('dbToQuantity', () => {
    it('should convert database fields to decimal', () => {
      expect(dbToQuantity(1, 50, 100)).toBe(1.5);
      expect(dbToQuantity(2, 25, 100)).toBe(2.25);
      expect(dbToQuantity(0, 75, 100)).toBe(0.75);
    });

    it('should handle whole numbers', () => {
      expect(dbToQuantity(3, 0, 100)).toBe(3);
    });

    it('should throw on zero denominator', () => {
      expect(() => dbToQuantity(1, 0, 0)).toThrow('denominator cannot be zero');
    });
  });

  describe('quantityToDb', () => {
    it('should convert decimal to database fields', () => {
      const result = quantityToDb(1.5);
      expect(result.quantityWhole).toBe(1);
      expect(result.quantityNum).toBe(50);
      expect(result.quantityDenom).toBe(100);
    });

    it('should handle whole numbers', () => {
      const result = quantityToDb(3);
      expect(result.quantityWhole).toBe(3);
      expect(result.quantityNum).toBe(0);
      expect(result.quantityDenom).toBe(100);
    });

    it('should auto-round inputs with more than 2 decimal places', () => {
      const result = quantityToDb(1.234);
      expect(result.quantityWhole).toBe(1);
      expect(result.quantityNum).toBe(23);
      expect(result.quantityDenom).toBe(100);
    });

    it('should throw on invalid quantity', () => {
      expect(() => quantityToDb(-1)).toThrow();
      expect(() => quantityToDb(0)).toThrow();
      expect(() => quantityToDb(10000)).toThrow();
    });
  });

  describe('formatQuantityDisplay', () => {
    it('should format decimals without trailing zeros', () => {
      expect(formatQuantityDisplay(1.5)).toBe('1.5');
      expect(formatQuantityDisplay(2.0)).toBe('2');
      expect(formatQuantityDisplay(0.75)).toBe('0.75');
    });

    it('should auto-round to 2 decimal places', () => {
      expect(formatQuantityDisplay(1.234)).toBe('1.23');
    });
  });

  describe('parseQuantityFromAPI', () => {
    it('should parse decimal strings', () => {
      expect(parseQuantityFromAPI('1.5')).toBe(1.5);
      expect(parseQuantityFromAPI('2')).toBe(2);
      expect(parseQuantityFromAPI('0.75')).toBe(0.75);
    });

    it('should trim whitespace', () => {
      expect(parseQuantityFromAPI('  1.5  ')).toBe(1.5);
    });

    it('should reject fraction format', () => {
      expect(() => parseQuantityFromAPI('1/2')).toThrow('Fraction format not supported');
      expect(() => parseQuantityFromAPI('1 1/2')).toThrow('Fraction format not supported');
    });

    it('should throw on empty string', () => {
      expect(() => parseQuantityFromAPI('')).toThrow('Empty quantity string');
    });

    it('should throw on invalid format', () => {
      expect(() => parseQuantityFromAPI('abc')).toThrow('Invalid quantity format');
    });

    it('should auto-round to 2 decimal places', () => {
      expect(parseQuantityFromAPI('1.999')).toBe(2);
      expect(parseQuantityFromAPI('1.234')).toBe(1.23);
    });
  });

  describe('validateQuantity', () => {
    it('should accept valid quantities', () => {
      expect(() => validateQuantity(1)).not.toThrow();
      expect(() => validateQuantity(0.01)).not.toThrow();
      expect(() => validateQuantity(9999.99)).not.toThrow();
    });

    it('should reject quantities below minimum', () => {
      expect(() => validateQuantity(0)).toThrow('at least 0.01');
      expect(() => validateQuantity(0.001)).toThrow('at least 0.01');
    });

    it('should reject quantities above maximum', () => {
      expect(() => validateQuantity(10000)).toThrow('less than 10000');
    });

    it('should reject non-finite numbers', () => {
      expect(() => validateQuantity(NaN)).toThrow('finite number');
      expect(() => validateQuantity(Infinity)).toThrow('finite number');
    });

    it('should reject more than 2 decimal places', () => {
      expect(() => validateQuantity(1.234)).toThrow('at most 2 decimal places');
    });
  });

  describe('addQuantities', () => {
    it('should add two quantities', () => {
      expect(addQuantities(1.5, 2.25)).toBe(3.75);
      expect(addQuantities(0.5, 0.5)).toBe(1);
    });

    it('should round to 2 decimal places', () => {
      expect(addQuantities(1.111, 2.222)).toBe(3.33);
    });
  });

  describe('multiplyQuantity', () => {
    it('should multiply quantity by scalar', () => {
      expect(multiplyQuantity(1.5, 2)).toBe(3);
      expect(multiplyQuantity(2.5, 0.5)).toBe(1.25);
    });

    it('should round to 2 decimal places', () => {
      expect(multiplyQuantity(1.111, 3)).toBe(3.33);
    });
  });

  describe('divideQuantity', () => {
    it('should divide quantity by scalar', () => {
      expect(divideQuantity(3, 2)).toBe(1.5);
      expect(divideQuantity(5, 4)).toBe(1.25);
    });

    it('should throw on division by zero', () => {
      expect(() => divideQuantity(1, 0)).toThrow('Cannot divide by zero');
    });

    it('should round to 2 decimal places', () => {
      expect(divideQuantity(1, 3)).toBe(0.33);
    });
  });
});
