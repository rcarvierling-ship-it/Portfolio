"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HomeView } from "@/components/views/home-view"
import { AboutView } from "@/components/views/about-view"
import { ContactView } from "@/components/views/contact-view"
import { HomeData, ServiceItem, AboutData, ContactData } from "@/lib/types"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { Home, Save, Smartphone, Monitor, Globe, Rocket, Eye, Settings as SettingsIcon, Layout, FileText, ChevronUp, ChevronDown, Trash, Plus, Loader2, CheckCircle2 } from "lucide-react"
import { ToastContainer, ToastProps } from "@/components/ui/toast"

interface VisualEditorProps {
    slug: string;
}

export function VisualEditor({ slug }: VisualEditorProps) {
    // Default Data States
    const defaultHome: HomeData = {
        hero: {
            title: "Capturing light, emotion, and the moments in between.",
            description: "Reese Vierling (RCV.Media) — Senior Frontend Engineer & Creative Developer.",
            ctaPrimary: { text: "View Gallery", link: "/work", show: true },
            ctaSecondary: { text: "Contact Me", link: "/contact", show: true },
            defaultTheme: 'dark',
            images: ["/uploads/hero-placeholder.jpg"]
        },
        stats: { line1: "50+ Projects • 10+ Years Exp •", line2: "Photography • Videography •" },
        services: [
            { id: "photography", title: "Photography", subtitle: "Capturing moments that tell a story.", description: "Editorial, Lifestyle, Event, and Product photography delivered with a unique cinematic style.", color: "from-orange-500/20 to-red-500/20", iconName: "Camera", show: true, link: "/work" }
        ],
        marquee: {
            show: true,
            keywords: ["EDITORIAL", "LIFESTYLE", "CAMPAIGN", "STUDIO", "PORTRAIT", "ANALOG", "DIGITAL"]
        },
        settings: {
            backgroundEffects: true,
            animationIntensity: 'normal',
            showScrollIndicator: true,
            sectionSpacing: 'default'
        }
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

    const [fullContent, setFullContent] = useState<any>(null); // Contains { draft, published }
    const [draftData, setDraftData] = useState<any>(null); // The content being edited (draft)
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [availablePages, setAvailablePages] = useState<{ title: string, slug: string }[]>([]);
    const [isPublishing, setIsPublishing] = useState(false);
    const [showPublishSuccess, setShowPublishSuccess] = useState(false);
    const [toasts, setToasts] = useState<ToastProps[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { ...toast, id, onClose: removeToast }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const scrollToSection = (sectionId: string) => {
        if (!scrollContainerRef.current) return;

        const element = scrollContainerRef.current.querySelector(sectionId.startsWith('#') ? sectionId : `#${sectionId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            if (sectionId === 'top') scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            if (sectionId === 'bottom') scrollContainerRef.current.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        // Fetch available pages for linking
        fetch('/api/pages')
            .then(res => res.json())
            .then(data => setAvailablePages(data))
            .catch(() => { });
    }, []);

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
                    setFullContent(resData.content);
                    // Initialize editor with DRAFT content
                    setDraftData(resData.content.draft || defaults);
                } else {
                    // New page or no content
                    const initialContent = { published: defaults, draft: defaults };
                    setFullContent(initialContent);
                    setDraftData(defaults);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [slug])

    const updateDraft = (newData: any) => {
        setDraftData(newData);
        setHasUnsavedChanges(true);
    };

    const handleSaveDraft = async () => {
        // Only update the draft part of the content
        const newFullContent = { ...fullContent, draft: draftData };

        const res = await fetch(`/api/pages/${slug}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slug,
                title: slug.charAt(0).toUpperCase() + slug.slice(1),
                status: 'published', // Page status itself is published, but content inside has draft/published states
                version: (fullContent?.version || 1) + 1,
                content: newFullContent
            })
        });

        if (res.ok) {
            setFullContent(newFullContent);
            setHasUnsavedChanges(false);
            // alert("Draft Saved!");
        } else alert("Failed to save draft.");
    }

    const handlePublish = async () => {
        if (!confirm("Are you sure you want to publish these changes to the live site?")) return;

        setIsPublishing(true);

        try {
            // Update BOTH draft and published to match current editor state
            const newFullContent = {
                published: draftData,
                draft: draftData
            };

            const res = await fetch(`/api/pages/${slug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug,
                    title: slug.charAt(0).toUpperCase() + slug.slice(1),
                    status: 'published',
                    version: (fullContent?.version || 1) + 1,
                    content: newFullContent
                })
            });

            if (!res.ok) {
                throw new Error(`Failed to publish: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();

            if (data.success) {
                setFullContent(newFullContent);
                setHasUnsavedChanges(false);
                setShowPublishSuccess(true);
                setTimeout(() => setShowPublishSuccess(false), 2400);

                addToast({
                    type: 'success',
                    title: 'Published Successfully!',
                    description: `Your changes to the ${slug} page are now live.`,
                    duration: 4000
                });
            } else {
                throw new Error(data.error || 'Unknown error occurred');
            }
        } catch (error) {
            console.error('Publish error:', error);
            addToast({
                type: 'error',
                title: 'Publish Failed',
                description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
                duration: 5000
            });
        } finally {
            setIsPublishing(false);
        }
    }

    if (loading || !draftData) return <div className="p-10 text-center text-muted-foreground">Loading editor...</div>

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
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Section Spacing</label>
                            <select
                                className="w-full p-2 rounded bg-secondary/50 border border-border text-sm"
                                value={homeData.settings?.sectionSpacing || 'default'}
                                onChange={e => updateDraft({ ...homeData, settings: { ...homeData.settings, sectionSpacing: e.target.value } })}
                            >
                                <option value="small">Compact (Small)</option>
                                <option value="default">Default</option>
                                <option value="large">Spacious (Large)</option>
                            </select>
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
                    {/* Hero Inputs */}
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
                    {/* Hero Image */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Background Image URL</label>
                        <input
                            className="w-full p-2 rounded bg-secondary/50 border border-border text-sm"
                            value={homeData.hero.images?.[0] || ""}
                            onChange={e => updateDraft({ ...homeData, hero: { ...homeData.hero, images: [e.target.value] } })}
                            placeholder="/uploads/my-photo.jpg"
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

                        <label className="text-xs font-bold text-muted-foreground uppercase mt-2">Secondary CTA</label>
                        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                            <input
                                className="p-2 rounded bg-secondary/50 border border-border text-sm"
                                placeholder="Text"
                                value={homeData.hero.ctaSecondary?.text}
                                onChange={e => updateDraft({ ...homeData, hero: { ...homeData.hero, ctaSecondary: { ...homeData.hero.ctaSecondary, text: e.target.value } } })}
                            />
                            <input
                                className="p-2 rounded bg-secondary/50 border border-border text-sm"
                                placeholder="Link"
                                value={homeData.hero.ctaSecondary?.link}
                                onChange={e => updateDraft({ ...homeData, hero: { ...homeData.hero, ctaSecondary: { ...homeData.hero.ctaSecondary, link: e.target.value } } })}
                            />
                            <input
                                type="checkbox"
                                checked={homeData.hero.ctaSecondary?.show ?? true}
                                onChange={e => updateDraft({ ...homeData, hero: { ...homeData.hero, ctaSecondary: { ...homeData.hero.ctaSecondary, show: e.target.checked } } })}
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

                {/* Services Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                        <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Services</h3>
                        {/* Could add reorder mode toggle here */}
                    </div>

                    {homeData.services.map((service, idx) => (
                        <div key={idx} className="p-4 bg-secondary/20 rounded-lg border border-border space-y-3 group hover:border-primary/20 transition-colors">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${service.show !== false ? 'bg-green-500' : 'bg-zinc-700'}`} />
                                    <span className="text-xs font-bold text-foreground">{service.title || `Service ${idx + 1}`}</span>
                                </div>
                                <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="p-1 hover:bg-background rounded"
                                        disabled={idx === 0}
                                        onClick={() => {
                                            const newServices = [...homeData.services];
                                            [newServices[idx - 1], newServices[idx]] = [newServices[idx], newServices[idx - 1]];
                                            updateDraft({ ...homeData, services: newServices });
                                        }}
                                    >
                                        <ChevronUp size={14} />
                                    </button>
                                    <button
                                        className="p-1 hover:bg-background rounded"
                                        disabled={idx === homeData.services.length - 1}
                                        onClick={() => {
                                            const newServices = [...homeData.services];
                                            [newServices[idx + 1], newServices[idx]] = [newServices[idx], newServices[idx + 1]];
                                            updateDraft({ ...homeData, services: newServices });
                                        }}
                                    >
                                        <ChevronDown size={14} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newServices = [...homeData.services];
                                            newServices[idx].show = !newServices[idx].show;
                                            updateDraft({ ...homeData, services: newServices });
                                        }}
                                        className={`p-1 hover:bg-background rounded ${service.show === false ? 'text-zinc-500' : 'text-primary'}`}
                                        title="Toggle Visibility"
                                    >
                                        <Eye size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Collapsible content could go here, for now just fields */}
                            <input
                                className="w-full p-2 rounded bg-background border border-border text-sm font-bold"
                                value={service.title}
                                onChange={e => {
                                    const newServices = [...homeData.services];
                                    newServices[idx].title = e.target.value;
                                    updateDraft({ ...homeData, services: newServices });
                                }}
                                placeholder="Title"
                            />
                            <input
                                className="w-full p-2 rounded bg-background border border-border text-sm"
                                value={service.subtitle}
                                onChange={e => {
                                    const newServices = [...homeData.services];
                                    newServices[idx].subtitle = e.target.value;
                                    updateDraft({ ...homeData, services: newServices });
                                }}
                                placeholder="Subtitle"
                            />
                            <textarea
                                className="w-full p-2 rounded bg-background border border-border text-xs min-h-[60px]"
                                value={service.description}
                                onChange={e => {
                                    const newServices = [...homeData.services];
                                    newServices[idx].description = e.target.value;
                                    updateDraft({ ...homeData, services: newServices });
                                }}
                                placeholder="Description"
                            />

                            {/* Link Selection */}
                            <div className="pt-2 border-t border-border mt-2">
                                <label className="text-xs uppercase font-bold text-muted-foreground mb-1 block">Link to Page</label>
                                <input
                                    className="w-full p-2 rounded bg-background border border-border text-sm"
                                    value={service.link || ''}
                                    onChange={e => {
                                        const newServices = [...homeData.services];
                                        newServices[idx].link = e.target.value;
                                        updateDraft({ ...homeData, services: newServices });
                                    }}
                                    placeholder="Enter URL or select page..."
                                    list={`pages-list-${idx}`}
                                />
                                <datalist id={`pages-list-${idx}`}>
                                    <option value="/work">Work (Gallery)</option>
                                    <option value="/about">About</option>
                                    <option value="/contact">Contact</option>
                                    {availablePages.map(page => (
                                        <option key={page.slug} value={`/pages/${page.slug}`}>{page.title}</option>
                                    ))}
                                </datalist>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Marquee Section */}
                <section className="space-y-4">
                    <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider pb-2 border-b border-border">Marquee Ticker</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Keywords (comma separated)</label>
                        <textarea
                            className="w-full p-2 rounded bg-secondary/50 border border-border text-sm min-h-[80px]"
                            value={homeData.marquee?.keywords?.join(', ')}
                            onChange={e => updateDraft({ ...homeData, marquee: { ...homeData.marquee, keywords: e.target.value.split(',').map(s => s.trim()).filter(s => s) } })}
                            placeholder="EDITORIAL, LIFESTYLE, CAMPAIGN..."
                        />
                    </div>
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
                            <label className="text-sm font-medium">Bio (Paragraphs)</label>
                            {aboutData.bio.map((p, i) => (
                                <textarea key={i} className="w-full p-2 rounded bg-secondary/50 border border-border text-sm min-h-[100px]" value={p} onChange={e => {
                                    const newBio = [...aboutData.bio];
                                    newBio[i] = e.target.value;
                                    updateDraft({ ...aboutData, bio: newBio });
                                }} />
                            ))}
                            <button onClick={() => updateDraft({ ...aboutData, bio: [...aboutData.bio, "New paragraph"] })} className="text-xs text-primary underline">+ Add Paragraph</button>
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
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea className="w-full p-2 rounded bg-secondary/50 border border-border text-sm min-h-[100px]" value={contactData.description} onChange={e => updateDraft({ ...contactData, description: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input className="w-full p-2 rounded bg-secondary/50 border border-border text-sm" value={contactData.email} onChange={e => updateDraft({ ...contactData, email: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Instagram</label>
                            <input className="w-full p-2 rounded bg-secondary/50 border border-border text-sm" value={contactData.instagram} onChange={e => updateDraft({ ...contactData, instagram: e.target.value })} />
                        </div>
                    </section>
                </div>
            )
        }
        return <div>Unknown Page Type</div>
    }

    const renderPreview = () => {
        // Use DRAFT data for preview
        if (slug === 'home') return (
            <HomeView
                data={draftData as HomeData}
                featuredProjectsNode={<div className="py-12 text-center border-y border-border opacity-50">Featured Projects (Server Component)</div>}
                recentPhotosNode={<div className="py-12 text-center border-y border-border opacity-50">Recent Photos (Server Component)</div>}
            />
        )
        if (slug === 'about') return <AboutView data={draftData as AboutData} />
        if (slug === 'contact') return <ContactView data={draftData as ContactData} />
        return <div>Preview not available</div>
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar Controls */}
            <div className="w-[400px] border-r border-border flex flex-col bg-card z-10 shadow-xl shrink-0">
                {/* Header */}
                <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold flex items-center gap-2 capitalize"><Home size={18} /> {slug} Page</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveDraft}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-colors flex items-center gap-1.5 ${hasUnsavedChanges ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}
                            >
                                <Save size={14} /> Draft
                            </button>
                            <MagneticButton
                                onClick={handlePublish}
                                disabled={isPublishing}
                                className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPublishing ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" /> Publishing...
                                    </>
                                ) : (
                                    <>
                                        <Rocket size={14} /> Publish
                                    </>
                                )}
                            </MagneticButton>
                        </div>
                    </div>

                    {/* Page switcher: Home, About, Contact */}
                    <div className="flex gap-1 p-1 bg-secondary/30 rounded-lg mb-4">
                        {(['home', 'about', 'contact'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => router.push(s === 'home' ? '/dashboard/pages' : `/dashboard/pages/${s}`)}
                                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${slug === s ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
                            >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
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

                <div
                    className="flex-1 overflow-y-auto p-6 custom-scrollbar"
                    data-lenis-prevent
                    onWheel={(e) => e.stopPropagation()}
                >
                    {renderForm()}
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-zinc-900 flex flex-col relative overflow-hidden h-full">
                <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 text-white bg-[#0a0a0a] shrink-0 z-20">
                    <span className="text-xs uppercase tracking-widest text-white/50 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${hasUnsavedChanges ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                        {hasUnsavedChanges ? 'Unsaved Changes' : 'All Saved'}
                    </span>

                    <div className="flex items-center gap-4">
                        {/* Scroll Navigation */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase text-white/30 font-bold tracking-wider">Jump To</span>
                            <div className="flex bg-white/10 rounded p-0.5">
                                <button onClick={() => scrollToSection('top')} className="p-1 hover:bg-white/10 rounded" title="Top"><ChevronUp size={14} /></button>
                                <button onClick={() => scrollToSection('bottom')} className="p-1 hover:bg-white/10 rounded" title="Bottom"><ChevronDown size={14} /></button>
                            </div>
                        </div>

                        <div className="w-px h-4 bg-white/10" />

                        {/* View Mode */}
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
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto overflow-x-hidden p-8 flex items-start justify-center bg-zinc-950 scroll-smooth"
                    data-lenis-prevent
                >
                    <div
                        className={`bg-background transition-all duration-300 shadow-2xl origin-top ${viewMode === 'mobile' ? 'w-[375px] min-h-[800px] rounded-[3rem] border-[8px] border-zinc-800' : 'w-full max-w-[1400px] min-h-screen rounded-md'
                            } overflow-hidden`}
                        style={{
                            transform: viewMode === 'mobile' ? 'scale(0.9)' : 'scale(1)'
                        }}
                    >
                        {/* Content Wrapper - Interactive! */}
                        <div className="h-full">
                            {renderPreview()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Publish Success Overlay */}
            <AnimatePresence>
                {showPublishSuccess && (
                    <motion.div
                        key="publish-success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none"
                    >
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="relative z-10 flex flex-col items-center gap-4 rounded-2xl border border-green-500/50 bg-gradient-to-br from-green-500/20 to-emerald-600/20 px-10 py-8 shadow-2xl shadow-green-500/20"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.05 }}
                                className="text-green-400"
                            >
                                <CheckCircle2 size={56} strokeWidth={2} />
                            </motion.div>
                            <motion.p
                                initial={{ y: 8, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="text-xl font-bold text-white"
                            >
                                Published
                            </motion.p>
                            <motion.p
                                initial={{ y: 4, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.25 }}
                                className="text-sm text-green-200/90"
                            >
                                Your changes are now live.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </div>
    )
}
