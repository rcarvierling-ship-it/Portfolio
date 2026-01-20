"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function FloatingParticles() {
    // We'll create a fixed set of particles with random initial positions and velocities
    // In a real app complexity, we might use canvas, but for ~20-30 particles DOM notes are fine and easier to style
    const particles = Array.from({ length: 25 });

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((_, i) => (
                <Particle key={i} index={i} />
            ))}
        </div>
    );
}

function Particle({ index }: { index: number }) {
    // Deterministic random-ish based on index to avoid hydration mismatch
    const random = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    const initialX = random(index) * 100; // 0-100%
    const initialY = random(index + 100) * 100; // 0-100%
    const size = random(index + 200) * 3 + 1; // 1-4px
    const duration = random(index + 300) * 20 + 10; // 10-30s
    const delay = random(index + 400) * -20; // negative delay to start mid-animation

    return (
        <motion.div
            className="absolute rounded-full bg-white/20"
            style={{
                left: `${initialX}%`,
                top: `${initialY}%`,
                width: size,
                height: size,
            }}
            animate={{
                y: [0, -100, 0],
                x: [0, 50, 0],
                opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
                delay: delay,
            }}
        />
    );
}
