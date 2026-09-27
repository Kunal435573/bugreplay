import { describe, expect, it } from 'vitest';
import { calculateTotal } from '../lib/bug';
describe('Northstar checkout', () => {
  it('SAVE10 on a $50 cart must return $45 (regression: double-discount bug)', () =>
    expect(calculateTotal('original')).toBe(4500));
  it('keeps the repaired calculation at the expected total', () => expect(calculateTotal('repaired')).toBe(4500));
  it('does not discount without SAVE10', () => expect(calculateTotal('repaired', 5000, '')).toBe(5000));
});
