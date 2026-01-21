"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { motion, AnimatePresence } from "framer-motion"
import { Search, FileText, Home, User, Mail, Briefcase } from "lucide-react"
import { useTheme } from "next-themes"

export function CommandPalette() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()
    const { setTheme } = useTheme()

    // Semantic Search State
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        // Custom event listener for "open-command-palette"
        const openListener = () => setOpen(true)
        window.addEventListener("open-command-palette", openListener)

        return () => {
            document.removeEventListener("keydown", down)
            window.removeEventListener("open-command-palette", openListener)
        }
    }, [])

    // Debounced Search
    React.useEffect(() => {
        if (!query || query.length < 2) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/ai/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });
                const data = await res.json();
                setResults(data.results || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
                onClick={() => setOpen(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
                >
                    <Command loop className="w-full" shouldFilter={false}>
                        <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <Command.Input
                                className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Search projects or run command..."
                                value={query}
                                onValueChange={setQuery}
                            />
                        </div>
                        <Command.List className="max-h-[300px] overflow-y-auto p-2">
                            {/* Loading / Empty States */}
                            {!query && <Command.Empty className="py-6 text-center text-sm">Type to search...</Command.Empty>}
                            {query && !loading && results.length === 0 && (
                                <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>
                            )}
                            {loading && <div className="py-6 text-center text-sm text-muted-foreground">Searching...</div>}

                            {/* Semantic Results */}
                            {results.length > 0 && (
                                <Command.Group heading="Search Results">
                                    {results.map((item) => (
                                        <Command.Item
                                            key={item.id}
                                            onSelect={() => {
                                                if (item.type === 'project') runCommand(() => router.push(`/work/${item.slug}`));
                                                else console.log("Photo selected", item);
                                            }}
                                            className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-secondary aria-selected:bg-secondary"
                                        >
                                            {item.type === 'project' ? <Briefcase size={14} className="text-blue-400" /> : <FileText size={14} className="text-purple-400" />}
                                            <div className="flex flex-col">
                                                <span className="font-medium">{item.title}</span>
                                                {item.description && <span className="text-xs text-muted-foreground truncate max-w-[300px]">{item.description}</span>}
                                            </div>
                                            {item.score > 0.8 && <span className="ml-auto text-[10px] text-green-500 font-mono">{(item.score * 100).toFixed(0)}%</span>}
                                        </Command.Item>
                                    ))}
                                </Command.Group>
                            )}

                            {/* Default Navigation Commands */}
                            <Command.Group heading="Navigation">
                                <Command.Item onSelect={() => runCommand(() => router.push("/"))} className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-secondary aria-selected:bg-secondary">
                                    <Home size={14} /> Home
                                </Command.Item>
                                <Command.Item onSelect={() => runCommand(() => router.push("/work"))} className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-secondary aria-selected:bg-secondary">
                                    <Briefcase size={14} /> Work
                                </Command.Item>
                                <Command.Item onSelect={() => runCommand(() => router.push("/dashboard"))} className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-secondary aria-selected:bg-secondary">
                                    <Home size={14} /> Dashboard
                                </Command.Item>
                            </Command.Group>

                            <Command.Group heading="Theme">
                                <Command.Item onSelect={() => runCommand(() => setTheme("light"))} className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-secondary aria-selected:bg-secondary">
                                    Light Mode
                                </Command.Item>
                                <Command.Item onSelect={() => runCommand(() => setTheme("dark"))} className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-secondary aria-selected:bg-secondary">
                                    Dark Mode
                                </Command.Item>
                            </Command.Group>
                        </Command.List>
                    </Command>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
