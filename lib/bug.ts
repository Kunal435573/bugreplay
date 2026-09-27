export type Variant = 'original' | 'repaired';
export const BUG_ID = 'BUG-001';
export const EXPECTED_TOTAL_CENTS = 4500;
export const BASE_SUBTOTAL_CENTS = 5000;
export const bugReport = { id: BUG_ID, title: 'SAVE10 is applied twice at checkout', severity: 'High', description: 'A seeded checkout defect subtracts the same discount twice when a two-item cart uses SAVE10.', steps: ['Add Demo Notebook — $30.00', 'Add Demo Pen Set — $20.00', 'Enter coupon SAVE10', 'Submit the checkout calculation'], expectedTotalCents: EXPECTED_TOTAL_CENTS, fixtureVersion: 'northstar-v1' };
export function calculateTotal(variant: Variant, subtotalCents = BASE_SUBTOTAL_CENTS, coupon = 'SAVE10') {
  const discount = coupon === 'SAVE10' ? Math.round(subtotalCents * 0.1) : 0;
  return subtotalCents - discount;
}
export function reproduce(variant: Variant) {
  const observedTotalCents = calculateTotal(variant);
  return { schemaVersion: 1 as const, runId: crypto.randomUUID?.() ?? `run-${Date.now()}`, scenarioId: 'coupon-double-discount', variant, fixtureVersion: 'northstar-v1', executedAt: new Date().toISOString(), observedTotalCents, expectedTotalCents: EXPECTED_TOTAL_CENTS, matchesExpected: observedTotalCents === EXPECTED_TOTAL_CENTS, events: [{ order: 1, action: 'Added Demo Notebook', observedValue: 3000 }, { order: 2, action: 'Added Demo Pen Set', observedValue: 2000 }, { order: 3, action: 'Applied SAVE10' }, { order: 4, action: `Calculated total: $${(observedTotalCents / 100).toFixed(2)}`, observedValue: observedTotalCents }] };
}
