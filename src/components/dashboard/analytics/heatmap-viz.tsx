"use client"

import { motion } from "framer-motion"

interface HeatmapProps {
    data: { depth: number, count: number }[];
    total: number;
}

export function HeatmapViz({ data, total }: HeatmapProps) {
    // Determine intensity for 25, 50, 75, 100
    const getIntensity = (depth: number) => {
        const count = data.find(d => d.depth === depth)?.count || 0;
        return total > 0 ? count / total : 0;
    };

    const segments = [25, 50, 75, 100];

    return (
        <div className="flex gap-2 h-8 w-full">
            {segments.map((depth) => {
                const intensity = getIntensity(depth);
                return (
                    <div key={depth} className="flex-1 relative group">
                        <motion.div
                            className="h-full rounded bg-orange-500"
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 0.1 + (intensity * 0.9), scaleY: 1 }}
                            transition={{ duration: 0.5, delay: depth * 0.005 }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {Math.round(intensity * 100)}%
                        </div>
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {depth}% Depth
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
