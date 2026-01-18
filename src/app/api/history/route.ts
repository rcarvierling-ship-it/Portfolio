import { NextResponse, NextRequest } from 'next/server';
import { getHistory } from '@/lib/cms';
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // History is strictly Admin-only
    const data = getHistory();
    return NextResponse.json(data);
}
