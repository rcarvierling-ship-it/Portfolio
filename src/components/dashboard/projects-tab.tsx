"use client"

import { useState, useEffect } from "react"
import { Reorder } from "framer-motion"
import { GripVertical, Plus, Edit2, ExternalLink, Clock, Check } from "lucide-react"
import { Project } from "@/lib/types"
import { HistoryModal } from "@/components/dashboard/history-modal"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { ImageUploader } from "@/components/ui/image-uploader"
import { TagInput } from "@/components/ui/tag-input"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/toast-context"
import { PulseIndicator, Shake, SuccessCheckmark } from "@/components/ui/motion-feedback"

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

    if (loading) return <div>Loading...</div>;

    if (editingProject) {
        return (
            <div className="flex flex-col gap-6">
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
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Description</label>
                            <textarea
                                value={editingProject.description || ""}
                                onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                                className="w-full p-2 rounded bg-secondary/30 border border-border h-32"
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
                                checked={editingProject.featured || false} // Ensure it's always a boolean
                                onChange={e => setEditingProject({ ...editingProject, featured: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                        </div>
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
                                    {p.coverImage && <img src={p.coverImage} className="w-full h-full object-cover" />}
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
