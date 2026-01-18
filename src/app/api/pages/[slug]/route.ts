import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/cms';
import { auth } from "@/auth"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params).slug;
    const page = await getPage(slug);
    // Return empty object if not found, to let frontend fill defaults
    if (!page) return NextResponse.json({});
    return NextResponse.json(page);
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const user = session.user?.email || "Admin";

        // Ensure ID exists
        const pageToSave = {
            ...body,
            id: body.id || (await params).slug, // Use slug as ID for simple pages like 'home'
            createdAt: body.createdAt || new Date().toISOString()
        };

        const success = await savePage(pageToSave, user);

        if (!success) return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
        return NextResponse.json({ success: true, data: pageToSave });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
