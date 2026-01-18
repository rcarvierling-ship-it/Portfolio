"use client"

import { motion } from "framer-motion"
import { Camera, Code, Palette, Zap } from "lucide-react"

const stats = [
    { icon: Camera, label: "Projects Completed", value: "50+" },
    { icon: Code, label: "Years Experience", value: "10+" },
    { icon: Palette, label: "Creative Tools", value: "15+" },
    { icon: Zap, label: "Client Satisfaction", value: "100%" },
]

export function StatsSection() {
    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col items-center text-center gap-4 p-6 rounded-xl bg-secondary/30 border border-border hover:border-primary/50 transition-colors"
                    >
                        <div className="p-3 rounded-full bg-primary/10">
                            <stat.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
