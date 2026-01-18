"use client"

import { motion } from "framer-motion"

interface ChartProps {
    data: { label: string, value: number }[];
    color?: string;
    height?: number;
}

export function SimpleBarChart({ data, color = "#6366f1", height = 200 }: ChartProps) {
    if (!data.length) return <div className="h-[200px] flex items-center justify-center text-muted-foreground text-xs">No Data</div>;

    const max = Math.max(...data.map(d => d.value));

    return (
        <div className="flex items-end justify-between gap-1 w-full" style={{ height }}>
            {data.map((d, i) => {
                const h = max > 0 ? (d.value / max) * 100 : 0;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                        {/* Bar Container */}
                        <div className="relative w-full flex items-end justify-center h-full overflow-hidden rounded-t-sm">
                            <motion.div
                                layout
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: `${Math.max(h, 2)}%`, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 80,
                                    damping: 15,
                                    mass: 1
                                }}
                                className="w-full relative z-0"
                                style={{ backgroundColor: color ? `${color}40` : undefined }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                />
                            </motion.div>
                        </div>

                        {/* Tooltip */}
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            whileHover={{ opacity: 1, y: 0, scale: 1 }}
                            className="absolute -top-12 bg-popover text-popover-foreground text-xs px-3 py-2 rounded-lg shadow-xl border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 flex flex-col items-center"
                        >
                            <span className="font-bold">{d.value}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Views</span>
                            <div className="absolute -bottom-1 w-2 h-2 bg-popover border-r border-b border-border rotate-45 transform" />
                        </motion.div>

                        <span className="text-[10px] text-muted-foreground truncate w-full text-center mt-1">{d.label}</span>
                    </div>
                )
            })}
        </div>
    )
}

export function MetricCard({ title, value, subValue, trend }: { title: string, value: string | number, subValue?: string, trend?: 'up' | 'down' | 'neutral' }) {
    return (
        <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
            <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{value}</span>
                {subValue && <span className="text-sm text-muted-foreground mb-1">{subValue}</span>}
            </div>
            {trend && (
                <div className={`text-xs mt-2 font-medium ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                    {trend === 'up' ? '↑ Trending up' : trend === 'down' ? '↓ Trending down' : '— Stable'}
                </div>
            )}
        </div>
    )
}
