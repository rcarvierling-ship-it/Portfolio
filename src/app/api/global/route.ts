import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSettings, saveSettings } from '@/lib/cms';
import { auth } from "@/auth"

export async function GET() {
    const data = await getSettings();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const session = await auth();
    // Re-using the ADMIN_EMAIL check is fine, or check session user name if using credentials
    // My credentials provider returns { name: "Admin", email: ... } so email check still works if env var is set.
    // Ideally I should strictly check if session is valid.
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        // user email from session might be null depending on provider, fallback to "Admin"
        const user = session.user?.email || "Admin";
        const success = await saveSettings(body, user);

        if (!success) return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });

        revalidatePath('/', 'layout'); // Clear cache for all pages since Navbar is global
        return NextResponse.json({ success: true, data: body });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
