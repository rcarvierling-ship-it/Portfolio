"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from "framer-motion"
// Helper function since @motionone/utils is causing build issues
const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

interface ParallaxProps {
    children: string
    baseVelocity: number
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
    const baseX = useMotionValue(0)
    const { scrollY } = useScroll()
    const scrollVelocity = useVelocity(scrollY)
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    })
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    })

    // Magic wrapping logic
    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`)

    const directionFactor = useRef<number>(1)
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

        // Change direction based on scroll
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get()

        baseX.set(baseX.get() + moveBy)
    })

    return (
        <div className="overflow-hidden flex flex-nowrap whitespace-nowrap">
            <motion.div className="flex flex-nowrap gap-10 md:gap-20" style={{ x }}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <span key={i} className="block text-4xl md:text-6xl font-black uppercase tracking-tighter opacity-80">
                        {children}
                    </span>
                ))}
            </motion.div>
        </div>
    )
}

interface StatsSectionProps {
    line1?: string;
    line2?: string;
}

export function StatsSection({ line1 = "50+ Projects • 10+ Years Exp • 15+ Creative Tools •", line2 = "Photography • Videography • Web Development •" }: StatsSectionProps) {
    return (
        <section className="py-12 md:py-20 border-y border-border/50 bg-secondary/10 overflow-hidden relative">
            <ParallaxText baseVelocity={-2}>{line1}</ParallaxText>
            <div className="h-4 md:h-8" />
            <ParallaxText baseVelocity={2}>{line2}</ParallaxText>

            {/* Gradient Fade Edges */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
        </section>
    )
}
