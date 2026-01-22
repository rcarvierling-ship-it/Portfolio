import { LivePreviewModal } from "@/components/dashboard/live-preview-modal"

// ... imports ...

function DashboardPage() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [showPreview, setShowPreview] = useState(false); // Add state

    const activeTab = (searchParams.get("tab") as Tab) || "overview";

    // ... setActiveTab function ...

    // ... useEffect ...

    // ... loading check ...

    // ... session check ...

    const lastPublished = "Today, 10:42 AM";

    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* ZONE 1: COMMAND BAR (Fixed Top) */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b-2 border-primary/10 h-16 px-6 flex items-center justify-between shadow-sm">

                {/* ... Left Side ... */}
                <div className="flex items-center gap-8">
                    {/* ... Content ... */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('overview')}>
                        <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">A</div>
                        <div className="flex flex-col">
                            <h1 className="font-bold text-sm leading-none">Antigravity</h1>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Dashboard</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6 border-l border-border pl-6 h-8">
                        {/* ... Status indicators ... */}
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

                    {/* Unsaved Changes Indicator */}
                    <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                        <span>All changes saved</span>
                    </div>

                    <div className="h-6 w-px bg-border hidden md:block" />

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowPreview(true)} // Wired up!
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

                    {activeTab === "analytics-overview" && <AnalyticsOverview />}
                    {activeTab === "analytics-projects" && <AnalyticsProjects />}
                    {activeTab === "analytics-sources" && <AnalyticsSources />}

                    {activeTab === "about" && <AboutTab />}
                    {activeTab === "settings" && <SettingsTab />}
                    {activeTab === "security" && <SecurityTab />}
                </div>

            </main>

            {/* Live Preview Modal */}
            <LivePreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} />
        </div>
    )
}
