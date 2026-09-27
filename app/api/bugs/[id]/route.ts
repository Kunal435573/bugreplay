import { NextResponse } from 'next/server';
import { BUG_ID, bugReport } from '@/lib/bug';
export async function GET(_: Request, { params }: { params: { id: string } }) { if (params.id !== BUG_ID) return NextResponse.json({ error: 'Not found.' }, { status: 404 }); return NextResponse.json({ data: bugReport }); }
