
import { type NextRequest, NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/cms';
import { Page } from '@/lib/types';
import { auth } from '@/auth';

export async function GET() {
    const page = await getPage('about');
    return NextResponse.json(page?.content?.timeline || []);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const timeline = await req.json();
    let page = await getPage('about');

    if (!page) {
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

    page.content = { ...page.content, timeline };
    page.version++;

    await savePage(page, session.user?.email || 'admin');
    return NextResponse.json({ success: true });
}
