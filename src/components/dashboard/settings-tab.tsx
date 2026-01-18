"use client"

import { useState, useEffect } from "react"
import { Settings, Lock } from "lucide-react"
import { SiteSettings } from "@/lib/types"
import { MagneticButton } from "@/components/ui/magnetic-button"

export function SettingsTab() {
    const [data, setData] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);

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
            if (res.ok) alert("Site Settings Saved!");
            else alert("Failed to save");
        } catch (e) {
            alert("Error saving settings");
        }
    }

    if (loading || !data) return <div>Loading settings...</div>;

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
    )
}
