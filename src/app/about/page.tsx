import { getPage } from "@/lib/cms"
import { AboutView } from "@/components/views/about-view"
import { AboutData } from "@/lib/types"

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
    const page = await getPage('about');
    const rawContent = page?.content || {};
    // Support both { published, draft } structure and legacy flat content
    const content = (rawContent.published || rawContent) as Record<string, unknown> | undefined;

    const aboutData: AboutData = {
        headline: (content?.headline as string) || "Photographer & Filmmaker",
        bio: (content?.bio as string[]) || ["Visual storyteller based in New York."],
        portrait: (content?.portrait as string) || "",
        gear: (content?.gear as AboutData['gear']) || [],
        timeline: (content?.timeline as AboutData['timeline']) || []
    };

    return <AboutView data={aboutData} />;
}
