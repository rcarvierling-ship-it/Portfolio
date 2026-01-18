import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Metadata } from 'next';
import { getProjects as getProjectsCMS, getProject as getProjectCMS } from "@/lib/cms";
import { auth } from "@/auth";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const project = getProjectCMS(slug);

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    return {
        title: `${project.title} | RCV.Media`,
        description: project.description.substring(0, 160) + "...",
        openGraph: {
            title: project.title,
            description: project.description.substring(0, 160),
            images: [
                {
                    url: project.coverImage,
                    width: 1200,
                    height: 630,
                    alt: project.title,
                },
            ],
        },
    };
}

export async function generateStaticParams() {
    const projects = getProjectsCMS(false); // Only generate static params for published? Or all?
    // If we want drafts to be previewable, they might not be SSG'd if not in this list.
    // Use published for static gen. Drafts can fallback to dynamic or just 404 if not generated?
    // Actually, if we use dynamic rendering for drafts usage, we shouldn't rely on generateStaticParams for them.
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ProjectPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>;
    searchParams: SearchParams;
}) {
    const { slug } = await params;

    // Preview Logic
    const sp = await searchParams;
    const isPreview = sp.preview === 'true';
    let showDrafts = false;
    if (isPreview) {
        const session = await auth();
        if (session) showDrafts = true;
    }

    // CMS fetch
    // getProjectCMS reads from JSON. It returns undefined if not found.
    // Note: getProjectCMS finds by slug in ALL projects currently? 
    // Let's check src/lib/cms.ts implementation of getProject.
    // It does `readJson... find(...)`. It reads whole file. So it finds drafts too.
    // We need to enforce published check if not authorized.

    const project = getProjectCMS(slug);

    if (!project) {
        notFound();
    }

    if (!showDrafts && project.status !== 'published') {
        notFound();
    }

    return (
        <article className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto flex flex-col gap-12">
            <Link
                href="/work"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit"
            >
                <ArrowLeft size={16} />
                Back to projects
            </Link>

            <div className="flex flex-col gap-6">
                <h1 className="text-4xl md:text-7xl font-bold tracking-tighter">{project.title}</h1>
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                    <span>{project.location}</span>
                    <span>•</span>
                    <span>{project.year}</span>
                </div>
                <div className="flex flex-wrap gap-6 text-sm">
                    {project.camera && (
                        <div className="flex flex-col">
                            <span className="text-muted-foreground uppercase tracking-wider text-xs">Camera</span>
                            <span className="font-medium">{project.camera}</span>
                        </div>
                    )}
                    {project.lens && (
                        <div className="flex flex-col">
                            <span className="text-muted-foreground uppercase tracking-wider text-xs">Lens</span>
                            <span className="font-medium">{project.lens}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-12">
                {/* Main Hero Image */}
                <div className="relative w-full aspect-[3/2] rounded-sm overflow-hidden bg-muted">
                    {/* Use Next/Image if it's a real path, otherwise text */}
                    {project.coverImage.startsWith('/') ? (
                        <Image src={project.coverImage} alt={project.title} fill className="object-cover" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            {project.coverImage} (URL)
                        </div>
                    )}
                </div>

                <div className="max-w-3xl">
                    <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                        {project.description}
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.galleryImages.length > 0 ? (
                        project.galleryImages.map((img, idx) => (
                            <div
                                key={idx}
                                className={`relative w-full rounded-sm overflow-hidden bg-muted ${idx % 3 === 0 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-[4/5]'}`}
                            >
                                <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-sm italic col-span-2">No gallery images uploaded yet.</p>
                    )}
                </div>
            </div>
        </article>
    );
}
