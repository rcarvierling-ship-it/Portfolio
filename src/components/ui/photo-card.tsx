"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Photo } from "@/lib/types"
import { useState } from "react"
import { X } from "lucide-react"

interface PhotoCardProps {
    photo: Photo
}

export function PhotoCard({ photo }: PhotoCardProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-secondary"
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src={photo.variants?.medium || photo.url}
                    alt={photo.altText || "Photo"}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end p-4">
                    <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {photo.caption && (
                            <p className="text-white text-sm font-medium">{photo.caption}</p>
                        )}
                        {photo.tags.length > 0 && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {photo.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Lightbox */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
                        <Image
                            src={photo.variants?.original || photo.url}
                            alt={photo.altText || "Photo"}
                            fill
                            className="object-contain"
                            sizes="100vw"
                        />
                    </div>
                    {(photo.caption || photo.altText) && (
                        <div className="absolute bottom-4 left-4 right-4 text-center">
                            <p className="text-white text-lg">{photo.caption || photo.altText}</p>
                        </div>
                    )}
                </motion.div>
            )}
        </>
    )
}
