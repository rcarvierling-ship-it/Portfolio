"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { Lock, BarChart3, Image as ImageIcon, Plus, Users, Globe, ArrowUp, Settings, Layout, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { ImageUploader } from "@/components/ui/image-uploader"

// Analytics removed - connect real provider
const ANALYTICS_DATA: any[] = []; // Empty for now

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react"

export default function DashboardWrapper() {
    return (
        <SessionProvider>
            <DashboardPage />
        </SessionProvider>
    )
}

function DashboardPage() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState<"analytics" | "projects" | "profile" | "settings">("analytics");

    // Redirect to login if unauthenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            signIn();
        }
    }, [status]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-t-2 border-primary animate-spin" />
                    <p className="text-muted-foreground">Verifying access...</p>
                </div>
            </div>
        )
    }

    if (!session) return null; // Will redirect

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Command Center</h1>
                    <p className="text-muted-foreground">Welcome back, {session.user?.name || "Admin"}.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2 bg-secondary/50 p-1 rounded-full overflow-x-auto max-w-full">
                        <button
                            onClick={() => setActiveTab("analytics")}
                            className={cn("px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap", activeTab === "analytics" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                        >
                            Analytics
                        </button>
                        <button
                            onClick={() => setActiveTab("projects")}
                            className={cn("px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap", activeTab === "projects" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                        >
                            Projects
                        </button>
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={cn("px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap", activeTab === "profile" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={cn("px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap", activeTab === "settings" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                        >
                            Settings
                        </button>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="text-xs text-muted-foreground hover:text-red-500 underline"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            {activeTab === "analytics" && <AnalyticsView />}
            {activeTab === "projects" && <ContentView />}
            {activeTab === "profile" && <ProfileView />}
            {activeTab === "settings" && <GlobalEditor />}
        </div>
    )
}

function AnalyticsView() {
    const [data, setData] = useState<{ totalViews: number, chartData: any[] } | null>(null);

    useEffect(() => {
        fetch('/api/analytics')
            .then(res => res.json())
            .then(setData)
            .catch(err => console.error("Failed to fetch analytics", err));
    }, []);

    if (!data) return <div className="p-8 text-center text-muted-foreground">Loading analytics...</div>;

    return (
        <div className="flex flex-col gap-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-border bg-card flex items-start justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Views</p>
                        <h3 className="text-3xl font-bold">{data.totalViews}</h3>
                        <div className="flex items-center gap-1 text-green-500 text-xs mt-2 font-medium">
                            <ArrowUp size={12} /> Live
                        </div>
                    </div>
                    <div className="p-3 rounded-full bg-secondary/50 text-foreground">
                        <Globe size={20} />
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="p-8 rounded-xl border border-border bg-card">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold">Traffic Overview (Real-Time)</h3>
                </div>

                <div className="h-64 w-full flex items-end justify-start gap-4 overflow-x-auto">
                    {data.chartData.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">No traffic recorded yet. Go view some pages!</div>
                    ) : (
                        data.chartData.map((d: any, idx: number) => (
                            <div key={idx} className="flex flex-col items-center gap-2 group min-w-[40px]">
                                <div className="w-12 relative h-48 flex items-end bg-secondary/20 rounded-t-sm">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.min((d.views / (data.totalViews || 1)) * 100 * 3, 100)}%` }} // Simple scaling
                                        transition={{ delay: idx * 0.1, duration: 1, type: "spring" }}
                                        className="w-full bg-primary/80 rounded-t-sm group-hover:bg-primary transition-colors relative"
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {d.views}
                                        </div>
                                    </motion.div>
                                </div>
                                <span className="text-xs text-muted-foreground font-mono">{d.day}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

import { Project } from "@/lib/types";

function ContentView() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const [newProject, setNewProject] = useState<Partial<Project>>({
        title: "",
        year: new Date().getFullYear().toString(),
        location: "",
        description: "",
        tags: [],
        camera: "",
        lens: "",
        coverImage: "/images/placeholder.jpg",
        galleryImages: [],
        featured: false
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = () => {
        fetch('/api/projects').then(res => res.json()).then(data => { setProjects(data); setLoading(false); });
    }

    const handleCreate = async () => {
        if (!newProject.title) return alert("Title is required");

        // Auto-generate slug
        const slug = newProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const projectToSave = {
            ...newProject,
            slug,
            id: Date.now().toString(), // Simple ID
            galleryImages: [] // For now empty
        };

        try {
            await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectToSave)
            });
            alert("Collection Created!");
            fetchProjects(); // Refresh list
            setNewProject({ ...newProject, title: "", description: "" }); // Reset basics
        } catch (e) {
            alert("Failed to create.");
        }
    };

    const handleDelete = async (index: number) => {
        const confirm = window.confirm("Are you sure you want to delete this collection?");
        if (!confirm) return;

        const newProjects = [...projects];
        newProjects.splice(index, 1);

        await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProjects) // Sending full array updates it
        });
        setProjects(newProjects);
    }

    if (loading) return <div>Loading content...</div>;

    return (
        <div className="flex flex-col gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Add Project Form */}
                <div className="p-6 rounded-xl border border-border bg-card h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-full bg-secondary/50"><ImageIcon size={20} /></div>
                        <h3 className="text-lg font-bold">New Collection</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Title</label>
                                <input
                                    value={newProject.title}
                                    onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                                    type="text" className="w-full p-2 rounded-md bg-secondary/30 border border-border text-sm" placeholder="e.g. Alpine Echoes"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Year</label>
                                <input
                                    value={newProject.year}
                                    onChange={e => setNewProject({ ...newProject, year: e.target.value })}
                                    type="text" className="w-full p-2 rounded-md bg-secondary/30 border border-border text-sm" placeholder="2025"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Location</label>
                                <input
                                    value={newProject.location}
                                    onChange={e => setNewProject({ ...newProject, location: e.target.value })}
                                    type="text" className="w-full p-2 rounded-md bg-secondary/30 border border-border text-sm" placeholder="Tokyo, Japan"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Camera</label>
                                <input
                                    value={newProject.camera}
                                    onChange={e => setNewProject({ ...newProject, camera: e.target.value })}
                                    type="text" className="w-full p-2 rounded-md bg-secondary/30 border border-border text-sm" placeholder="Sony A7RV"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Description</label>
                            <textarea
                                value={newProject.description}
                                onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                                className="w-full p-2 rounded-md bg-secondary/30 border border-border text-sm resize-none h-24" placeholder="Story behind the shoot..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Cover Image</label>
                            <ImageUploader
                                value={newProject.coverImage || ""}
                                onChange={(url) => setNewProject({ ...newProject, coverImage: url as string })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Gallery Images</label>
                            <ImageUploader
                                value={newProject.galleryImages || []}
                                onChange={(urls) => setNewProject({ ...newProject, galleryImages: urls as string[] })}
                                multiple
                            />
                        </div>

                        <MagneticButton
                            onClick={handleCreate}
                            className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium mt-2">
                            Create Collection (+ Page)
                        </MagneticButton>
                    </div>
                </div>

                {/* Existing Projects List */}
                <div className="flex flex-col gap-6">
                    <div className="p-6 rounded-xl border border-border bg-card">
                        <h3 className="text-lg font-bold mb-4">Existing Collections ({projects.length})</h3>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {projects.length === 0 ? <p className="text-muted-foreground text-sm">No collections found.</p> :
                                projects.map((p, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-secondary rounded overflow-hidden relative">
                                                {/* Placeholder for img */}
                                                <div className="absolute inset-0 bg-zinc-800" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm">{p.title}</h4>
                                                <p className="text-xs text-muted-foreground">{p.year} • {p.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a href={`/work/${p.slug}`} target="_blank" className="text-xs text-muted-foreground hover:text-primary font-medium px-3 py-1 bg-secondary rounded flex items-center gap-1">
                                                <ExternalLink size={12} /> View
                                            </a>
                                            <button onClick={() => handleDelete(idx)} className="text-xs text-red-500 hover:text-red-400 font-medium px-3 py-1 bg-red-500/10 rounded">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


import { AboutData, Gear, TimelineItem } from "@/lib/types"

function ProfileView() {
    const [viewMode, setViewMode] = useState<"profile" | "gear" | "timeline">("profile");

    if (viewMode === "gear") return <GearEditor onBack={() => setViewMode("profile")} />;
    if (viewMode === "timeline") return <TimelineEditor onBack={() => setViewMode("profile")} />;

    // Default Profile Editor
    return <ProfileEditor onManageGear={() => setViewMode("gear")} onManageTimeline={() => setViewMode("timeline")} />;
}

function ProfileEditor({ onManageGear, onManageTimeline }: { onManageGear: () => void, onManageTimeline: () => void }) {
    const [formData, setFormData] = useState<AboutData>({ headline: "", bio: [], portrait: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/about')
            .then(res => res.json())
            .then(data => {
                setFormData(data);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch('/api/about', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            alert("Saved successfully!");
        } catch (e) {
            alert("Failed to save.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-8">
            <div className="p-6 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-full bg-secondary/50"><Users size={20} /></div>
                    <h3 className="text-lg font-bold">About Me</h3>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Headline</label>
                        <input
                            type="text"
                            value={formData.headline}
                            onChange={e => setFormData({ ...formData, headline: e.target.value })}
                            className="w-full p-2 rounded-md bg-secondary/30 border border-border text-sm"
                            placeholder="Behind the lens."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Bio (Line separated paragraphs)</label>
                        <textarea
                            value={formData.bio.join('\n\n')}
                            onChange={e => setFormData({ ...formData, bio: e.target.value.split('\n\n') })}
                            className="w-full p-2 rounded-md bg-secondary/30 border border-border text-sm resize-none h-32"
                            placeholder="One paragraph per block..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Portrait Image</label>
                        <ImageUploader
                            value={formData.portrait}
                            onChange={(url) => setFormData({ ...formData, portrait: url as string })}
                        />
                    </div>

                    <MagneticButton
                        onClick={handleSave}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium mt-2"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </MagneticButton>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h3 className="text-lg font-bold mb-4">Gear Locker</h3>
                    <p className="text-sm text-muted-foreground mb-4">Manage camera bodies, lenses, and accessories.</p>
                    <MagneticButton onClick={onManageGear} className="w-full py-3 border border-border rounded-lg text-sm font-medium hover:bg-secondary">
                        Manage Gear
                    </MagneticButton>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h3 className="text-lg font-bold mb-4">Timeline</h3>
                    <p className="text-sm text-muted-foreground mb-4">Update exhibitions, awards, and career milestones.</p>
                    <MagneticButton onClick={onManageTimeline} className="w-full py-3 border border-border rounded-lg text-sm font-medium hover:bg-secondary">
                        Manage Timeline
                    </MagneticButton>
                </div>
            </div>
        </div>
    )
}

function GearEditor({ onBack }: { onBack: () => void }) {
    const [gear, setGear] = useState<Gear[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/gear').then(res => res.json()).then(data => { setGear(data); setLoading(false); });
    }, []);

    const handleSave = async () => {
        await fetch('/api/gear', { method: 'POST', body: JSON.stringify(gear) });
        alert("Gear saved!");
    };

    const updateCategory = (idx: number, key: string, val: any) => {
        const newGear = [...gear];
        // @ts-ignore
        newGear[idx][key] = val;
        setGear(newGear);
    }

    const addItem = (catIdx: number) => {
        const newGear = [...gear];
        newGear[catIdx].items.push("New Item");
        setGear(newGear);
    }

    const removeItem = (catIdx: number, itemIdx: number) => {
        const newGear = [...gear];
        newGear[catIdx].items.splice(itemIdx, 1);
        setGear(newGear);
    }

    const updateItem = (catIdx: number, itemIdx: number, val: string) => {
        const newGear = [...gear];
        newGear[catIdx].items[itemIdx] = val;
        setGear(newGear);
    }

    const addCategory = () => {
        setGear([...gear, { category: "New Category", items: [] }]);
    }

    const removeCategory = (idx: number) => {
        const newGear = [...gear];
        newGear.splice(idx, 1);
        setGear(newGear);
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="text-sm underline">← Back to Profile</button>
                <h3 className="text-xl font-bold">Edit Gear</h3>
            </div>

            {gear.map((cat, catIdx) => (
                <div key={catIdx} className="p-4 border border-border rounded-lg bg-card relative">
                    <button onClick={() => removeCategory(catIdx)} className="absolute top-4 right-4 text-xs text-red-500">Remove Category</button>
                    <div className="mb-4">
                        <label className="text-xs uppercase font-semibold text-muted-foreground">Category Name</label>
                        <input
                            value={cat.category}
                            onChange={(e) => updateCategory(catIdx, 'category', e.target.value)}
                            className="w-full bg-secondary/30 border border-border p-2 rounded text-lg font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        {cat.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex gap-2">
                                <input
                                    value={item}
                                    onChange={(e) => updateItem(catIdx, itemIdx, e.target.value)}
                                    className="flex-1 bg-background border border-border p-2 rounded text-sm"
                                />
                                <button onClick={() => removeItem(catIdx, itemIdx)} className="text-muted-foreground hover:text-red-500">✕</button>
                            </div>
                        ))}
                        <button onClick={() => addItem(catIdx)} className="text-xs text-primary mt-2">+ Add Item</button>
                    </div>
                </div>
            ))}
            <button onClick={addCategory} className="w-full py-3 border border-dashed border-border rounded hover:bg-secondary/50">+ Add Category</button>
            <MagneticButton onClick={handleSave} className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold">Save Gear Changes</MagneticButton>
        </div>
    )
}

function TimelineEditor({ onBack }: { onBack: () => void }) {
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/timeline').then(res => res.json()).then(data => { setTimeline(data); setLoading(false); });
    }, []);

    const handleSave = async () => {
        await fetch('/api/timeline', { method: 'POST', body: JSON.stringify(timeline) });
        alert("Timeline saved!");
    };

    const updateItem = (idx: number, field: string, val: string) => {
        const newTimeline = [...timeline];
        // @ts-ignore
        newTimeline[idx][field] = val;
        setTimeline(newTimeline);
    }

    const addItem = () => {
        setTimeline([{ year: "2025", title: "New Event", location: "Location", description: "Description" }, ...timeline]);
    }

    const removeItem = (idx: number) => {
        const newTimeline = [...timeline];
        newTimeline.splice(idx, 1);
        setTimeline(newTimeline);
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="text-sm underline">← Back to Profile</button>
                <h3 className="text-xl font-bold">Edit Timeline</h3>
            </div>

            <button onClick={addItem} className="w-full py-3 border border-dashed border-border rounded hover:bg-secondary/50">+ Add New Event</button>

            {timeline.map((item, idx) => (
                <div key={idx} className="p-4 border border-border rounded-lg bg-card relative space-y-3">
                    <button onClick={() => removeItem(idx)} className="absolute top-4 right-4 text-xs text-red-500">Remove</button>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className="text-xs uppercase font-semibold text-muted-foreground">Year</label>
                            <input value={item.year} onChange={e => updateItem(idx, 'year', e.target.value)} className="w-full bg-secondary/30 border border-border p-2 rounded" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs uppercase font-semibold text-muted-foreground">Title</label>
                            <input value={item.title} onChange={e => updateItem(idx, 'title', e.target.value)} className="w-full bg-secondary/30 border border-border p-2 rounded" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs uppercase font-semibold text-muted-foreground">Location</label>
                        <input value={item.location} onChange={e => updateItem(idx, 'location', e.target.value)} className="w-full bg-secondary/30 border border-border p-2 rounded" />
                    </div>
                    <div>
                        <label className="text-xs uppercase font-semibold text-muted-foreground">Description</label>
                        <textarea value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} className="w-full bg-secondary/30 border border-border p-2 rounded h-20 resize-none" />
                    </div>
                </div>
            ))}
            <MagneticButton onClick={handleSave} className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold">Save Timeline Changes</MagneticButton>
        </div>
    )
}

function GlobalEditor() {
    const [data, setData] = useState({
        heroTitle: "",
        heroDescription: "",
        footerText: "",
        email: "",
        instagram: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/global').then(res => res.json()).then(d => { setData(d); setLoading(false); });
    }, []);

    const handleSave = async () => {
        await fetch('/api/global', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        alert("Site Settings Saved!");
    }

    if (loading) return <div>Loading settings...</div>;

    return (
        <div className="flex flex-col gap-8 max-w-2xl">
            <div className="p-6 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-full bg-secondary/50"><Settings size={20} /></div>
                    <h3 className="text-lg font-bold">Global Site Settings</h3>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Hero Title</label>
                        <input
                            value={data.heroTitle}
                            onChange={e => setData({ ...data, heroTitle: e.target.value })}
                            className="w-full p-2 rounded-md bg-secondary/30 border border-border text-lg font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Hero Description</label>
                        <textarea
                            value={data.heroDescription}
                            onChange={e => setData({ ...data, heroDescription: e.target.value })}
                            className="w-full p-2 rounded-md bg-secondary/30 border border-border resize-none h-24 text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Footer Text</label>
                        <input
                            value={data.footerText}
                            onChange={e => setData({ ...data, footerText: e.target.value })}
                            className="w-full p-2 rounded-md bg-secondary/30 border border-border text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Email Address</label>
                            <input
                                value={data.email}
                                onChange={e => setData({ ...data, email: e.target.value })}
                                className="w-full p-2 rounded-md bg-secondary/30 border border-border text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Instagram URL</label>
                            <input
                                value={data.instagram}
                                onChange={e => setData({ ...data, instagram: e.target.value })}
                                className="w-full p-2 rounded-md bg-secondary/30 border border-border text-sm"
                            />
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/20 border border-border mt-4">
                        <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><Lock size={14} /> Security</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                            To change your dashboard PIN, you must edit the <code>.env.local</code> file in your project root.
                        </p>
                        <code className="text-xs bg-background p-1 rounded border border-border block w-fit">
                            NEXT_PUBLIC_ADMIN_PIN={process.env.NEXT_PUBLIC_ADMIN_PIN || "2025"}
                        </code>
                    </div>

                    <MagneticButton onClick={handleSave} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium">
                        Save Site Settings
                    </MagneticButton>
                </div>
            </div>
        </div>
    )
}
