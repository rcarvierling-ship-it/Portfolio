import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import sharp from 'sharp';
import { auth } from "@/auth"

import { checkRateLimit } from '@/lib/rate-limit';
import { logAudit } from '@/lib/audit';
import { headers } from 'next/headers';

export async function POST(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = (await headers()).get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, 'upload_file', { interval: 60000, limit: 10 })) {
        return NextResponse.json({ error: 'Rate limit exceeded (10 uploads/min)' }, { status: 429 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const user = session.user?.email || "Admin";

        if (!file) {
            return NextResponse.json({ error: 'No file received.' }, { status: 400 });
        }

        // 1. Process with Sharp for metadata
        const buffer = Buffer.from(await file.arrayBuffer());
        const image = sharp(buffer);
        const metadata = await image.metadata();
        const width = metadata.width;
        const height = metadata.height;

        const blurBuffer = await image.clone().resize(10).toBuffer();
        const blurDataURL = `data:image/${metadata.format};base64,${blurBuffer.toString('base64')}`;

        // 2. Upload to Vercel Blob
        const blob = await put(file.name, file, {
            access: 'public',
        });

        logAudit(user, 'upload', blob.url, `${(buffer.length / 1024).toFixed(2)} KB`);

        return NextResponse.json({
            url: blob.url,
            width, height, blurDataURL,
            variants: {
                original: blob.url,
                medium: blob.url, // Blob serves optimized variants via query params usually, but for now url is enough
                thumbnail: blob.url
            }
        });

    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: error.message || 'Upload optimization failed.' }, { status: 500 });
    }
}
