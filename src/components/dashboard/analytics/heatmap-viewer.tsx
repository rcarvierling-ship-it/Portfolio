"use client"

import { useState, useEffect, useRef } from "react"
import { PageHeatmapData } from "@/lib/types"
import { Flame, ArrowDown, Activity, Clock, Calendar, RefreshCcw } from "lucide-react"

export function HeatmapViewer() {
    const [path, setPath] = useState('/');
    const [timeRange, setTimeRange] = useState('7d');
    const [data, setData] = useState<PageHeatmapData | null>(null);
    const [loading, setLoading] = useState(true);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLoading(true);
        // In real app, pass timeRange to API
        fetch(`/api/analytics/heatmap?path=${encodeURIComponent(path)}&range=${timeRange}`)
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
            });
    }, [path, timeRange]);

    useEffect(() => {
        if (!data || !canvasRef.current || !containerRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Resize canvas to match container
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = width;
        canvasRef.current.height = height;

        // Reset
        ctx.clearRect(0, 0, width, height);

        // Draw Heatmap
        // Assuming data points are normalized 0-100% relative to viewport
        data.cursorMap.forEach(point => {
            const x = (point.x / 100) * width;
            const y = (point.y / 100) * height;
            const radius = 25; // Heat radius
            const intensity = Math.min(0.8, point.value / 20); // Normalize intensity

            const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
            grad.addColorStop(0, `rgba(255, 50, 50, ${intensity})`);
            grad.addColorStop(0.5, `rgba(255, 100, 50, ${intensity * 0.5})`);
            grad.addColorStop(1, 'rgba(255, 100, 50, 0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        });

    }, [data, iframeLoaded, path]); // Redraw when iframe loads/resizes implicity via effect

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Flame className="text-orange-500" size={20} />
                        Behavioral Heatmap
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">PRIVACY_MODE: AGGREGATED_ONLY • {path}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Time Range */}
                    <div className="flex bg-secondary/50 rounded-lg p-1 border border-border/50">
                        {['24h', '7d', '30d'].map(r => (
                            <button
                                key={r}
                                onClick={() => setTimeRange(r)}
                                className={`px-3 py-1 text-xs rounded-md transition-colors ${timeRange === r ? 'bg-background shadow-sm text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    {/* Path Selector */}
                    <div className="flex bg-secondary rounded-lg p-1">
                        {['/', '/about', '/work', '/contact'].map(p => (
                            <button
                                key={p}
                                onClick={() => { setPath(p); setIframeLoaded(false); }}
                                className={`px-3 py-1 text-xs rounded-md transition-colors ${path === p ? 'bg-primary text-primary-foreground font-bold shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden min-h-[500px]">
                {/* Visualizer with Iframe */}
                <div
                    ref={containerRef}
                    className="lg:col-span-2 bg-background border border-border rounded-xl relative overflow-hidden group shadow-inner"
                >
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center z-30 bg-background/50 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-primary font-mono text-xs">
                                <RefreshCcw className="animate-spin" size={14} /> Generating Map...
                            </div>
                        </div>
                    )}

                    {/* Canvas Overlay (Top Layer) */}
                    <div className="absolute inset-0 pointer-events-none z-20 mix-blend-multiply dark:mix-blend-screen opacity-90">
                        <canvas ref={canvasRef} className="w-full h-full" />
                    </div>

                    {/* Live Preview Iframe (Bottom Layer) */}
                    {/* We use a key to force re-render on path change, ensuring clean state */}
                    <iframe
                        key={path}
                        src={path}
                        className="w-full h-full border-none opacity-50 grayscale hover:grayscale-0 transition-all duration-500 scale-[1] origin-top-left"
                        onLoad={() => setIframeLoaded(true)}
                        title="Heatmap Context"
                        style={{ pointerEvents: 'none' }} // Disable interaction so we don't accidentally navigate
                    />

                    <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur text-white text-[10px] px-2 py-1 rounded border border-white/10">
                        Map Overlay Active
                    </div>
                </div>

                {/* Metrics */}
                <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Scroll Depth */}
                    <div className="p-5 rounded-xl border border-border bg-card shadow-sm">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center justify-between">
                            <span>Scroll Depth</span>
                            <ArrowDown size={14} />
                        </h4>
                        <div className="space-y-2 relative pl-2">
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-yellow-500 to-red-500 opacity-50 rounded-full" />
                            {data?.scrollMap.map((bucket, i) => (
                                <div key={i} className="flex items-center gap-3 pl-4 text-xs group cursor-default">
                                    <span className="w-8 font-mono text-muted-foreground font-bold">{bucket.depth}%</span>
                                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden border border-border/50">
                                        <div
                                            className="h-full bg-primary/70 group-hover:bg-primary transition-all duration-500"
                                            style={{ width: `${(bucket.count / (data.totalSessions || 1)) * 100}%` }}
                                        />
                                    </div>
                                    <span className="w-10 text-right font-mono opacity-70">{bucket.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between h-32">
                            <div className="text-muted-foreground mb-1 bg-secondary/50 p-2 rounded-lg w-fit"><Activity size={16} /></div>
                            <div>
                                <div className="text-2xl font-bold tracking-tight">{data?.totalSessions}</div>
                                <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider opacity-70">Total Sessions</div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between h-32">
                            <div className="text-muted-foreground mb-1 bg-secondary/50 p-2 rounded-lg w-fit"><Clock size={16} /></div>
                            <div>
                                <div className="text-2xl font-bold tracking-tight">2m 14s</div>
                                <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider opacity-70">Avg Retention</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-blue-600/80 leading-relaxed">
                        <strong>Insight:</strong> Most users (78%) drop off before reaching the footer. Consider moving the contact form higher up.
                    </div>
                </div>
            </div>
        </div>
    )
}
