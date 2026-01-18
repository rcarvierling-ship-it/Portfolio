"use client"
import { useEffect, useState } from "react"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDown } from "lucide-react"
import Link from "next/link"
import { TextReveal } from "@/components/animations/text-reveal"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { ParticlesBackground } from "@/components/animations/particles-background"

import { HeroScene } from "@/components/3d/hero-scene";

export function Hero() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const [content, setContent] = useState({
        heroTitle: "Capturing light, emotion, and the moments in between.",
        heroDescription: "Reese Vierling (RCV.Media) — Senior Frontend Engineer & Creative Developer specializing in interactive web applications and 3D experiences."
    });

    useEffect(() => {
        fetch('/api/global')
            .then(res => res.json())
            .then(data => {
                if (data.heroTitle) setContent(data);
            })
            .catch(err => console.error("Failed to load global content"));
    }, []);

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    return (
        <section
            ref={ref}
            className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-20 overflow-hidden" // pt-20 to account for fixed header if needed
        >
            <motion.div
                className="absolute inset-0 z-[-1]"
                style={{ y: backgroundY, opacity }}
            >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-50" />
                <div className="absolute inset-0 bg-grid-zinc-900/[0.02] dark:bg-grid-white/[0.02]" />
                <HeroScene />
                <ParticlesBackground />
            </motion.div>

            <div className="flex flex-col items-center gap-8 max-w-4xl text-center z-10">
                <TextReveal
                    text={content.heroTitle}
                    className="text-4xl md:text-7xl font-bold tracking-tighter justify-center"
                />

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl text-center"
                >
                    {content.heroDescription}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="flex gap-4 mt-4"
                >
                    <Link href="/work">
                        <MagneticButton className="px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-medium">
                            View Gallery
                        </MagneticButton>
                    </Link>
                    <Link href="/contact">
                        <MagneticButton className="px-8 py-4 border border-input bg-background hover:bg-muted text-foreground rounded-full text-lg font-medium">
                            Contact Me
                        </MagneticButton>
                    </Link>
                </motion.div>
            </div>

            <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                <span className="text-xs uppercase tracking-widest">Scroll</span>
                <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    <ArrowDown size={20} />
                </motion.div>
            </motion.div>
        </section >
    )
}
