import { parseRupeesToPaise, formatPaiseToRupees } from '../utils/amountUtils';

export function runAmountTests() {
  const results: { test: string; passed: boolean; details?: any }[] = [];

  const assert = (test: string, condition: boolean, details?: any) => {
    results.push({ test, passed: condition, details });
    if (!condition) {
      console.error(`❌ Test failed: ${test}`, details);
    }
  };

  // Test 1: Positive integers
  const t1 = parseRupeesToPaise('50');
  assert('50 parsed as 5000 paise', t1.isValid && t1.amountPaise === 5000, t1);

  // Test 2: Decimals
  const t2 = parseRupeesToPaise('50.01');
  assert('50.01 parsed as 5001 paise', t2.isValid && t2.amountPaise === 5001, t2);

  const t3 = parseRupeesToPaise('99.99');
  assert('99.99 parsed as 9999 paise', t3.isValid && t3.amountPaise === 9999, t3);

  const t4 = parseRupeesToPaise('100');
  assert('100 parsed as 10000 paise', t4.isValid && t4.amountPaise === 10000, t4);

  // Test 3: Rejections
  const t5 = parseRupeesToPaise('0');
  assert('0 is rejected', !t5.isValid && t5.amountPaise === 0, t5);

  const t6 = parseRupeesToPaise('-10');
  assert('Negative amount is rejected', !t6.isValid, t6);

  const t7 = parseRupeesToPaise('12.345');
  assert('More than 2 decimals rejected', !t7.isValid, t7);

  const t8 = parseRupeesToPaise('abc');
  assert('Non-numeric rejected', !t8.isValid, t8);

  // Test 4: Formatting
  assert('formatPaiseToRupees(5000) produces ₹50.00', formatPaiseToRupees(5000).includes('50'));

  return results;
}
