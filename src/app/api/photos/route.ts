import { NextResponse, NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPhotos, savePhoto, savePhotos } from '@/lib/cms';
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
    const session = await auth();
    const isAdmin = !!session?.user;

    // Return all for admin (drafts included), only published for public
    const data = await getPhotos(isAdmin);
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
            const success = await savePhotos(body, user);
            if (!success) return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });

            revalidatePath('/work'); // In case photos are used in project grids/previews
            revalidatePath('/');
            return NextResponse.json({ success: true, data: body });
        }

        const success = await savePhoto(body, user);

        if (!success) return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });

        revalidatePath('/work');
        revalidatePath('/');

        return NextResponse.json({ success: true, data: body });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
