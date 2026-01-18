import { NextResponse, NextRequest } from 'next/server';
import { getPages, savePage } from '@/lib/cms';
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
    const session = await auth();
    const isAdmin = !!session?.user;

    const data = await getPages(isAdmin);
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const user = session.user?.email || "Admin";

        if (Array.isArray(body)) {
            return NextResponse.json({ error: 'Bulk update not supported' }, { status: 400 });
        }

        const success = await savePage(body, user);

        if (!success) return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
        return NextResponse.json({ success: true, data: body });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
