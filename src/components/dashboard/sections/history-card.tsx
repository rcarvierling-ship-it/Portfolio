"use client"

import { useState, useEffect } from "react"
import { Clock, FileText, Camera, Settings } from "lucide-react"
import { HistoryEntry } from "@/lib/types"

export function HistoryCard() {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/history')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setHistory(data);
                setLoading(false);
            })
            .catch(err => console.error("Failed to fetch history", err));
    }, []);

    const getIcon = (type: HistoryEntry['entityType']) => {
        switch (type) {
            case 'project': return <FileText size={16} />;
            case 'photo': return <Camera size={16} />;
            case 'settings': return <Settings size={16} />;
            default: return <Clock size={16} />;
        }
    }

    if (loading) return <div className="p-4 text-center text-xs text-muted-foreground">Loading activity...</div>;

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                Recent Activity
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[300px]">
                {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent activity logged.</p>
                ) : (
                    history.slice(0, 5).map((entry) => (
                        <div key={entry.id} className="group flex items-start gap-3 p-3 rounded-md hover:bg-secondary/40 transition-colors border border-transparent hover:border-border/50">
                            <div className="p-2 rounded-full bg-secondary text-primary mt-0.5 group-hover:bg-background group-hover:shadow-sm transition-all">
                                {getIcon(entry.entityType)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <p className="font-medium text-foreground text-sm truncate">
                                        <span className="capitalize">{entry.action}</span> {entry.entityType}
                                    </p>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                        {new Date(entry.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                    {entry.user}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
