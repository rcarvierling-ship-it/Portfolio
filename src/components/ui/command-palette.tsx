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

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

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
                    <Command loop className="w-full">
                        <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <Command.Input
                                className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Type a command or search..."
                            />
                        </div>
                        <Command.List className="max-h-[300px] overflow-y-auto p-2">
                            <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>

                            <Command.Group heading="Pages">
                                <Command.Item onSelect={() => runCommand(() => router.push("/"))} className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-secondary aria-selected:bg-secondary">
                                    <Home size={14} /> Home
                                </Command.Item>
                                <Command.Item onSelect={() => runCommand(() => router.push("/work"))} className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-secondary aria-selected:bg-secondary">
                                    <Briefcase size={14} /> Work
                                </Command.Item>
                            </Command.Group>

                            <Command.Group heading="Dashboard">
                                <Command.Item onSelect={() => runCommand(() => router.push("/dashboard?tab=overview"))} className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-secondary aria-selected:bg-secondary">
                                    <Home size={14} /> Dashboard Home
                                </Command.Item>
                                <Command.Item onSelect={() => runCommand(() => router.push("/dashboard?tab=analytics-overview"))} className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-secondary aria-selected:bg-secondary">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" /> Analytics
                                </Command.Item>
                                <Command.Item onSelect={() => runCommand(() => router.push("/dashboard?tab=projects"))} className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-secondary aria-selected:bg-secondary">
                                    <FileText size={14} /> Manage Projects
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
