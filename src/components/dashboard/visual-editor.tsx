"use client"

import { useState, useEffect } from "react"
import { HomeView } from "@/components/views/home-view"
import { HomeData, ServiceItem } from "@/lib/types"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { Home, Save, Smartphone, Monitor } from "lucide-react"

export function VisualEditor() {
    const [data, setData] = useState<HomeData>({
        hero: {
            title: "Capturing light, emotion, and the moments in between.",
            description: "Reese Vierling (RCV.Media) — Senior Frontend Engineer & Creative Developer specializing in interactive web applications and 3D experiences."
        },
        stats: {
            line1: "50+ Projects • 10+ Years Exp • 15+ Creative Tools •",
            line2: "Photography • Videography • Web Development •"
        },
        services: [
            { id: "photography", title: "Photography", subtitle: "Capturing moments that tell a story.", description: "Editorial, Lifestyle, Event, and Product photography delivered with a unique cinematic style.", color: "from-orange-500/20 to-red-500/20", iconName: "Camera" },
            { id: "videography", title: "Videography", subtitle: "Motion pictures that move emotions.", description: "End-to-end video production from storyboarding and shooting to editing and color grading.", color: "from-blue-500/20 to-cyan-500/20", iconName: "Video" },
            { id: "web-dev", title: "Web Development", subtitle: "Digital experiences that engage.", description: "Modern, performant websites and applications built with Next.js, React, and creative coding.", color: "from-emerald-500/20 to-green-500/20", iconName: "Code2" },
            { id: "creative", title: "Creative Direction", subtitle: "Vision turned into reality.", description: "Comprehensive brand strategy and visual identity development for digital-first businesses.", color: "from-purple-500/20 to-pink-500/20", iconName: "Sparkles" }
        ]
    })

    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

    useEffect(() => {
        // Fetch existing data
        fetch('/api/pages/home')
            .then(res => res.json())
            .then(resData => {
                if (resData?.content) {
                    // Merge with defaults to ensure structure
                    setData(prev => ({ ...prev, ...resData.content }));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [])

    const handleSave = async () => {
        const res = await fetch('/api/pages/home', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slug: 'home',
                title: 'Home',
                status: 'published',
                version: 1, // Incremented by backend logic if needed, but for now simple upsert
                content: data
            })
        });

        if (res.ok) alert("Saved successfully!");
        else alert("Failed to save.");
    }

    if (loading) return <div className="p-10 text-center">Loading editor...</div>

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar Controls */}
            <div className="w-[400px] border-r border-border flex flex-col bg-card z-10 shadow-xl">
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-bold flex items-center gap-2"><Home size={18} /> Home Page</h2>
                    <MagneticButton onClick={handleSave} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                        <Save size={16} /> Save
                    </MagneticButton>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {/* Hero Section */}
                    <section className="space-y-4">
                        <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider pb-2 border-b border-border">Hero Section</h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Headline</label>
                            <textarea
                                className="w-full p-2 rounded bg-secondary/50 border border-border text-sm min-h-[80px]"
                                value={data.hero.title}
                                onChange={e => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subheadline</label>
                            <textarea
                                className="w-full p-2 rounded bg-secondary/50 border border-border text-sm min-h-[100px]"
                                value={data.hero.description}
                                onChange={e => setData({ ...data, hero: { ...data.hero, description: e.target.value } })}
                            />
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="space-y-4">
                        <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider pb-2 border-b border-border">Scrolling Stats</h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Top Line</label>
                            <input
                                className="w-full p-2 rounded bg-secondary/50 border border-border text-sm"
                                value={data.stats.line1}
                                onChange={e => setData({ ...data, stats: { ...data.stats, line1: e.target.value } })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bottom Line</label>
                            <input
                                className="w-full p-2 rounded bg-secondary/50 border border-border text-sm"
                                value={data.stats.line2}
                                onChange={e => setData({ ...data, stats: { ...data.stats, line2: e.target.value } })}
                            />
                        </div>
                    </section>

                    {/* Services Section */}
                    <section className="space-y-4">
                        <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider pb-2 border-b border-border">Services</h3>
                        {data.services.map((service, idx) => (
                            <div key={idx} className="p-4 bg-secondary/20 rounded-lg border border-border space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-muted-foreground">Service {idx + 1}</span>
                                    {/* Could add delete button here */}
                                </div>
                                <input
                                    className="w-full p-2 rounded bg-background border border-border text-sm font-bold"
                                    value={service.title}
                                    onChange={e => {
                                        const newServices = [...data.services];
                                        newServices[idx].title = e.target.value;
                                        setData({ ...data, services: newServices });
                                    }}
                                />
                                <input
                                    className="w-full p-2 rounded bg-background border border-border text-sm"
                                    value={service.subtitle}
                                    onChange={e => {
                                        const newServices = [...data.services];
                                        newServices[idx].subtitle = e.target.value;
                                        setData({ ...data, services: newServices });
                                    }}
                                />
                                <textarea
                                    className="w-full p-2 rounded bg-background border border-border text-xs min-h-[60px]"
                                    value={service.description}
                                    onChange={e => {
                                        const newServices = [...data.services];
                                        newServices[idx].description = e.target.value;
                                        setData({ ...data, services: newServices });
                                    }}
                                />
                            </div>
                        ))}
                    </section>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-zinc-900 flex flex-col relative overflow-hidden">
                <div className="h-12 border-b border-white/10 flex items-center justify-center gap-4 text-white">
                    <span className="text-xs uppercase tracking-widest text-white/50">Live Preview</span>
                    <div className="flex bg-black/50 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('desktop')}
                            className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                        >
                            <Monitor size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('mobile')}
                            className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                        >
                            <Smartphone size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-8 flex items-start justify-center bg-zinc-950">
                    <div
                        className={`bg-background transition-all duration-300 shadow-2xl origin-top ${viewMode === 'mobile' ? 'w-[375px] min-h-[800px] rounded-[3rem] border-[8px] border-zinc-800' : 'w-full max-w-[1400px] min-h-screen rounded-md'
                            } overflow-hidden`}
                        style={{
                            transform: viewMode === 'mobile' ? 'scale(0.9)' : 'scale(1)'
                        }}
                    >
                        {/* We wrap HomeView in a div that isolates it a bit, though styles are global */}
                        <div className={viewMode === 'mobile' ? 'pointer-events-none select-none' : ''}>
                            <HomeView data={data} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
