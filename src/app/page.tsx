import { getPage } from "@/lib/cms";
import { HomeView } from "@/components/views/home-view";
import { HomeData } from "@/lib/types";

// Force dynamic if we want fresh CMS data on every request, or revalidate
export const revalidate = 0;
// or export const dynamic = 'force-dynamic';

export default async function Home() {
  const page = await getPage('home');
  const content = page?.content as HomeData | undefined;

  return <HomeView data={content} />;
}
