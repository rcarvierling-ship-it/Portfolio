import { AnalyticsEvent } from "@/lib/types";

export type TimeRange = '15m' | '1h' | '24h' | '7d' | '30d';

export function filterEventsByTime(events: AnalyticsEvent[], range: TimeRange): AnalyticsEvent[] {
    const now = Date.now();
    let cutoff = 0;

    switch (range) {
        case '15m': cutoff = now - 15 * 60 * 1000; break;
        case '1h': cutoff = now - 60 * 60 * 1000; break;
        case '24h': cutoff = now - 24 * 60 * 60 * 1000; break;
        case '7d': cutoff = now - 7 * 24 * 60 * 60 * 1000; break;
        case '30d': cutoff = now - 30 * 24 * 60 * 60 * 1000; break;
    }

    return events.filter(e => new Date(e.timestamp).getTime() > cutoff);
}

export function aggregateViewsByDate(events: AnalyticsEvent[], range: TimeRange) {
    const views = events.filter(e => e.type === 'pageview');
    const buckets: Record<string, number> = {};

    // Determine granularity
    let formatLabel = (date: Date) => date.toISOString();

    // For shorter ranges, bucket by minute. For longer, by hour/day.
    // 15m -> by minute
    // 1h -> by 5 minutes
    // 24h -> by hour
    // 7d -> by day
    // 30d -> by day

    views.forEach(e => {
        const date = new Date(e.timestamp);
        let key = "";

        if (range === '15m' || range === '1h') {
            // Minute precision
            key = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (range === '24h') {
            // Hour precision
            key = date.toLocaleTimeString([], { hour: '2-digit' }) + ":00";
        } else {
            // Day precision
            key = date.toLocaleDateString([], { weekday: 'short', day: 'numeric' });
        }

        buckets[key] = (buckets[key] || 0) + 1;
    });

    return Object.entries(buckets).map(([label, value]) => ({ label, value }));
}

export function calculateMetrics(events: AnalyticsEvent[]) {
    // Unique Sessions
    const sessions = new Set(events.map(e => e.sessionId));
    const totalSessions = sessions.size;

    // Page Views
    const pageViews = events.filter(e => e.type === 'pageview').length;

    // Bounce Rate: Sessions with only 1 event (usually just the landing pageview)
    // Actually, session with only 1 pageview and no other significant interactions?
    // Let's iterate sessions.
    let singlePageSessions = 0;
    const sessionGroups: Record<string, AnalyticsEvent[]> = {};

    events.forEach(e => {
        if (!sessionGroups[e.sessionId]) sessionGroups[e.sessionId] = [];
        sessionGroups[e.sessionId].push(e);
    });

    Object.values(sessionGroups).forEach(group => {
        // If only 1 event, bounce. 
        // Or if multiple events but all on same page and short time? 
        // Simple definition: 1 interaction.
        if (group.length === 1) singlePageSessions++;
    });

    const bounceRate = totalSessions > 0 ? (singlePageSessions / totalSessions) * 100 : 0;

    return {
        uniqueVisitors: totalSessions,
        totalViews: pageViews,
        bounceRate: Math.round(bounceRate),
        avgTimeOnSite: "N/A" // Complex to calc perfectly without explicit ping, but can approx
    };
}
