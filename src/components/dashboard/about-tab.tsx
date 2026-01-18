"use client"

import { useState, useEffect } from "react"
import { Users } from "lucide-react"
import { AboutData, Gear, TimelineItem } from "@/lib/types"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { ImageUploader } from "@/components/ui/image-uploader"

export function AboutTab() {
    const [viewMode, setViewMode] = useState<"profile" | "gear" | "timeline">("profile");

    if (viewMode === "gear") return <GearEditor onBack={() => setViewMode("profile")} />;
    if (viewMode === "timeline") return <TimelineEditor onBack={() => setViewMode("profile")} />;

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
                if (data) setFormData(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
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
