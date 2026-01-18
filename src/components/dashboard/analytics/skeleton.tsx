"use client"

import { motion } from "framer-motion"

export function ChartSkeleton({ height = 200 }: { height?: number }) {
    return (
        <div className="w-full flex items-end justify-between gap-1" style={{ height }}>
            {[...Array(12)].map((_, i) => (
                <div key={i} className="relative flex-1 h-full flex items-end">
                    <motion.div
                        initial={{ height: "10%" }}
                        animate={{ height: ["10%", "60%", "30%", "80%"] }}
                        transition={{
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: 2,
                            delay: i * 0.1,
                            ease: "easeInOut"
                        }}
                        className="w-full bg-secondary/30 rounded-t-md"
                    />
                </div>
            ))}
        </div>
    )
}
