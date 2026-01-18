"use client"

import { useState, useEffect } from "react"
import { HistoryEntry } from "@/lib/types"
import { X, RotateCcw, Clock } from "lucide-react"

interface HistoryModalProps {
    entityId: string;
    isOpen: boolean;
    onClose: () => void;
    onRollback: (snapshot: any) => Promise<void>;
}

export function HistoryModal({ entityId, isOpen, onClose, onRollback }: HistoryModalProps) {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetch(`/api/history?entityId=${entityId}`)
                .then(res => res.json())
                .then(data => {
                    // Filter for this entity if API returns all
                    // Our API currently returns all. We should probably filter on client or update API.
                    // Let's filter client side for now.
                    const entityHistory = data.filter((h: HistoryEntry) => h.entityId === entityId);
                    setHistory(entityHistory);
                    setLoading(false);
                });
        }
    }, [isOpen, entityId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2"><Clock size={16} /> Version History</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? <p className="text-center text-muted-foreground">Loading history...</p> : (
                        history.length === 0 ? <p className="text-center text-muted-foreground">No history found.</p> :
                            history.map(entry => (
                                <div key={entry.id} className="border border-border rounded p-3 flex flex-col gap-2 bg-secondary/10">
                                    <div className="flex justify-between items-start">
                                        <div className="text-sm">
                                            <span className="font-bold">{entry.action.toUpperCase()}</span> by <span className="text-muted-foreground">{entry.user}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</span>
                                    </div>

                                    {entry.snapshot && (
                                        <button
                                            onClick={() => {
                                                if (confirm("Are you sure you want to restore this version? Current unsaved changes will be lost.")) {
                                                    onRollback(entry.snapshot);
                                                    onClose();
                                                }
                                            }}
                                            className="self-start text-xs flex items-center gap-1 text-primary hover:underline mt-1"
                                        >
                                            <RotateCcw size={12} /> Restore this version
                                        </button>
                                    )}
                                </div>
                            ))
                    )}
                </div>
            </div>
        </div>
    )
}
