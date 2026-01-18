
import { NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/audit';
import { auth } from "@/auth"

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const logs = getAuditLogs();
    return NextResponse.json(logs);
}
