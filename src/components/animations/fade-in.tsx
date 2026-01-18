"use client"

import { motion, HTMLMotionProps } from "framer-motion"

export function FadeIn({ children, className, delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}
