"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PreloaderProps {
    className?: string
    fullscreen?: boolean
}

export function Preloader({ className, fullscreen = true }: PreloaderProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center bg-background z-50",
            fullscreen ? "fixed inset-0 w-screen h-screen" : "w-full h-full min-h-[200px]",
            className
        )}>
            <div className="relative flex items-center justify-center">
                {/* Central gravity well */}
                <motion.div
                    className="w-4 h-4 rounded-full bg-primary"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Inner Orbit */}
                <motion.div
                    className="absolute w-12 h-12 border border-primary/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <div className="w-2 h-2 rounded-full bg-primary absolute -top-1 left-1/2 -translate-x-1/2" />
                </motion.div>

                {/* Outer Orbit */}
                <motion.div
                    className="absolute w-20 h-20 border border-primary/10 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground absolute -bottom-0.5 left-1/2 -translate-x-1/2" />
                </motion.div>

                {/* Floating Particles for "Antigravity" Effect */}
                <motion.div
                    className="absolute -top-8 left-8 w-1 h-1 rounded-full bg-primary/50"
                    animate={{
                        y: [-5, 5, -5],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2
                    }}
                />
                <motion.div
                    className="absolute top-8 -left-8 w-1 h-1 rounded-full bg-primary/50"
                    animate={{
                        y: [5, -5, 5],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                />
            </div>
            {/* Loading text with reveal effect */}
            <div className="mt-8 overflow-hidden h-6">
                <motion.p
                    className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    Loading
                </motion.p>
            </div>
        </div>
    )
}
