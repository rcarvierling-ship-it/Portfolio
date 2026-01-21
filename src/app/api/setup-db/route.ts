
import { NextResponse } from 'next/server';
import { createTables } from '@/lib/setup-db';

export async function GET() {
    try {
        await createTables();
        return NextResponse.json({ success: true, message: "Database schema updated" });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
