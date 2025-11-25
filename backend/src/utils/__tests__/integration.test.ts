import { parseQuantity, quantityToDecimal } from '../fractionParser.js';
import { addQuantities, multiplyQuantity, formatQuantity, normalize } from '../fractionMath.js';
import { convertQuantity, toBaseUnits, fromBaseUnits } from '../unitConverter.js';

describe('integration tests - real-world scenarios', () => {
  describe('recipe scaling', () => {
    it('should scale a recipe by 1.5x', () => {
      // Recipe calls for 2 cups flour
      const flour = parseQuantity('2');
      // Scale by 1.5
      const scaledFlour = multiplyQuantity(flour, 1.5);
      expect(formatQuantity(scaledFlour)).toBe('3');
    });

    it('should scale recipe with fractions by 0.5x', () => {
      // Recipe calls for 1 1/2 cups sugar
      const sugar = parseQuantity('1 1/2');
      // Scale by 0.5
      const scaledSugar = multiplyQuantity(sugar, 0.5);
      expect(formatQuantity(scaledSugar)).toBe('3/4');
    });

    it('should handle scaling with decimals', () => {
      // Recipe calls for 3/4 cup butter
      const butter = parseQuantity('3/4');
      // Scale by 2
      const scaledButter = multiplyQuantity(butter, 2);
      expect(formatQuantity(scaledButter)).toBe('1 1/2');
    });
  });

  describe('shopping list aggregation', () => {
    it('should aggregate flour from two recipes', () => {
      // Recipe 1: 2 cups flour
      const recipe1Flour = parseQuantity('2');
      // Recipe 2: 1 1/2 cups flour
      const recipe2Flour = parseQuantity('1 1/2');
      // Total needed
      const totalFlour = addQuantities(recipe1Flour, recipe2Flour);
      expect(formatQuantity(totalFlour)).toBe('3 1/2');
    });

    it('should aggregate milk from three recipes', () => {
      // Recipe 1: 1 cup milk
      const recipe1 = parseQuantity('1');
      // Recipe 2: 3/4 cup milk
      const recipe2 = parseQuantity('3/4');
      // Recipe 3: 1/2 cup milk
      const recipe3 = parseQuantity('1/2');

      const total = addQuantities(addQuantities(recipe1, recipe2), recipe3);
      expect(formatQuantity(total)).toBe('2 1/4');
    });

    it('should handle unit conversion in aggregation', () => {
      // Recipe 1: 2 cups milk
      const recipe1 = toBaseUnits(parseQuantity('2'), 'cup');
      // Recipe 2: 500 ml milk
      const recipe2 = toBaseUnits(parseQuantity('500'), 'ml');
      // Total
      const totalMl = recipe1.value + recipe2.value;
      // Should be roughly 972ml (2 cups + 500ml)
      expect(totalMl).toBeCloseTo(972.176, 0);
    });
  });

  describe('meal plan with serving overrides', () => {
    it('should calculate ingredients for modified servings', () => {
      // Recipe base: 1 1/2 cups flour for 4 servings
      const baseFlour = parseQuantity('1 1/2');
      // We need 6 servings instead of 4 (1.5x scaling)
      const scaleFactor = 6 / 4;
      const neededFlour = multiplyQuantity(baseFlour, scaleFactor);
      // Should be 2 1/4 cups
      expect(formatQuantity(neededFlour)).toBe('2 1/4');
    });

    it('should handle partial servings', () => {
      // Recipe: 2 cups sugar for 8 servings
      const baseSugar = parseQuantity('2');
      // We need 3 servings
      const scaleFactor = 3 / 8;
      const neededSugar = multiplyQuantity(baseSugar, scaleFactor);
      // Should be 3/4 cup
      expect(formatQuantity(neededSugar)).toBe('3/4');
    });
  });

  describe('unit conversions for shopping lists', () => {
    it('should convert butter from cups to grams for shopping', () => {
      const butterCups = parseQuantity('1 1/2');
      // Convert to grams (1 cup butter ≈ 227g)
      const butterGrams = convertQuantity(butterCups, 'cup', 'g');
      // 1.5 * 227 = ~340.5g
      expect(butterGrams.whole).toBeGreaterThan(300);
    });

    it('should keep volume and mass separate', () => {
      // This should throw - can't convert cups to grams for water
      // (while water 1cup = 240ml ≈ 240g, the app shouldn't do this automatically)
      expect(() => {
        convertQuantity(parseQuantity('2'), 'cup', 'g');
      }).toThrow();
    });
  });

  describe('complex shopping list scenario', () => {
    it('should aggregate ingredients for a 2-meal plan', () => {
      // Meal 1: Cookies (makes 24, we want 12 -> 0.5x)
      // Base: 2 1/4 cups flour
      const cookieFlour = multiplyQuantity(parseQuantity('2 1/4'), 0.5);
      // Meal 2: Bread (makes 1, we want 1 -> 1x)
      // Base: 3 cups flour
      const breadFlour = parseQuantity('3');
      // Total flour needed
      const totalFlour = addQuantities(cookieFlour, breadFlour);
      // 1.125 + 3 = 4.125 cups = 4 1/8
      expect(formatQuantity(totalFlour)).toBe('4 1/8');
    });

    it('should handle ingredient from multiple meal instances', () => {
      // Monday dinner: Pasta (serves 4, we need 6 - 1.5x)
      // Base: 1 lb pasta
      const mealPasta = multiplyQuantity(parseQuantity('1'), 1.5);
      // Tuesday dinner: Pasta (serves 4, we need 4 - 1x)
      // Base: 1 lb pasta
      const pasta2 = parseQuantity('1');
      // Total
      const totalPasta = addQuantities(mealPasta, pasta2);
      expect(formatQuantity(totalPasta)).toBe('2 1/2');
    });
  });

  describe('error handling', () => {
    it('should handle invalid quantity strings gracefully', () => {
      expect(() => parseQuantity('invalid')).toThrow();
      expect(() => parseQuantity('1/0')).toThrow();
    });

    it('should validate unit conversions', () => {
      expect(() => {
        convertQuantity(parseQuantity('2'), 'cup', 'lb');
      }).toThrow('Cannot convert between');
    });
  });

  describe('formatting and display', () => {
    it('should format shopping list quantities nicely', () => {
      const q1 = parseQuantity('2');
      expect(formatQuantity(q1)).toBe('2');

      const q2 = parseQuantity('1 1/2');
      expect(formatQuantity(q2)).toBe('1 1/2');

      const q3 = parseQuantity('3/4');
      expect(formatQuantity(q3)).toBe('3/4');
    });

    it('should preserve precision through conversions', () => {
      // Start with a fraction
      const original = parseQuantity('3/4');
      // Convert to ml
      const inMl = convertQuantity(original, 'cup', 'ml');
      // Convert back to cups
      const backToCups = convertQuantity(inMl, 'ml', 'cup');
      // Should be approximately equal
      const originalDecimal = quantityToDecimal(original);
      const resultDecimal = quantityToDecimal(normalize(backToCups));
      expect(resultDecimal).toBeCloseTo(originalDecimal, 2);
    });
  });
});
