"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Monitor, Briefcase, Image, BarChart2, Zap, Box, Activity, ArrowRight, LayoutDashboard, Settings } from "lucide-react"
import { HistoryCard } from "@/components/dashboard/sections/history-card"
import { MetricsSnapshot } from "@/components/dashboard/sections/metrics-snapshot"
import { cn } from "@/lib/utils"

interface DashboardHomeProps {
    setActiveTab: (tab: any) => void;
}

export function DashboardHome({ setActiveTab }: DashboardHomeProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col animate-in fade-in duration-500 pb-20">

            {/* ZONE 2: PRIMARY ACTIONS - HERO SECTION */}
            {/* Design Rule: These must be visually larger than everything else. */}
            <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <LayoutDashboard size={20} />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold tracking-tight">System Operations</h2>
                        <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">_Primary_Controls</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Edit Home & Manage Work - The Two Main Pillars */}
                    <HeroActionCard
                        title="Edit Architecture"
                        description="Manage global layout, pages, sections, and site structure."
                        icon={<Monitor className="w-8 h-8" />}
                        onClick={() => router.push('/dashboard/pages')}
                        gradient="from-blue-500/10 via-blue-500/5 to-transparent"
                        accentColor="text-blue-500"
                        borderColor="hover:border-blue-500/50"
                        label="_LAYOUT_ENGINE"
                    />

                    <HeroActionCard
                        title="Manage Content"
                        description="Add new case studies, update project details, and organize portfolio."
                        icon={<Briefcase className="w-8 h-8" />}
                        onClick={() => setActiveTab('projects')}
                        gradient="from-purple-500/10 via-purple-500/5 to-transparent"
                        accentColor="text-purple-500"
                        borderColor="hover:border-purple-500/50"
                        label="_CMS_CORE"
                    />

                    {/* Secondary Tier of Primary Actions */}
                    <HeroActionCard
                        title="Media Library"
                        description="Upload images, manage assets, and organize files."
                        icon={<Image className="w-8 h-8" />}
                        onClick={() => setActiveTab('photos')}
                        gradient="from-pink-500/10 via-pink-500/5 to-transparent"
                        accentColor="text-pink-500"
                        borderColor="hover:border-pink-500/50"
                        label="_ASSETS"
                        compact
                    />

                    <HeroActionCard
                        title="Global Diagnostics"
                        description="Check traffic sources, visitor engagement, and performance stats."
                        icon={<BarChart2 className="w-8 h-8" />}
                        onClick={() => setActiveTab('analytics-overview')}
                        gradient="from-emerald-500/10 via-emerald-500/5 to-transparent"
                        accentColor="text-emerald-500"
                        borderColor="hover:border-emerald-500/50"
                        label="_ANALYTICS"
                        compact
                    />

                    {/* System Configuration - Full Width */}
                    <HeroActionCard
                        title="System Configuration"
                        description="Manage global branding, themes, SEO defaults, and site preferences."
                        icon={<Settings className="w-8 h-8" />}
                        onClick={() => setActiveTab('settings')}
                        gradient="from-orange-500/10 via-orange-500/5 to-transparent"
                        accentColor="text-orange-500"
                        borderColor="hover:border-orange-500/50"
                        label="_GLOBAL_CONFIG"
                        className="md:col-span-2"
                        compact
                    />
                </div>
            </section>


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* ZONE 3: SECONDARY / ADVANCED TOOLS */}
                {/* Design Rule: Visually separated, clearly "secondary". */}
                <section className="lg:col-span-4 space-y-6">
                    <div className="border-t border-dashed border-border/60 pt-8 relative">
                        <div className="absolute -top-3 left-0 bg-background px-2 text-[10px] uppercase font-mono text-muted-foreground">
                            _Advanced_Tools
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            <SecondaryToolRow
                                label="Sandbox Environment"
                                subtext="Safe testing ground"
                                icon={<Box size={14} />}
                                onClick={() => router.push('/dashboard/sandbox')}
                            />
                            <SecondaryToolRow
                                label="Analytics Simulator"
                                subtext="Generate mock traffic"
                                icon={<Activity size={14} />}
                                onClick={() => setActiveTab('analytics-sources')}
                            />
                            <SecondaryToolRow
                                label="Chaos Mode"
                                subtext="Inject random failures"
                                icon={<Zap size={14} />}
                                onClick={() => alert("Chaos Mode functionality is currently experimental.")}
                                destructive
                            />
                        </div>
                    </div>
                </section>


                {/* ZONE 4: CONTEXT & FEEDBACK */}
                {/* Design Rule: Passive info, status read-only feel. */}
                <section className="lg:col-span-8 space-y-6">
                    <div className="border-t border-dashed border-border/60 pt-8 relative">
                        <div className="absolute -top-3 left-0 bg-background px-2 text-[10px] uppercase font-mono text-muted-foreground">
                            _System_Status
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-secondary/5 border border-border/50 rounded-xl p-6 relative overflow-hidden group hover:border-border/80 transition-colors">
                                <div className="absolute top-2 right-2 opacity-50 text-[9px] font-mono uppercase">Log</div>
                                <HistoryCard />
                            </div>
                            <div className="bg-secondary/5 border border-border/50 rounded-xl p-6 relative overflow-hidden group hover:border-border/80 transition-colors">
                                <div className="absolute top-2 right-2 opacity-50 text-[9px] font-mono uppercase">Metrics</div>
                                <MetricsSnapshot />
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}

function HeroActionCard({ title, description, icon, onClick, gradient, accentColor, borderColor, compact, label, className }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative group overflow-hidden rounded-lg border border-border/60 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
                "bg-gradient-to-br bg-card",
                gradient,
                borderColor,
                compact ? "h-40" : "h-64",
                className
            )}
        >
            {label && (
                <div className="absolute top-4 right-4 text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest border border-border/40 px-2 py-0.5 rounded-full group-hover:border-border/80 transition-colors">
                    {label}
                </div>
            )}

            <div className="relative z-10 flex flex-col justify-between h-full p-8">
                <div className="flex justify-between items-start">
                    <div className={cn("p-3 rounded-lg bg-background/80 backdrop-blur-sm shadow-sm transition-transform group-hover:scale-110 duration-500 border border-border/50", accentColor)}>
                        {icon}
                    </div>
                </div>

                <div>
                    <h3 className={cn("font-bold mb-2 group-hover:text-primary transition-colors tracking-tight", compact ? "text-xl" : "text-2xl")}>{title}</h3>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[90%] opacity-80">{description}</p>
                </div>
            </div>
        </button>
    )
}

function SecondaryToolRow({ label, subtext, icon, onClick, destructive }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center justify-between p-3 rounded-md border border-transparent hover:bg-secondary/50 hover:border-border transition-all group",
                destructive ? "hover:bg-red-500/10 hover:border-red-500/20" : ""
            )}
        >
            <div className="flex items-center gap-3">
                <div className={cn("text-muted-foreground group-hover:text-foreground transition-colors", destructive ? "text-red-500 group-hover:text-red-600" : "")}>
                    {icon}
                </div>
                <div className="text-left">
                    <div className={cn("text-sm font-medium", destructive ? "text-red-500" : "")}>{label}</div>
                    <div className="text-[10px] text-muted-foreground">{subtext}</div>
                </div>
            </div>
        </button>
    )
}
