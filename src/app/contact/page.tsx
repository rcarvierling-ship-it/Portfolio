import { getPage } from "@/lib/cms";
import { ContactView } from "@/components/views/contact-view";
import { ContactData } from "@/lib/types";

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
    const page = await getPage('contact');
    const rawContent = page?.content || {};
    // Support both { published, draft } structure and legacy flat content
    const content = (rawContent.published || rawContent) as Record<string, unknown> | undefined;

    const contactData: ContactData = {
        title: (content?.title as string) || "Let's start a project together.",
        description: (content?.description as string) || "Interested in working together? I'm currently available for freelance projects and full-time opportunities.",
        email: (content?.email as string) || "info@rcv-media.com",
        instagram: (content?.instagram as string) || "@rcv.media"
    };

    return <ContactView data={contactData} />;
}
