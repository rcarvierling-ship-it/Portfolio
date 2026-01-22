"use client"

import { MetadataOverlayConfig, Photo } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Camera, Aperture, Calendar, Clock } from "lucide-react"

interface MetadataOverlayProps {
    photo?: Photo;
    data?: {
        camera?: string;
        lens?: string;
        settings?: string;
        date?: string;
    };
    config?: MetadataOverlayConfig;
    className?: string;
}

export function MetadataOverlay({ photo, data, config, className }: MetadataOverlayProps) {
    if (!config?.show) return null;

    const { mode, style, fields, position } = config;

    // Resolve data sources: Direct prop > Photo EXIF > Defaults
    const camera = data?.camera || photo?.exif?.camera || "Sony A7IV";
    const lens = data?.lens || photo?.exif?.lens || "35mm GM";
    const settings = data?.settings || (photo?.exif ? `${photo.exif.aperture || 'f/1.4'} ${photo.exif.shutter || '1/250s'} ISO${photo.exif.iso || '100'}` : "f/2.8 1/125s ISO400");
    const date = data?.date || (photo?.createdAt ? new Date(photo.createdAt).toLocaleDateString() : new Date().toLocaleDateString());

    // Position Classes
    const positionClasses = {
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'top-left': 'top-4 left-4',
        'top-right': 'top-4 right-4'
    };

    // Style Classes
    const containerStyle = {
        'minimal': 'text-white/80 text-[10px] font-medium drop-shadow-md space-y-0.5 pointer-events-none',
        'badge': 'bg-black/40 backdrop-blur-md rounded-lg p-2 border border-white/10 text-white text-[10px] shadow-lg space-y-1 pointer-events-none',
        'terminal': 'bg-black text-green-400 font-mono text-[10px] p-2 border border-green-500/50 space-y-1 pointer-events-none'
    };

    return (
        <div
            className={cn(
                "absolute z-20 transition-opacity duration-300 select-none",
                positionClasses[position || 'bottom-left'],
                containerStyle[style || 'minimal'],
                mode === 'hover' ? "opacity-0 group-hover:opacity-100" : "opacity-100",
                className
            )}
        >
            {fields?.camera && (
                <div className="flex items-center gap-1.5">
                    <Camera size={10} className={style === 'terminal' ? 'text-green-500' : 'opacity-70'} />
                    <span>{camera}</span>
                </div>
            )}
            {fields?.lens && (
                <div className="flex items-center gap-1.5">
                    <Aperture size={10} className={style === 'terminal' ? 'text-green-500' : 'opacity-70'} />
                    <span>{lens}</span>
                </div>
            )}
            {fields?.settings && (
                <div className="flex items-center gap-2 opacity-80">
                    <span>{settings}</span>
                </div>
            )}
            {fields?.date && (
                <div className="flex items-center gap-1.5 opacity-60 pt-1">
                    <Calendar size={8} />
                    <span>{date}</span>
                </div>
            )}
        </div>
    )
}
