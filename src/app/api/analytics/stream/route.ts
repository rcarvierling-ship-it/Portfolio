import { NextResponse } from 'next/server';
import { getAnalyticsEvents } from '@/lib/cms';

export async function GET(request: Request) {
    const encoder = new TextEncoder();

    // Create a streaming response
    const stream = new ReadableStream({
        async start(controller) {
            // Initial Fetch
            // Note: In serverless, keeping a connection open and polling DB every second is expensive.
            // But for this dashboard, it's acceptable for limited admin usage.
            // Better: user manual refresh or SWR. But let's keep the stream for the "wow" factor if requested.

            let events = await getAnalyticsEvents();
            // Since we can't easily subscribe to Postgres changes without specific Listen/Notify setup which Vercel doesn't fully expose via HTTP easily,
            // we will poll the DB count/latest timestamp.

            let lastId = events.length > 0 ? events[0].id : null; // Assuming DESC sort in getAnalyticsEvents

            // Send initial data (full set? or just connected)
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', events: events })}\n\n`));

            const interval = setInterval(async () => {
                try {
                    const latestEvents = await getAnalyticsEvents();
                    if (latestEvents.length > 0) {
                        const newLatestId = latestEvents[0].id;
                        if (newLatestId !== lastId) {
                            // Find all new events since lastId
                            // Since list is sorted DESC, we take from top until we hit lastId
                            const newItems = [];
                            for (const e of latestEvents) {
                                if (e.id === lastId) break;
                                newItems.push(e);
                            }

                            if (newItems.length > 0) {
                                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'update', events: newItems })}\n\n`));
                                lastId = newLatestId;
                            }
                        }
                    }
                } catch (e) {
                    console.error("Stream poll error", e);
                }
            }, 5000); // Poll every 5s to be kinder to DB quota

            request.signal.addEventListener('abort', () => {
                clearInterval(interval);
                controller.close();
            });
        }
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
