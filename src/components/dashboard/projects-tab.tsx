"use client"

import { useState, useEffect } from "react"
import { Reorder } from "framer-motion"
import { GripVertical, Plus, Edit2, ExternalLink, Clock, Check, X, ImageIcon } from "lucide-react"
import { Project, GalleryItem } from "@/lib/types"
import { HistoryModal } from "@/components/dashboard/history-modal"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { ImageUploader } from "@/components/ui/image-uploader"
import { TagInput } from "@/components/ui/tag-input"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/toast-context"
import { PulseIndicator, Shake, SuccessCheckmark } from "@/components/ui/motion-feedback"
import { AiButton } from "@/components/dashboard/ai-button"

export function ProjectsTab() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = () => {
        fetch('/api/projects').then(res => res.json()).then(data => {
            setProjects(data);
            setLoading(false);

            // Deep linking check
            const params = new URLSearchParams(window.location.search);
            const editId = params.get('editId');
            if (editId) {
                const target = data.find((p: Project) => p.id === editId);
                if (target) setEditingProject(target);
            }
        });
    }

    const handleReorder = async (newOrder: Project[]) => {
        setProjects(newOrder);
        // Persist order
        await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder)
        });
    }

    // handleCreateNew moved up to be near state

    const { addToast } = useToast();
    const [shake, setShake] = useState(false);

    const handleSave = async () => {
        if (!editingProject?.title) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            addToast("Title is required", "error");
            return;
        }

        // Auto-slug if missing
        if (!editingProject.slug) {
            editingProject.slug = editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }

        const projectToSave = {
            ...editingProject,
            id: editingProject.id || Date.now().toString(),
            updatedAt: new Date().toISOString()
        } as Project;

        if (!projectToSave.createdAt) projectToSave.createdAt = new Date().toISOString();

        try {
            await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectToSave)
            });
            fetchProjects();
            // Don't close editor, just update state to clean
            setEditingProject(projectToSave);
            setInitialProjectState(projectToSave);
            setLastSaved(new Date());
            addToast("Project saved successfully", "success");
        } catch (e) {
            addToast("Failed to save project", "error");
        }
    }

    const [initialProjectState, setInitialProjectState] = useState<Partial<Project> | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const isDirty = JSON.stringify(editingProject) !== JSON.stringify(initialProjectState);

    const handleEdit = (project: Project) => {
        setEditingProject({ ...project });
        setInitialProjectState({ ...project });
        setLastSaved(null);
    }

    // Also update handleCreateNew to set initial state
    const handleCreateNew = () => {
        const newProj = {
            title: "",
            slug: "",
            year: new Date().getFullYear().toString(),
            status: 'draft' as const,
            galleryImages: [],
            tags: [],
            tools: []
        };
        setEditingProject(newProj);
        setInitialProjectState(newProj);
        setLastSaved(null);
    }

    // AI HANDLERS
    const [analyzingImageId, setAnalyzingImageId] = useState<string | null>(null);
    const [generatingDescription, setGeneratingDescription] = useState(false);

    const handleAnalyzeImage = async (imageId: string, imageUrl: string) => {
        setAnalyzingImageId(imageId);
        try {
            const res = await fetch('/api/ai/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl })
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            // Update gallery item caption
            const newGallery = editingProject?.galleryImages?.map(img =>
                img.id === imageId ? { ...img, caption: data.caption } : img
            );

            // If tags returned and we don't have many, suggest them via toast or append?
            // For now let's just toast the success
            addToast("Image analyzed successfully", "success");

            setEditingProject(prev => ({ ...prev, galleryImages: newGallery }));

        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Failed to analyze image";
            addToast(message, "error");
        } finally {
            setAnalyzingImageId(null);
        }
    }

    const handleGenerateDescription = async () => {
        if (!editingProject?.title) {
            addToast("Please enter a title first", "error");
            return;
        }

        setGeneratingDescription(true);
        try {
            const res = await fetch('/api/ai/generate-description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editingProject.title,
                    tags: editingProject.tags || [],
                    imageCaptions: editingProject.galleryImages?.map(i => i.caption).filter(Boolean) || [],
                    currentDescription: editingProject.description
                })
            });

            if (!res.ok) throw new Error(res.statusText);

            // Stream the response
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error("No reader available");

            let newDescription = "";
            setEditingProject(prev => ({ ...prev, description: "" })); // Clear current to stream new

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                newDescription += chunk;

                setEditingProject(prev => ({ ...prev, description: (prev?.description || "") + chunk }));
            }

            addToast("Description generated", "success");

        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Failed to generate description";
            addToast(message, "error");
        } finally {
            setGeneratingDescription(false);
        }
    }

    if (loading) return <div>Loading...</div>;

    if (editingProject) {
        return (
            <div className="flex flex-col gap-6">
                {/* ... header ... */}
                <div className="flex items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b border-border">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xl font-bold">{editingProject.id ? 'Edit Project' : 'New Project'}</h3>
                        {isDirty && (
                            <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                                <PulseIndicator active />
                                <span className="text-xs font-bold">Unsaved Changes</span>
                            </div>
                        )}
                        {lastSaved && !isDirty && (
                            <span className="text-xs font-medium text-green-500 flex items-center gap-1">
                                <SuccessCheckmark size={16} /> Saved {lastSaved.toLocaleTimeString()}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-4 items-center">
                        {editingProject.id && (
                            <button onClick={() => setShowHistory(true)} className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground">
                                <Clock size={14} /> History
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (isDirty && !confirm("Discard unsaved changes?")) return;
                                setEditingProject(null);
                            }}
                            className="text-sm underline hover:text-primary transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                <HistoryModal
                    entityId={editingProject.id || ""}
                    isOpen={showHistory}
                    onClose={() => setShowHistory(false)}
                    onRollback={async (snapshot) => {
                        setEditingProject(snapshot);
                        await fetch('/api/projects', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(snapshot)
                        });
                        fetchProjects();
                        addToast("Version restored successfully", "success");
                    }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Shake trigger={shake} className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Title</label>
                            <input
                                value={editingProject.title}
                                onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                                className={cn("w-full p-2 rounded bg-secondary/30 border", shake ? "border-red-500" : "border-border")}
                                placeholder="Project Name..."
                            />
                        </Shake>
                        <div className="grid grid-cols-2 gap-4">
                            {/* ... year/status ... */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Year</label>
                                <input
                                    value={editingProject.year}
                                    onChange={e => setEditingProject({ ...editingProject, year: e.target.value })}
                                    className="w-full p-2 rounded bg-secondary/30 border border-border"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Status</label>
                                <select
                                    value={editingProject.status || 'draft'}
                                    onChange={e => setEditingProject({ ...editingProject, status: e.target.value as any })}
                                    className="w-full p-2 rounded bg-secondary/30 border border-border"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2 relative">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Description</label>
                                <AiButton
                                    label="Generate Story"
                                    onClick={handleGenerateDescription}
                                    loading={generatingDescription}
                                />
                            </div>
                            <textarea
                                value={editingProject.description || ""}
                                onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                                className="w-full p-2 rounded bg-secondary/30 border border-border h-32"
                                placeholder="Write a description or use AI..."
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Cover Image</label>
                            <ImageUploader
                                value={editingProject.coverImage || ""}
                                onChange={(url) => setEditingProject({ ...editingProject, coverImage: url as string })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Tags</label>
                            <TagInput
                                tags={editingProject.tags || []}
                                onTagsChange={(newTags) => setEditingProject({ ...editingProject, tags: newTags })}
                            />
                        </div>

                        <div className="p-4 rounded border border-border bg-secondary/10 flex items-center justify-between">
                            <label className="text-sm font-medium">Featured Project?</label>
                            <input
                                type="checkbox"
                                checked={editingProject.featured || false}
                                onChange={e => setEditingProject({ ...editingProject, featured: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold">Project Gallery</h4>
                        <span className="text-xs text-muted-foreground">Drag to reorder • AI Auto-Caption available</span>
                    </div>

                    <Reorder.Group axis="y" values={editingProject.galleryImages || []} onReorder={(newOrder) => setEditingProject({ ...editingProject, galleryImages: newOrder })} className="space-y-3">
                        {editingProject.galleryImages?.map((item) => (
                            <Reorder.Item key={item.id} value={item} className="flex gap-4 p-3 bg-card border border-border rounded-lg items-start relative group">
                                <div className="text-muted-foreground pt-8 cursor-grab active:cursor-grabbing"><GripVertical size={20} /></div>
                                <div className="w-24 h-24 bg-secondary rounded overflow-hidden flex-shrink-0 relative">
                                    <img src={item.url} alt={item.caption || "Gallery image"} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-semibold uppercase text-muted-foreground">Caption</label>
                                        <AiButton
                                            iconOnly
                                            loading={analyzingImageId === item.id}
                                            onClick={() => handleAnalyzeImage(item.id, item.url)}
                                            title="Auto-caption with AI"
                                        />
                                    </div>
                                    <textarea
                                        value={item.caption || ""}
                                        onChange={(e) => {
                                            const newGallery = editingProject.galleryImages?.map(i => i.id === item.id ? { ...i, caption: e.target.value } : i);
                                            setEditingProject({ ...editingProject, galleryImages: newGallery });
                                        }}
                                        className="w-full p-2 text-sm rounded bg-secondary/30 border border-border h-20 resize-none"
                                        placeholder="Image caption..."
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        const newGallery = editingProject.galleryImages?.filter(i => i.id !== item.id);
                                        setEditingProject({ ...editingProject, galleryImages: newGallery });
                                    }}
                                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>

                    <div className="bg-secondary/20 p-4 rounded-xl border border-dashed border-border">
                        <p className="text-sm font-bold mb-4 flex items-center gap-2"><ImageIcon size={16} /> Add Images</p>
                        <ImageUploader
                            value={[]}
                            onChange={(urls) => {
                                if (Array.isArray(urls)) {
                                    const newItems: GalleryItem[] = urls.map(url => ({
                                        id: Math.random().toString(36).substring(2, 9),
                                        url
                                    }));
                                    setEditingProject({
                                        ...editingProject,
                                        galleryImages: [...(editingProject.galleryImages || []), ...newItems]
                                    });
                                }
                            }}
                            multiple
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <a
                        href={`/work/${editingProject.slug}?preview=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 bg-secondary text-secondary-foreground rounded-lg font-bold hover:bg-secondary/80"
                    >
                        Preview Draft <ExternalLink size={16} />
                    </a>
                    <MagneticButton onClick={handleSave} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold">
                        Save Project
                    </MagneticButton>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">All Projects</h3>
                <MagneticButton onClick={handleCreateNew} className="px-4 py-2 bg-primary text-primary-foreground rounded-full flex items-center gap-2">
                    <Plus size={16} /> New Project
                </MagneticButton>
            </div>

            <Reorder.Group axis="y" values={projects} onReorder={handleReorder} className="space-y-4">
                {projects.map(p => (
                    <Reorder.Item key={p.id} value={p}>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border cursor-grab active:cursor-grabbing gap-4">
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                                <div className="text-muted-foreground flex-shrink-0"><GripVertical size={20} /></div>
                                <div className="w-12 h-12 bg-secondary rounded overflow-hidden flex-shrink-0">
                                    {p.coverImage && <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-bold truncate">{p.title}</h4>
                                        <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded flex-shrink-0", p.status === 'published' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500')}>
                                            {p.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">{p.year} • {p.slug}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <a href={`/work/${p.slug}`} target="_blank" className="p-2 hover:bg-secondary rounded"><ExternalLink size={16} /></a>
                                <button onClick={() => handleEdit(p)} className="p-2 hover:bg-secondary rounded"><Edit2 size={16} /></button>
                            </div>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </div>
    )
}
