"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Camera, Video, Code2, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { ServiceItem } from "@/lib/types"

// Default data if CMS fails or is empty
const defaultServices: ServiceItem[] = [
    {
        id: "photography",
        title: "Photography",
        subtitle: "Capturing moments that tell a story.",
        description: "Editorial, Lifestyle, Event, and Product photography delivered with a unique cinematic style.",
        color: "from-orange-500/20 to-red-500/20",
        iconName: "Camera",
        link: "/work"
    },
]

const iconMap = {
    Camera,
    Video,
    Code2,
    Sparkles
}

interface ServicesSectionProps {
    services?: ServiceItem[];
}

export function ServicesSection({ services = defaultServices }: ServicesSectionProps) {
    const [hoveredService, setHoveredService] = useState<string | null>(null)

    return (
        <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto cursor-default">
            <div className="mb-16">
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full border border-primary/50" />
                    <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">_Core_Competencies</h2>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-border via-border/50 to-transparent" />
            </div>

            <div className="flex flex-col">
                {services.filter(s => !['videography', 'web-dev', 'creative'].includes(s.id)).map((service, idx) => {
                    const Icon = service.iconName ? iconMap[service.iconName] : Sparkles;

                    const CardContent = (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group relative border-b border-dashed border-border/50 py-12 md:py-16 transition-all duration-300 cursor-pointer"
                            onMouseEnter={() => setHoveredService(service.id)}
                            onMouseLeave={() => setHoveredService(null)}
                        >
                            <div className="absolute top-6 left-0 text-[10px] font-mono text-muted-foreground/40 font-light">
                                [{(idx + 1).toString().padStart(2, '0')}]
                            </div>

                            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 z-10 relative">
                                <h3 className="text-3xl md:text-6xl font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-4">
                                    {service.title}
                                </h3>
                                <div className="md:max-w-md">
                                    <p className="text-xl md:text-2xl font-medium mb-2 text-foreground/80 group-hover:text-primary transition-colors font-mono tracking-tight">
                                        {/* <span className="text-primary/50 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">/</span> */}
                                        {service.subtitle}
                                    </p>
                                    <p className="text-muted-foreground leading-relaxed font-light">
                                        {service.description}
                                    </p>
                                </div>

                                <div className="md:self-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                    <ArrowRight className="w-8 h-8 md:w-12 md:h-12 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                </div>
                            </div>

                            {/* Background Glow Effect on Hover */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl -z-10`}
                            />
                        </motion.div>
                    );

                    return service.link ? (
                        <Link href={service.link} key={service.id} className="block">
                            {CardContent}
                        </Link>
                    ) : (
                        <div key={service.id}>
                            {CardContent}
                        </div>
                    );

                })}
            </div>
        </section>
    )
}
