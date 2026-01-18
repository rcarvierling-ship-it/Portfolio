"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Home, User, Mail, Globe } from "lucide-react"

const pages = [
    { slug: "home", title: "Home Page", description: "Edit hero, stats, and services", icon: Home },
    { slug: "about", title: "About Page", description: "Edit bio, journey, and tools", icon: User },
    { slug: "contact", title: "Contact Page", description: "Edit contact info and intro", icon: Mail },
]

export default function PagesList() {
    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold font-mono uppercase tracking-tighter">Pages</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page) => (
                    <Link key={page.slug} href={`/dashboard/pages/${page.slug}`}>
                        <Card className="hover:bg-accent/50 transition-colors cursor-pointer group">
                            <CardHeader>
                                <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <page.icon size={24} />
                                </div>
                                <CardTitle>{page.title}</CardTitle>
                                <CardDescription>{page.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
