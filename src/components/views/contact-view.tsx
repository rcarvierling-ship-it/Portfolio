"use client"

import { ContactData } from "@/lib/types"
import { TextReveal } from "@/components/animations/text-reveal"
import { Mail, Instagram } from "lucide-react"

interface ContactViewProps {
    data: ContactData
}

export function ContactView({ data }: ContactViewProps) {
    const { title, description, email, instagram } = data;

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
            <div className="flex flex-col gap-12">
                <TextReveal text={title} className="text-4xl md:text-6xl font-bold" />
                <p className="text-xl text-muted-foreground leading-relaxed">
                    {description}
                </p>

                <div className="flex flex-col gap-6 mt-8">
                    <div className="flex items-center gap-4 text-lg">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Email</h3>
                            <a href={`mailto:${email}`} className="text-2xl hover:text-primary transition-colors">{email}</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-lg">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary">
                            <Instagram size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Instagram</h3>
                            <a href={`https://www.instagram.com/${instagram.replace('@', '')}/`} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition-colors">{instagram}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
