"use client";

import { SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DynamicLogoProps {
    settings?: SiteSettings;
    className?: string;
}

export function DynamicLogo({ settings, className }: DynamicLogoProps) {
    const [logoSettings, setLogoSettings] = useState(settings?.branding);

    // If settings change (e.g. from props update or granular state), update local state
    useEffect(() => {
        if (settings?.branding) {
            setLogoSettings(settings.branding);
        }
    }, [settings?.branding]);

    const showLogo = logoSettings?.showLogo ?? true;
    const logoSize = logoSettings?.logoSize || 32;
    const logoMargin = logoSettings?.logoMargin || 8;
    const logoUrl = logoSettings?.logoUrl || "/logo.png";
    const logoAlt = logoSettings?.logoAltText || "Brand Logo";

    // Safety check: if hidden explicitly
    if (!showLogo && !logoSettings?.brandName) return null;

    return (
        <div
            className={cn("flex items-center select-none", className)}
            style={{ gap: `${logoMargin / 4}rem` }} // Convert px roughly to rem units or just use pixels
        >
            {showLogo && (
                <div
                    className="relative shrink-0 select-none"
                    style={{
                        width: `${logoSize}px`,
                        height: `${logoSize}px`
                    }}
                >
                    <img
                        src={logoUrl}
                        alt={logoAlt}
                        className="w-full h-full object-contain invert dark:invert-0"
                    />
                </div>
            )}

            {logoSettings?.brandName && (
                <span className="text-sm font-mono uppercase tracking-widest hidden md:block whitespace-nowrap">
                    {logoSettings.brandName}
                </span>
            )}
        </div>
    );
}
