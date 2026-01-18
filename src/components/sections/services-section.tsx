"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Camera, Video, Code2, Sparkles } from "lucide-react"
import Image from "next/image"

// Define services data with images (using placeholders or actual images if available)
const services = [
    {
        id: "photography",
        title: "Photography",
        subtitle: "Capturing moments that tell a story.",
        description: "Editorial, Lifestyle, Event, and Product photography delivered with a unique cinematic style.",
        // Using a color gradient placeholder for now, ideally this would be a real image
        color: "from-orange-500/20 to-red-500/20",
        icon: Camera
    },
    {
        id: "videography",
        title: "Videography",
        subtitle: "Motion pictures that move emotions.",
        description: "End-to-end video production from storyboarding and shooting to editing and color grading.",
        color: "from-blue-500/20 to-cyan-500/20",
        icon: Video
    },
    {
        id: "web-dev",
        title: "Web Development",
        subtitle: "Digital experiences that engage.",
        description: "Modern, performant websites and applications built with Next.js, React, and creative coding.",
        color: "from-emerald-500/20 to-green-500/20",
        icon: Code2
    },
    {
        id: "creative",
        title: "Creative Direction",
        subtitle: "Vision turned into reality.",
        description: "Comprehensive brand strategy and visual identity development for digital-first businesses.",
        color: "from-purple-500/20 to-pink-500/20",
        icon: Sparkles
    },
]

export function ServicesSection() {
    const [hoveredService, setHoveredService] = useState<string | null>(null)

    return (
        <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto cursor-default">
            <div className="mb-16">
                <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4"> Expertise</h2>
                <div className="h-px w-full bg-border" />
            </div>

            <div className="flex flex-col">
                {services.map((service) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="group relative border-b border-border py-12 md:py-16 transition-all duration-300"
                        onMouseEnter={() => setHoveredService(service.id)}
                        onMouseLeave={() => setHoveredService(null)}
                    >
                        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 z-10 relative">
                            <h3 className="text-4xl md:text-6xl font-bold transition-transform duration-300 group-hover:translate-x-4">
                                {service.title}
                            </h3>
                            <div className="md:max-w-md">
                                <p className="text-xl md:text-2xl font-medium mb-2 text-foreground/80 group-hover:text-primary transition-colors">
                                    {service.subtitle}
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
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
                ))}
            </div>
        </section>
    )
}
