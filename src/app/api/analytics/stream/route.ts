
import { NextResponse } from 'next/server';
import { getAnalyticsEvents, fileAnalytics } from '@/lib/cms';
import { AnalyticsEvent } from '@/lib/types';
import fs from 'fs';
import path from 'path';

// Helper to get file mtime
const getMtime = () => {
    try {
        const filePath = path.join(process.cwd(), 'src/data', fileAnalytics);
        if (!fs.existsSync(filePath)) return 0;
        return fs.statSync(filePath).mtimeMs;
    } catch (e) {
        return 0;
    }
};

export async function GET(request: Request) {
    const encoder = new TextEncoder();

    // Create a streaming response
    const stream = new ReadableStream({
        async start(controller) {
            let lastMtime = getMtime();
            let initialEvents = getAnalyticsEvents();
            let lastEventCount = initialEvents.length;

            // Send initial connection message
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', count: lastEventCount })}\n\n`));

            const interval = setInterval(() => {
                const currentMtime = getMtime();

                if (currentMtime > lastMtime) {
                    // File changed
                    const allEvents = getAnalyticsEvents();
                    const newEvents = allEvents.slice(lastEventCount);

                    if (newEvents.length > 0) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'update', events: newEvents })}\n\n`));
                        lastEventCount = allEvents.length;
                        lastMtime = currentMtime;
                    }
                }

                // Keep-alive ping every 10s to prevent timeouts
                // controller.enqueue(encoder.encode(': ping\n\n')); 

            }, 1000); // Poll every 1s

            // Cleanup on close
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
