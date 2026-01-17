import { ContactForm } from "@/components/ui/contact-form";
import { TextReveal } from "@/components/animations/text-reveal";
import { Mail, Instagram } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div className="flex flex-col gap-8">
                <TextReveal text="Let's start a project together." className="text-4xl md:text-6xl font-bold" />
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Interested in working together? I'm currently available for freelance projects and full-time opportunities.
                </p>

                <div className="flex flex-col gap-6 mt-8">
                    <div className="flex items-center gap-4 text-lg">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Email</h3>
                            <a href="mailto:info@rcv-media.com" className="hover:text-primary transition-colors">info@rcv-media.com</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-lg">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary">
                            <Instagram size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Instagram</h3>
                            <a href="https://www.instagram.com/rcv.media/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@rcv.media</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center md:items-start">
                <ContactForm />
            </div>
        </div>
    )
}
