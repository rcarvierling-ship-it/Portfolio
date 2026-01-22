"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Monitor, Briefcase, Image, BarChart2, Zap, Box, Activity } from "lucide-react"
import { HistoryCard } from "@/components/dashboard/sections/history-card"
import { MetricsSnapshot } from "@/components/dashboard/sections/metrics-snapshot"
import { cn } from "@/lib/utils"

interface DashboardHomeProps {
    setActiveTab: (tab: any) => void;
}

export function DashboardHome({ setActiveTab }: DashboardHomeProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-12 animate-in fade-in duration-500">

            {/* ZONE 2: PRIMARY ACTIONS */}
            <section className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Edit Home */}
                    <ActionCard
                        title="Edit Home"
                        description="Manage hero & sections"
                        icon={<Monitor className="w-6 h-6" />}
                        onClick={() => setActiveTab('pages')}
                        gradient="from-blue-500/10 to-blue-500/5 hover:to-blue-500/20"
                        accentColor="text-blue-500"
                    />

                    {/* Manage Work */}
                    <ActionCard
                        title="Manage Work"
                        description="Add projects & client work"
                        icon={<Briefcase className="w-6 h-6" />}
                        onClick={() => setActiveTab('projects')}
                        gradient="from-purple-500/10 to-purple-500/5 hover:to-purple-500/20"
                        accentColor="text-purple-500"
                    />

                    {/* Media Library */}
                    <ActionCard
                        title="Media Library"
                        description="Upload & manage assets"
                        icon={<Image className="w-6 h-6" />}
                        onClick={() => setActiveTab('photos')}
                        gradient="from-pink-500/10 to-pink-500/5 hover:to-pink-500/20"
                        accentColor="text-pink-500"
                    />

                    {/* Analytics */}
                    <ActionCard
                        title="View Analytics"
                        description="Traffic & performance"
                        icon={<BarChart2 className="w-6 h-6" />}
                        onClick={() => setActiveTab('analytics-overview')}
                        gradient="from-emerald-500/10 to-emerald-500/5 hover:to-emerald-500/20"
                        accentColor="text-emerald-500"
                    />
                </div>
            </section>


            {/* WRAPPER FOR ZONE 3 & 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ZONE 3: SECONDARY / ADVANCED TOOLS (Col 1) */}
                <section className="lg:col-span-1 space-y-6">
                    <div>
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            Advanced Tools
                        </h2>
                        <div className="space-y-3">
                            <ToolRow
                                label="Sandbox Environment"
                                icon={<Box size={16} />}
                                onClick={() => router.push('/dashboard/sandbox')} // Assuming this route exists
                            />
                            <ToolRow
                                label="Chaos Mode"
                                icon={<Zap size={16} />}
                                onClick={() => alert("Chaos Mode functionality is currently experimental.")}
                                destructive
                            />
                            <ToolRow
                                label="Analytics Simulator"
                                icon={<Activity size={16} />}
                                onClick={() => setActiveTab('analytics-sources')} // Mapping to sources for now
                            />
                        </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-secondary/5 mt-8">
                        <h4 className="font-medium text-sm mb-2 text-muted-foreground">System Status</h4>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-sm">All Systems Operational</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Database latency: 24ms</p>
                    </div>
                </section>


                {/* ZONE 4: CONTEXT & FEEDBACK (Col 2 & 3) */}
                <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <HistoryCard />
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <MetricsSnapshot />
                    </div>
                </section>

            </div>
        </div>
    )
}

function ActionCard({ title, description, icon, onClick, gradient, accentColor }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative group overflow-hidden p-6 h-40 rounded-xl border border-border text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                "bg-gradient-to-br",
                gradient
            )}
        >
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className={cn("mb-4 p-3 rounded-lg w-fit bg-background shadow-sm", accentColor)}>
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-lg leading-tight mb-1 group-hover:underline decoration-2 decoration-primary/50 underline-offset-4">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    )
}

function ToolRow({ label, icon, onClick, destructive }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg border border-border bg-card transition-colors hover:bg-secondary/50",
                destructive ? "hover:border-red-500/50 hover:bg-red-500/5" : ""
            )}
        >
            <div className="flex items-center gap-3">
                <div className={cn("text-muted-foreground", destructive ? "text-red-500" : "")}>
                    {icon}
                </div>
                <span className={cn("text-sm font-medium", destructive ? "text-red-500" : "")}>{label}</span>
            </div>
            <span className="text-xs text-muted-foreground">→</span>
        </button>
    )
}
