import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getContactMessages } from '@/lib/cms';

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const messages = await getContactMessages();
        return NextResponse.json(messages);
    } catch (e: any) {
        console.error('Contact inbox API Error:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
