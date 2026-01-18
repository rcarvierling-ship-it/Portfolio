"use client"

import { useAnalyticsQuery } from "@/hooks/use-analytics-query"
import { ExternalLink } from "lucide-react"

export function AnalyticsProjects() {
    const { events } = useAnalyticsQuery();

    // Group by Path (ignoring query params)
    const projectStats: Record<string, { views: number, clicks: number, conversions: number }> = {};

    events.forEach(e => {
        let path = e.path.split('?')[0];
        if (!path.startsWith('/work/')) return;

        // Use slug as key
        const slug = path.replace('/work/', '');
        if (!slug) return;

        if (!projectStats[slug]) projectStats[slug] = { views: 0, clicks: 0, conversions: 0 };

        if (e.type === 'pageview') projectStats[slug].views++;
        if (e.type === 'click') projectStats[slug].clicks++;
        if (e.type === 'click' && (e.data?.label === 'Contact' || e.data?.target?.includes('mailto'))) {
            projectStats[slug].conversions++;
        }
    });

    const rows = Object.entries(projectStats)
        .sort((a, b) => b[1].views - a[1].views)
        .map(([slug, stats]) => ({ slug, ...stats }));

    // Find top converting
    const topConverting = [...rows].sort((a, b) => b.conversions - a.conversions)[0];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Project Performance</h2>

            {topConverting && topConverting.conversions > 0 && (
                <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                    <h3 className="text-indigo-500 font-bold uppercase text-xs mb-2">🏆 Top Converting Project</h3>
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold capitalize">{topConverting.slug.replace('-', ' ')}</span>
                        <span className="text-sm bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-mono">
                            {topConverting.conversions} Conversions
                        </span>
                    </div>
                </div>
            )}

            <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/50 text-muted-foreground font-medium uppercase text-xs">
                        <tr>
                            <th className="p-4">Project</th>
                            <th className="p-4 text-right">Views</th>
                            <th className="p-4 text-right">Interactions (Clicks)</th>
                            <th className="p-4 text-right">Conversion Est.</th>
                            <th className="p-4 text-right">Explore</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {rows.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No project data yet.</td></tr>
                        ) : (
                            rows.map(row => (
                                <tr key={row.slug} className="hover:bg-secondary/20">
                                    <td className="p-4 font-medium capitalize">{row.slug.replace('-', ' ')}</td>
                                    <td className="p-4 text-right">{row.views}</td>
                                    <td className="p-4 text-right text-muted-foreground">{row.clicks}</td>
                                    <td className="p-4 text-right font-mono">{row.conversions}</td>
                                    <td className="p-4 text-right">
                                        <a href={`/work/${row.slug}`} target="_blank" className="inline-flex items-center justify-center p-2 hover:bg-secondary rounded">
                                            <ExternalLink size={14} />
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
