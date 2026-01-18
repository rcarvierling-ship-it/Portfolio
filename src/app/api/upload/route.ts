import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

import { auth } from "@/auth"

export async function POST(request: Request) {
    const session = await auth();
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file received.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Ensure filename is unique-ish
        const filename = Date.now() + "_" + file.name.replace(/\s/g, '_');

        // Ensure uploads dir exists (use absolute path for safety)
        const uploadDir = path.join(process.cwd(), 'public/uploads');

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore if exists
        }

        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Return the URL path
        return NextResponse.json({ url: `/uploads/${filename}` });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
    }
}
