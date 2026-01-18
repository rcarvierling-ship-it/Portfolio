"use client"

import { motion } from "framer-motion"
import { Camera, Code2, Sparkles, Video } from "lucide-react"

const services = [
    {
        icon: Camera,
        title: "Photography",
        description: "Professional photography capturing authentic moments and stunning visuals across various styles and settings.",
    },
    {
        icon: Video,
        title: "Videography",
        description: "Cinematic video production bringing stories to life with creative direction and technical excellence.",
    },
    {
        icon: Code2,
        title: "Web Development",
        description: "Interactive web experiences combining cutting-edge technology with beautiful, user-focused design.",
    },
    {
        icon: Sparkles,
        title: "Creative Direction",
        description: "End-to-end creative solutions from concept to execution, ensuring cohesive brand storytelling.",
    },
]

export function ServicesSection() {
    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-bold mb-4">What I Do</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Blending technical expertise with creative vision to deliver exceptional results
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, index) => (
                    <motion.div
                        key={service.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg"
                    >
                        <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                            <service.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {service.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
