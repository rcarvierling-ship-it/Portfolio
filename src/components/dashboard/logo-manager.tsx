"use client";

import { SiteSettings } from "@/lib/types";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Image as ImageIcon, Upload, Eye, EyeOff, Minus, Plus } from "lucide-react";
import { DynamicLogo } from "@/components/ui/dynamic-logo";

interface LogoManagerProps {
    settings: SiteSettings;
    onUpdate: (newSettings: SiteSettings) => void;
    onSelectLogoClick: () => void;
}

export function LogoManager({ settings, onUpdate, onSelectLogoClick }: LogoManagerProps) {
    const branding = settings.branding || { brandName: "" };

    const updateBranding = (updates: Partial<typeof branding>) => {
        onUpdate({
            ...settings,
            branding: {
                ...branding,
                ...updates
            }
        });
    };

    return (
        <div className="p-6 rounded-xl border border-border bg-secondary/10">
            <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-sm flex items-center gap-2">
                    <ImageIcon size={16} /> Logo Configuration
                </h4>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono text-muted-foreground mr-2">Visibility</span>
                    <button
                        onClick={() => updateBranding({ showLogo: !branding.showLogo })}
                        className={`p-2 rounded-full transition-colors ${branding.showLogo ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                        title={branding.showLogo ? "Logo Visible" : "Logo Hidden"}
                    >
                        {branding.showLogo !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Controls */}
                <div className="space-y-6">
                    {/* Size Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Size (px)</label>
                            <span className="text-xs font-mono">{branding.logoSize || 32}px</span>
                        </div>
                        <input
                            type="range"
                            min="16"
                            max="120"
                            value={branding.logoSize || 32}
                            onChange={(e) => updateBranding({ logoSize: parseInt(e.target.value) })}
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    {/* Margin Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Gap (px)</label>
                            <span className="text-xs font-mono">{branding.logoMargin || 8}px</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="48"
                            value={branding.logoMargin || 8}
                            onChange={(e) => updateBranding({ logoMargin: parseInt(e.target.value) })}
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    {/* Logo File Actions */}
                    <div className="flex items-center gap-4 pt-2">
                        <MagneticButton
                            onClick={onSelectLogoClick}
                            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-md flex items-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <Upload size={14} /> Replace Logo
                        </MagneticButton>

                        {branding.logoUrl && (
                            <button
                                onClick={() => updateBranding({ logoUrl: undefined, logoId: undefined })}
                                className="text-xs text-red-500 hover:underline"
                            >
                                Reset Default
                            </button>
                        )}
                    </div>
                </div>

                {/* Right: Live Preview */}
                <div className="relative rounded-lg border border-dashed border-border/60 bg-background/50 flex items-center justify-center min-h-[200px] overflow-hidden">
                    <div className="absolute top-2 left-2 text-[10px] font-mono uppercase text-muted-foreground">_Preview</div>

                    {/* Simulated Navbar Context */}
                    <div className="p-4 border-b border-border/20 w-full flex items-center bg-background/80 backdrop-blur-sm shadow-sm">
                        <DynamicLogo settings={settings} />

                        {/* Fake Nav Items */}
                        <div className="ml-auto hidden sm:flex gap-4 text-[10px] font-mono uppercase text-muted-foreground opacity-50">
                            <span>[ WORK ]</span>
                            <span>ABOUT</span>
                            <span>CONTACT</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
