"use client"

import { useState, useEffect, Suspense } from "react"
import { cn } from "@/lib/utils"
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, Cloud, Eye, ArrowUpRight } from "lucide-react"

// Tab Components
import { DashboardHome } from "@/components/dashboard/dashboard-home"
import { ProjectsTab } from "@/components/dashboard/projects-tab"
import { PhotosTab } from "@/components/dashboard/photos-tab"
import { PagesTab } from "@/components/dashboard/pages-tab"
import { SettingsTab } from "@/components/dashboard/settings-tab"
import { AboutTab } from "@/components/dashboard/about-tab"
import { AnalyticsOverview } from "@/components/dashboard/analytics/analytics-overview"
import { AnalyticsProjects } from "@/components/dashboard/analytics/analytics-projects"
import { AnalyticsSources } from "@/components/dashboard/analytics/analytics-sources"
import { SecurityTab } from "@/components/dashboard/security-tab"
import { GlobalSearch } from "@/components/dashboard/global-search"

export default function DashboardWrapper() {
    return (
        <SessionProvider>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-primary animate-spin" /></div>}>
                <DashboardPage />
            </Suspense>
        </SessionProvider>
    )
}

type Tab = "overview" | "projects" | "photos" | "pages" | "about" | "settings" | "analytics-overview" | "analytics-projects" | "analytics-sources" | "security";

function DashboardPage() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();

    const activeTab = (searchParams.get("tab") as Tab) || "overview";

    const setActiveTab = (tab: Tab) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        params.delete("editId");
        router.push(`/dashboard?${params.toString()}`);
    }

    useEffect(() => {
        if (status === "unauthenticated") {
            signIn();
        }
    }, [status]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-t-2 border-primary animate-spin" />
                    <p className="text-muted-foreground">Verifying access...</p>
                </div>
            </div>
        )
    }

    if (!session) return null;

    // ZONE 1: GLOBAL STATUS BAR CONFIG
    const lastPublished = "Today, 10:42 AM"; // Placeholder - in real app would come from API

    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* ZONE 1: GLOBAL STATUS BAR (Fixed Top) */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16 px-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">A</div>
                        <h1 className="font-bold text-lg hidden md:block">Antigravity</h1>
                    </div>

                    <div className="hidden md:flex items-center gap-4 text-xs">
                        <div className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Live
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1">
                            <Cloud size={12} />
                            <span>Published: {lastPublished}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <GlobalSearch />

                    <div className="h-6 w-px bg-border hidden md:block" />

                    <div className="flex items-center gap-2">
                        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors">
                            <Eye size={14} /> Preview
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-md shadow-sm hover:brightness-110 transition-all">
                            Publish <ArrowUpRight size={14} className="opacity-75" />
                        </button>
                    </div>

                    <div className="ml-2">
                        <button
                            onClick={() => signOut()}
                            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                            title="Sign Out"
                        >
                            {session.user?.name?.[0] || "U"}
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="pt-24 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">

                {/* Back Button (Breadcrumb) only if not on overview */}
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

                    {activeTab === "about" && <AboutTab />}
                    {activeTab === "settings" && <SettingsTab />}
                    {activeTab === "security" && <SecurityTab />}
                </div>

            </main>
        </div>
    )
}
