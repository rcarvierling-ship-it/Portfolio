import { getPage } from "@/lib/cms";
import { ContactView } from "@/components/views/contact-view";
import { ContactData } from "@/lib/types";

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
    const page = await getPage('contact');
    const content = page?.content || {};

    const contactData: ContactData = {
        title: content.title || "Let's start a project together.",
        description: content.description || "Interested in working together? I'm currently available for freelance projects and full-time opportunities.",
        email: content.email || "info@rcv-media.com",
        instagram: content.instagram || "@rcv.media"
    };

    return <ContactView data={contactData} />;
}
