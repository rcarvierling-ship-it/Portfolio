"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Photo } from "@/lib/types"
import { ArrowRight } from "lucide-react"

export function RecentPhotosClient({ photos }: { photos: Photo[] }) {
    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center justify-between mb-12"
            >
                <div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-2">Recent Captures</h2>
                    <p className="text-muted-foreground">Latest additions to the collection</p>
                </div>
                <Link
                    href="/work?type=photos"
                    className="hidden md:flex items-center gap-2 text-primary hover:gap-3 transition-all"
                >
                    View All <ArrowRight size={20} />
                </Link>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {photos.map((photo, index) => (
                    <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative aspect-square rounded-lg overflow-hidden bg-secondary"
                    >
                        <Image
                            src={photo.variants?.thumbnail || photo.url}
                            alt={photo.altText || "Photo"}
                            fill
                            className="object-cover transition-transform group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </motion.div>
                ))}
            </div>

            <Link
                href="/work?type=photos"
                className="md:hidden flex items-center justify-center gap-2 text-primary hover:gap-3 transition-all mt-8"
            >
                View All Photos <ArrowRight size={20} />
            </Link>
        </section>
    )
}
