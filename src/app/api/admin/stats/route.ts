
import { NextResponse } from 'next/server';
import { auth } from "@/auth"
import fs from 'fs/promises';
import path from 'path';

async function getDirSize(dir: string): Promise<{ size: number, count: number }> {
    let size = 0;
    let count = 0;

    try {
        const files = await fs.readdir(dir, { withFileTypes: true });
        for (const file of files) {
            const filePath = path.join(dir, file.name);
            if (file.isDirectory()) {
                const sub = await getDirSize(filePath);
                size += sub.size;
                count += sub.count;
            } else {
                const stats = await fs.stat(filePath);
                size += stats.size;
                count++;
            }
        }
    } catch {
        // ignore missing dirs
    }
    return { size, count };
}

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dataPath = path.join(process.cwd(), 'src/data');
    const uploadsPath = path.join(process.cwd(), 'public/uploads');

    const dataStats = await getDirSize(dataPath);
    const uploadStats = await getDirSize(uploadsPath);

    return NextResponse.json({
        totalSize: dataStats.size + uploadStats.size,
        fileCount: dataStats.count + uploadStats.count,
        breakdown: {
            data: dataStats,
            uploads: uploadStats
        }
    });
}
