"use client"

import { useState, useEffect } from "react"
import { Settings, Lock, Image as ImageIcon, X, Palette } from "lucide-react"
import { SiteSettings, Photo } from "@/lib/types"
import { GRADIENT_PRESETS } from "@/lib/gradient-presets"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { RefreshCw } from "lucide-react"
import { MediaLibrary } from "@/components/dashboard/media-library"
import { EditableWrapper } from "@/components/dashboard/editable-wrapper"
import { TechFrame } from "@/components/ui/tech-frame"
import { AnimatePresence, motion } from "framer-motion"

export function SettingsTab() {
    const [data, setData] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [showLogoPicker, setShowLogoPicker] = useState(false);

    useEffect(() => {
        fetch('/api/global').then(res => res.json()).then(d => { setData(d); setLoading(false); });
    }, []);

    const handleSave = async () => {
        if (!data) return;
        try {
            const res = await fetch('/api/global', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                alert("Site Settings Saved!");
                window.location.reload(); // Hard reload to ensure all server components re-fetch fresh settings
            }
            else alert("Failed to save");
        } catch (e) {
            alert("Error saving settings");
        }
    }

    if (loading || !data) return <div>Loading settings...</div>;

    return (
        <>
            <div className="flex flex-col gap-8 max-w-2xl">
                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-full bg-secondary/50"><Settings size={20} /></div>
                        <h3 className="text-lg font-bold">Global Site Settings</h3>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Branding Section */}
                        <div className="p-4 rounded-lg bg-secondary/20 border border-border">
                            <h4 className="font-bold text-sm mb-4 flex items-center gap-2"><ImageIcon size={16} /> Branding</h4>
                            <div className="space-y-6">
                                {/* Brand Name */}
                                <div className="space-y-2">
                                    <EditableWrapper label="BRAND_NAME" helperText="Displayed in navbar and meta titles.">
                                        <label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">Brand Name</label>
                                        <input
                                            value={data.branding?.brandName || "RCV.Media"}
                                            onChange={e => setData({ ...data, branding: { ...data.branding!, brandName: e.target.value } })}
                                            className="w-full p-2 rounded-md bg-background border border-border text-lg font-bold focus:outline-none focus:ring-1 focus:ring-primary/50"
                                            placeholder="RCV.Media"
                                        />
                                    </EditableWrapper>
                                </div>

                                {/* Logo Picker */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">Logo Icon</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden p-2">
                                            <img
                                                src={data.branding?.logoUrl || "/logo.png"}
                                                alt={data.branding?.logoAltText || "Brand Logo"}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <MagneticButton
                                                onClick={() => setShowLogoPicker(true)}
                                                className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold rounded-md"
                                            >
                                                Change Logo
                                            </MagneticButton>
                                            {data.branding?.logoUrl && (
                                                <button
                                                    onClick={() => setData({ ...data, branding: { ...data.branding!, logoUrl: undefined, logoId: undefined } })}
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Reset to Default
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Theme Section */}
                        <div className="p-4 rounded-lg bg-secondary/20 border border-border">
                            <h4 className="font-bold text-sm mb-4 flex items-center gap-2"><Palette size={16} /> Theme & Colors</h4>
                            <div className="mb-6 space-y-3">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Gradient Preset</label>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 relative">
                                        <select
                                            value={data.theme?.presetId || "custom"}
                                            onChange={(e) => {
                                                const newId = e.target.value;
                                                if (newId === 'custom') {
                                                    setData({ ...data, theme: { ...data.theme, presetId: 'custom' } });
                                                } else {
                                                    const preset = GRADIENT_PRESETS.find(p => p.id === newId);
                                                    if (preset) {
                                                        setData({
                                                            ...data,
                                                            theme: {
                                                                ...data.theme,
                                                                presetId: preset.id,
                                                                backgroundColors: {
                                                                    ...preset.colors
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            }}
                                            className="w-full p-2 rounded-md bg-background border border-border text-sm appearance-none cursor-pointer"
                                        >
                                            <option value="custom">Custom (Manual Edit)</option>
                                            <optgroup label="Presets">
                                                {GRADIENT_PRESETS.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </optgroup>
                                        </select>
                                    </div>
                                    <MagneticButton
                                        onClick={() => {
                                            const randomPreset = GRADIENT_PRESETS[Math.floor(Math.random() * GRADIENT_PRESETS.length)];
                                            setData({
                                                ...data,
                                                theme: {
                                                    ...data.theme,
                                                    presetId: randomPreset.id,
                                                    backgroundColors: { ...randomPreset.colors }
                                                }
                                            });
                                        }}
                                        className="p-2 bg-secondary hover:bg-secondary/80 rounded-md"
                                        title="Random Preset"
                                    >
                                        <RefreshCw size={16} />
                                    </MagneticButton>
                                </div>

                                {/* Preset Preview dots for current selection */}
                                {data.theme?.backgroundColors && (
                                    <div className="flex items-center gap-2 p-2 rounded-md bg-secondary/30 mt-2">
                                        <span className="text-[10px] text-muted-foreground mr-auto">Current Palette:</span>
                                        <div className="w-4 h-4 rounded-full" style={{ background: data.theme.backgroundColors.color1 }} />
                                        <div className="w-4 h-4 rounded-full" style={{ background: data.theme.backgroundColors.color2 }} />
                                        <div className="w-4 h-4 rounded-full" style={{ background: data.theme.backgroundColors.color3 }} />
                                        <div className="w-4 h-4 rounded-full" style={{ background: data.theme.backgroundColors.color4 }} />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center justify-between">
                                    Manual Overrides
                                    {data.theme?.presetId && data.theme.presetId !== 'custom' && (
                                        <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded">Editing will switch to Custom</span>
                                    )}
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    {([
                                        { label: "Top Left", key: 'color1', default: "rgba(217, 70, 239, 0.5)" },
                                        { label: "Bottom Right", key: 'color2', default: "rgba(34, 211, 238, 0.5)" },
                                        { label: "Center", key: 'color3', default: "rgba(167, 139, 250, 0.4)" },
                                        { label: "Top Middle", key: 'color4', default: "rgba(244, 114, 182, 0.4)" }
                                    ] as const).map((c) => {
                                        const colorKey = c.key as keyof NonNullable<NonNullable<SiteSettings['theme']>['backgroundColors']>;
                                        const currentValue = data.theme?.backgroundColors?.[colorKey] || c.default;

                                        return (
                                            <div key={c.key} className="space-y-1">
                                                <label className="text-[10px] text-muted-foreground">{c.label}</label>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-8 h-8 rounded-full border border-border shrink-0"
                                                        style={{ background: currentValue }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={currentValue}
                                                        onChange={e => setData({
                                                            ...data,
                                                            theme: {
                                                                ...data.theme,
                                                                presetId: 'custom', // Switch to custom on manual edit
                                                                backgroundColors: {
                                                                    color1: data.theme?.backgroundColors?.color1 || "rgba(217, 70, 239, 0.5)",
                                                                    color2: data.theme?.backgroundColors?.color2 || "rgba(34, 211, 238, 0.5)",
                                                                    color3: data.theme?.backgroundColors?.color3 || "rgba(167, 139, 250, 0.4)",
                                                                    color4: data.theme?.backgroundColors?.color4 || "rgba(244, 114, 182, 0.4)",
                                                                    ...data.theme?.backgroundColors,
                                                                    [c.key]: e.target.value
                                                                }
                                                            }
                                                        })}
                                                        className="w-full p-2 rounded-md bg-background border border-border text-xs font-mono"
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                    Supports HEX, RGBA, and standard CSS color names.
                                    <strong>Tip:</strong> Use RGBA with opacity (e.g. `rgba(255, 0, 0, 0.5)`) for better blending.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <EditableWrapper label="HERO_TITLE" helperText="Main headline on the homepage.">
                                <label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">Hero Title</label>
                                <input
                                    value={data.heroTitle}
                                    onChange={e => setData({ ...data, heroTitle: e.target.value })}
                                    className="w-full p-2 rounded-md bg-secondary/30 border border-border text-lg font-bold focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                            </EditableWrapper>
                        </div>

                        <div className="space-y-2">
                            <EditableWrapper label="HERO_DESC" helperText="Subtext below the main headline.">
                                <label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">Hero Description</label>
                                <textarea
                                    value={data.heroDescription}
                                    onChange={e => setData({ ...data, heroDescription: e.target.value })}
                                    className="w-full p-2 rounded-md bg-secondary/30 border border-border resize-none h-24 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                            </EditableWrapper>
                        </div>

                        <div className="space-y-2">
                            <EditableWrapper label="FOOTER_COPY" helperText="Copyright notice or footer message.">
                                <label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">Footer Text</label>
                                <input
                                    value={data.footerText}
                                    onChange={e => setData({ ...data, footerText: e.target.value })}
                                    className="w-full p-2 rounded-md bg-secondary/30 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                            </EditableWrapper>
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

                        {/* SEO Section used to be missing, adding it now */}
                        <div className="p-4 rounded-lg bg-secondary/20 border border-border mt-2">
                            <h4 className="font-bold text-sm mb-4">SEO Defaults</h4>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">Default Title</label>
                                    <input
                                        value={data.seo?.defaultTitle || ""}
                                        onChange={e => setData({ ...data, seo: { ...data.seo, defaultTitle: e.target.value } })}
                                        className="w-full p-2 rounded-md bg-background border border-border text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">Default Description</label>
                                    <textarea
                                        value={data.seo?.defaultDescription || ""}
                                        onChange={e => setData({ ...data, seo: { ...data.seo, defaultDescription: e.target.value } })}
                                        className="w-full p-2 rounded-md bg-background border border-border text-sm h-20 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-secondary/20 border border-border mt-4">
                            <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><Lock size={14} /> Security</h4>
                            <p className="text-xs text-muted-foreground mb-2">
                                Admin Password is set in your environment variables (`ADMIN_PASSWORD`).
                            </p>
                        </div>

                        <MagneticButton onClick={handleSave} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium">
                            Save Site Settings
                        </MagneticButton>
                    </div>
                </div>
            </div>

            {/* Logo Picker Modal */}
            <AnimatePresence>
                {showLogoPicker && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <div className="w-full max-w-5xl h-[80vh] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-border">
                                <h3 className="font-bold">Select Logo</h3>
                                <button onClick={() => setShowLogoPicker(false)}><X size={20} /></button>
                            </div>
                            <div className="flex-1 overflow-hidden p-4">
                                <MediaLibrary
                                    mode="select"
                                    onSelect={(photo) => {
                                        setData({
                                            ...data!,
                                            branding: {
                                                ...data!.branding!,
                                                logoId: photo.id,
                                                logoUrl: photo.url,
                                                logoAltText: photo.altText
                                            }
                                        });
                                        setShowLogoPicker(false);
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
