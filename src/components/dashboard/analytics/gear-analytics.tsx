"use client"

import { useState, useEffect } from "react"
import { Camera, Aperture, TrendingUp, BarChart, Smartphone, PieChart } from "lucide-react"
import { motion } from "framer-motion"

export function GearAnalytics() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/analytics/gear').then(res => res.json()).then(d => {
            setData(d);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-8 text-center text-muted-foreground font-mono">Loading Gear Analysis...</div>;

    const maxCount = Math.max(...data.cameraDistribution.map((i: any) => i.count));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Camera size={20} className="text-secondary-foreground" />
                    Gear Utilization
                </h3>
                <span className="text-xs font-mono text-muted-foreground">DATA_SOURCE: EXIF_AGGREGATION</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Camera Body Usage */}
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center justify-between">
                        <span>Body Distribution</span>
                        <PieChart size={14} />
                    </h4>
                    <div className="space-y-4">
                        {data.cameraDistribution.map((item: any, i: number) => (
                            <div key={i} className="group">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-bold">{item.name}</span>
                                    <div className="flex gap-4">
                                        <span className="text-muted-foreground">{item.count} shots</span>
                                        <span className={`font-mono text-xs ${item.engagement > 90 ? 'text-green-500' : 'text-yellow-500'}`}>
                                            {item.engagement}% Eng.
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(item.count / maxCount) * 100}%` }}
                                        transition={{ delay: i * 0.1, duration: 1 }}
                                        className="h-full bg-primary/80 group-hover:bg-primary transition-colors"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Combinations & ROI */}
                <div className="space-y-6">
                    <div className="p-6 rounded-xl border border-border bg-card h-full">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center justify-between">
                            <span>High Performance Kits</span>
                            <TrendingUp size={14} />
                        </h4>
                        <div className="space-y-3">
                            {data.topCombinations.map((combo: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="text-xs font-mono text-muted-foreground">#{i + 1}</div>
                                        <div className="text-sm font-medium">{combo.gear}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-mono text-green-500 font-bold">{combo.avgEngagement} Score</div>
                                        <div className="text-[10px] text-muted-foreground">{combo.shotCount} Projects</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-4 rounded bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
                            <strong>Insight:</strong> Your prime lenses ("35mm") consistently outperform zooms in user engagement metrics by 12%.
                        </div>
                    </div>
                </div>

                {/* Lens Usage - Horizontal Bar Style */}
                <div className="p-6 rounded-xl border border-border bg-card lg:col-span-2">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center justify-between">
                        <span>Lens Optics Analytics</span>
                        <Aperture size={14} />
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {data.lensDistribution.map((item: any, i: number) => (
                            <div key={i} className="p-4 rounded-lg bg-secondary/30 border border-border flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors">
                                <div className="p-2 rounded-full bg-background border border-border">
                                    <Aperture size={20} className="text-muted-foreground" />
                                </div>
                                <span className="font-bold text-sm">{item.name}</span>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs text-muted-foreground">{item.count} Uses</span>
                                    <span className="text-[10px] font-mono text-green-500 opacity-80">Rating: {item.engagement}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
