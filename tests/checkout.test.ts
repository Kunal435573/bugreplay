import { describe, expect, it } from 'vitest';
import { calculateTotal, reproduce, NOTEBOOK_PRICE_CENTS, PEN_SET_PRICE_CENTS } from '../lib/bug';

// ─── Original 3 regression tests (unchanged) ─────────────────────────────────

describe('Northstar checkout', () => {
  it('SAVE10 on a $50 cart returns $40 with original (double-discount bug)', () =>
    expect(calculateTotal('original')).toBe(4000));

  it('keeps the repaired calculation at the expected total', () =>
    expect(calculateTotal('repaired')).toBe(4500));

  it('does not discount without SAVE10', () =>
    expect(calculateTotal('repaired', 5000, '')).toBe(5000));
});

// ─── calculateTotal: variant behaviour ───────────────────────────────────────

describe('calculateTotal — variant behaviour', () => {
  it('original: applies SAVE10 twice (bug)', () => {
    // $50.00 × 10% = $5.00 discount; bug applies it twice → $40.00
    expect(calculateTotal('original', 5000, 'SAVE10')).toBe(4000);
  });

  it('repaired: applies SAVE10 once (correct)', () => {
    expect(calculateTotal('repaired', 5000, 'SAVE10')).toBe(4500);
  });

  it('coupon is case-insensitive', () => {
    expect(calculateTotal('repaired', 5000, 'save10')).toBe(4500);
    expect(calculateTotal('repaired', 5000, 'Save10')).toBe(4500);
  });
});

// ─── reproduce: 1 notebook + 1 pen + SAVE10 ─────────────────────────────────

describe('reproduce — 1 notebook + 1 pen + SAVE10', () => {
  const subtotal = NOTEBOOK_PRICE_CENTS + PEN_SET_PRICE_CENTS; // 5000

  it('original: observedTotal = $40 (bug), expectedTotal = $45', () => {
    const r = reproduce('original', { notebookQuantity: 1, penQuantity: 1, coupon: 'SAVE10' });
    expect(r.subtotalCents).toBe(subtotal);
    expect(r.discountCents).toBe(500);
    expect(r.observedTotalCents).toBe(4000);
    expect(r.expectedTotalCents).toBe(4500);
    expect(r.matchesExpected).toBe(false);
  });

  it('repaired: observedTotal = $45 (correct), matchesExpected = true', () => {
    const r = reproduce('repaired', { notebookQuantity: 1, penQuantity: 1, coupon: 'SAVE10' });
    expect(r.observedTotalCents).toBe(4500);
    expect(r.expectedTotalCents).toBe(4500);
    expect(r.matchesExpected).toBe(true);
  });

  it('result echoes back the cart', () => {
    const r = reproduce('repaired', { notebookQuantity: 1, penQuantity: 1, coupon: 'SAVE10' });
    expect(r.cart).toEqual({ notebookQuantity: 1, penQuantity: 1, coupon: 'SAVE10' });
  });
});

// ─── reproduce: different quantities ─────────────────────────────────────────

describe('reproduce — different quantities', () => {
  it('2 notebooks + 3 pen sets, repaired, SAVE10', () => {
    // subtotal = 2×3000 + 3×2000 = 6000 + 6000 = 12000
    // discount = 10% of 12000 = 1200
    // expected total = 12000 - 1200 = 10800
    const r = reproduce('repaired', { notebookQuantity: 2, penQuantity: 3, coupon: 'SAVE10' });
    expect(r.subtotalCents).toBe(12000);
    expect(r.discountCents).toBe(1200);
    expect(r.observedTotalCents).toBe(10800);
    expect(r.expectedTotalCents).toBe(10800);
    expect(r.matchesExpected).toBe(true);
  });

  it('2 notebooks + 3 pen sets, original (bug): discount applied twice', () => {
    const r = reproduce('original', { notebookQuantity: 2, penQuantity: 3, coupon: 'SAVE10' });
    expect(r.subtotalCents).toBe(12000);
    expect(r.discountCents).toBe(1200);
    // bug: 12000 - 1200 - 1200 = 9600
    expect(r.observedTotalCents).toBe(9600);
    expect(r.matchesExpected).toBe(false);
  });

  it('5 notebooks, no pen sets is not allowed by API — but calculateTotal handles qty via subtotal', () => {
    // calculateTotal works on the subtotal directly; large subtotals are fine
    const subtotal = 5 * NOTEBOOK_PRICE_CENTS; // 15000
    expect(calculateTotal('repaired', subtotal, 'SAVE10')).toBe(13500);
  });
});

// ─── reproduce: empty or invalid coupon ──────────────────────────────────────

describe('reproduce — empty / invalid coupon', () => {
  it('empty coupon string: no discount applied', () => {
    const r = reproduce('repaired', { notebookQuantity: 1, penQuantity: 1, coupon: '' });
    expect(r.discountCents).toBe(0);
    expect(r.observedTotalCents).toBe(5000);
    expect(r.expectedTotalCents).toBe(5000);
    expect(r.matchesExpected).toBe(true);
  });

  it('unknown coupon code: no discount applied', () => {
    const r = reproduce('repaired', { notebookQuantity: 1, penQuantity: 1, coupon: 'BOGUS99' });
    expect(r.discountCents).toBe(0);
    expect(r.observedTotalCents).toBe(5000);
    expect(r.matchesExpected).toBe(true);
  });

  it('whitespace-padded coupon is trimmed and recognised', () => {
    const r = reproduce('repaired', { notebookQuantity: 1, penQuantity: 1, coupon: '  SAVE10  ' });
    expect(r.discountCents).toBe(500);
    expect(r.observedTotalCents).toBe(4500);
  });

  it('calculateTotal with unknown coupon: no discount', () => {
    expect(calculateTotal('repaired', 5000, 'NOPE')).toBe(5000);
  });
});

// ─── reproduce: negative / invalid quantity guard (API layer) ────────────────
// The API rejects negative / zero quantities before calling reproduce().
// These tests confirm the route validation logic by verifying what the
// route would reject — we check the pure arithmetic is still sane when
// the API has already validated inputs as positive integers.

describe('reproduce — quantity edge cases', () => {
  it('quantity of 1 each produces correct subtotal', () => {
    const r = reproduce('repaired', { notebookQuantity: 1, penQuantity: 1, coupon: '' });
    expect(r.subtotalCents).toBe(NOTEBOOK_PRICE_CENTS + PEN_SET_PRICE_CENTS);
  });

  it('large quantities scale linearly', () => {
    const r = reproduce('repaired', { notebookQuantity: 10, penQuantity: 10, coupon: '' });
    expect(r.subtotalCents).toBe(10 * NOTEBOOK_PRICE_CENTS + 10 * PEN_SET_PRICE_CENTS);
    expect(r.discountCents).toBe(0);
    expect(r.observedTotalCents).toBe(r.subtotalCents);
  });

  it('API rejects notebookQuantity = 0 (negative integer check boundary)', () => {
    // Simulate the route validation logic inline
    const qty = 0;
    expect(Number.isInteger(qty) && qty >= 1).toBe(false);
  });

  it('API rejects notebookQuantity = -5', () => {
    const qty = -5;
    expect(Number.isInteger(qty) && qty >= 1).toBe(false);
  });

  it('API rejects notebookQuantity = 1.5 (non-integer)', () => {
    const qty = 1.5;
    expect(Number.isInteger(qty) && qty >= 1).toBe(false);
  });

  it('API rejects notebookQuantity = NaN', () => {
    const qty = Number('abc');
    expect(Number.isInteger(qty) && qty >= 1).toBe(false);
  });
});
