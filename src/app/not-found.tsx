"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { ArrowLeft, Ban, Satellite, Disc, Pentagon, Triangle } from "lucide-react"

export default function NotFound() {
    return (
        <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden select-none">

            {/* Background Stars / Noise */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" />
                <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-75" />
                <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-150" />
                <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-white rounded-full animate-pulse delay-300" />
            </div>

            {/* Floating Debris Layer 1 (Slow) */}
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 text-white/5 pointer-events-none z-0"
            >
                <Satellite size={120} />
            </motion.div>

            <motion.div
                animate={{ y: [0, 30, 0], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/3 right-1/4 text-white/5 pointer-events-none z-0"
            >
                <Disc size={80} />
            </motion.div>

            {/* Content */}
            <div className="z-10 flex flex-col items-center text-center p-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative"
                >
                    <h1 className="text-[12rem] md:text-[18rem] font-bold text-white/5 leading-none select-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-widest uppercase mb-4 mix-blend-overlay">Lost Signal</h2>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground text-lg md:text-xl max-w-md mt-[-2rem]"
                >
                    You've drifted a bit too far into deep space. <br />
                    The coordinates you are looking for do not exist.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12"
                >
                    <Link href="/">
                        <MagneticButton className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-gray-200 transition-colors">
                            <ArrowLeft size={20} />
                            Return to Base
                        </MagneticButton>
                    </Link>
                </motion.div>
            </div>

            {/* Foreground Debris (Closer/Faster) */}
            <motion.div
                animate={{ y: [0, -50, 0], rotate: [0, 45, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 left-20 text-white/10 pointer-events-none blur-[1px]"
            >
                <Pentagon size={40} />
            </motion.div>

            <motion.div
                animate={{ y: [0, 40, 0], rotate: [0, -30, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-20 right-20 text-white/10 pointer-events-none blur-[1px]"
            >
                <Triangle size={30} />
            </motion.div>

        </div>
    )
}
