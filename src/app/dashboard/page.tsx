"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react"

// Tab Components
import { OverviewTab } from "@/components/dashboard/overview-tab"
import { ProjectsTab } from "@/components/dashboard/projects-tab"
import { PhotosTab } from "@/components/dashboard/photos-tab"
import { PagesTab } from "@/components/dashboard/pages-tab"
import { SettingsTab } from "@/components/dashboard/settings-tab"
import { AboutTab } from "@/components/dashboard/about-tab"
import { AnalyticsOverview } from "@/components/dashboard/analytics/analytics-overview"
import { AnalyticsProjects } from "@/components/dashboard/analytics/analytics-projects"
import { AnalyticsSources } from "@/components/dashboard/analytics/analytics-sources"
import { SecurityTab } from "@/components/dashboard/security-tab"

import { Suspense } from "react"

export default function DashboardWrapper() {
    return (
        <SessionProvider>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-primary animate-spin" /></div>}>
                <DashboardPage />
            </Suspense>
        </SessionProvider>
    )
}

// Define tab categories
type Tab = "overview" | "projects" | "photos" | "pages" | "about" | "settings" | "analytics-overview" | "analytics-projects" | "analytics-sources" | "security";

import { useRouter, useSearchParams } from "next/navigation"
import { GlobalSearch } from "@/components/dashboard/global-search"

function DashboardPage() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();

    const activeTab = (searchParams.get("tab") as Tab) || "overview";

    const setActiveTab = (tab: Tab) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        params.delete("editId"); // Clear edit state when switching tabs manually
        router.push(`/dashboard?${params.toString()}`);
    }

    // Redirect to login if unauthenticated
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

    const tabs: { id: Tab, label: string }[] = [
        { id: "overview", label: "Overview" },
        { id: "analytics-overview", label: "Analytics" },
        // { id: "analytics-projects", label: "Project Stats" }, // Maybe group these? 
        // Let's just put one main "Analytics" tab, and handle sub-tabs inside? 
        // User request asked for pages: /dashboard/analytics-overview etc. 
        // So they are distinct tabs efficiently.
        { id: "analytics-projects", label: "Perf" },
        { id: "analytics-sources", label: "Sources" },
        { id: "projects", label: "Work" },
        // { id: "photos", label: "Photos" }, // Removed as per request
        { id: "pages", label: "Pages" },
        { id: "about", label: "About" },
        { id: "settings", label: "Settings" },
        { id: "security", label: "Security" },
    ];

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Command Center</h1>
                    <p className="text-muted-foreground">Logged in as {session.user?.name || "Admin"}.</p>
                </div>

                <GlobalSearch />

                <div className="flex items-center gap-4">
                    <div className="flex gap-2 bg-secondary/50 p-1 rounded-full overflow-x-auto max-w-full">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                                    activeTab === tab.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="text-xs text-muted-foreground hover:text-red-500 underline ml-2"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="min-h-[500px]">
                {activeTab === "overview" && <OverviewTab />}
                {activeTab === "projects" && <ProjectsTab />}
                {activeTab === "photos" && <PhotosTab />}
                {activeTab === "pages" && <PagesTab />}

                {activeTab === "analytics-overview" && <AnalyticsOverview />}
                {activeTab === "analytics-projects" && <AnalyticsProjects />}
                {activeTab === "analytics-sources" && <AnalyticsSources />}

                {activeTab === "analytics-projects" && <AnalyticsProjects />}
                {activeTab === "analytics-sources" && <AnalyticsSources />}

                {activeTab === "about" && <AboutTab />}
                {activeTab === "settings" && <SettingsTab />}
                {activeTab === "security" && <SecurityTab />}
            </main>
        </div>
    )
}
