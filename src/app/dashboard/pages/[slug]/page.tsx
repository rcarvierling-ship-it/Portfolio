import { VisualEditor } from "@/components/dashboard/visual-editor";

export default async function EditorPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    return <VisualEditor slug={slug} />;
}
