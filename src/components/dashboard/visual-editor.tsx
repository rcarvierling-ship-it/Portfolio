"use client"

import { useState, useEffect } from "react"
import { HomeView } from "@/components/views/home-view"
import { AboutView } from "@/components/views/about-view"
import { ContactView } from "@/components/views/contact-view"
import { HomeData, ServiceItem, AboutData, ContactData } from "@/lib/types"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { Home, Save, Smartphone, Monitor } from "lucide-react"

interface VisualEditorProps {
    slug: string;
}

export function VisualEditor({ slug }: VisualEditorProps) {
    // Default Data States
    const defaultHome: HomeData = {
        hero: { title: "Capturing light, emotion, and the moments in between.", description: "Reese Vierling (RCV.Media) — Senior Frontend Engineer & Creative Developer." },
        stats: { line1: "50+ Projects • 10+ Years Exp •", line2: "Photography • Videography •" },
        services: [
            { id: "photography", title: "Photography", subtitle: "Capturing moments that tell a story.", description: "Editorial, Lifestyle, Event, and Product photography delivered with a unique cinematic style.", color: "from-orange-500/20 to-red-500/20", iconName: "Camera" },
            { id: "videography", title: "Videography", subtitle: "Motion pictures that move emotions.", description: "End-to-end video production from storyboarding and shooting to editing and color grading.", color: "from-blue-500/20 to-cyan-500/20", iconName: "Video" },
            { id: "web-dev", title: "Web Development", subtitle: "Digital experiences that engage.", description: "Modern, performant websites and applications built with Next.js, React, and creative coding.", color: "from-emerald-500/20 to-green-500/20", iconName: "Code2" },
            { id: "creative", title: "Creative Direction", subtitle: "Vision turned into reality.", description: "Comprehensive brand strategy and visual identity development for digital-first businesses.", color: "from-purple-500/20 to-pink-500/20", iconName: "Sparkles" }
        ]
    };
    const defaultAbout: AboutData = {
        headline: "Photographer & Filmmaker",
        bio: ["Visual storyteller based in New York."],
        portrait: "",
        gear: [],
        timeline: []
    };
    const defaultContact: ContactData = {
        title: "Let's start a project together.",
        description: "Interested in working together?",
        email: "info@rcv-media.com",
        instagram: "@rcv.media"
    };

    const [data, setData] = useState<any>(null); // Typless initially to handle variants
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

    useEffect(() => {
        setLoading(true);
        fetch(`/api/pages/${slug}`)
            .then(res => res.json())
            .then(resData => {
                let defaults: any = {};
                if (slug === 'home') defaults = defaultHome;
                if (slug === 'about') defaults = defaultAbout;
                if (slug === 'contact') defaults = defaultContact;

                if (resData?.content) {
                    setData({ ...defaults, ...resData.content });
                } else {
                    setData(defaults);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [slug])

    const handleSave = async () => {
        const res = await fetch(`/api/pages/${slug}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slug,
                title: slug.charAt(0).toUpperCase() + slug.slice(1),
                status: 'published',
                version: 1,
                content: data
            })
        });

        if (res.ok) alert("Saved successfully!");
        else alert("Failed to save.");
    }

    if (loading || !data) return <div className="p-10 text-center">Loading editor...</div>

    const renderForm = () => {
        if (slug === 'home') {
            const homeData = data as HomeData;
            return (
                <div className="space-y-8">
                    <section className="space-y-4">
                        <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider pb-2 border-b border-border">Hero Section</h3>
                        {/* Hero Inputs */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Headline</label>
                            <textarea
                                className="w-full p-2 rounded bg-secondary/50 border border-border text-sm min-h-[80px]"
                                value={homeData.hero.title}
                                onChange={e => setData({ ...homeData, hero: { ...homeData.hero, title: e.target.value } })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subheadline</label>
                            <textarea
                                className="w-full p-2 rounded bg-secondary/50 border border-border text-sm min-h-[100px]"
                                value={homeData.hero.description}
                                onChange={e => setData({ ...homeData, hero: { ...homeData.hero, description: e.target.value } })}
                            />
                        </div>
                    </section>
                    {/* ... other home fields ... */}
                    <section className="space-y-4">
                        <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider pb-2 border-b border-border">Scrolling Stats</h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Top Line</label>
                            <input className="w-full p-2 rounded bg-secondary/50 border border-border text-sm" value={homeData.stats.line1} onChange={e => setData({ ...homeData, stats: { ...homeData.stats, line1: e.target.value } })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bottom Line</label>
                            <input className="w-full p-2 rounded bg-secondary/50 border border-border text-sm" value={homeData.stats.line2} onChange={e => setData({ ...homeData, stats: { ...homeData.stats, line2: e.target.value } })} />
                        </div>
                    </section>

                    {/* Services Section */}
                    <section className="space-y-4">
                        <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider pb-2 border-b border-border">Services</h3>
                        {homeData.services.map((service, idx) => (
                            <div key={idx} className="p-4 bg-secondary/20 rounded-lg border border-border space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-muted-foreground">Service {idx + 1}</span>
                                    {/* Could add delete button here */}
                                </div>
                                <input
                                    className="w-full p-2 rounded bg-background border border-border text-sm font-bold"
                                    value={service.title}
                                    onChange={e => {
                                        const newServices = [...homeData.services];
                                        newServices[idx].title = e.target.value;
                                        setData({ ...homeData, services: newServices });
                                    }}
                                />
                                <input
                                    className="w-full p-2 rounded bg-background border border-border text-sm"
                                    value={service.subtitle}
                                    onChange={e => {
                                        const newServices = [...homeData.services];
                                        newServices[idx].subtitle = e.target.value;
                                        setData({ ...homeData, services: newServices });
                                    }}
                                />
                                <textarea
                                    className="w-full p-2 rounded bg-background border border-border text-xs min-h-[60px]"
                                    value={service.description}
                                    onChange={e => {
                                        const newServices = [...homeData.services];
                                        newServices[idx].description = e.target.value;
                                        setData({ ...homeData, services: newServices });
                                    }}
                                />
                            </div>
                        ))}
                    </section>
                </div>
            )
        }
        if (slug === 'about') {
            const aboutData = data as AboutData;
            return (
                <div className="space-y-8">
                    <section className="space-y-4">
                        <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider pb-2 border-b border-border">Profile</h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Headline</label>
                            <input className="w-full p-2 rounded bg-secondary/50 border border-border text-sm" value={aboutData.headline} onChange={e => setData({ ...aboutData, headline: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bio (Paragraphs)</label>
                            {aboutData.bio.map((p, i) => (
                                <textarea key={i} className="w-full p-2 rounded bg-secondary/50 border border-border text-sm min-h-[100px]" value={p} onChange={e => {
                                    const newBio = [...aboutData.bio];
                                    newBio[i] = e.target.value;
                                    setData({ ...aboutData, bio: newBio });
                                }} />
                            ))}
                            <button onClick={() => setData({ ...aboutData, bio: [...aboutData.bio, "New paragraph"] })} className="text-xs text-primary underline">+ Add Paragraph</button>
                        </div>
                    </section>
                </div>
            )
        }
        if (slug === 'contact') {
            const contactData = data as ContactData;
            return (
                <div className="space-y-8">
                    <section className="space-y-4">
                        <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider pb-2 border-b border-border">Contact Info</h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <input className="w-full p-2 rounded bg-secondary/50 border border-border text-sm" value={contactData.title} onChange={e => setData({ ...contactData, title: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea className="w-full p-2 rounded bg-secondary/50 border border-border text-sm min-h-[100px]" value={contactData.description} onChange={e => setData({ ...contactData, description: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input className="w-full p-2 rounded bg-secondary/50 border border-border text-sm" value={contactData.email} onChange={e => setData({ ...contactData, email: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Instagram</label>
                            <input className="w-full p-2 rounded bg-secondary/50 border border-border text-sm" value={contactData.instagram} onChange={e => setData({ ...contactData, instagram: e.target.value })} />
                        </div>
                    </section>
                </div>
            )
        }
        return <div>Unknown Page Type</div>
    }

    const renderPreview = () => {
        if (slug === 'home') return <HomeView data={data as HomeData} />
        if (slug === 'about') return <AboutView data={data as AboutData} />
        if (slug === 'contact') return <ContactView data={data as ContactData} />
        return <div>Preview not available</div>
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar Controls */}
            <div className="w-[400px] border-r border-border flex flex-col bg-card z-10 shadow-xl">
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-bold flex items-center gap-2 capitalize"><Home size={18} /> {slug} Page</h2>
                    <MagneticButton onClick={handleSave} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                        <Save size={16} /> Save
                    </MagneticButton>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {renderForm()}
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
                        <div className={viewMode === 'mobile' ? 'pointer-events-none select-none' : ''}>
                            {renderPreview()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
