"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { Eye, ArrowUpRight } from "lucide-react"

import { LivePreviewModal } from "@/components/dashboard/live-preview-modal"
import { CommandPalette } from "@/components/ui/command-palette"
import { DashboardHome } from "@/components/dashboard/dashboard-home"
import { ProjectsTab } from "@/components/dashboard/projects-tab"
import { PhotosTab } from "@/components/dashboard/photos-tab"
import { PagesTab } from "@/components/dashboard/pages-tab"
import { AboutTab } from "@/components/dashboard/about-tab"
import { SettingsTab } from "@/components/dashboard/settings-tab"
import { SecurityTab } from "@/components/dashboard/security-tab"
import { SystemMap } from "@/components/dashboard/system-map"
import { ContactInboxTab } from "@/components/dashboard/contact-inbox-tab"

import { AnalyticsOverview } from "@/components/dashboard/analytics/analytics-overview"
import { AnalyticsProjects } from "@/components/dashboard/analytics/analytics-projects"
import { AnalyticsSources } from "@/components/dashboard/analytics/analytics-sources"
import { GearAnalytics } from "@/components/dashboard/analytics/gear-analytics"
import { HeatmapViewer } from "@/components/dashboard/analytics/heatmap-viewer"

type Tab = "overview" | "projects" | "photos" | "pages" | "about" | "settings" | "contact-inbox" | "analytics-overview" | "analytics-projects" | "analytics-sources" | "analytics-gear" | "analytics-heatmap" | "security" | "system-map";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [showPreview, setShowPreview] = useState(false);

    const activeTab = (searchParams.get("tab") as Tab) || "overview";

    const setActiveTab = (tab: Tab) => {
        router.push(`/dashboard?tab=${tab}`);
    }

    // Auth Check
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') return <div className="h-screen flex items-center justify-center">Loading...</div>;

    if (!session) return null;

    const lastPublished = "Today, 10:42 AM"; // Mock

    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* ZONE 1: COMMAND BAR (Fixed Top) */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b-2 border-primary/10 h-16 px-6 flex items-center justify-between shadow-sm">

                {/* Left Side */}
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('overview')}>
                        <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">A</div>
                        <div className="flex flex-col">
                            <h1 className="font-bold text-sm leading-none">Antigravity</h1>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Dashboard</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6 border-l border-border pl-6 h-8">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Status</span>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-green-500">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Live System
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Last Published</span>
                            <span className="text-xs font-medium">{lastPublished}</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: COMMAND & ACTIONS */}
                <div className="flex items-center gap-6">

                    <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                        <span>All changes saved</span>
                    </div>

                    <div className="h-6 w-px bg-border hidden md:block" />

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowPreview(true)}
                            className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary rounded-md transition-colors border border-transparent hover:border-border"
                        >
                            <Eye size={14} />
                            <span>Preview Site</span>
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-primary text-primary-foreground rounded-md shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:translate-y-0">
                            Publish Changes <ArrowUpRight size={14} className="opacity-75" />
                        </button>
                    </div>

                    <div className="ml-2 pl-4 border-l border-border">
                        <button
                            onClick={() => signOut()}
                            className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-secondary/50 border border-white/10 flex items-center justify-center text-xs font-bold text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all shadow-sm"
                            title="Sign Out"
                        >
                            {session.user?.name?.[0] || "U"}
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="pt-24 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">

                {/* Back Button (Breadcrumb) */}
                {activeTab !== 'overview' && (
                    <div className="mb-8 flex items-center gap-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                            ← Back to Command Center
                        </button>
                    </div>
                )}

                {/* TAB CONTENT */}
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {activeTab === "overview" && <DashboardHome setActiveTab={setActiveTab} />}

                    {activeTab === "projects" && <ProjectsTab />}
                    {activeTab === "photos" && <PhotosTab />}
                    {activeTab === "pages" && <PagesTab />}

                    {activeTab === "analytics-overview" && <AnalyticsOverview />}
                    {activeTab === "analytics-projects" && <AnalyticsProjects />}
                    {activeTab === "analytics-sources" && <AnalyticsSources />}
                    {activeTab === "analytics-gear" && <GearAnalytics />}
                    {activeTab === "analytics-heatmap" && <HeatmapViewer />}

                    {activeTab === "about" && <AboutTab />}
                    {activeTab === "settings" && <SettingsTab />}
                    {activeTab === "contact-inbox" && <ContactInboxTab />}
                    {activeTab === "security" && <SecurityTab />}
                    {activeTab === "system-map" && <SystemMap />}
                </div>

            </main>

            {/* Live Preview Modal */}
            <LivePreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} />

            {/* Global Command Palette */}
            <CommandPalette />
        </div>
    )
}
