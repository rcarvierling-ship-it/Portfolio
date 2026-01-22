"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Instagram, Mail } from "lucide-react"
import { AnimatedIcon } from "@/components/ui/animated-icon"

export function Footer() {
    const currentYear = new Date().getFullYear();
    const [content, setContent] = useState({
        footerText: `© ${currentYear} RCV.Media. All rights reserved.`,
        email: "info@rcv-media.com",
        instagram: "https://www.instagram.com/rcv.media/"
    });

    useEffect(() => {
        fetch('/api/global')
            .then(res => res.json())
            .then(data => {
                if (data.footerText) setContent(data);
            })
            .catch(err => console.error("Failed to load global content"));
    }, []);

    return (
        <footer className="w-full py-12 px-6 md:px-12 border-t border-dashed border-border/40 bg-background/50 relative">
            <div className="absolute top-0 left-12 px-2 -translate-y-1/2 bg-background border border-border/40 text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
                _End_of_Line
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                <div className="text-sm text-muted-foreground">
                    {content.footerText}
                </div>

                <div className="flex gap-6">
                    <Link href={content.instagram} target="_blank" className="hover:text-primary transition-colors">
                        <AnimatedIcon icon={Instagram} size={20} variant="rotate" />
                        <span className="sr-only">Instagram</span>
                    </Link>
                    <Link href={content.email.startsWith('mailto:') ? content.email : `mailto:${content.email}`} className="hover:text-primary transition-colors">
                        <AnimatedIcon icon={Mail} size={20} variant="shake" />
                        <span className="sr-only">Email</span>
                    </Link>
                </div>
            </div>
        </footer>
    )
}
