export type Variant = 'original' | 'repaired';

export const BUG_ID = 'BUG-001';

// Synthetic fixture prices (cents)
export const NOTEBOOK_PRICE_CENTS = 3000; // $30.00
export const PEN_SET_PRICE_CENTS  = 2000; // $20.00
export const KNOWN_COUPONS: Record<string, number> = { SAVE10: 0.1 };

// Legacy seeded constants — kept so existing tests and routes stay unchanged.
export const EXPECTED_TOTAL_CENTS  = 4500;
export const BASE_SUBTOTAL_CENTS   = 5000;

export const bugReport = {
  id:          BUG_ID,
  title:       'SAVE10 is applied twice at checkout',
  severity:    'High',
  description: 'A seeded checkout defect subtracts the same discount twice when a two-item cart uses SAVE10.',
  steps: [
    'Add Demo Notebook — $30.00',
    'Add Demo Pen Set — $20.00',
    'Enter coupon SAVE10',
    'Submit the checkout calculation',
  ],
  expectedTotalCents: EXPECTED_TOTAL_CENTS,
  fixtureVersion:     'northstar-v1',
};

/**
 * Core pricing logic.
 *
 * `original` variant: reproduces the bug by applying the discount twice.
 * `repaired` variant: applies the discount once (correct behaviour).
 *
 * All parameters are optional and fall back to the seeded fixture defaults
 * so all existing callers keep working without change.
 */
export function calculateTotal(
  variant:       Variant,
  subtotalCents: number  = BASE_SUBTOTAL_CENTS,
  coupon:        string  = 'SAVE10',
): number {
  const rate     = KNOWN_COUPONS[coupon.trim().toUpperCase()] ?? 0;
  const discount = Math.round(subtotalCents * rate);

  if (variant === 'original') {
    // Bug: discount subtracted twice
    return subtotalCents - discount - discount;
  }
  // Repaired: discount subtracted once
  return subtotalCents - discount;
}

export interface CartInput {
  notebookQuantity: number;
  penQuantity:      number;
  coupon:           string;
}

export interface ReproductionResult {
  schemaVersion:      1;
  runId:              string;
  scenarioId:         string;
  variant:            Variant;
  fixtureVersion:     string;
  executedAt:         string;
  subtotalCents:      number;
  discountCents:      number;
  observedTotalCents: number;
  expectedTotalCents: number;
  matchesExpected:    boolean;
  cart: {
    notebookQuantity: number;
    penQuantity:      number;
    coupon:           string;
  };
  events: Array<{ order: number; action: string; observedValue?: number }>;
}

export function reproduce(
  variant: Variant,
  cart: CartInput = { notebookQuantity: 1, penQuantity: 1, coupon: 'SAVE10' },
): ReproductionResult {
  const subtotalCents = (
    cart.notebookQuantity * NOTEBOOK_PRICE_CENTS +
    cart.penQuantity      * PEN_SET_PRICE_CENTS
  );

  const couponKey    = cart.coupon.trim().toUpperCase();
  const rate         = KNOWN_COUPONS[couponKey] ?? 0;
  const discountCents = Math.round(subtotalCents * rate);

  const observedTotalCents = calculateTotal(variant, subtotalCents, cart.coupon);

  // Expected = subtotal minus discount once (the correct answer)
  const expectedTotalCents = subtotalCents - discountCents;

  return {
    schemaVersion:  1,
    runId:          crypto.randomUUID?.() ?? `run-${Date.now()}`,
    scenarioId:     'coupon-double-discount',
    variant,
    fixtureVersion: 'northstar-v1',
    executedAt:     new Date().toISOString(),
    subtotalCents,
    discountCents,
    observedTotalCents,
    expectedTotalCents,
    matchesExpected: observedTotalCents === expectedTotalCents,
    cart: {
      notebookQuantity: cart.notebookQuantity,
      penQuantity:      cart.penQuantity,
      coupon:           cart.coupon,
    },
    events: [
      { order: 1, action: `Added ${cart.notebookQuantity}× Demo Notebook`, observedValue: cart.notebookQuantity * NOTEBOOK_PRICE_CENTS },
      { order: 2, action: `Added ${cart.penQuantity}× Demo Pen Set`,       observedValue: cart.penQuantity * PEN_SET_PRICE_CENTS },
      ...(couponKey ? [{ order: 3, action: `Applied coupon ${couponKey}` }] : []),
      { order: couponKey ? 4 : 3, action: `Calculated total: $${(observedTotalCents / 100).toFixed(2)}`, observedValue: observedTotalCents },
    ],
  };
}
