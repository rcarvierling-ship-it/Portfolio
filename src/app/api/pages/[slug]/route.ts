import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/cms';
import { auth } from "@/auth"
import { revalidatePath } from 'next/cache';

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
        const slug = (await params).slug;
        const user = session.user?.email || "Admin";

        console.log('[API] Publishing page:', slug, 'with data:', JSON.stringify(body).substring(0, 200));

        // body.content should be the FULL object { draft: ..., published: ... }
        // The editor decides when to update 'published' (by copying draft to it).

        const pageToSave = {
            ...body,
            id: body.id || slug,
            slug: slug,
            createdAt: body.createdAt || new Date().toISOString()
        };

        console.log('[API] Saving page with ID:', pageToSave.id);

        const success = await savePage(pageToSave, user);

        if (!success) {
            console.error('[API] savePage returned false');
            return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
        }

        console.log('[API] Page saved successfully');

        // Revalidate the page route to clear cache
        try {
            // Revalidate the specific page route
            if (slug === 'home') {
                revalidatePath('/', 'page');
            } else {
                revalidatePath(`/${slug}`, 'page');
            }
            // Also revalidate the dashboard pages route
            revalidatePath('/dashboard/pages', 'page');
        } catch (revalidateError) {
            console.error('Revalidation error:', revalidateError);
            // Don't fail the request if revalidation fails
        }

        return NextResponse.json({ success: true, data: pageToSave });
    } catch (error) {
        console.error('[API] Error in POST /api/pages/[slug]:', error);
        return NextResponse.json({
            error: 'Invalid request',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 400 });
    }
}
