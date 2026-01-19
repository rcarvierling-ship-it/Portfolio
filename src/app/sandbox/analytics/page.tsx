"use client"

import { useSandbox } from "@/lib/sandbox/context"
import { BarChart3, TrendingUp, TrendingDown, Users, Monitor, Activity } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function SandboxAnalytics() {
    const { store, forceUpdate } = useSandbox();
    const [autoTraffic, setAutoTraffic] = useState(false);

    // Auto-update effect for dynamic chart movement
    useEffect(() => {
        if (!autoTraffic) return;
        const interval = setInterval(() => {
            store.simulateSpike();
            store.analytics.pageViews.push(Math.floor(Math.random() * 200));
            store.analytics.pageViews.shift(); // Keep array consistent length
            forceUpdate();
        }, 800);
        return () => clearInterval(interval);
    }, [autoTraffic, store, forceUpdate]);

    return (
        <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <BarChart3 className="text-green-500" />
                        Analytics Simulator
                    </h1>
                    <p className="text-muted-foreground">Manipulate fake data streams. Test how the dashboard handles spikes and drops.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/sandbox" className="text-sm font-medium border px-4 py-2 rounded-lg hover:bg-secondary">
                        Back
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Control Panel */}
                <div className="bg-card p-6 rounded-xl border border-border space-y-6">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Traffic Control</h3>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => { store.simulateSpike(); forceUpdate(); }}
                                className="flex items-center justify-center gap-2 bg-green-500/10 text-green-500 border border-green-500/20 py-3 rounded-lg font-bold hover:bg-green-500 hover:text-white transition-colors"
                            >
                                <TrendingUp size={18} /> Spike Traffic (+50)
                            </button>
                            <button
                                onClick={() => { store.simulateDrop(); forceUpdate(); }}
                                className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 py-3 rounded-lg font-bold hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <TrendingDown size={18} /> Crash Traffic (-20)
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Automation</h3>
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Auto-Generate Traffic</span>
                            <button
                                onClick={() => setAutoTraffic(!autoTraffic)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${autoTraffic ? 'bg-primary' : 'bg-muted'}`}
                            >
                                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${autoTraffic ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Visualization */}
                <div className="md:col-span-2 bg-card p-6 rounded-xl border border-border flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-4xl font-black">{store.analytics.liveVisitors}</h2>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Mock Visitors
                            </p>
                        </div>
                        <Activity className="text-muted-foreground opacity-20" size={64} />
                    </div>

                    {/* Chart Bar Visualization */}
                    <div className="h-64 flex items-end justify-between gap-1">
                        {store.analytics.pageViews.map((val, i) => (
                            <div
                                key={i}
                                className="bg-primary/50 w-full rounded-t-sm transition-all duration-300 ease-out"
                                style={{ height: `${Math.min(100, (val / 100) * 100)}%` }}
                            />
                        ))}
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-4 font-mono">Real-time Request Stream (Simulated)</p>
                </div>
            </div>
        </div>
    )
}
