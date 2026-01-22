"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Home, User, Mail } from "lucide-react"

const pages = [
    { slug: "home", title: "Home Page", description: "Edit hero, stats, and services", icon: Home },
    { slug: "about", title: "About Page", description: "Edit bio, journey, and tools", icon: User },
    { slug: "contact", title: "Contact Page", description: "Edit contact info and intro", icon: Mail },
]

export default function PagesList() {
    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen pt-32">
            <h1 className="text-3xl font-bold font-mono uppercase tracking-tighter mb-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Pages</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page) => (
                    <Link key={page.slug} href={`/dashboard/pages/${page.slug}`}>
                        <Card className="hover:bg-secondary/40 transition-all cursor-pointer group border-border/50 hover:border-primary/20 h-full">
                            <CardHeader>
                                <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                                    <page.icon size={24} />
                                </div>
                                <CardTitle className="group-hover:text-primary transition-colors">{page.title}</CardTitle>
                                <CardDescription>{page.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
