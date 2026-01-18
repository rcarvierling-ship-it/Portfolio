import { getPage } from "@/lib/cms"
import { AboutView } from "@/components/views/about-view"
import { AboutData } from "@/lib/types"

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
    const page = await getPage('about');
    const content = page?.content || {};

    const aboutData: AboutData = {
        headline: content.headline || "Photographer & Filmmaker",
        bio: content.bio || ["Visual storyteller based in New York."],
        portrait: content.portrait || "",
        gear: content.gear || [],
        timeline: content.timeline || []
    };

    return <AboutView data={aboutData} />;
}
