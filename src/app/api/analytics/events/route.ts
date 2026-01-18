
import { NextResponse } from 'next/server';
import { getAnalyticsEvents } from '@/lib/cms';

export async function GET() {
    // Return all events for client-side analysis
    // In production with millions of rows, this would be paginated or aggregated on server.
    // For this portfolio scale, sending 1MB of JSON is fine.
    const events = await getAnalyticsEvents();
    return NextResponse.json(events);
}
