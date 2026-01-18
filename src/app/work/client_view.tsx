"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Project, Photo } from "@/lib/types"
import { TiltCard } from "@/components/ui/tilt-card"
import { PhotoCard } from "@/components/ui/photo-card"
import { ProjectFilterBar } from "@/components/ui/project-filter-bar"
import { TextReveal } from "@/components/animations/text-reveal"

const ALL_CATEGORY = "All";
const PROJECTS_TYPE = "Projects";
const PHOTOS_TYPE = "Photos";

export function WorkClient({ projects, photos }: { projects: Project[], photos: Photo[] }) {
    const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
    const [contentType, setContentType] = useState<"all" | "projects" | "photos">("all");

    // Combine tags from both projects and photos
    const projectTags = Array.from(new Set(projects.flatMap(p => p.tags)));
    const photoTags = Array.from(new Set(photos.flatMap(p => p.tags)));
    const allTags = Array.from(new Set([...projectTags, ...photoTags]));
    const filterCategories = [ALL_CATEGORY, ...allTags];

    // Filter content based on type and category
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
                <TextReveal
                    text="Selected Collections"
                    className="text-4xl md:text-6xl font-bold"
                />
                <p className="text-muted-foreground max-w-xl">
                    Visual stories from around the world.
                </p>

                {/* Content Type Filter */}
                <div className="flex gap-2 mb-2">
                    <button
                        onClick={() => setContentType("all")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${contentType === "all"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary hover:bg-secondary/80"
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setContentType("projects")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${contentType === "projects"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary hover:bg-secondary/80"
                            }`}
                    >
                        Projects
                    </button>
                    <button
                        onClick={() => setContentType("photos")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${contentType === "photos"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary hover:bg-secondary/80"
                            }`}
                    >
                        Photos
                    </button>
                </div>

                {/* Tag Filter */}
                <ProjectFilterBar
                    categories={filterCategories}
                    activeCategory={activeCategory}
                    onSelect={setActiveCategory}
                    className="mt-4"
                />
            </div>

            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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

            {totalItems === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    No {contentType === "all" ? "content" : contentType} found in this category.
                </div>
            )}
        </div>
    )
}
