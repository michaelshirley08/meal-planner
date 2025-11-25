import { describe, it, expect } from 'vitest';
import {
  parseQuantity,
  formatQuantity,
  reduceFraction,
  quantityToDecimal,
  addQuantities,
  multiplyQuantity,
} from './fractionUtils';
import type { Quantity } from '../types';

describe('Fraction Utils', () => {
  describe('parseQuantity', () => {
    it('should parse simple fractions', () => {
      const result = parseQuantity('1/2');
      expect(result).toEqual({ whole: 0, num: 1, denom: 2 });
    });

    it('should parse mixed numbers', () => {
      const result = parseQuantity('1 1/2');
      expect(result).toEqual({ whole: 1, num: 1, denom: 2 });
    });

    it('should parse decimal numbers', () => {
      const result = parseQuantity('1.5');
      expect(result.whole + result.num / result.denom).toBeCloseTo(1.5, 1);
    });

    it('should parse whole numbers', () => {
      const result = parseQuantity('2');
      expect(result).toEqual({ whole: 2, num: 0, denom: 1 });
    });

    it('should trim whitespace', () => {
      const result = parseQuantity('  1/2  ');
      expect(result).toEqual({ whole: 0, num: 1, denom: 2 });
    });

    it('should handle edge case of 0', () => {
      const result = parseQuantity('0');
      expect(result).toEqual({ whole: 0, num: 0, denom: 1 });
    });
  });

  describe('formatQuantity', () => {
    it('should format simple fractions', () => {
      const result = formatQuantity({ whole: 0, num: 1, denom: 2 });
      expect(result).toBe('1/2');
    });

    it('should format mixed numbers', () => {
      const result = formatQuantity({ whole: 1, num: 1, denom: 2 });
      expect(result).toBe('1 1/2');
    });

    it('should format whole numbers without fraction', () => {
      const result = formatQuantity({ whole: 2, num: 0, denom: 1 });
      expect(result).toBe('2');
    });

    it('should reduce fractions before formatting', () => {
      const result = formatQuantity({ whole: 0, num: 2, denom: 4 });
      expect(result).toBe('1/2');
    });
  });

  describe('reduceFraction', () => {
    it('should reduce fractions to lowest terms', () => {
      const result = reduceFraction({ whole: 0, num: 2, denom: 4 });
      expect(result).toEqual({ whole: 0, num: 1, denom: 2 });
    });

    it('should convert improper fractions', () => {
      const result = reduceFraction({ whole: 0, num: 5, denom: 2 });
      expect(result).toEqual({ whole: 2, num: 1, denom: 2 });
    });

    it('should handle whole numbers', () => {
      const result = reduceFraction({ whole: 2, num: 0, denom: 1 });
      expect(result).toEqual({ whole: 2, num: 0, denom: 1 });
    });

    it('should handle 0 numerator', () => {
      const result = reduceFraction({ whole: 1, num: 0, denom: 2 });
      expect(result).toEqual({ whole: 1, num: 0, denom: 1 });
    });
  });

  describe('quantityToDecimal', () => {
    it('should convert simple fractions', () => {
      const result = quantityToDecimal({ whole: 0, num: 1, denom: 2 });
      expect(result).toBe(0.5);
    });

    it('should convert mixed numbers', () => {
      const result = quantityToDecimal({ whole: 1, num: 1, denom: 2 });
      expect(result).toBe(1.5);
    });

    it('should convert whole numbers', () => {
      const result = quantityToDecimal({ whole: 3, num: 0, denom: 1 });
      expect(result).toBe(3);
    });
  });

  describe('addQuantities', () => {
    it('should add two fractions', () => {
      const a: Quantity = { whole: 0, num: 1, denom: 2 }; // 0.5
      const b: Quantity = { whole: 0, num: 1, denom: 4 }; // 0.25
      const result = addQuantities(a, b);
      const decimal = result.whole + result.num / result.denom;
      expect(decimal).toBeCloseTo(0.75, 1);
    });

    it('should add mixed numbers', () => {
      const a: Quantity = { whole: 1, num: 1, denom: 2 }; // 1.5
      const b: Quantity = { whole: 2, num: 1, denom: 2 }; // 2.5
      const result = addQuantities(a, b);
      const decimal = result.whole + result.num / result.denom;
      expect(decimal).toBeCloseTo(4, 0);
    });

    it('should handle same denominator', () => {
      const a: Quantity = { whole: 0, num: 1, denom: 4 };
      const b: Quantity = { whole: 0, num: 1, denom: 4 };
      const result = addQuantities(a, b);
      expect(result.num / result.denom).toBeCloseTo(0.5, 1);
    });
  });

  describe('multiplyQuantity', () => {
    it('should multiply a fraction by a scalar', () => {
      const qty: Quantity = { whole: 0, num: 1, denom: 2 }; // 0.5
      const result = multiplyQuantity(qty, 2);
      const decimal = result.whole + result.num / result.denom;
      expect(decimal).toBeCloseTo(1, 0);
    });

    it('should multiply a mixed number', () => {
      const qty: Quantity = { whole: 1, num: 1, denom: 2 }; // 1.5
      const result = multiplyQuantity(qty, 2);
      const decimal = result.whole + result.num / result.denom;
      expect(decimal).toBeCloseTo(3, 0);
    });

    it('should handle fractional multipliers', () => {
      const qty: Quantity = { whole: 2, num: 0, denom: 1 }; // 2
      const result = multiplyQuantity(qty, 1.5);
      const decimal = result.whole + result.num / result.denom;
      expect(decimal).toBeCloseTo(3, 0);
    });

    it('should multiply by 0', () => {
      const qty: Quantity = { whole: 5, num: 0, denom: 1 };
      const result = multiplyQuantity(qty, 0);
      expect(result.whole).toBe(0);
    });
  });

  describe('Round-trip tests', () => {
    it('should parse and format consistently', () => {
      const inputs = ['1/2', '1 1/2', '2', '3/4'];
      inputs.forEach((input) => {
        const parsed = parseQuantity(input);
        const formatted = formatQuantity(parsed);
        const reparsed = parseQuantity(formatted);
        const reformatted = formatQuantity(reparsed);
        expect(formatted).toBe(reformatted);
      });
    });

    it('should maintain precision through multiplication', () => {
      const qty: Quantity = { whole: 1, num: 1, denom: 2 }; // 1.5
      const doubled = multiplyQuantity(qty, 2);
      const decimal = doubled.whole + doubled.num / doubled.denom;
      expect(decimal).toBeCloseTo(3, 0);
    });
  });
});
