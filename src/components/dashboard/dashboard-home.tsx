"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Monitor, Briefcase, Image, BarChart2, Zap, Box, Activity, ArrowRight, LayoutDashboard } from "lucide-react"
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
                    <h2 className="text-2xl font-bold tracking-tight">Primary Actions</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Edit Home & Manage Work - The Two Main Pillars */}
                    <HeroActionCard
                        title="Edit Website Layout"
                        description="Manage global layout, pages, sections, and site structure."
                        icon={<Monitor className="w-8 h-8" />}
                        onClick={() => setActiveTab('pages')}
                        gradient="from-blue-500/20 via-blue-500/5 to-transparent"
                        accentColor="text-blue-500"
                        borderColor="hover:border-blue-500/50"
                    />

                    <HeroActionCard
                        title="Manage Work"
                        description="Add new case studies, update project details, and organize portfolio."
                        icon={<Briefcase className="w-8 h-8" />}
                        onClick={() => setActiveTab('projects')}
                        gradient="from-purple-500/20 via-purple-500/5 to-transparent"
                        accentColor="text-purple-500"
                        borderColor="hover:border-purple-500/50"
                    />

                    {/* Secondary Tier of Primary Actions */}
                    <HeroActionCard
                        title="Media Library"
                        description="Upload images, manage assets, and organize files."
                        icon={<Image className="w-8 h-8" />}
                        onClick={() => setActiveTab('photos')}
                        gradient="from-pink-500/20 via-pink-500/5 to-transparent"
                        accentColor="text-pink-500"
                        borderColor="hover:border-pink-500/50"
                        compact
                    />

                    <HeroActionCard
                        title="View Analytics"
                        description="Check traffic sources, visitor engagement, and performance stats."
                        icon={<BarChart2 className="w-8 h-8" />}
                        onClick={() => setActiveTab('analytics-overview')}
                        gradient="from-emerald-500/20 via-emerald-500/5 to-transparent"
                        accentColor="text-emerald-500"
                        borderColor="hover:border-emerald-500/50"
                        compact
                    />
                </div>
            </section>


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* ZONE 3: SECONDARY / ADVANCED TOOLS */}
                {/* Design Rule: Visually separated, clearly "secondary". */}
                <section className="lg:col-span-4 space-y-6">
                    <div className="border-t border-border pt-8">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                            Advanced / Experimental
                        </h2>

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
                    <div className="border-t border-border pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-secondary/5 border border-border/50 rounded-xl p-6">
                                <HistoryCard />
                            </div>
                            <div className="bg-secondary/5 border border-border/50 rounded-xl p-6">
                                <MetricsSnapshot />
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}

function HeroActionCard({ title, description, icon, onClick, gradient, accentColor, borderColor, compact }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative group overflow-hidden rounded-2xl border border-border text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                "bg-gradient-to-br bg-card",
                gradient,
                borderColor,
                compact ? "h-40" : "h-64"
            )}
        >
            <div className="relative z-10 flex flex-col justify-between h-full p-8">
                <div className="flex justify-between items-start">
                    <div className={cn("p-4 rounded-xl bg-background/80 backdrop-blur-sm shadow-sm transition-transform group-hover:scale-110 duration-500", accentColor)}>
                        {icon}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2">
                        <ArrowRight className="text-muted-foreground" />
                    </div>
                </div>

                <div>
                    <h3 className={cn("font-bold mb-2 group-hover:text-primary transition-colors", compact ? "text-xl" : "text-3xl")}>{title}</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed max-w-[90%]">{description}</p>
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
