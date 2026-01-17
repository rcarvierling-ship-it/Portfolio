"use client"

import { motion } from "framer-motion"
import { TextReveal } from "@/components/animations/text-reveal"
import Image from "next/image"
import { AboutData, Gear, TimelineItem } from "@/lib/types"

interface AboutClientProps {
    aboutData: AboutData;
    gear: Gear[];
    timeline: TimelineItem[];
}

export function AboutClient({ aboutData, gear, timeline }: AboutClientProps) {
    return (
        <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto flex flex-col gap-24">

            {/* Bio Section */}
            <section className="flex flex-col gap-8">
                <TextReveal text={aboutData.headline} className="text-4xl md:text-6xl font-bold" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="text-lg leading-relaxed text-muted-foreground flex flex-col gap-4">
                        {aboutData.bio.map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                        ))}
                    </div>
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                        <Image
                            src={aboutData.portrait}
                            alt="Portrait"
                            fill
                            className="object-cover"
                        />
                        {/* Fallback if image fails or is placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center text-muted-foreground -z-10">
                            Portrait
                        </div>
                    </div>
                </div>
            </section>

            {/* Gear Section */}
            <section className="flex flex-col gap-8">
                <h2 className="text-3xl font-bold">In My Bag</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {gear.map((gearGroup, idx) => (
                        <motion.div
                            key={gearGroup.category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 rounded-xl border border-border bg-card"
                        >
                            <h3 className="text-xl font-semibold mb-4 text-primary">{gearGroup.category}</h3>
                            <ul className="flex flex-col gap-2">
                                {gearGroup.items.map(item => (
                                    <li key={item} className="text-sm text-muted-foreground border-b border-border/50 pb-1 last:border-0 last:pb-0">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Timeline Section */}
            <section className="flex flex-col gap-8">
                <h2 className="text-3xl font-bold">Journey</h2>
                <div className="border-l-2 border-border ml-3 pl-8 flex flex-col gap-12 relative">
                    {timeline.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            <div className="absolute -left-[41px] top-2 w-5 h-5 rounded-full bg-background border-4 border-primary" />
                            <span className="text-sm font-mono text-muted-foreground">{item.year}</span>
                            <h3 className="text-xl font-bold mt-1">{item.title}</h3>
                            <h4 className="text-lg text-primary font-medium mb-2">{item.location}</h4>
                            <p className="text-muted-foreground max-w-2xl">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

        </div>
    )
}
