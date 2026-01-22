"use client"

import { useState, useEffect, useRef } from "react"
import { PageHeatmapData } from "@/lib/types"
import { Flame, ArrowDown, Activity, Clock } from "lucide-react"

export function HeatmapViewer() {
    const [path, setPath] = useState('/');
    const [data, setData] = useState<PageHeatmapData | null>(null);
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/analytics/heatmap?path=${encodeURIComponent(path)}`)
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
            });
    }, [path]);

    useEffect(() => {
        if (!data || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Reset
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw Heatmap (Simulated visualization)
        // In real app, we'd map percentage X/Y to actual dimensions of iframe/preview
        const w = canvasRef.current.width;
        const h = canvasRef.current.height;

        // Draw points
        data.cursorMap.forEach(point => {
            const x = (point.x / 100) * w;
            const y = (point.y / 100) * h;
            const radius = 30;
            const intensity = Math.min(1, point.value / 50);

            const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
            grad.addColorStop(0, `rgba(255, 90, 90, ${intensity})`);
            grad.addColorStop(1, 'rgba(255, 90, 90, 0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        });

    }, [data]);

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Flame className="text-orange-500" size={20} />
                        Behavioral Heatmap
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">PRIVACY_MODE: AGGREGATED_ONLY</p>
                </div>
                <div className="flex bg-secondary rounded-lg p-1">
                    {['/', '/about', '/work'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPath(p)}
                            className={`px-3 py-1 text-xs rounded-md transition-colors ${path === p ? 'bg-background shadow-sm text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                {/* Visualizer */}
                <div className="lg:col-span-2 bg-gradient-to-b from-secondary/10 to-background border border-border rounded-xl relative overflow-hidden group">
                    {loading && <div className="absolute inset-0 flex items-center justify-center z-20 bg-background/50 backdrop-blur-sm">Loading Heatmap...</div>}

                    <div className="absolute inset-0 pointer-events-none z-10 opacity-70 mix-blend-screen">
                        <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-cover" />
                    </div>

                    {/* Mock Website Preview Background */}
                    <div className="w-full h-full overflow-y-auto opacity-50 grayscale custom-scrollbar bg-white/5 p-8 text-xs font-mono">
                        <div className="w-full h-64 bg-white/10 mb-4 rounded flex items-center justify-center">Hero Section</div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="h-32 bg-white/10 rounded">Content A</div>
                            <div className="h-32 bg-white/10 rounded">Content B</div>
                        </div>
                        <div className="w-full h-96 bg-white/10 rounded mb-4">Gallery Grid</div>
                        <div className="w-full h-32 bg-white/10 rounded">Footer</div>
                    </div>
                </div>

                {/* Metrics */}
                <div className="space-y-6 overflow-y-auto">
                    {/* Scroll Depth */}
                    <div className="p-4 rounded-xl border border-border bg-card">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center justify-between">
                            <span>Scroll Depth</span>
                            <ArrowDown size={14} />
                        </h4>
                        <div className="space-y-2 relative">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-yellow-500 to-red-500 opacity-50 rounded-full" />
                            {data?.scrollMap.map((bucket, i) => (
                                <div key={i} className="flex items-center gap-3 pl-4 text-xs group cursor-default">
                                    <span className="w-8 font-mono text-muted-foreground">{bucket.depth}%</span>
                                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-foreground/50 group-hover:bg-foreground transition-colors"
                                            style={{ width: `${(bucket.count / (data.totalSessions || 1)) * 100}%` }}
                                        />
                                    </div>
                                    <span className="w-12 text-right opacity-50">{bucket.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-border bg-card">
                            <div className="text-muted-foreground mb-1"><Activity size={16} /></div>
                            <div className="text-2xl font-bold">{data?.totalSessions}</div>
                            <div className="text-[10px] uppercase text-muted-foreground">Traffic Samples</div>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-card">
                            <div className="text-muted-foreground mb-1"><Clock size={16} /></div>
                            <div className="text-2xl font-bold">2.4m</div>
                            <div className="text-[10px] uppercase text-muted-foreground">Avg Dwell Time</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
