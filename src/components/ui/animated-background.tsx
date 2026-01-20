"use client";

import { useEffect, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export function AnimatedBackground({ colors }: { colors?: { color1: string; color2: string; color3: string; color4: string } }) {
    const c1 = colors?.color1 || "rgba(217, 70, 239, 0.5)";
    const c2 = colors?.color2 || "rgba(34, 211, 238, 0.5)";
    const c3 = colors?.color3 || "rgba(167, 139, 250, 0.4)";
    const c4 = colors?.color4 || "rgba(244, 114, 182, 0.4)";

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Update mouse position normalized to window size (0-100%) mainly or pixels
            // Let's use direct pixels for the radial gradient center
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Create a spotlight gradient that moves with the mouse
    const spotlightBackground = useMotionTemplate`
        radial-gradient(
            600px circle at ${mouseX}px ${mouseY}px,
            rgba(255, 255, 255, 0.07),
            transparent 80%
        )
    `;

    return (
        <div className="fixed inset-0 -z-50 h-full w-full bg-background overflow-hidden">
            {/* Base ambient gradient layer - moves slowly on its own */}
            <div
                className="absolute inset-0 h-full w-full opacity-40 dark:opacity-30 animate-gradient"
                style={{
                    background: `
            radial-gradient(circle at 15% 50%, ${c1}, transparent 25%), 
            radial-gradient(circle at 85% 30%, ${c2}, transparent 25%)
          `,
                    backgroundSize: "200% 200%",
                    filter: "blur(60px)",
                }}
            />

            {/* Secondary accent layer for depth */}
            <div
                className="absolute inset-0 h-full w-full opacity-30 dark:opacity-20 animate-gradient-reverse"
                style={{
                    background: `
            radial-gradient(circle at 50% 50%, ${c3}, transparent 50%),
            radial-gradient(circle at 50% 10%, ${c4}, transparent 40%)
          `,
                    backgroundSize: "200% 200%",
                    filter: "blur(80px)",
                }}
            />

            {/* Interactive Spotlight Layer */}
            <motion.div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    background: spotlightBackground,
                }}
            />

            {/* Film Grain Texture Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
}

