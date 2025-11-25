import { parseQuantity, quantityToDecimal } from '../fractionParser';

describe('fractionParser', () => {
  describe('parseQuantity', () => {
    it('should parse simple integers', () => {
      expect(parseQuantity('2')).toEqual({ whole: 2, num: 0, denom: 1 });
      expect(parseQuantity('0')).toEqual({ whole: 0, num: 0, denom: 1 });
      expect(parseQuantity('100')).toEqual({ whole: 100, num: 0, denom: 1 });
    });

    it('should parse simple fractions', () => {
      expect(parseQuantity('1/2')).toEqual({ whole: 0, num: 1, denom: 2 });
      expect(parseQuantity('3/4')).toEqual({ whole: 0, num: 3, denom: 4 });
      expect(parseQuantity('1/8')).toEqual({ whole: 0, num: 1, denom: 8 });
    });

    it('should parse mixed numbers', () => {
      expect(parseQuantity('1 1/2')).toEqual({ whole: 1, num: 1, denom: 2 });
      expect(parseQuantity('2 3/4')).toEqual({ whole: 2, num: 3, denom: 4 });
      expect(parseQuantity('10 1/8')).toEqual({ whole: 10, num: 1, denom: 8 });
    });

    it('should parse decimals', () => {
      expect(parseQuantity('0.5')).toEqual({ whole: 0, num: 1, denom: 2 });
      expect(parseQuantity('1.5')).toEqual({ whole: 1, num: 1, denom: 2 });
      expect(parseQuantity('2.25')).toEqual({ whole: 2, num: 1, denom: 4 });
    });

    it('should handle whitespace', () => {
      expect(parseQuantity('  1 1/2  ')).toEqual({ whole: 1, num: 1, denom: 2 });
      expect(parseQuantity('  2  ')).toEqual({ whole: 2, num: 0, denom: 1 });
    });

    it('should throw on invalid input', () => {
      expect(() => parseQuantity('')).toThrow('Empty quantity string');
      expect(() => parseQuantity('abc')).toThrow('Invalid quantity format');
      expect(() => parseQuantity('1/0')).toThrow('Denominator cannot be zero');
      expect(() => parseQuantity('a/b')).toThrow('Invalid quantity format');
    });

    it('should handle edge cases', () => {
      expect(parseQuantity('1/1')).toEqual({ whole: 0, num: 1, denom: 1 });
      expect(parseQuantity('0 1/2')).toEqual({ whole: 0, num: 1, denom: 2 });
    });
  });

  describe('quantityToDecimal', () => {
    it('should convert to decimal correctly', () => {
      expect(quantityToDecimal({ whole: 1, num: 1, denom: 2 })).toBe(1.5);
      expect(quantityToDecimal({ whole: 2, num: 1, denom: 4 })).toBe(2.25);
      expect(quantityToDecimal({ whole: 0, num: 1, denom: 2 })).toBe(0.5);
      expect(quantityToDecimal({ whole: 5, num: 0, denom: 1 })).toBe(5);
    });

    it('should handle zero', () => {
      expect(quantityToDecimal({ whole: 0, num: 0, denom: 1 })).toBe(0);
    });
  });

  describe('round-trip conversion', () => {
    it('should parse and convert back to decimal correctly', () => {
      const testCases = ['2', '1/2', '1 1/2', '0.5', '2.25'];
      for (const testCase of testCases) {
        const parsed = parseQuantity(testCase);
        const decimal = quantityToDecimal(parsed);
        expect(decimal).toBeCloseTo(parseFloat(testCase), 5);
      }
    });
  });
});
