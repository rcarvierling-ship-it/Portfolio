"use client"

import { AboutData } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { TextReveal } from "@/components/animations/text-reveal"

interface AboutViewProps {
    data: AboutData;
}

export function AboutView({ data }: AboutViewProps) {
    const { headline, bio, portrait, gear = [], timeline = [] } = data;

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-24">
            {/* Header */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                <div className="space-y-8">
                    <TextReveal text={headline} className="text-4xl md:text-6xl font-bold tracking-tighter" />
                    <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                        {bio.map((paragraph, i) => (
                            <motion.p
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                            >
                                {paragraph}
                            </motion.p>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary"
                >
                    {/* Placeholder if no portrait */}
                    {portrait ? (
                        <Image src={portrait} alt="Portrait" fill className="object-cover" priority />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Portrait Image</div>
                    )}
                </motion.div>
            </div>

            {/* Timeline */}
            {timeline.length > 0 && (
                <div className="space-y-12">
                    <h2 className="text-2xl font-bold border-b border-border pb-4">Journey</h2>
                    <div className="space-y-8">
                        {timeline.map((item, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4 md:gap-12">
                                <span className="font-mono text-muted-foreground">{item.year}</span>
                                <div>
                                    <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                                    {item.location && <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">{item.location}</p>}
                                    <p className="text-muted-foreground">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Gear */}
            {gear.length > 0 && (
                <div className="space-y-12">
                    <h2 className="text-2xl font-bold border-b border-border pb-4">Tools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {gear.map((category, i) => (
                            <div key={i} className="space-y-4">
                                <h3 className="font-semibold text-primary">{category.category}</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    {category.items.map((item, j) => (
                                        <li key={j} className="border-b border-border/50 pb-1 last:border-0">{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
