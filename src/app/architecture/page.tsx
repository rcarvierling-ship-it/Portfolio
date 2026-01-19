import { Metadata } from 'next'
import { Shield, Server, Database, Layers, ArrowRight, Lock, Activity, Layout, Box, GitBranch, RefreshCcw, Eye } from "lucide-react"

export const metadata: Metadata = {
    title: 'System Architecture | Private',
    robots: {
        index: false,
        follow: false,
    },
}

export default function ArchitecturePage() {
    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-purple-500/30">
            {/* Header / Badge */}
            <div className="fixed top-0 left-0 right-0 z-50 p-6 pointer-events-none flex justify-between items-start">
                <div className="bg-black/50 backdrop-blur-md border border-white/5 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-2xl">
                    <Lock size={12} className="text-orange-500" />
                    <span className="text-xs font-mono font-medium tracking-wider text-orange-500/80 uppercase">Private / Internal Only</span>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-24 space-y-32">

                {/* 1. Overview */}
                <section className="space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tight">
                        Architecture &<br />Design Decisions
                    </h1>
                    <p className="text-lg md:text-xl leading-relaxed text-gray-400 max-w-2xl">
                        This platform is built to solve a specific problem: <span className="text-white font-medium">Safe Iteration.</span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <Shield className="w-8 h-8 text-emerald-500 mb-4" />
                            <h3 className="font-bold text-white mb-2">Isolation</h3>
                            <p className="text-sm">Sandbox environment is completely decoupled from production. DB writes are impossible in sandbox mode.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <RefreshCcw className="w-8 h-8 text-blue-500 mb-4" />
                            <h3 className="font-bold text-white mb-2">Reversibility</h3>
                            <p className="text-sm">Content uses versioned snapshots. Rollbacks are instant. Mock data resets with a single click.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <Activity className="w-8 h-8 text-purple-500 mb-4" />
                            <h3 className="font-bold text-white mb-2">Observability</h3>
                            <p className="text-sm">Analytics are ingrained in the runtime, not tacked on. Every interaction is measured.</p>
                        </div>
                    </div>
                </section>

                {/* 2. System Architecture Diagram */}
                <section className="space-y-8">
                    <div className="border-l-2 border-purple-500/50 pl-6">
                        <h2 className="text-2xl font-bold text-white">System Architecture</h2>
                        <p className="text-sm text-gray-500 mt-1">High-level data flow and separation of concerns.</p>
                    </div>

                    <div className="w-full bg-[#0a0a0a] rounded-xl border border-white/10 p-8 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

                        {/* CSS-based Diagram replacement for SVG complexity */}
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                            {/* Client Layer */}
                            <div className="space-y-4">
                                <div className="text-xs font-mono text-center text-gray-500 uppercase tracking-widest mb-4">Client Layer</div>
                                <div className="bg-[#111] p-4 rounded-lg border border-purple-500/30 shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)] text-center">
                                    <h4 className="font-bold text-purple-400">Public Site</h4>
                                    <div className="text-xs text-gray-500 mt-1">SSR / ISR</div>
                                </div>
                                <div className="bg-[#111] p-4 rounded-lg border border-orange-500/30 text-center opacity-80">
                                    <h4 className="font-bold text-orange-400">/dashboard</h4>
                                    <div className="text-xs text-gray-500 mt-1">Auth Protected</div>
                                </div>
                                <div className="bg-[#111] p-4 rounded-lg border border-emerald-500/30 text-center opacity-80">
                                    <h4 className="font-bold text-emerald-400">/sandbox</h4>
                                    <div className="text-xs text-gray-500 mt-1">Isolated Context</div>
                                </div>
                            </div>

                            {/* Logic/API Layer */}
                            <div className="space-y-4 relative md:top-12">
                                <div className="text-xs font-mono text-center text-gray-500 uppercase tracking-widest mb-4">Edge / Server</div>
                                <div className="bg-[#151515] p-6 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-2">
                                    <Server size={24} className="text-gray-400" />
                                    <span className="font-bold text-sm">Next.js API Routes</span>
                                    <div className="w-full h-px bg-white/10 my-2" />
                                    <div className="text-xs font-mono text-gray-500">Middleware (Auth)</div>
                                </div>
                                <div className="flex justify-center">
                                    <ArrowRight className="rotate-90 text-gray-700" />
                                </div>
                            </div>

                            {/* Data Layer */}
                            <div className="space-y-4">
                                <div className="text-xs font-mono text-center text-gray-500 uppercase tracking-widest mb-4">Persistence</div>
                                <div className="bg-[#111] p-4 rounded-lg border border-blue-500/30 text-center">
                                    <Database size={20} className="mx-auto mb-2 text-blue-500" />
                                    <h4 className="font-bold text-blue-400">Neon Postgres</h4>
                                    <div className="text-xs text-gray-500 mt-1">Content & Analytics</div>
                                </div>
                                <div className="bg-[#111] p-4 rounded-lg border border-yellow-500/30 text-center">
                                    <Box size={20} className="mx-auto mb-2 text-yellow-500" />
                                    <h4 className="font-bold text-yellow-400">Object Storage</h4>
                                    <div className="text-xs text-gray-500 mt-1">Media Assets</div>
                                </div>
                            </div>
                        </div>

                        {/* Connection Lines (Simulated) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
                            <path d="M 300 100 Q 400 100 500 150" fill="none" stroke="white" strokeDasharray="4 4" />
                            <path d="M 500 250 Q 600 250 700 150" fill="none" stroke="white" strokeDasharray="4 4" />
                        </svg>
                    </div>
                </section>

                {/* 3. CMS Flow */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                        <div className="border-l-2 border-blue-500/50 pl-6">
                            <h2 className="text-2xl font-bold text-white">CMS Workflow</h2>
                            <p className="text-sm text-gray-500 mt-1">Drafting, previewing, and publishing.</p>
                        </div>
                        <ul className="space-y-4 text-sm text-gray-400 pt-4">
                            <li className="flex gap-4">
                                <div className="min-w-[24px] h-[24px] rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">1</div>
                                <div>
                                    <strong className="text-white block">Draft State</strong>
                                    Edits are saved to `project_versions` or `page_versions` with status `draft`. Not visible publicly.
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="min-w-[24px] h-[24px] rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">2</div>
                                <div>
                                    <strong className="text-white block">Preview</strong>
                                    The dashboard fetches draft content via protected APIs.
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="min-w-[24px] h-[24px] rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">3</div>
                                <div>
                                    <strong className="text-white block">Publish & Revalidate</strong>
                                    On publish, the `published` flag flips. `revalidatePath` is called to purge Next.js cache.
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-[#0a0a0a] rounded-xl border border-white/10 p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-4 bg-[#151515] p-3 rounded border border-white/5">
                            <div className="w-2 h-full bg-yellow-500 rounded-full" />
                            <div>
                                <div className="text-xs uppercase tracking-wider text-yellow-500 font-bold">Draft</div>
                                <div className="text-xs text-gray-500">v14 • Edited 2m ago</div>
                            </div>
                        </div>
                        <div className="flex justify-center text-gray-600"><ArrowRight className="rotate-90" size={16} /></div>
                        <div className="flex items-center gap-4 bg-[#151515] p-3 rounded border border-white/5">
                            <div className="w-2 h-full bg-green-500 rounded-full" />
                            <div>
                                <div className="text-xs uppercase tracking-wider text-green-500 font-bold">Published</div>
                                <div className="text-xs text-gray-500">v12 • Live on Production</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Sandbox Isolation */}
                <section className="space-y-8">
                    <div className="border-l-2 border-emerald-500/50 pl-6">
                        <h2 className="text-2xl font-bold text-white">Sandbox Isolation</h2>
                        <p className="text-sm text-gray-500 mt-1">How we safely break things.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-[#0a0a0a] border border-emerald-500/20 rounded-xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 bg-emerald-500/20 text-emerald-500 text-xs font-bold uppercase rounded-bl-xl border-l border-b border-emerald-500/20">
                                Sandbox Context
                            </div>
                            <h3 className="font-bold text-white mb-4">Mock Logic</h3>
                            <pre className="text-xs font-mono text-emerald-300/80 overflow-x-auto p-4 bg-black/50 rounded-lg border border-white/5">
                                {`// src/lib/sandbox/store.ts
class MockStore {
  // In-memory only
  projects: Project[] = [];
  
  // No DB connection
  addProject(p) {
    this.projects.push(p);
  }

  reset() {
    this.projects = seed();
  }
}`}
                            </pre>
                            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                                When a user visits <code>/sandbox</code>, the app swaps the data provider. The layout wraps children in a <code>SandboxProvider</code> that intercepts all data calls and serves from the in-memory store.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-white font-bold">Why this matters</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Most portfolios are static. This one is a living application. I needed a way to test destructive actions (deleting projects, crashing analytics) without risking the actual database.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-500 list-disc list-inside">
                                <li>Zero risk of data loss</li>
                                <li>Instant state resets</li>
                                <li>Perfect for UI/UX experimentation</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 5. Analytics Pipeline */}
                <section className="space-y-8">
                    <div className="border-l-2 border-orange-500/50 pl-6">
                        <h2 className="text-2xl font-bold text-white">Analytics Pipeline</h2>
                        <p className="text-sm text-gray-500 mt-1">Privacy-first, performance-focused.</p>
                    </div>

                    <div className="bg-[#0a0a0a] rounded-xl border border-white/10 p-2 md:p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                            <div className="flex-1">
                                <div className="bg-white/5 p-4 rounded-lg mb-2 mx-auto w-16 h-16 flex items-center justify-center">
                                    <Eye className="text-white" />
                                </div>
                                <h4 className="font-bold text-sm">Event Capture</h4>
                                <p className="text-xs text-gray-500 mt-1">Middleware intercepts requests</p>
                            </div>
                            <ArrowRight className="text-gray-700 hidden md:block" />
                            <div className="flex-1">
                                <div className="bg-white/5 p-4 rounded-lg mb-2 mx-auto w-16 h-16 flex items-center justify-center">
                                    <Shield className="text-white" />
                                </div>
                                <h4 className="font-bold text-sm">Anonymization</h4>
                                <p className="text-xs text-gray-500 mt-1">IP hashing, no PII stored</p>
                            </div>
                            <ArrowRight className="text-gray-700 hidden md:block" />
                            <div className="flex-1">
                                <div className="bg-white/5 p-4 rounded-lg mb-2 mx-auto w-16 h-16 flex items-center justify-center">
                                    <Database className="text-white" />
                                </div>
                                <h4 className="font-bold text-sm">Ingestion</h4>
                                <p className="text-xs text-gray-500 mt-1">Stored in Neon (Time-series)</p>
                            </div>
                            <ArrowRight className="text-gray-700 hidden md:block" />
                            <div className="flex-1">
                                <div className="bg-white/5 p-4 rounded-lg mb-2 mx-auto w-16 h-16 flex items-center justify-center">
                                    <Layout className="text-white" />
                                </div>
                                <h4 className="font-bold text-sm">Dashboard</h4>
                                <p className="text-xs text-gray-500 mt-1">Aggregated Visualization</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Design Philosophy */}
                <section>
                    <div className="border-l-2 border-white/50 pl-6 mb-8">
                        <h2 className="text-2xl font-bold text-white">Design Philosophy</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="font-bold text-lg text-white mb-2">Motion as Meaning</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Animations are never just for show. They indicate state changes, guide the eye, or smoothen layout shifts (like <code>layoutId</code> in Framer Motion). If it distracts, it's removed.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white mb-2">Content First</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                The UI is strictly monochromatic to allow the work (images, videos) to provide the color. The interface recedes; the content advances.
                            </p>
                        </div>
                    </div>
                </section>

                <footer className="pt-24 pb-12 border-t border-white/5 text-center text-gray-600 text-sm">
                    <p>Internal Documentation • Antigravity Portfolio v1.0</p>
                </footer>
            </main>
        </div>
    )
}
