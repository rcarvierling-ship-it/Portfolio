"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function AnimatedBackground({ colors }: { colors?: { color1: string; color2: string; color3: string; color4: string } }) {
    const c1 = colors?.color1 || "rgba(217, 70, 239, 0.5)";
    const c2 = colors?.color2 || "rgba(34, 211, 238, 0.5)";
    const c3 = colors?.color3 || "rgba(167, 139, 250, 0.4)";
    const c4 = colors?.color4 || "rgba(244, 114, 182, 0.4)";

    return (
        <div className="fixed inset-0 -z-50 h-full w-full bg-background selection:bg-cyan-500/30">
            {/* 1. Base Gradient Layer */}
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

            {/* 2. Secondary accent layer for depth */}
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

            {/* 3. Noise Texture Layer (The "Veil") */}
            <div className="absolute inset-0 z-0 h-full w-full bg-noise-subtle opacity-[0.07] mix-blend-overlay pointer-events-none" />

            {/* 4. System Grid Layer (Scaffolding) */}
            <div className="absolute inset-0 z-0 h-full w-full bg-tech-grid pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
        </div>
    );
}
