import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/projects.json');

function readData() {
    try {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading projects data:", error);
        return [];
    }
}

function writeData(data: any) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error("Error writing projects data:", error);
        return false;
    }
}

export async function GET() {
    const data = readData();
    return NextResponse.json(data);
}

import { auth } from "@/auth"

export async function POST(request: Request) {
    const session = await auth();
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json(); // body can be a single project to ADD, or full array
        // Check if body is array (bulk replace) or object (append)
        let currentData = readData();

        if (Array.isArray(body)) {
            currentData = body;
        } else {
            // Assume it's a new project to append
            currentData.unshift(body); // Add to top
        }

        const success = writeData(currentData);
        if (!success) return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
        return NextResponse.json({ success: true, data: currentData });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
