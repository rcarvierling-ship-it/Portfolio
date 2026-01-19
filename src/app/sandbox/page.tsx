"use client"

import { useSandbox } from "@/lib/sandbox/context"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { Monitor, RefreshCcw, Copy, Camera, Layout, BarChart3, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SandboxDashboard() {
    const { store, forceUpdate } = useSandbox();
    const router = useRouter();

    const handleReset = () => {
        if (confirm("Reset the entire sandbox? All your experimental changes will be lost.")) {
            store.reset();
            forceUpdate();
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto w-full space-y-12">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Sandbox Playground</h1>
                    <p className="text-muted-foreground">Experiment safely with mock data. Nothing here touches the real database.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2">
                        <ArrowLeft size={16} /> Back to Real Dashboard
                    </Link>
                    <MagneticButton onClick={handleReset} className="bg-destructive/10 text-destructive border border-destructive/20 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-destructive hover:text-white transition-colors">
                        <RefreshCcw size={16} /> Reset Sandbox
                    </MagneticButton>
                </div>
            </div>

            {/* Quick Stats (Mock) */}
            <div className="grid grid-cols-4 gap-6">
                <div className="bg-card p-6 rounded-xl border shadow-sm">
                    <h3 className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-2">Mock Projects</h3>
                    <p className="text-3xl font-bold">{store.projects.length}</p>
                </div>
                <div className="bg-card p-6 rounded-xl border shadow-sm">
                    <h3 className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-2">Mock Photos</h3>
                    <p className="text-3xl font-bold">{store.photos.length}</p>
                </div>
                <div className="bg-card p-6 rounded-xl border shadow-sm">
                    <h3 className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-2">Live Sim Visitors</h3>
                    <p className="text-3xl font-bold text-green-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        {store.analytics.liveVisitors}
                    </p>
                </div>
                <div className="bg-card p-6 rounded-xl border shadow-sm">
                    <h3 className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-2">Status</h3>
                    <p className="text-3xl font-bold text-yellow-500">ISOLATED</p>
                </div>
            </div>

            {/* Experiment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Visual Editor Card */}
                <div className="bg-secondary/20 p-6 rounded-xl border border-border space-y-4 hover:border-primary/50 transition-colors group">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Layout size={24} />
                    </div>
                    <h2 className="text-xl font-bold">Visual Page Editor</h2>
                    <p className="text-sm text-muted-foreground">Test new layouts and content structures for Home, About, and Contact pages without affecting the live site.</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                        <Link href="/sandbox/pages/home" className="text-xs bg-background px-3 py-1.5 rounded-md border font-medium hover:text-primary">Edit Home</Link>
                        <Link href="/sandbox/pages/about" className="text-xs bg-background px-3 py-1.5 rounded-md border font-medium hover:text-primary">Edit About</Link>
                        <Link href="/sandbox/pages/contact" className="text-xs bg-background px-3 py-1.5 rounded-md border font-medium hover:text-primary">Edit Contact</Link>
                    </div>
                </div>

                {/* Project Experiments */}
                <div className="bg-secondary/20 p-6 rounded-xl border border-border space-y-4 hover:border-primary/50 transition-colors group relative">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                        <Copy size={24} />
                    </div>
                    <h2 className="text-xl font-bold">Project Manager</h2>
                    <p className="text-sm text-muted-foreground">Manage {store.projects.length} mock projects. Test reordering, deletion, and duplication logic safely.</p>
                    <div className="flex gap-2 pt-2">
                        <Link href="/sandbox/projects" className="text-xs bg-background px-3 py-1.5 rounded-md border font-medium hover:text-primary hover:border-primary">Launch Manager</Link>
                    </div>
                </div>

                {/* Media Library */}
                <div className="bg-secondary/20 p-6 rounded-xl border border-border space-y-4 hover:border-primary/50 transition-colors group relative">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                        <Camera size={24} />
                    </div>
                    <h2 className="text-xl font-bold">Media Library</h2>
                    <p className="text-sm text-muted-foreground">Mess around with {store.photos.length} mock photos. Test drag-and-drop, tagging, and mass deletion.</p>
                    <div className="flex gap-2 pt-2">
                        <Link href="/sandbox/media" className="text-xs bg-background px-3 py-1.5 rounded-md border font-medium hover:text-primary hover:border-primary">Open Library</Link>
                    </div>
                </div>

                {/* Analytics Simulator */}
                <div className="bg-secondary/20 p-6 rounded-xl border border-border space-y-4 hover:border-primary/50 transition-colors group relative">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                        <BarChart3 size={24} />
                    </div>
                    <h2 className="text-xl font-bold">Analytics Simulator</h2>
                    <p className="text-sm text-muted-foreground">Inject fake traffic spikes and visualize data streams.</p>
                    <div className="flex gap-2 pt-2">
                        <Link href="/sandbox/analytics" className="text-xs bg-background px-3 py-1.5 rounded-md border font-medium hover:text-primary hover:border-primary">Start Simulation</Link>
                    </div>
                </div>

                {/* Destructive Zone */}
                <div className="bg-red-500/5 p-6 rounded-xl border border-red-500/20 space-y-4 hover:border-red-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                        <AlertTriangle size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-red-500">Chaos Mode</h2>
                    <p className="text-sm text-muted-foreground">Intentionally break things to test error boundaries.</p>
                    <div className="flex gap-2 pt-2">
                        <button className="text-xs bg-background px-3 py-1.5 rounded-md border border-red-200 text-red-500 font-medium hover:bg-red-500 hover:text-white transition-colors"
                            onClick={() => {
                                // Simple chaos: corrupt the store
                                store.projects = [];
                                store.photos = [];
                                forceUpdate();
                                alert("💥 Chaos unleashed! Data wiped.");
                            }}
                        >
                            Wipe All Data
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
