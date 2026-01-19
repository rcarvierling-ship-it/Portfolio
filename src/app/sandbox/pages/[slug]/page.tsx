"use client"

import { useState, useEffect } from "react"
import { useSandbox } from "@/lib/sandbox/context"
import { HomeView } from "@/components/views/home-view"
import { AboutView } from "@/components/views/about-view"
import { ContactView } from "@/components/views/contact-view"
import { HomeData, AboutData, ContactData } from "@/lib/types"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { Home, Save, Smartphone, Monitor, Globe, Rocket, Eye, Settings as SettingsIcon, Layout, FileText, ChevronUp, ChevronDown, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface SandboxEditorProps {
    slug: string;
}

export default function SandboxVisualEditor({ slug }: SandboxEditorProps) {
    const { store } = useSandbox();

    // We need local state for the form inputs, just like the real editor
    // But we initialize it from the synchronous store
    const [draftData, setDraftData] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        // Load data from store on mount
        const page = store.pages[slug];
        if (page && page.content) {
            // In sandbox, we just edit the 'draft' version directly or a clone of it
            // Let's clone to allow 'save' to be explicit
            setDraftData(JSON.parse(JSON.stringify(page.content.draft)));
        }
    }, [slug, store]);

    const updateDraft = (newData: any) => {
        setDraftData(newData);
        setHasUnsavedChanges(true);
    };

    const handleSave = () => {
        // Update the store
        store.updatePage(slug, {
            published: draftData, // specific to sandbox: save updates both for simplicity or separate?
            draft: draftData
        });
        setHasUnsavedChanges(false);
        // We don't need to forceUpdate the whole app unless we want other components to react
        // But the local state is what matters here.
        alert("Sandbox: Changes saved to memory!");
    };

    if (!draftData) return <div className="p-10 text-center text-muted-foreground">Loading sandbox editor...</div>

    const renderPreview = () => {
        if (slug === 'home') return (
            <HomeView
                data={draftData as HomeData}
                featuredProjectsNode={<div className="py-12 text-center border-y border-border opacity-50">Featured Projects (Server Component placeholder)</div>}
                recentPhotosNode={<div className="py-12 text-center border-y border-border opacity-50">Recent Photos (Server Component placeholder)</div>}
            />
        )
        if (slug === 'about') return <AboutView data={draftData as AboutData} />
        if (slug === 'contact') return <ContactView data={draftData as ContactData} />
        return <div>Preview not available</div>
    }

    const renderHomeEditor = () => {
        const homeData = draftData as HomeData;

        if (activeTab === 'settings') {
            return (
                <div className="space-y-6">
                    <section className="space-y-4">
                        <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider pb-2 border-b border-border flex items-center gap-2">
                            <SettingsIcon size={14} /> Global Settings
                        </h3>
                        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded border border-border">
                            <label className="text-sm font-medium">Background Effects</label>
                            <input
                                type="checkbox"
                                checked={homeData.settings?.backgroundEffects ?? true}
                                onChange={e => updateDraft({ ...homeData, settings: { ...homeData.settings, backgroundEffects: e.target.checked } })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Animation Intensity</label>
                            <div className="flex bg-secondary/30 p-1 rounded border border-border">
                                {['normal', 'reduced'].map((intensity) => (
                                    <button
                                        key={intensity}
                                        onClick={() => updateDraft({ ...homeData, settings: { ...homeData.settings, animationIntensity: intensity } })}
                                        className={`flex-1 text-xs py-1.5 rounded capitalize transition-colors ${homeData.settings?.animationIntensity === intensity ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary'}`}
                                    >
                                        {intensity}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded border border-border">
                            <label className="text-sm font-medium">Show Scroll Indicator</label>
                            <input
                                type="checkbox"
                                checked={homeData.settings?.showScrollIndicator ?? true}
                                onChange={e => updateDraft({ ...homeData, settings: { ...homeData.settings, showScrollIndicator: e.target.checked } })}
                            />
                        </div>
                    </section>
                </div>
            )
        }

        return (
            <div className="space-y-8">
                <section className="space-y-4">
                    <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider pb-2 border-b border-border flex items-center gap-2">
                        <Layout size={14} /> Hero Section
                    </h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Headline</label>
                        <textarea
                            className="w-full p-2 rounded bg-secondary/50 border border-border text-sm min-h-[80px]"
                            value={homeData.hero.title}
                            onChange={e => updateDraft({ ...homeData, hero: { ...homeData.hero, title: e.target.value } })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Subheadline</label>
                        <textarea
                            className="w-full p-2 rounded bg-secondary/50 border border-border text-sm min-h-[100px]"
                            value={homeData.hero.description}
                            onChange={e => updateDraft({ ...homeData, hero: { ...homeData.hero, description: e.target.value } })}
                        />
                    </div>
                    {/* CTAs */}
                    <div className="space-y-3 pt-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Primary CTA</label>
                        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                            <input
                                className="p-2 rounded bg-secondary/50 border border-border text-sm"
                                placeholder="Text"
                                value={homeData.hero.ctaPrimary?.text}
                                onChange={e => updateDraft({ ...homeData, hero: { ...homeData.hero, ctaPrimary: { ...homeData.hero.ctaPrimary, text: e.target.value } } })}
                            />
                            <input
                                className="p-2 rounded bg-secondary/50 border border-border text-sm"
                                placeholder="Link"
                                value={homeData.hero.ctaPrimary?.link}
                                onChange={e => updateDraft({ ...homeData, hero: { ...homeData.hero, ctaPrimary: { ...homeData.hero.ctaPrimary, link: e.target.value } } })}
                            />
                            <input
                                type="checkbox"
                                checked={homeData.hero.ctaPrimary?.show ?? true}
                                onChange={e => updateDraft({ ...homeData, hero: { ...homeData.hero, ctaPrimary: { ...homeData.hero.ctaPrimary, show: e.target.checked } } })}
                            />
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider pb-2 border-b border-border">Scrolling Stats</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Top Line</label>
                        <input className="w-full p-2 rounded bg-secondary/50 border border-border text-sm" value={homeData.stats.line1} onChange={e => updateDraft({ ...homeData, stats: { ...homeData.stats, line1: e.target.value } })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Bottom Line</label>
                        <input className="w-full p-2 rounded bg-secondary/50 border border-border text-sm" value={homeData.stats.line2} onChange={e => updateDraft({ ...homeData, stats: { ...homeData.stats, line2: e.target.value } })} />
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                        <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Services (Mock)</h3>
                    </div>
                    {homeData.services.map((service, idx) => (
                        <div key={idx} className="p-4 bg-secondary/20 rounded-lg border border-border space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${service.show !== false ? 'bg-green-500' : 'bg-zinc-700'}`} />
                                    <span className="text-xs font-bold text-foreground">{service.title || `Service ${idx + 1}`}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        const newServices = [...homeData.services];
                                        newServices[idx].show = !newServices[idx].show;
                                        updateDraft({ ...homeData, services: newServices });
                                    }}
                                    className={`p-1 hover:bg-background rounded ${service.show === false ? 'text-zinc-500' : 'text-primary'}`}
                                >
                                    <Eye size={14} />
                                </button>
                            </div>
                            <input
                                className="w-full p-2 rounded bg-background border border-border text-sm font-bold"
                                value={service.title}
                                onChange={e => {
                                    const newServices = [...homeData.services];
                                    newServices[idx].title = e.target.value;
                                    updateDraft({ ...homeData, services: newServices });
                                }}
                            />
                        </div>
                    ))}
                </section>
            </div>
        )
    }

    const renderForm = () => {
        if (slug === 'home') return renderHomeEditor();
        if (slug === 'about') {
            const aboutData = draftData as AboutData;
            return (
                <div className="space-y-8">
                    <section className="space-y-4">
                        <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider pb-2 border-b border-border">Profile</h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Headline</label>
                            <input className="w-full p-2 rounded bg-secondary/50 border border-border text-sm" value={aboutData.headline} onChange={e => updateDraft({ ...aboutData, headline: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bio</label>
                            {aboutData.bio.map((p, i) => (
                                <textarea key={i} className="w-full p-2 rounded bg-secondary/50 border border-border text-sm min-h-[100px]" value={p} onChange={e => {
                                    const newBio = [...aboutData.bio];
                                    newBio[i] = e.target.value;
                                    updateDraft({ ...aboutData, bio: newBio });
                                }} />
                            ))}
                        </div>
                    </section>
                </div>
            )
        }
        if (slug === 'contact') {
            const contactData = draftData as ContactData;
            return (
                <div className="space-y-8">
                    <section className="space-y-4">
                        <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider pb-2 border-b border-border">Contact Info</h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <input className="w-full p-2 rounded bg-secondary/50 border border-border text-sm" value={contactData.title} onChange={e => updateDraft({ ...contactData, title: e.target.value })} />
                        </div>
                    </section>
                </div>
            )
        }
        return <div>Unknown Page Type</div>
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar Controls */}
            <div className="w-[400px] border-r border-border flex flex-col bg-card z-10 shadow-xl border-l-[6px] border-l-yellow-500/20">
                {/* Header */}
                <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Link href="/sandbox" className="p-1 hover:bg-secondary rounded"><ArrowLeft size={16} /></Link>
                            <h2 className="font-bold flex items-center gap-2 capitalize text-yellow-500"><Home size={18} /> {slug} (Mock)</h2>
                        </div>
                        <div className="flex gap-2">
                            <MagneticButton onClick={handleSave} className="bg-yellow-500 text-yellow-950 px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-yellow-500/20">
                                <Save size={14} /> Update Mock
                            </MagneticButton>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-secondary/50 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'content' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <FileText size={14} /> Content
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'settings' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <SettingsIcon size={14} /> Settings
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {renderForm()}
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-zinc-900 flex flex-col relative overflow-hidden">
                <div className="h-12 border-b border-white/10 flex items-center justify-center gap-4 text-white">
                    <span className="text-xs uppercase tracking-widest text-yellow-500/80 flex items-center gap-2 font-bold">
                        Sandbox Preview
                    </span>
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
