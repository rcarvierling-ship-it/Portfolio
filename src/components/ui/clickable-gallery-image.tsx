"use client"

import { useState } from "react"
import Image from "next/image"
import { GalleryItem, MetadataOverlayConfig } from "@/lib/types"
import { MetadataOverlay } from "@/components/ui/metadata-overlay"
import { motion, AnimatePresence } from "framer-motion"
import { X, Maximize2 } from "lucide-react"

interface ClickableGalleryImageProps {
    item: GalleryItem;
    projectConfig?: {
        camera?: string;
        lens?: string;
    };
    aspectRatio?: string;
}

export function ClickableGalleryImage({ item, projectConfig, aspectRatio = "aspect-[4/5]" }: ClickableGalleryImageProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Default configuration for the overlay when clicked
    const overlayConfig: MetadataOverlayConfig = {
        show: true,
        mode: 'always',
        position: 'bottom-left',
        fields: {
            camera: true,
            lens: true,
            settings: true,
            date: true
        },
        style: 'badge'
    };

    const metadata = {
        camera: projectConfig?.camera || "Sony A7IV",
        lens: projectConfig?.lens || "35mm f/1.4 GM",
        settings: "f/2.0 1/500s ISO 200",
        date: new Date().toLocaleDateString()
    };

    return (
        <>
            <div
                className={`relative w-full rounded-sm overflow-hidden bg-muted group cursor-pointer ${aspectRatio}`}
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src={item.url}
                    alt={item.caption || "Gallery Image"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-black/50 backdrop-blur-sm p-2 rounded-full text-white">
                        <Maximize2 size={20} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
                        onClick={() => setIsOpen(false)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
                        >
                            <X size={24} />
                        </button>

                        <div
                            className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={item.url}
                                alt={item.caption || "Full View"}
                                fill
                                className="object-contain select-none"
                                sizes="100vw"
                                priority
                            />

                            {/* Metadata Overlay (Inside Lightbox) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="absolute bottom-6 left-6 md:bottom-12 md:left-12 max-w-md pointer-events-none"
                            >
                                <MetadataOverlay
                                    config={overlayConfig}
                                    data={metadata}
                                    className="!static !translate-y-0" // Override absolute positioning
                                />
                                {item.caption && (
                                    <p className="mt-4 text-white/80 text-sm font-medium border-l-2 border-primary/50 pl-3">
                                        {item.caption}
                                    </p>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
