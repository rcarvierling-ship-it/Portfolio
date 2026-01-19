"use client"

import { useSandbox } from "@/lib/sandbox/context"
import { Camera, Trash2, Plus, Grip, Edit, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Photo } from "@/lib/types"

export default function SandboxMedia() {
    const { store, forceUpdate } = useSandbox();
    const photos = store.photos;
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const handleUpload = () => {
        store.addPhoto();
        forceUpdate();
    }

    const handleDelete = (id: string) => {
        store.deletePhoto(id);
        forceUpdate();
    }

    return (
        <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Camera className="text-purple-500" />
                        Media Library (Sandbox)
                    </h1>
                    <p className="text-muted-foreground">Manage {photos.length} mock photos. Nothing deleted here is lost.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleUpload} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <Plus size={16} /> Fake Upload
                    </button>
                    <Link href="/sandbox" className="text-sm font-medium border px-4 py-2 rounded-lg hover:bg-secondary">
                        Back
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {photos.map(photo => (
                    <div key={photo.id} className="group relative aspect-square bg-muted/20 rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-colors">
                        <Image
                            src={photo.url}
                            alt={photo.altText}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            unoptimized
                        />

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                            <div className="flex justify-end">
                                <button onClick={() => handleDelete(photo.id)} className="p-1.5 bg-red-500 text-white rounded-md hover:scale-110 transition-transform">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className="text-xs text-white truncate font-medium">
                                {photo.altText}
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px] uppercase font-bold bg-black/60 text-white rounded backdrop-blur-sm">
                            {photo.status}
                        </div>
                    </div>
                ))}
            </div>

            {photos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-xl bg-muted/10">
                    <Camera size={48} className="text-muted-foreground mb-4 opacity-50" />
                    <p className="font-bold text-muted-foreground">Library Empty</p>
                    <button onClick={handleUpload} className="mt-4 text-primary font-bold hover:underline">Generated a mock photo</button>
                </div>
            )}
        </div>
    )
}
