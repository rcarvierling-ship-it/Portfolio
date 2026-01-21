"use client"

import { useState, useEffect, useCallback } from "react"
import { Reorder } from "framer-motion"
import { Image as ImageIcon, Trash2, Edit2, Check, X, Upload, Loader2, Search, Filter, Clock } from "lucide-react"
import { Photo } from "@/lib/types"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { TagInput } from "@/components/ui/tag-input"
import { cn } from "@/lib/utils"
import imageCompression from 'browser-image-compression'
// We'll reuse the existing history/uploader where possible, or reimplement within this scope if needed for "Advanced" features
import { HistoryModal } from "@/components/dashboard/history-modal"
import { AiButton } from "@/components/dashboard/ai-button"

interface MediaLibraryProps {
    mode?: 'manage' | 'select';
    onSelect?: (photo: Photo) => void;
}

export function MediaLibrary({ mode = 'manage', onSelect }: MediaLibraryProps) {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    // Editor State
    const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
    const [showHistory, setShowHistory] = useState(false);


    // Upload State
    const [uploadQueue, setUploadQueue] = useState<{ file: File, status: 'pending' | 'uploading' | 'done' | 'error', error?: string }[]>([]);

    // AI & Related
    const [analyzing, setAnalyzing] = useState(false);
    const [relatedPhotos, setRelatedPhotos] = useState<Photo[]>([]);

    useEffect(() => {
        if (editingPhoto?.id) {
            // Fetch related
            fetch(`/api/photos/${editingPhoto.id}/related`)
                .then(res => res.json())
                .then(data => setRelatedPhotos(data.related || []))
                .catch(err => console.error("Failed to fetch related", err));
        } else {
            setRelatedPhotos([]);
        }
    }, [editingPhoto?.id]);

    const handleAnalyze = async () => {
        if (!editingPhoto) return;
        setAnalyzing(true);
        try {
            const res = await fetch('/api/ai/analyze-image', {
                method: 'POST',
                body: JSON.stringify({ imageUrl: editingPhoto.url })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setEditingPhoto(prev => prev ? ({
                ...prev,
                caption: data.caption,
                tags: [...new Set([...prev.tags, ...data.tags])],
                mood: data.mood,
                colors: data.colors
            }) : null);
        } catch (error) {
            alert('Analysis failed: ' + error);
        } finally {
            setAnalyzing(false);
        }
    };

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
                // Compress image before upload
                let fileToUpload = item.file;
                try {
                    const options = {
                        maxSizeMB: 1,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true
                    };
                    const compressedBlob = await imageCompression(item.file, options);
                    fileToUpload = new File([compressedBlob], item.file.name, { type: item.file.type });
                    console.log(`Compressed ${item.file.size / 1024 / 1024}MB -> ${fileToUpload.size / 1024 / 1024}MB`);
                } catch (compressionError) {
                    console.warn("Compression failed, using original:", compressionError);
                }

                const formData = new FormData();
                formData.append('file', fileToUpload);

                const res = await fetch('/api/upload', { method: 'POST', body: formData });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
                    throw new Error(errorData.error || `Upload failed with status ${res.status}`);
                }

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

            } catch (err: any) {
                console.error("Upload error:", err);
                const errorMessage = err.message || "Upload failed";
                setUploadQueue(q => q.map(i => i.file === item.file ? { ...i, status: 'error', error: errorMessage } : i));
                alert(`Failed to upload ${item.file.name}: ${errorMessage}`);
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

            // Call DELETE endpoint
            await fetch('/api/photos', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: Array.from(selectedIds) })
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
        <div className="flex flex-col gap-6 h-[calc(100vh-240px)] min-h-[500px]">
            {/* Toolbar */}
            {mode === 'manage' && (
                <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
                    {/* ... (Search and Upload controls) ... */}
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
            )}
            {mode === 'select' && (
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
                    </div>
                </div>
            )}

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
                                    {item.status === 'error' && (
                                        <>
                                            <X className="text-red-500" />
                                            {item.error && <div className="text-[10px] text-red-500 text-center mt-1">{item.error}</div>}
                                        </>
                                    )}
                                    {item.status === 'done' && <Check className="text-green-500" />}
                                    {/* Progress bar could go here */}
                                    <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300" style={{ width: item.status === 'uploading' ? '50%' : item.status === 'done' ? '100%' : '0%' }} />
                                </div>
                            ))}

                            {filteredPhotos.map(photo => (
                                <div
                                    key={photo.id}
                                    onClick={() => {
                                        if (mode === 'select' && onSelect) {
                                            onSelect(photo);
                                            return;
                                        }
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
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
                        {/* Modal Container */}
                        <div className="w-full h-full max-w-7xl bg-card rounded-2xl border border-border shadow-2xl flex flex-col md:flex-row overflow-hidden relative">

                            {/* Close Button (Absolute Top Right of Modal) */}
                            <button
                                onClick={() => setEditingPhoto(null)}
                                className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors md:hidden"
                            >
                                <X size={20} />
                            </button>

                            {/* LEFT: Image Preview (Large) */}
                            <div className="flex-1 bg-black/90 flex items-center justify-center p-4 md:p-12 relative overflow-hidden group">
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <img
                                        src={editingPhoto.variants?.original || editingPhoto.url}
                                        alt={editingPhoto.altText}
                                        className="max-w-full max-h-full object-contain shadow-2xl"
                                    />
                                </div>

                                {/* Image Info Overlay */}
                                <div className="absolute bottom-4 left-4 text-white/50 text-xs font-mono">
                                    {editingPhoto.width}x{editingPhoto.height}
                                </div>
                            </div>

                            {/* RIGHT: Options Panel (Fixed Width) */}
                            <div className="w-full md:w-[400px] bg-card border-t md:border-t-0 md:border-l border-border flex flex-col h-[50%] md:h-full">

                                {/* Header */}
                                <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg">Edit Photo</h3>
                                        {editingPhoto.id && (
                                            <button onClick={() => setShowHistory(true)} className="text-muted-foreground hover:text-foreground transition-colors p-1" title="History">
                                                <Clock size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <button onClick={() => setEditingPhoto(null)} className="hidden md:block p-2 hover:bg-secondary rounded-full transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Scrollable Form Content */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
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

                                    <div className="bg-secondary/10 rounded-xl p-4 border border-border">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-xs font-bold uppercase text-muted-foreground">AI Intelligence</h4>
                                            <AiButton onClick={handleAnalyze} loading={analyzing} label="Analyze" className="h-7 text-xs px-2" />
                                        </div>

                                        {/* Colors */}
                                        {editingPhoto.colors && editingPhoto.colors.length > 0 && (
                                            <div className="flex items-center gap-2 mb-3">
                                                {editingPhoto.colors.map((color, i) => (
                                                    <div key={i} className="w-6 h-6 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: color }} title={color} />
                                                ))}
                                                {editingPhoto.mood && (
                                                    <span className="ml-auto text-[10px] uppercase font-bold bg-primary/20 text-primary px-2 py-1 rounded-full">
                                                        {editingPhoto.mood}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Related */}
                                        {relatedPhotos.length > 0 && (
                                            <div className="space-y-2 mt-4 pt-4 border-t border-border/50">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Visually Similar</label>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {relatedPhotos.map(p => (
                                                        <div key={p.id} className="aspect-square rounded-md overflow-hidden bg-black/20 cursor-pointer hover:ring-2 hover:ring-primary transition-all" onClick={() => setEditingPhoto(p)}>
                                                            <img src={p.variants?.thumbnail || p.url} className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Quick Actions (Featured/Published) */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-secondary/20 border border-border space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-bold text-muted-foreground">Featured</label>
                                                <input
                                                    type="checkbox"
                                                    checked={editingPhoto.featured}
                                                    onChange={e => setEditingPhoto({ ...editingPhoto, featured: e.target.checked })}
                                                    className="w-5 h-5 accent-primary cursor-pointer"
                                                />
                                            </div>
                                            <p className="text-[10px] text-muted-foreground">Highlight this photo in galleries.</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-secondary/20 border border-border space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-bold text-muted-foreground">Status</label>
                                                <input
                                                    type="checkbox"
                                                    checked={editingPhoto.status === 'published'}
                                                    onChange={e => setEditingPhoto({ ...editingPhoto, status: e.target.checked ? 'published' : 'draft' })}
                                                    className="w-5 h-5 accent-primary cursor-pointer"
                                                />
                                            </div>
                                            <p className="text-[10px] text-muted-foreground">
                                                Currently: <span className={cn("font-bold", editingPhoto.status === 'published' ? "text-green-500" : "text-yellow-500")}>
                                                    {editingPhoto.status === 'published' ? 'LIVE' : 'DRAFT'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Alt Text (SEO)</label>
                                        <input
                                            className="w-full p-3 bg-secondary/30 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                            value={editingPhoto.altText}
                                            onChange={e => setEditingPhoto({ ...editingPhoto, altText: e.target.value })}
                                            placeholder="Describe the image for accessibility..."
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Caption</label>
                                        <textarea
                                            className="w-full p-3 bg-secondary/30 rounded-lg border border-border text-sm h-32 focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                                            value={editingPhoto.caption || ""}
                                            onChange={e => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                                            placeholder="Add a caption like 'Shot on Sony A7III...'"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Tags</label>
                                        <TagInput
                                            tags={editingPhoto.tags}
                                            onTagsChange={tags => setEditingPhoto({ ...editingPhoto, tags })}
                                        />
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-6 border-t border-border bg-muted/20 shrink-0">
                                    <MagneticButton
                                        onClick={async () => {
                                            await fetch('/api/photos', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify(editingPhoto)
                                            });
                                            // Refresh list
                                            setPhotos(prev => prev.map(p => p.id === editingPhoto.id ? editingPhoto : p));
                                            setEditingPhoto(null); // Close on save?
                                        }}
                                        className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                                    >
                                        Save Changes
                                    </MagneticButton>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
