import { TiltCard } from "@/components/ui/tilt-card"
import { FadeIn } from "@/components/animations/fade-in"
import { getProjects } from "@/lib/cms"

export async function FeaturedProjects() {
    const all = await getProjects(false); // Only published
    const featured = all.filter(p => p.featured).slice(0, 2);

    if (featured.length === 0) return null;

    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="flex flex-col gap-12">
                <FadeIn className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-tech text-xs text-muted-foreground uppercase tracking-wider">_SELECTED_WORKS</span>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-muted-foreground/30 to-transparent" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Featured Projects</h2>
                    <p className="text-muted-foreground text-lg max-w-xl font-light">
                        Engineering systems and digital experiences.
                    </p>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {featured.map((project, index) => (
                        <FadeIn key={project.slug} delay={index * 0.1}>
                            <TiltCard project={project} />
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    )
}

