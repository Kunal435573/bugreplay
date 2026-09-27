import { NextResponse } from 'next/server';
import { bugReport } from '@/lib/bug';
export async function GET() { return NextResponse.json({ data: [bugReport] }); }
