"use client"

import { useState, useEffect } from "react"
import { Mail, User, MessageSquare, Calendar, RefreshCw } from "lucide-react"
import { ContactMessage } from "@/lib/types"
import { cn } from "@/lib/utils"

export function ContactInboxTab() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = () => {
        setLoading(true);
        fetch('/api/contact/inbox')
            .then(res => res.json())
            .then((data) => {
                setMessages(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-secondary/50"><Mail size={20} /></div>
                    <h3 className="text-lg font-bold">Contact Inbox</h3>
                </div>
                <div className="p-12 text-center text-muted-foreground">Loading messages...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-secondary/50"><Mail size={20} /></div>
                    <h3 className="text-lg font-bold">Contact Inbox</h3>
                </div>
                <button
                    onClick={fetchMessages}
                    className="p-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                    title="Refresh"
                >
                    <RefreshCw size={16} className="text-muted-foreground" />
                </button>
            </div>

            <p className="text-sm text-muted-foreground">
                Messages from the contact form on your site. Newest first.
            </p>

            {messages.length === 0 ? (
                <div className="p-12 rounded-xl border border-dashed border-border bg-secondary/5 text-center text-muted-foreground">
                    <Mail size={32} className="mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No messages yet</p>
                    <p className="text-sm mt-1">Messages submitted via the contact page will appear here.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "p-6 rounded-xl border bg-card transition-colors",
                                msg.read ? "border-border" : "border-primary/30 bg-primary/5"
                            )}
                        >
                            <div className="flex flex-wrap items-center gap-4 mb-3">
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-muted-foreground" />
                                    <span className="font-semibold">{msg.name}</span>
                                </div>
                                <a
                                    href={`mailto:${msg.email}`}
                                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                    <Mail size={14} />
                                    {msg.email}
                                </a>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Calendar size={12} />
                                    {new Date(msg.created_at).toLocaleString()}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <MessageSquare size={14} className="text-muted-foreground shrink-0 mt-0.5" />
                                <p className="text-sm text-foreground/90 whitespace-pre-wrap">{msg.message}</p>
                            </div>
                            <a
                                href={`mailto:${msg.email}?subject=Re: Your message`}
                                className="inline-block mt-4 text-xs font-medium text-primary hover:underline"
                            >
                                Reply via email →
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
