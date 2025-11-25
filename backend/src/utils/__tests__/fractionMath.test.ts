import {
  normalize,
  addQuantities,
  subtractQuantities,
  multiplyQuantity,
  divideQuantity,
  compareQuantities,
  formatQuantity,
} from '../fractionMath.js';

describe('fractionMath', () => {
  describe('normalize', () => {
    it('should reduce fractions', () => {
      expect(normalize({ whole: 0, num: 2, denom: 4 })).toEqual({ whole: 0, num: 1, denom: 2 });
      expect(normalize({ whole: 0, num: 4, denom: 8 })).toEqual({ whole: 0, num: 1, denom: 2 });
    });

    it('should move excess numerator to whole', () => {
      expect(normalize({ whole: 0, num: 5, denom: 2 })).toEqual({ whole: 2, num: 1, denom: 2 });
      expect(normalize({ whole: 1, num: 5, denom: 2 })).toEqual({ whole: 3, num: 1, denom: 2 });
    });

    it('should normalize zero fractions', () => {
      expect(normalize({ whole: 5, num: 0, denom: 3 })).toEqual({ whole: 5, num: 0, denom: 1 });
    });

    it('should handle negative numbers', () => {
      expect(normalize({ whole: 0, num: -1, denom: 2 })).toEqual({ whole: 0, num: -1, denom: 2 });
      expect(normalize({ whole: 2, num: -5, denom: 2 })).toEqual({ whole: 0, num: -1, denom: 2 });
    });
  });

  describe('addQuantities', () => {
    it('should add fractions with same denominator', () => {
      const result = addQuantities(
        { whole: 0, num: 1, denom: 2 },
        { whole: 0, num: 1, denom: 2 }
      );
      expect(result).toEqual({ whole: 1, num: 0, denom: 1 });
    });

    it('should add fractions with different denominators', () => {
      const result = addQuantities(
        { whole: 0, num: 1, denom: 2 },
        { whole: 0, num: 1, denom: 4 }
      );
      expect(result).toEqual({ whole: 0, num: 3, denom: 4 });
    });

    it('should add mixed numbers', () => {
      const result = addQuantities(
        { whole: 1, num: 1, denom: 2 },
        { whole: 2, num: 1, denom: 4 }
      );
      expect(result).toEqual({ whole: 3, num: 3, denom: 4 });
    });

    it('should handle edge case of all zeros', () => {
      const result = addQuantities(
        { whole: 0, num: 0, denom: 1 },
        { whole: 0, num: 0, denom: 1 }
      );
      expect(result).toEqual({ whole: 0, num: 0, denom: 1 });
    });

    it('should add 2 cups + 1 cup = 3 cups', () => {
      const result = addQuantities(
        { whole: 2, num: 0, denom: 1 },
        { whole: 1, num: 0, denom: 1 }
      );
      expect(result).toEqual({ whole: 3, num: 0, denom: 1 });
    });
  });

  describe('subtractQuantities', () => {
    it('should subtract quantities', () => {
      const result = subtractQuantities(
        { whole: 1, num: 1, denom: 2 },
        { whole: 0, num: 1, denom: 2 }
      );
      expect(result).toEqual({ whole: 1, num: 0, denom: 1 });
    });

    it('should handle negative results', () => {
      const result = subtractQuantities(
        { whole: 0, num: 1, denom: 4 },
        { whole: 0, num: 1, denom: 2 }
      );
      expect(result).toEqual({ whole: 0, num: -1, denom: 4 });
    });
  });

  describe('multiplyQuantity', () => {
    it('should multiply by integers', () => {
      expect(multiplyQuantity({ whole: 1, num: 1, denom: 2 }, 2)).toEqual(
        { whole: 3, num: 0, denom: 1 }
      );
      expect(multiplyQuantity({ whole: 2, num: 0, denom: 1 }, 3)).toEqual(
        { whole: 6, num: 0, denom: 1 }
      );
    });

    it('should multiply by decimals', () => {
      const result = multiplyQuantity({ whole: 2, num: 0, denom: 1 }, 1.5);
      expect(result).toEqual({ whole: 3, num: 0, denom: 1 });
    });

    it('should multiply fractions', () => {
      const result = multiplyQuantity({ whole: 0, num: 1, denom: 2 }, 2);
      expect(result).toEqual({ whole: 1, num: 0, denom: 1 });
    });

    it('should multiply by zero', () => {
      const result = multiplyQuantity({ whole: 5, num: 1, denom: 2 }, 0);
      expect(result).toEqual({ whole: 0, num: 0, denom: 1 });
    });

    it('should scale recipe by 0.5x', () => {
      const result = multiplyQuantity({ whole: 2, num: 0, denom: 1 }, 0.5);
      expect(result).toEqual({ whole: 1, num: 0, denom: 1 });
    });

    it('should scale recipe by 1.5x', () => {
      const result = multiplyQuantity(
        { whole: 1, num: 1, denom: 3 },
        1.5
      );
      expect(result.whole).toBe(2);
      expect(result.num).toBe(0);
    });
  });

  describe('divideQuantity', () => {
    it('should divide by integers', () => {
      const result = divideQuantity({ whole: 2, num: 0, denom: 1 }, 2);
      expect(result).toEqual({ whole: 1, num: 0, denom: 1 });
    });

    it('should throw on divide by zero', () => {
      expect(() => divideQuantity({ whole: 1, num: 0, denom: 1 }, 0)).toThrow();
    });
  });

  describe('compareQuantities', () => {
    it('should compare equal quantities', () => {
      expect(compareQuantities(
        { whole: 1, num: 1, denom: 2 },
        { whole: 1, num: 1, denom: 2 }
      )).toBe(0);
    });

    it('should identify less than', () => {
      expect(compareQuantities(
        { whole: 0, num: 1, denom: 2 },
        { whole: 1, num: 0, denom: 1 }
      )).toBe(-1);
    });

    it('should identify greater than', () => {
      expect(compareQuantities(
        { whole: 2, num: 0, denom: 1 },
        { whole: 1, num: 1, denom: 2 }
      )).toBe(1);
    });
  });

  describe('formatQuantity', () => {
    it('should format whole numbers', () => {
      expect(formatQuantity({ whole: 2, num: 0, denom: 1 })).toBe('2');
      expect(formatQuantity({ whole: 10, num: 0, denom: 1 })).toBe('10');
    });

    it('should format simple fractions', () => {
      expect(formatQuantity({ whole: 0, num: 1, denom: 2 })).toBe('1/2');
      expect(formatQuantity({ whole: 0, num: 3, denom: 4 })).toBe('3/4');
    });

    it('should format mixed numbers', () => {
      expect(formatQuantity({ whole: 1, num: 1, denom: 2 })).toBe('1 1/2');
      expect(formatQuantity({ whole: 2, num: 3, denom: 4 })).toBe('2 3/4');
    });

    it('should format as decimal when requested', () => {
      expect(formatQuantity({ whole: 1, num: 1, denom: 2 }, 'decimal')).toBe('1.5');
      expect(formatQuantity({ whole: 2, num: 0, denom: 1 }, 'decimal')).toBe('2');
    });

    it('should format zero', () => {
      expect(formatQuantity({ whole: 0, num: 0, denom: 1 })).toBe('0');
    });
  });
});
