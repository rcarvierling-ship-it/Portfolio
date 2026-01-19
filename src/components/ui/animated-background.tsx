"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-50 h-full w-full bg-background">
            <div
                className="absolute inset-0 h-full w-full opacity-30 dark:opacity-20 animate-gradient"
                style={{
                    background: `
            radial-gradient(circle at 15% 50%, rgba(76, 29, 149, 0.4), transparent 25%), 
            radial-gradient(circle at 85% 30%, rgba(29, 78, 216, 0.4), transparent 25%)
          `,
                    backgroundSize: "200% 200%",
                    filter: "blur(60px)",
                }}
            />

            {/* Secondary accent layer for depth */}
            <div
                className="absolute inset-0 h-full w-full opacity-20 dark:opacity-10 animate-gradient-reverse"
                style={{
                    background: `
            radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.3), transparent 50%),
            radial-gradient(circle at 50% 10%, rgba(59, 130, 246, 0.3), transparent 40%)
          `,
                    backgroundSize: "200% 200%",
                    filter: "blur(80px)",
                }}
            />
        </div>
    );
}
