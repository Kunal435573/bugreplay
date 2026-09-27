import { NextResponse } from 'next/server';
import { BUG_ID } from '@/lib/bug';
import { verification } from '@/lib/verification';
export async function GET(_: Request, { params }: { params: { id: string } }) { if (params.id !== BUG_ID) return NextResponse.json({ error: 'Not found.' }, { status: 404 }); return NextResponse.json({ data: verification }); }
