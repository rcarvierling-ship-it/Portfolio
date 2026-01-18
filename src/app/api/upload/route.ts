import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { auth } from "@/auth"

import { checkRateLimit } from '@/lib/rate-limit';
import { logAudit } from '@/lib/audit';
import { headers } from 'next/headers';

export async function POST(request: Request) {
    const session = await auth();
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
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

        // ... (rest of logic same) ...
        const buffer = Buffer.from(await file.arrayBuffer());
        const image = sharp(buffer);
        const metadata = await image.metadata();
        const width = metadata.width;
        const height = metadata.height;
        const timestamp = Date.now();
        const originalName = file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, '_');
        const extension = path.extname(file.name);
        // ...
        const filenameOriginal = `${timestamp}_${originalName}${extension}`;
        const filenameMedium = `${timestamp}_${originalName}_medium${extension}`;
        const filenameThumb = `${timestamp}_${originalName}_thumb${extension}`;
        const uploadDir = path.join(process.cwd(), 'public/uploads');

        try { await mkdir(uploadDir, { recursive: true }); } catch (e) { }

        await writeFile(path.join(uploadDir, filenameOriginal), buffer);
        await image.clone().resize({ width: 1200, withoutEnlargement: true }).toFile(path.join(uploadDir, filenameMedium));
        await image.clone().resize({ width: 400, withoutEnlargement: true }).toFile(path.join(uploadDir, filenameThumb));

        const blurBuffer = await image.clone().resize(10).toBuffer();
        const blurDataURL = `data:image/${metadata.format};base64,${blurBuffer.toString('base64')}`;

        logAudit(user, 'upload', filenameOriginal, `${(buffer.length / 1024).toFixed(2)} KB`);

        return NextResponse.json({
            url: `/uploads/${filenameOriginal}`,
            width, height, blurDataURL,
            variants: {
                original: `/uploads/${filenameOriginal}`,
                medium: `/uploads/${filenameMedium}`,
                thumbnail: `/uploads/${filenameThumb}`
            }
        });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: 'Upload optimization failed.' }, { status: 500 });
    }
}
