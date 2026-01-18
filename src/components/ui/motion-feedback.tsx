"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function Shake({ children, trigger, className }: { children: React.ReactNode, trigger: boolean, className?: string }) {
    return (
        <motion.div
            animate={trigger ? { x: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    )
}

export function PulseIndicator({ active }: { active: boolean }) {
    if (!active) return null;

    return (
        <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
        </span>
    )
}

export function SuccessCheckmark({ size = 24 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-500"
        >
            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                d="M20 6L9 17l-5-5"
            />
        </svg>
    )
}
