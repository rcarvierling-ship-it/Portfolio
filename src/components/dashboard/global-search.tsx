"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const timer = setTimeout(() => {
            setLoading(true);
            // Parallel fetch
            Promise.all([
                fetch('/api/projects').then(res => res.json()),
                fetch('/api/photos').then(res => res.json()),
                // pages?
            ]).then(([projects, photos]) => {
                const combined = [
                    ...projects.map((p: any) => ({ ...p, type: 'project', label: p.title })),
                    ...photos.map((p: any) => ({ ...p, type: 'photo', label: p.altText || p.id }))
                ];

                const filtered = combined.filter(item =>
                    item.label?.toLowerCase().includes(query.toLowerCase()) ||
                    item.id.includes(query)
                );

                setResults(filtered.slice(0, 5)); // Limit 5
                setLoading(false);
                setIsOpen(true);
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (item: any) => {
        setQuery("");
        setIsOpen(false);
        const tab = item.type === 'project' ? 'projects' : 'photos';
        router.push(`/dashboard?tab=${tab}&editId=${item.id}`);
    }

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                    className="w-full pl-9 pr-4 py-2 rounded-full border border-border bg-secondary/30 focus:bg-background focus:ring-1 focus:ring-primary transition-all text-sm"
                    placeholder="Search content..."
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
                    onFocus={() => { if (query) setIsOpen(true); }}
                />
                {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" size={14} />}
            </div>

            {isOpen && (results.length > 0 || query) && (
                <div className="absolute top-full mt-2 left-0 w-full bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
                    {results.length === 0 ? (
                        <div className="p-4 text-center text-xs text-muted-foreground">No results found</div>
                    ) : (
                        results.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                className="w-full text-left px-4 py-3 hover:bg-secondary/50 flex items-center justify-between group"
                            >
                                <div>
                                    <div className="font-medium text-sm">{item.label}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase">{item.type}</div>
                                </div>
                                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100">Edit &rarr;</span>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
