
import { type NextRequest, NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/cms';
import { Page } from '@/lib/types';
import { auth } from '@/auth';

export async function GET() {
    // 1. Get 'about' page
    const page = await getPage('about');
    // 2. Return content or defaults
    const defaults = { headline: "", bio: [], portrait: "" };
    if (!page) return NextResponse.json(defaults);
    return NextResponse.json({ ...defaults, ...(page.content || {}) });
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    let page = await getPage('about');

    if (!page) {
        // Create if missing
        page = {
            id: 'about',
            slug: 'about',
            title: 'About',
            status: 'published',
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            blocks: [],
            content: {}
        } as Page;
    }

    // Merge only profile fields (headline, bio, portrait) to avoid overwriting gear/timeline
    // Actually the POST body is exactly the profile data based on AboutTab
    page.content = {
        ...page.content,
        headline: data.headline,
        bio: data.bio,
        portrait: data.portrait
    };
    page.version++;

    await savePage(page, session.user?.email || 'admin');
    return NextResponse.json({ success: true });
}
