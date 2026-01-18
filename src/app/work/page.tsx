import { getProjects, getPhotos } from "@/lib/cms"
import { WorkClient } from "./client_view"
import { auth } from "@/auth"

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function WorkPage(props: { searchParams: SearchParams }) {
    const searchParams = await props.searchParams;
    const isPreview = searchParams.preview === 'true';
    let showDrafts = false;

    if (isPreview) {
        const session = await auth();
        if (session) showDrafts = true;
    }

    const projects = await getProjects(showDrafts);
    const photos = await getPhotos(showDrafts); // Fetch published photos

    return <WorkClient projects={projects} photos={photos} />;
}

// Duplicate removed
