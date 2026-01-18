"use client"

import { useState, useEffect, useCallback } from "react"
import { Reorder } from "framer-motion"
import { Image as ImageIcon, Trash2, Edit2, Check, X, Upload, Loader2, Search, Filter, Clock } from "lucide-react"
import { Photo } from "@/lib/types"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { TagInput } from "@/components/ui/tag-input"
import { cn } from "@/lib/utils"
// We'll reuse the existing history/uploader where possible, or reimplement within this scope if needed for "Advanced" features
import { HistoryModal } from "@/components/dashboard/history-modal"

export function MediaLibrary() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    // Editor State
    const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
    const [showHistory, setShowHistory] = useState(false);

    // Upload State
    const [uploadQueue, setUploadQueue] = useState<{ file: File, status: 'pending' | 'uploading' | 'done' | 'error' }[]>([]);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        setLoading(true);
        const res = await fetch('/api/photos');
        const data = await res.json();
        setPhotos(data);
        setLoading(false);
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const files = Array.from(e.target.files);
        const newQueue = files.map(file => ({ file, status: 'pending' as const }));
        setUploadQueue(prev => [...prev, ...newQueue]);

        // Process queue
        for (const item of newQueue) {
            // Update status to uploading
            setUploadQueue(q => q.map(i => i.file === item.file ? { ...i, status: 'uploading' } : i));

            try {
                const formData = new FormData();
                formData.append('file', item.file);

                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                if (!res.ok) throw new Error("Upload failed");

                const data = await res.json();

                // create new photo entry
                const newPhoto: Photo = {
                    id: Date.now().toString() + Math.random().toString().slice(2, 5),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    version: 1,
                    status: 'draft', // Default to draft?
                    url: data.url,
                    width: data.width,
                    height: data.height,
                    blurDataURL: data.blurDataURL,
                    variants: data.variants,
                    featured: false,
                    tags: [],
                    altText: "",
                    caption: ""
                };

                // Save to DB
                await fetch('/api/photos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newPhoto)
                });

                // Update status done
                setUploadQueue(q => q.map(i => i.file === item.file ? { ...i, status: 'done' } : i));

                // Add to list immediately
                setPhotos(prev => [newPhoto, ...prev]);

            } catch (err) {
                console.error(err);
                setUploadQueue(q => q.map(i => i.file === item.file ? { ...i, status: 'error' } : i));
            }
        }

        // Clear done items after delay? Or manual clear.
        setTimeout(() => {
            setUploadQueue(prev => prev.filter(i => i.status !== 'done'));
        }, 3000);
    }

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    }

    const handleBulkAction = async (action: 'delete' | 'publish' | 'draft') => {
        if (!confirm(`Confirm ${action} for ${selectedIds.size} items?`)) return;

        const updatedPhotos = photos.map(p => {
            if (selectedIds.has(p.id)) {
                if (action === 'publish') return { ...p, status: 'published' as const };
                if (action === 'draft') return { ...p, status: 'draft' as const };
            }
            return p;
        });

        if (action === 'delete') {
            // Filter out deleted
            const kept = photos.filter(p => !selectedIds.has(p.id));
            setPhotos(kept);
            await fetch('/api/photos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(kept) // This logic relies on "Save full array" behavior of our generic backend
            });
        } else {
            setPhotos(updatedPhotos);
            // Save individually or bulk? Our DAL saveAll expects array
            await fetch('/api/photos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPhotos)
            });
        }

        setSelectedIds(new Set());
        setIsSelectionMode(false);
    }

    // Filter Logic
    const filteredPhotos = photos.filter(p =>
        p.altText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-200px)]">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search media..."
                            className="pl-9 pr-4 py-2 rounded-lg bg-secondary/30 text-sm border-none focus:ring-1 focus:ring-primary w-64"
                        />
                    </div>
                    <div className="h-6 w-px bg-border mx-2" />
                    <button
                        onClick={() => setIsSelectionMode(!isSelectionMode)}
                        className={cn("text-xs font-bold px-3 py-1.5 rounded transition-colors", isSelectionMode ? "bg-primary/20 text-primary" : "hover:bg-secondary")}
                    >
                        {isSelectionMode ? "Cancel Select" : "Select Multiple"}
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    {selectedIds.size > 0 && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                            <span className="text-xs font-bold mr-2">{selectedIds.size} selected</span>
                            <button onClick={() => handleBulkAction('publish')} className="p-2 hover:bg-green-500/20 text-green-500 rounded" title="Publish"><Check size={16} /></button>
                            <button onClick={() => handleBulkAction('draft')} className="p-2 hover:bg-yellow-500/20 text-yellow-500 rounded" title="Unpublish"><X size={16} /></button>
                            <button onClick={() => handleBulkAction('delete')} className="p-2 hover:bg-red-500/20 text-red-500 rounded" title="Delete"><Trash2 size={16} /></button>
                        </div>
                    )}

                    <label className="cursor-pointer">
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                        <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                            <Upload size={16} /> Upload
                        </div>
                    </label>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Main Grid */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center h-40 text-muted-foreground">Loading library...</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {/* Upload Queue first */}
                            {uploadQueue.map((item, idx) => (
                                <div key={idx} className="aspect-square rounded-xl bg-secondary/50 border border-border flex flex-col items-center justify-center p-4 relative overflow-hidden">
                                    <div className="text-xs font-bold text-center truncate w-full mb-2">{item.file.name}</div>
                                    {item.status === 'uploading' && <Loader2 className="animate-spin text-primary" />}
                                    {item.status === 'error' && <X className="text-red-500" />}
                                    {item.status === 'done' && <Check className="text-green-500" />}
                                    {/* Progress bar could go here */}
                                    <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300" style={{ width: item.status === 'uploading' ? '50%' : item.status === 'done' ? '100%' : '0%' }} />
                                </div>
                            ))}

                            {filteredPhotos.map(photo => (
                                <div
                                    key={photo.id}
                                    onClick={() => {
                                        if (isSelectionMode) toggleSelection(photo.id);
                                        else setEditingPhoto(photo);
                                    }}
                                    className={cn(
                                        "group relative aspect-square rounded-xl overflow-hidden border cursor-pointer transition-all",
                                        selectedIds.has(photo.id) ? "ring-2 ring-primary border-primary" : "border-border hover:border-primary/50",
                                        photo.status === 'draft' ? "opacity-80 grayscale-[0.5]" : ""
                                    )}
                                >
                                    <img
                                        src={photo.variants?.thumbnail || photo.url}
                                        alt={photo.altText}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        loading="lazy"
                                    />

                                    {/* Status Badges */}
                                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                        {photo.status === 'draft' && <span className="text-[10px] font-bold bg-yellow-500 text-black px-1.5 py-0.5 rounded shadow-sm">DRAFT</span>}
                                        {photo.featured && <span className="text-[10px] font-bold bg-purple-500 text-white px-1.5 py-0.5 rounded shadow-sm">★</span>}
                                    </div>

                                    {/* Selection Checkbox (always visible in selection mode, or on hover) */}
                                    {(isSelectionMode || selectedIds.has(photo.id)) && (
                                        <div className="absolute top-2 left-2 w-5 h-5 rounded-full border border-white/50 bg-black/50 flex items-center justify-center">
                                            {selectedIds.has(photo.id) && <div className="w-3 h-3 rounded-full bg-primary" />}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Edit Sidebar */}
                {editingPhoto && (
                    <div className="w-80 bg-card border-l border-border p-6 flex flex-col h-full overflow-y-auto animate-in slide-in-from-right shadow-2xl z-20 absolute right-0 top-0 bottom-0 md:relative md:shadow-none">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold">Details</h3>
                                {editingPhoto.id && (
                                    <button onClick={() => setShowHistory(true)} className="text-muted-foreground hover:text-foreground transition-colors" title="History">
                                        <Clock size={16} />
                                    </button>
                                )}
                            </div>
                            <button onClick={() => setEditingPhoto(null)}><X size={18} /></button>
                        </div>

                        <HistoryModal
                            entityId={editingPhoto.id || ""}
                            isOpen={showHistory}
                            onClose={() => setShowHistory(false)}
                            onRollback={async (snapshot) => {
                                setEditingPhoto(snapshot);
                                await fetch('/api/photos', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(snapshot)
                                });
                                fetchPhotos();
                                alert("Restored version.");
                            }}
                        />

                        <div className="space-y-6 flex-1">
                            <div className="aspect-video rounded-lg bg-secondary overflow-hidden border border-border">
                                <img src={editingPhoto.variants?.medium || editingPhoto.url} className="w-full h-full object-contain" />
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs uppercase font-bold text-muted-foreground">Alt Text</label>
                                    <input
                                        className="w-full p-2 bg-secondary/30 rounded border border-border text-sm"
                                        value={editingPhoto.altText}
                                        onChange={e => setEditingPhoto({ ...editingPhoto, altText: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs uppercase font-bold text-muted-foreground">Caption</label>
                                    <textarea
                                        className="w-full p-2 bg-secondary/30 rounded border border-border text-sm h-20"
                                        value={editingPhoto.caption || ""}
                                        onChange={e => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs uppercase font-bold text-muted-foreground">Tags</label>
                                    <TagInput
                                        tags={editingPhoto.tags}
                                        onTagsChange={tags => setEditingPhoto({ ...editingPhoto, tags })}
                                    />
                                </div>

                                <div className="flex items-center justify-between py-2 border-t border-b border-border">
                                    <label className="text-sm font-medium">Featured</label>
                                    <input
                                        type="checkbox"
                                        checked={editingPhoto.featured}
                                        onChange={e => setEditingPhoto({ ...editingPhoto, featured: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                </div>

                                <div className="flex items-center justify-between py-2 border-b border-border">
                                    <label className="text-sm font-medium">Published</label>
                                    <input
                                        type="checkbox"
                                        checked={editingPhoto.status === 'published'}
                                        onChange={e => setEditingPhoto({ ...editingPhoto, status: e.target.checked ? 'published' : 'draft' })}
                                        className="w-4 h-4"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-6 flex gap-2">
                            <MagneticButton
                                onClick={async () => {
                                    await fetch('/api/photos', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(editingPhoto)
                                    });
                                    // Refresh list (optimistic update needed in real app to avoid jump)
                                    setPhotos(prev => prev.map(p => p.id === editingPhoto.id ? editingPhoto : p));
                                    alert("Saved");
                                }}
                                className="flex-1 py-2 bg-primary text-primary-foreground rounded font-bold text-sm"
                            >
                                Save Changes
                            </MagneticButton>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
