import { NextResponse } from 'next/server';
import { reproduce, type Variant } from '@/lib/bug';
export async function POST(request: Request) {
  try { const body = await request.json(); if (!body || !['original', 'repaired'].includes(body.variant)) return NextResponse.json({ error: 'Choose original or repaired variant.' }, { status: 400 }); return NextResponse.json({ data: reproduce(body.variant as Variant) }); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
}
