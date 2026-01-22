"use client"

import { PagesTab } from "@/components/dashboard/pages-tab"

export default function PagesPage() {
    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen pt-32">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Website Pages</h1>
                <p className="text-muted-foreground">Manage your site structure and page content.</p>
            </div>
            <PagesTab />
        </div>
    )
}
