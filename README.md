# BugReplay

BugReplay is an evidence-first debugging prototype built with IBM Bob 2.0.

It helps developers reproduce a checkout bug, compare the original and repaired implementation, and verify the fix with a regression test.

## Problem

A checkout bug applies the `SAVE10` coupon twice.  
For a $50 cart:

- Expected total: $45
- Buggy total: $40

This makes bug reports difficult to reproduce and verify.

## Solution

BugReplay provides:

- Interactive notebook and pen quantity inputs
- Coupon code testing
- Original bug and repaired code variants
- Reproduction of the incorrect calculation
- Before-and-after evidence
- Automated regression tests
- Verification page showing the confirmed fix

## Demo Flow

1. Open `/bugs/BUG-001`
2. Enter quantities and coupon code `SAVE10`
3. Select **Original bug**
4. Click **Calculate total** and observe `$40`
5. Select **Repaired code**
6. Click **Calculate total** and observe `$45`
7. Open the verification page to review the evidence

## IBM Bob 2.0 Usage

IBM Bob IDE was used to:

- Inspect the existing project
- Reproduce the seeded checkout defect
- Implement the smallest repair
- Add regression tests
- Add interactive checkout inputs
- Run tests and production build validation

Bob task-session summary screenshots are included as hackathon evidence.

## Technology Stack

- Next.js
- React
- TypeScript
- Vitest
- IBM Bob IDE
- Vercel

## Testing

Run the tests:

```bash
npm test