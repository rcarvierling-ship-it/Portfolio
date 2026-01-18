"use client"

import { useState } from "react"
import { useAnalyticsQuery } from "@/hooks/use-analytics-query"
import { filterEventsByTime, aggregateViewsByDate, calculateMetrics, TimeRange } from "@/lib/analytics-utils"
import { SimpleBarChart, MetricCard } from "./charts"
import { Loader2 } from "lucide-react"
import { ChartSkeleton } from "./skeleton"
import { HeatmapViz } from "./heatmap-viz"
import { UserMap } from "./user-map"
import { MockDataGenerator } from "./mock-data-generator"
import { motion, AnimatePresence } from "framer-motion"

export function AnalyticsOverview() {
    const { events, isConnected, refresh } = useAnalyticsQuery();
    const [range, setRange] = useState<TimeRange>('24h');

    // Filter
    const filteredEvents = filterEventsByTime(events, range);

    // Aggregate
    const chartData = aggregateViewsByDate(filteredEvents, range);
    const metrics = calculateMetrics(filteredEvents);

    // Prepare Heatmap Data
    const scrollEvents = filteredEvents.filter(e => e.type === 'scroll' && e.data?.depth);
    const heatmapData = [25, 50, 75, 100].map(depth => ({
        depth,
        count: scrollEvents.filter(e => e.data?.depth === depth).length
    }));
    const totalScrollUsers = new Set(scrollEvents.map(e => e.sessionId)).size;
    // Or just use total visitors for heatmap context? Usually vs total visitors.

    const isLoading = !isConnected && events.length === 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    Analytics Overview
                    {!isConnected && <Loader2 className="animate-spin text-muted-foreground w-4 h-4" />}
                </h2>
                <div className="flex items-center gap-2">
                    <MockDataGenerator onGenerate={() => window.location.reload()} />
                    <div className="flex bg-secondary/50 rounded-lg p-1">
                        {(['15m', '1h', '24h', '7d', '30d'] as TimeRange[]).map(r => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${range === r ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Total Views"
                    value={metrics.totalViews}
                    trend="neutral"
                />
                <MetricCard
                    title="Unique Visitors"
                    value={metrics.uniqueVisitors}
                />
                <div className="p-6 rounded-xl border border-border bg-card flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm text-muted-foreground mb-1">Avg Scroll Depth</h3>
                        <div className="mt-4">
                            <HeatmapViz data={heatmapData} total={metrics.uniqueVisitors || 1} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h3 className="font-bold mb-4">Traffic Over Time</h3>
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="skeleton"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <ChartSkeleton />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chart"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <SimpleBarChart data={chartData} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-[400px]">
                    <UserMap data={filteredEvents} />
                </div>
            </div>
        </div>
    )
}
