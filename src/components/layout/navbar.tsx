"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Search } from "lucide-react"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { cn } from "@/lib/utils"
// toggle theme is in separate component, but I can include it here or user can add it
import { useTheme } from "next-themes"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Sun, Moon } from "lucide-react"

const navItems = [
    { name: "Work", path: "/work" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
]

import { SiteSettings } from "@/lib/types";

export function Navbar({ settings }: { settings?: SiteSettings }) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()

    const brandName = settings?.branding?.brandName || "RCV.Media";
    const logoUrl = settings?.branding?.logoUrl || "/logo.png";
    const logoAlt = settings?.branding?.logoAltText || "Logo";

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
                <div className="bg-background/80 backdrop-blur-md border-b border-white/5 md:border-transparent transition-all duration-300">
                    <div className="flex items-center justify-between px-6 py-4 md:px-12">
                        {/* Logo */}
                        <div className="pointer-events-auto">
                            <Link href="/" className="flex items-center gap-2 font-bold tracking-tighter text-primary group">
                                <div className="relative w-8 h-8 opacity-90 group-hover:opacity-100 transition-opacity">
                                    <img
                                        src={logoUrl}
                                        alt={logoAlt}
                                        aria-hidden="true"
                                        className="w-full h-full object-contain invert dark:invert-0"
                                    />
                                </div>
                                <span className="text-sm font-mono uppercase tracking-widest hidden md:block">{brandName}</span>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex gap-12 pointer-events-auto items-center">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/');
                                return (
                                    <Link key={item.path} href={item.path} className="relative group">
                                        <div className="flex flex-col items-center">
                                            <span className={cn(
                                                "text-[11px] font-mono tracking-[0.2em] uppercase transition-all duration-300",
                                                isActive ? "text-primary font-bold" : "text-muted-foreground group-hover:text-primary"
                                            )}>
                                                {isActive ? `[ ${item.name} ]` : item.name}
                                            </span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="indicator"
                                                    className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full"
                                                />
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right Actions */}
                        <div className="pointer-events-auto flex items-center gap-4">
                            <button
                                onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
                                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-muted/50 transition-colors text-xs font-mono text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50"
                                aria-label="Search"
                            >
                                <Search size={14} />
                                <span className="opacity-50">CMD+K</span>
                            </button>

                            <div className="h-4 w-px bg-border/40 hidden md:block" />

                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                                aria-label="Toggle theme"
                            >
                                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-2" />
                            </button>

                            {/* Mobile Toggle */}
                            <div className="md:hidden">
                                <MagneticButton
                                    className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                                    onClick={() => setIsOpen(!isOpen)}
                                    aria-label={isOpen ? "Close menu" : "Open menu"}
                                    aria-expanded={isOpen}
                                >
                                    {isOpen ? <X size={18} /> : <Menu size={18} />}
                                </MagneticButton>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-header / Breadcrumbs Area (Desktop) */}
                <div className="hidden md:flex items-center px-6 md:px-12 py-2 pointer-events-auto">
                    <Breadcrumbs />
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-[60] bg-background flex flex-col items-center justify-center gap-8 md:hidden"
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsOpen(false)}
                                className="text-4xl font-bold tracking-tight hover:text-muted-foreground transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
