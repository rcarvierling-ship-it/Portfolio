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

import { del } from '@vercel/blob';
import { getPhoto, deletePhoto } from '@/lib/cms';

export async function DELETE(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { ids } = await request.json();
        const user = session.user?.email || "Admin";

        if (!Array.isArray(ids)) {
            return NextResponse.json({ error: 'ids must be an array' }, { status: 400 });
        }

        for (const id of ids) {
            // 1. Get photo to check for blob URL
            const photo = await getPhoto(id);

            // 2. Delete from Blob Storage if it's a Vercel Blob
            if (photo && photo.url && photo.url.includes('vercel-storage.com')) {
                try {
                    await del(photo.url, { token: process.env.BLOB_READ_WRITE_TOKEN });
                } catch (blobError) {
                    console.error("Failed to delete blob:", blobError);
                    // Continue to delete from DB even if blob delete fails
                }
            }

            // 3. Delete from DB
            await deletePhoto(id, user);
        }

        revalidatePath('/work');
        revalidatePath('/');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
