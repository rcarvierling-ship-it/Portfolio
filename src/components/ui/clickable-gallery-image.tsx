"use client"

import { useState } from "react"
import Image from "next/image"
import { GalleryItem, MetadataOverlayConfig } from "@/lib/types"
import { MetadataOverlay } from "@/components/ui/metadata-overlay"
import { motion, AnimatePresence } from "framer-motion"

interface ClickableGalleryImageProps {
    item: GalleryItem;
    projectConfig?: {
        camera?: string;
        lens?: string;
    };
    aspectRatio?: string;
}

export function ClickableGalleryImage({ item, projectConfig, aspectRatio = "aspect-[4/5]" }: ClickableGalleryImageProps) {
    const [showMetadata, setShowMetadata] = useState(false);

    // Default configuration for the overlay when clicked
    const overlayConfig: MetadataOverlayConfig = {
        show: true,
        mode: 'always', // Force always visible when state is true
        position: 'bottom-left',
        fields: {
            camera: true,
            lens: true,
            settings: true,
            date: true
        },
        style: 'badge' // Use badge style for better visibility on click
    };

    // Construct data for the overlay
    // Use project defaults if item specific data is missing (mocking for now since GalleryItem is simple)
    const metadata = {
        camera: projectConfig?.camera || "Sony A7IV",
        lens: projectConfig?.lens || "35mm f/1.4 GM",
        settings: "f/2.0 1/500s ISO 200", // Mock random settings for variance
        date: new Date().toLocaleDateString()
    };

    return (
        <div
            className={`relative w-full rounded-sm overflow-hidden bg-muted group cursor-pointer ${aspectRatio}`}
            onClick={() => setShowMetadata(!showMetadata)}
        >
            <Image
                src={item.url}
                alt={item.caption || "Gallery Image"}
                fill
                className={`object-cover transition-transform duration-700 ${showMetadata ? 'scale-105' : 'group-hover:scale-105'}`}
            />

            {/* Darken overlay when metadata is shown to improve readability */}
            <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${showMetadata ? 'opacity-100' : 'opacity-0'}`} />

            <AnimatePresence>
                {showMetadata && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <MetadataOverlay
                            config={overlayConfig}
                            data={metadata}
                            className="pointer-events-none"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {showMetadata && (
                <div className="absolute top-4 right-4 text-[10px] text-white/50 font-mono bg-black/50 px-2 py-1 rounded backdrop-blur-md">
                    METADATA_ACTIVE
                </div>
            )}
        </div>
    )
}
