"use client"

import { useRef, useState } from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    strength?: number; // How strong the magnet pull is
}

export function MagneticButton({
    children,
    className,
    strength = 15,
    ...props
}: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        setPosition({ x: x / (strength / 2), y: y / (strength / 2) });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.button
            ref={ref}
            className={cn("relative inline-flex items-center justify-center", className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            {...props} // Pass through valid HTML button props
        // Remove motion-specific props if they conflict, but motion.button usually handles it
        >
            {children}
        </motion.button>
    );
}
