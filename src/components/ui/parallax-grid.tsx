"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ParallaxGridProps {
    images?: string[];
    className?: string;
}

export function ParallaxGrid({ images = [], className }: ParallaxGridProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Mouse position state
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth physics-based movement
    const springConfig = { damping: 25, stiffness: 150 };
    const x = useSpring(useTransform(mouseX, [-1500, 1500], [40, -40]), springConfig);
    const y = useSpring(useTransform(mouseY, [-1000, 1000], [40, -40]), springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Calculate center-based position
            const { innerWidth, innerHeight } = window;
            const centerX = innerWidth / 2;
            const centerY = innerHeight / 2;

            mouseX.set(e.clientX - centerX);
            mouseY.set(e.clientY - centerY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Ensure we have a nice grid even if only 1-2 images are passed
    // We'll repeat the images if needed to fill a 3x3 grid (9 items)
    const sourceImages = images.length > 0 ? images : ["/uploads/hero-placeholder.jpg"];
    const filledImages = Array(9).fill(null).map((_, i) => sourceImages[i % sourceImages.length]);

    if (filledImages.length === 0) return null;

    return (
        <div ref={containerRef} className={cn("absolute inset-0 z-0 overflow-hidden", className)}>
            {/* 
                We scale the grid container slightly larger than the screen 
                so the parallax edges don't show blank space.
            */}
            <motion.div
                className="grid grid-cols-3 gap-8 w-[120%] h-[120%] -ml-[10%] -mt-[10%] opacity-40 dark:opacity-25 filter blur-[1px] grayscale-[0.5]"
                style={{ x, y }}
            >
                {filledImages.map((src, idx) => (
                    <div key={idx} className="relative aspect-video w-full h-full overflow-hidden rounded-xl">
                        <Image
                            src={src}
                            alt={`Ambient background ${idx}`}
                            fill
                            className="object-cover"
                            sizes="33vw"
                        />
                        {/* Vignette overlay on each image */}
                        <div className="absolute inset-0 bg-black/10" />
                    </div>
                ))}
            </motion.div>

            {/* Vignette to focus attention on the center text */}
            <div className="absolute inset-0 bg-background/50 radial-mask z-10 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, transparent 30%, var(--background) 100%)'
                }}
            />
        </div>
    );
}
