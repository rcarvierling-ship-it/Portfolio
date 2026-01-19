"use client"

import { motion } from "framer-motion"

interface MarqueeSectionProps {
    keywords?: string[];
}

const defaultKeywords = [
    "EDITORIAL", "LIFESTYLE", "CAMPAIGN", "STUDIO", "PORTRAIT", "ANALOG", "DIGITAL"
]

export function MarqueeSection({ keywords = defaultKeywords }: MarqueeSectionProps) {
    // Ensure we have enough copies for smooth looping
    const displayKeywords = keywords.length > 0 ? [...keywords, ...keywords, ...keywords, ...keywords] : [...defaultKeywords, ...defaultKeywords, ...defaultKeywords, ...defaultKeywords];

    return (
        <section className="py-24 overflow-hidden bg-background border-y border-border/40">
            <div className="relative flex whitespace-nowrap">
                <motion.div
                    className="flex items-center gap-12 md:gap-24"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30
                    }}
                >
                    {displayKeywords.map((word, i) => (
                        <span
                            key={i}
                            className="text-6xl md:text-9xl font-black tracking-tighter text-transparent stroke-text opacity-20 hover:opacity-100 transition-opacity duration-300 select-none uppercase"
                            style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.5)" }}
                        >
                            {word}
                        </span>
                    ))}
                </motion.div>

                {/* Second layer for seamless loop (handled by the duplication above and -50% x) */}
            </div>
            {/* Gradient masks for fading edges */}
            <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </section>
    )
}
