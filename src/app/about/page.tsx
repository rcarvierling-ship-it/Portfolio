import { getPage } from "@/lib/cms"
import { AboutClient } from "./client_view"

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
    const page = await getPage('about');
    const content = page?.content || {};

    const aboutData = {
        headline: content.headline || "Photographer & Filmmaker",
        bio: content.bio || [],
        portrait: content.portrait || ""
    };

    return <AboutClient aboutData={aboutData} gear={content.gear || []} timeline={content.timeline || []} />;
}
