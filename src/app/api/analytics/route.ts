import { NextResponse } from 'next/server';
import { trackAnalyticsEvent, getAnalyticsEvents } from '@/lib/cms';
import { AnalyticsEvent } from '@/lib/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.type || !body.sessionId) {
            return NextResponse.json({ error: 'Invalid event data' }, { status: 400 });
        }

        const event: AnalyticsEvent = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            ...body
        };

        const success = trackAnalyticsEvent(event);
        if (!success) {
            return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

export async function GET() {
    const events = getAnalyticsEvents();

    // Simple aggregation for dashboard (compatible w/ previous chart format)
    // We can do more complex aggregation here or on client
    const pageViews: Record<string, number> = {};
    let totalViews = 0;

    events.forEach(e => {
        if (e.type === 'pageview') {
            totalViews++;
            const day = new Date(e.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
            pageViews[day] = (pageViews[day] || 0) + 1;
        }
    });

    const chartData = Object.entries(pageViews).map(([day, views]) => ({
        day,
        views
    }));

    // Ensure we have last 7 days or so if needed, but for now just raw data aggregation

    return NextResponse.json({
        totalViews,
        chartData
    });
}
