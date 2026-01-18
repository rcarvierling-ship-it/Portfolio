import { NextResponse, NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getProjects, saveProject, saveProjects } from '@/lib/cms';
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
    const session = await auth();
    const isAdmin = !!session?.user; // Simple check for now

    // If admin, return all (drafts included). If public, published only.
    const data = await getProjects(isAdmin);
    return NextResponse.json(data);
}

import { checkRateLimit } from '@/lib/rate-limit';
import { logAudit } from '@/lib/audit';
import { headers } from 'next/headers';

export async function POST(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate Limit (Write)
    // Use IP or User ID. Next.js headers().get('x-forwarded-for') works in Vercel/proxies
    const ip = (await headers()).get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, 'write_project', { interval: 60000, limit: 20 })) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    try {
        const body = await request.json();
        const user = session.user?.email || "Admin";

        if (Array.isArray(body)) {
            // Handle bulk update (reordering)
            const success = await saveProjects(body, user as string);
            if (!success) return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });

            logAudit(user, 'update', 'Bulk Project Reorder');

            revalidatePath('/work');
            revalidatePath('/');
            return NextResponse.json({ success: true, data: body });
        }

        // Determine action type
        // For an authenticated user in POST, we always want to fetch all projects (including drafts)
        const projects = await getProjects(true); // `true` here is equivalent to `isAdmin` if defined as `!!session?.user`
        const existing = projects.find(p => p.id === body.id);
        const action = existing ? 'update' : 'create';

        const success = await saveProject(body, user as string);
        if (!success) return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });

        logAudit(user, action, `Project: ${body.title} (${body.id})`);

        revalidatePath('/work');
        revalidatePath('/');
        revalidatePath(`/work/${body.slug}`);

        return NextResponse.json({ success: true, data: body });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
