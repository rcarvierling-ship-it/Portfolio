"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Instagram, Mail } from "lucide-react"

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
        <footer className="w-full py-12 px-6 md:px-12 border-t bg-background">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                <div className="text-sm text-muted-foreground">
                    {content.footerText}
                </div>

                <div className="flex gap-6">
                    <Link href={content.instagram} target="_blank" className="hover:text-primary transition-colors">
                        <Instagram size={20} />
                        <span className="sr-only">Instagram</span>
                    </Link>
                    <Link href={content.email.startsWith('mailto:') ? content.email : `mailto:${content.email}`} className="hover:text-primary transition-colors">
                        <Mail size={20} />
                        <span className="sr-only">Email</span>
                    </Link>
                </div>
            </div>
        </footer>
    )
}
