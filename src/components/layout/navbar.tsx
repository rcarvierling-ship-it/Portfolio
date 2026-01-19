"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { cn } from "@/lib/utils"
// toggle theme is in separate component, but I can include it here or user can add it
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

const navItems = [
    { name: "Work", path: "/work" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
]

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 pointer-events-none">
                {/* Logo */}
                <div className="pointer-events-auto">
                    <Link href="/" className="flex items-center gap-2 font-bold tracking-tighter text-primary">
                        <div className="relative w-8 h-8">
                            <Image
                                src="/logo.png"
                                alt="RCV.Media Logo"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                        </div>
                        <span>RCV.Media</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8 pointer-events-auto items-center">
                    {navItems.map((item) => (
                        <Link key={item.path} href={item.path} className="relative group">
                            <span className={cn(
                                "text-sm font-medium transition-colors hover:text-primary/70",
                                pathname === item.path ? "text-primary" : "text-muted-foreground"
                            )}>
                                {item.name}
                            </span>
                            {pathname === item.path && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute left-0 top-full h-[1px] w-full bg-primary"
                                />
                            )}
                        </Link>
                    ))}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 ml-4 rounded-full hover:bg-muted transition-colors"
                        aria-label="Toggle theme"
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-2" />
                        <span className="sr-only">Toggle theme</span>
                    </button>
                </nav>

                {/* Mobile Toggle */}
                <div className="md:hidden pointer-events-auto flex items-center gap-4">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                        aria-label="Toggle theme"
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </button>

                    <MagneticButton
                        className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-50"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </MagneticButton>
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
