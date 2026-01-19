"use client"

import React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AnimatedIconProps extends Omit<HTMLMotionProps<"div">, "children"> {
    icon: LucideIcon
    size?: number | string
    className?: string
    variant?: "scale" | "rotate" | "shake" | "pulse"
    trigger?: "hover" | "click"
    iconClassName?: string
}

export function AnimatedIcon({
    icon: Icon,
    size = 24,
    className,
    variant = "scale",
    trigger = "hover",
    iconClassName,
    ...props
}: AnimatedIconProps) {

    const variants = {
        scale: {
            initial: { scale: 1 },
            animate: { scale: 1.2 },
            transition: { type: "spring", stiffness: 400, damping: 10 }
        },
        rotate: {
            initial: { rotate: 0 },
            animate: { rotate: 15 },
            transition: { type: "spring", stiffness: 300, damping: 10 }
        },
        shake: {
            initial: { x: 0 },
            animate: { x: [-2, 2, -2, 2, 0] },
            transition: { duration: 0.4 }
        },
        pulse: {
            initial: { scale: 1 },
            animate: { scale: [1, 1.1, 1] },
            transition: { duration: 0.8, repeat: Infinity, repeatDelay: 1 }
        }
    }

    const isHover = trigger === "hover"
    const isClick = trigger === "click"

    return (
        <motion.div
            className={cn("inline-flex items-center justify-center", className)}
            whileHover={isHover ? variants[variant].animate : undefined}
            whileTap={isClick ? variants[variant].animate : undefined}
            initial={variants[variant].initial}
            {...props}
        >
            <Icon size={size} className={iconClassName} />
        </motion.div>
    )
}
