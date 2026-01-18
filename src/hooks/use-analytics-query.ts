import { useState, useEffect } from 'react';
import { AnalyticsEvent } from "@/lib/types";

// Shared event source instance to avoid duplicates if used in multiple components
let eventSource: EventSource | null = null;
let listeners: ((events: AnalyticsEvent[]) => void)[] = [];
let eventCache: AnalyticsEvent[] = [];

// Initialize connection logic
function connect() {
    if (eventSource) return;

    if (typeof window === 'undefined') return;

    eventSource = new EventSource('/api/analytics/stream');

    eventSource.onmessage = (msg) => {
        const payload = JSON.parse(msg.data);
        if (payload.type === 'update' || payload.type === 'connected') {
            // Update cache
            // If connected, payload.count might be useful implies we should fetch fresh?
            // For now let's assume 'update' sends new events. 'connected' sends count.
            // Actually, if we want full history, we should fetch it separately on load.

            if (payload.events) {
                eventCache = [...payload.events, ...eventCache];
                // Limit cache in memory?
                if (eventCache.length > 5000) eventCache = eventCache.slice(0, 5000);

                notify();
            }
        }
    };

    eventSource.onerror = () => {
        eventSource?.close();
        eventSource = null;
        // Retry logic handled by consumer checks or interval
        setTimeout(connect, 5000);
    };
}

function notify() {
    listeners.forEach(l => l(eventCache));
}

export function useAnalyticsQuery() {
    const [events, setEvents] = useState<AnalyticsEvent[]>(eventCache);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Initial fetch of full log for robust stats
        // We do this only once if cache is empty
        if (eventCache.length === 0) {
            fetch('/api/analytics/events')
                .then(r => {
                    if (!r.ok) throw new Error('Failed to fetch');
                    return r.json();
                })
                .then(data => {
                    if (Array.isArray(data)) {
                        eventCache = data.reverse(); // Newest first
                        setEvents(eventCache);
                    }
                })
                .catch(() => {
                    // Ignore errors (e.g. adblocker)
                });
        }

        connect();

        const listener = (newEvents: AnalyticsEvent[]) => {
            setEvents(newEvents);
            setIsConnected(true);
        };

        listeners.push(listener);
        setIsConnected(!!eventSource && eventSource.readyState === 1);

        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }, []);

    return { events, isConnected, refresh: notify };
}
