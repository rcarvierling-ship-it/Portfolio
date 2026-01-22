"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Photo } from "@/lib/types"
import { ArrowRight } from "lucide-react"

import { TechFrame } from "@/components/ui/tech-frame"

export function RecentPhotosClient({ photos }: { photos: Photo[] }) {
    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center justify-between mb-12"
            >
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-tech text-xs text-muted-foreground uppercase tracking-widest">_LIVE_FEED / CAPTURES</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Recent Photos</h2>
                    <p className="text-muted-foreground text-lg font-light">Raw output from recent sessions.</p>
                </div>
                <Link
                    href="/work?type=photos"
                    className="hidden md:flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-mono uppercase tracking-wider"
                >
                    _VIEW_ALL <ArrowRight size={16} />
                </Link>
            </motion.div>

            <TechFrame label="_GRID_VIEW" cornerAccents className="p-1 md:p-2 border-dashed border-gray-500/20 bg-background/5">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    {photos.map((photo, index) => (
                        <motion.div
                            key={photo.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative aspect-square overflow-hidden bg-secondary border border-transparent hover:border-cyan-500/30 transition-colors"
                        >
                            <Image
                                src={photo.variants?.thumbnail || photo.url}
                                alt={photo.altText || "Photo"}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                            />

                            {/* Technical Overlay on Hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <span className="text-[9px] font-mono text-cyan-400 bg-black/50 px-1 py-0.5 rounded">
                                        IMG_{index.toString().padStart(3, '0')}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </TechFrame>

            <Link
                href="/work?type=photos"
                className="md:hidden flex items-center justify-center gap-2 text-primary hover:gap-3 transition-all mt-8"
            >
                View All Photos <ArrowRight size={20} />
            </Link>
        </section>
    )
}
