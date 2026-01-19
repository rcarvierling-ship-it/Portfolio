import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/cms';
import { auth } from "@/auth"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params).slug;
    const page = await getPage(slug);

    // Return empty object if not found
    if (!page) return NextResponse.json({});

    // Migration Strategy:
    // If content has NO 'published' key, assume it is legacy flat content.
    // We transform it into { published: content, draft: content } structure on the fly
    // so the editor receives the correct shape.
    let content = page.content || {};
    if (!content.published && !content.draft) {
        // It's legacy flat content. 
        // For the EDITOR (fetch), we treat this flat content as BOTH published and draft.
        content = {
            published: { ...content },
            draft: { ...content }
        };
    }

    // Determine what to return based on query param? 
    // Actually, for the editor, we always want the FULL object (draft + published).
    // The public site usually calls getPage directly, not this API.
    // This API is primarily for the Dashboard Editor.

    return NextResponse.json({ ...page, content });
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

        // body.content should be the FULL object { draft: ..., published: ... }
        // The editor decides when to update 'published' (by copying draft to it).

        const pageToSave = {
            ...body,
            id: body.id || (await params).slug,
            createdAt: body.createdAt || new Date().toISOString()
        };

        const success = await savePage(pageToSave, user);

        if (!success) return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
        return NextResponse.json({ success: true, data: pageToSave });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
