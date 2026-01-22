"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Project, Photo } from "@/lib/types"
import { TiltCard } from "@/components/ui/tilt-card"
import { PhotoCard } from "@/components/ui/photo-card"
import { ProjectFilterBar } from "@/components/ui/project-filter-bar"
import { TextReveal } from "@/components/animations/text-reveal"

import { TechFrame } from "@/components/ui/tech-frame"

// ... (imports remain)
const ALL_CATEGORY = "All";
const PROJECTS_TYPE = "Projects";
const PHOTOS_TYPE = "Photos";

export function WorkClient({ projects, photos }: { projects: Project[], photos: Photo[] }) {
    const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
    const [contentType, setContentType] = useState<"all" | "projects" | "photos">("all");

    // ... (logic remains same)
    const projectTags = Array.from(new Set(projects.flatMap(p => p.tags)));
    const photoTags = Array.from(new Set(photos.flatMap(p => p.tags)));
    const allTags = Array.from(new Set([...projectTags, ...photoTags]));
    const filterCategories = [ALL_CATEGORY, ...allTags];

    // ... (filtering logic remains same)
    const filteredProjects = projects.filter(project => {
        if (contentType === "photos") return false;
        if (activeCategory === ALL_CATEGORY) return true;
        return project.tags.includes(activeCategory);
    });

    const filteredPhotos = photos.filter(photo => {
        if (contentType === "projects") return false;
        if (activeCategory === ALL_CATEGORY) return true;
        return photo.tags.includes(activeCategory);
    });

    const totalItems = filteredProjects.length + filteredPhotos.length;

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-12">
            <div className="flex flex-col items-center text-center gap-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-primary/80 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">_Index / Collections</span>
                </div>
                <TextReveal
                    text="Selected Collections"
                    className="text-4xl md:text-6xl font-bold tracking-tight"
                />
                <p className="text-muted-foreground text-lg max-w-xl font-light">
                    Visual stories from around the world.
                </p>

                {/* Content Type Filter */}
                <div className="flex gap-2 mb-2 p-1 bg-secondary/50 rounded-full border border-border/50">
                    {["all", "projects", "photos"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setContentType(type as any)}
                            className={cn(
                                "px-6 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-all",
                                contentType === type
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "hover:bg-background/50 text-muted-foreground"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Tag Filter */}
                <ProjectFilterBar
                    categories={filterCategories}
                    activeCategory={activeCategory}
                    onSelect={setActiveCategory}
                    className="mt-4"
                />
            </div>

            <TechFrame label={contentType === 'all' ? "_MASTER_INDEX" : `_${contentType.toUpperCase()}_INDEX`}>
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4 md:p-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <motion.div
                                key={`project-${project.slug}`}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="md:col-span-2"
                            >
                                <TiltCard project={project} />
                            </motion.div>
                        ))}
                        {filteredPhotos.map((photo) => (
                            <motion.div
                                key={`photo-${photo.id}`}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <PhotoCard photo={photo} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </TechFrame>


            {totalItems === 0 && (
                <div className="text-center py-20 text-muted-foreground font-mono text-sm border border-dashed border-border/50 rounded-lg">
                    _NO_DATA_FOUND: {contentType === "all" ? "content" : contentType} in category [{activeCategory}]
                </div>
            )}
        </div>
    )
}
