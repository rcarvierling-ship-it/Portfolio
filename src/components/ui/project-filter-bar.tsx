"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProjectFilterBarProps {
    categories: string[];
    activeCategory: string;
    onSelect: (category: string) => void;
    className?: string;
}

export function ProjectFilterBar({ categories, activeCategory, onSelect, className }: ProjectFilterBarProps) {
    return (
        <div className={cn("flex flex-wrap gap-2 justify-center", className)}>
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onSelect(category)}
                    className={cn(
                        "relative px-4 py-2 text-sm font-medium transition-colors rounded-full hover:text-primary",
                        activeCategory === category ? "text-primary-foreground" : "text-muted-foreground bg-secondary/50"
                    )}
                >
                    {activeCategory === category && (
                        <motion.div
                            layoutId="activeFilter"
                            className="absolute inset-0 bg-primary rounded-full"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">{category}</span>
                </button>
            ))}
        </div>
    )
}
