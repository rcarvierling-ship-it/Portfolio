"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { AnalyticsEvent } from "@/lib/types"

export function MetricsSnapshot() {
    const [events, setEvents] = useState<AnalyticsEvent[]>([]);
    const [stats, setStats] = useState({ totalViews: 0 });
    const [activeVisitors, setActiveVisitors] = useState(0);

    // Initial Stats Fetch
    useEffect(() => {
        fetch('/api/analytics')
            .then(r => {
                if (!r.ok) throw new Error("Fetch failed");
                return r.json();
            })
            .then(d => {
                if (d && typeof d.totalViews === 'number') {
                    setStats({ totalViews: d.totalViews });
                }
            })
            .catch(() => setStats({ totalViews: 0 }));
    }, []);

    // Light Stream for Active Visitors
    useEffect(() => {
        const es = new EventSource('/api/analytics/stream');

        es.onmessage = (event) => {
            const payload = JSON.parse(event.data);
            if (payload.type === 'update') {
                setEvents(prev => [...payload.events, ...prev].slice(0, 50));
            }
        };

        return () => es.close();
    }, []);

    // Calculate Active
    useEffect(() => {
        const calcActive = () => {
            const now = Date.now();
            const fiveMinsAgo = now - 5 * 60 * 1000;
            const active = new Set(events.filter(e => new Date(e.timestamp).getTime() > fiveMinsAgo).map(e => e.sessionId));
            setActiveVisitors(active.size);
        };

        // Run immediately and then interval
        calcActive();
        const interval = setInterval(calcActive, 5000);
        return () => clearInterval(interval);
    }, [events]);


    return (
        <div className="flex flex-col gap-4 h-full">
            <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                Live Snapshot
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-card border border-border flex flex-col justify-between">
                    <p className="text-xs text-muted-foreground mb-1">Active Now</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl font-bold">{activeVisitors}</h3>
                        <div className="flex items-center gap-1 text-[10px] text-green-500 font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Live
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-card border border-border flex flex-col justify-between">
                    <p className="text-xs text-muted-foreground mb-1">Total Views</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl font-bold">{stats.totalViews + events.filter(e => e.type === 'pageview').length}</h3>
                        <div className="text-xs text-muted-foreground flex items-center">
                            <ArrowUp size={12} className="mr-0.5" /> All time
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-4 rounded-lg border border-border/50 bg-secondary/10 flex-1">
                <p className="text-xs font-medium text-muted-foreground mb-3">Live Feed</p>
                <div className="space-y-2 max-h-[150px] overflow-hidden relative">
                    {events.slice(0, 3).map(e => (
                        <div key={e.id} className="text-[10px] flex justify-between items-center text-muted-foreground/80">
                            <span className="truncate max-w-[70%]">{e.path}</span>
                            <span>{new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                    ))}
                    {events.length === 0 && <div className="text-[10px] text-muted-foreground italic">Waiting for traffic...</div>}

                    {/* Fade out bottom */}
                    <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                </div>
            </div>
        </div>
    )
}
