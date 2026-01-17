import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import fs from 'fs'
import path from 'path'
import { Project } from "@/lib/types";

async function getProjects(): Promise<Project[]> {
    const filePath = path.join(process.cwd(), 'src/data/projects.json');
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

export async function generateStaticParams() {
    const projects = await getProjects();
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const projects = await getProjects();
    const project = projects.find((p) => p.slug === slug);

    if (!project) {
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
