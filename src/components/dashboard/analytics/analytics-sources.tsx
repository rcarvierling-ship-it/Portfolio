"use client"

import { useAnalyticsQuery } from "@/hooks/use-analytics-query"
import { SimpleBarChart } from "./charts"

export function AnalyticsSources() {
    const { events } = useAnalyticsQuery();

    const devices = events.reduce((acc, e) => {
        const d = e.data?.device || 'unknown';
        acc[d] = (acc[d] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const referrers = events.reduce((acc, e) => {
        if (!e.data?.referrer || e.data.referrer === "") {
            acc['Direct'] = (acc['Direct'] || 0) + 1;
        } else {
            // Extract domain
            try {
                const url = new URL(e.data.referrer);
                const domain = url.hostname;
                acc[domain] = (acc[domain] || 0) + 1;
            } catch {
                acc['Unknown'] = (acc['Unknown'] || 0) + 1;
            }
        }
        return acc;
    }, {} as Record<string, number>);

    const deviceData = Object.entries(devices).map(([label, value]) => ({ label, value }));
    const referrerData = Object.entries(referrers)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([label, value]) => ({ label, value }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-border bg-card">
                <h3 className="font-bold mb-6">Device Breakdown</h3>
                <SimpleBarChart data={deviceData} color="#ec4899" />
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
                <h3 className="font-bold mb-6">Top Referrers</h3>
                <SimpleBarChart data={referrerData} color="#10b981" />
            </div>
        </div>
    )
}
