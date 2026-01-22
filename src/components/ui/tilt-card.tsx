"use client"

import React, { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import Link from "next/link"
import { Project } from "@/lib/types"

interface TiltCardProps {
    project: Project;
}

export function TiltCard({ project }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]); // Reduced rotation for classier feel
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = ref.current!.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <Link href={`/work/${project.slug}`}>
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateY,
                    rotateX,
                    transformStyle: "preserve-3d",
                }}
                className="relative group cursor-pointer"
            >
                <div
                    className="relative h-[500px] w-full rounded-sm overflow-hidden bg-muted border border-white/5"
                    style={{ transform: "translateZ(0px)" }} // Base layer
                >
                    {/* Placeholder Image - in real app use Next.js Image */}
                    <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center text-neutral-600 bg-tech-grid-small">
                        <span className="text-4xl font-light opacity-20 font-mono">_IMG</span>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                    {/* Tech Corners */}
                    <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/30" />
                    <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/30" />
                    <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/30" />
                    <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/30" />
                </div>

                <div
                    style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
                    className="absolute bottom-0 left-0 p-8 w-full"
                >
                    <h3 className="text-3xl font-light text-white mb-2 tracking-wide">{project.title}</h3>
                    <div className="flex items-center gap-4 text-sm font-medium text-white/70 uppercase tracking-widest">
                        <span>{project.location}</span>
                        <span className="w-1 h-1 rounded-full bg-white/50" />
                        <span>{project.year}</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
