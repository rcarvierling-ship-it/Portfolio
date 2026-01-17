"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Project } from "@/lib/types"
import { TiltCard } from "@/components/ui/tilt-card"
import { ProjectFilterBar } from "@/components/ui/project-filter-bar"
import { TextReveal } from "@/components/animations/text-reveal"

const ALL_CATEGORY = "All";
// const FILTER_CATEGORIES = [ALL_CATEGORY, "Street", "B&W", "Landscape", "Portrait", "Nature"];

export function WorkClient({ projects }: { projects: Project[] }) {
    const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);

    // Dynamically generate categories from available projects, plus manual "Standard" ones if preferred
    const availableCategories = Array.from(new Set(projects.flatMap(p => p.tags)));
    const filterCategories = [ALL_CATEGORY, ...availableCategories];

    const filteredProjects = projects.filter(project => {
        if (activeCategory === ALL_CATEGORY) return true;
        return project.tags.includes(activeCategory);
    });

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-12">
            <div className="flex flex-col items-center text-center gap-6">
                <TextReveal
                    text="Selected Collections"
                    className="text-4xl md:text-6xl font-bold"
                />
                <p className="text-muted-foreground max-w-xl">
                    Visual stories from around the world.
                </p>

                <ProjectFilterBar
                    categories={filterCategories}
                    activeCategory={activeCategory}
                    onSelect={setActiveCategory}
                    className="mt-4"
                />
            </div>

            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.slug}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TiltCard project={project} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    No projects found in this category.
                </div>
            )}
        </div>
    )
}
