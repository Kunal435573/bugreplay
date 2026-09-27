import { NextResponse } from 'next/server';
import { reproduce, type Variant } from '@/lib/bug';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate variant
    if (!body || !['original', 'repaired'].includes(body.variant)) {
      return NextResponse.json(
        { error: 'Choose original or repaired variant.' },
        { status: 400 },
      );
    }

    // Parse and validate quantities (must be positive integers)
    const notebookQuantity = Number(body.notebookQuantity ?? 1);
    const penQuantity      = Number(body.penQuantity      ?? 1);

    if (!Number.isInteger(notebookQuantity) || notebookQuantity < 1) {
      return NextResponse.json(
        { error: 'notebookQuantity must be a positive integer.' },
        { status: 400 },
      );
    }
    if (!Number.isInteger(penQuantity) || penQuantity < 1) {
      return NextResponse.json(
        { error: 'penQuantity must be a positive integer.' },
        { status: 400 },
      );
    }

    // Coupon is optional; treat missing / non-string as empty
    const coupon = typeof body.coupon === 'string' ? body.coupon : '';

    return NextResponse.json({
      data: reproduce(body.variant as Variant, {
        notebookQuantity,
        penQuantity,
        coupon,
      }),
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
