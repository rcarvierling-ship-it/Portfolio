import { TiltCard } from "@/components/ui/tilt-card"
import * as Motion from "framer-motion/client"
import { getProjects } from "@/lib/cms"

export async function FeaturedProjects() {
    const all = await getProjects(false); // Only published
    const featured = all.filter(p => p.featured).slice(0, 2);

    if (featured.length === 0) return null;

    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="flex flex-col gap-12">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-4"
                >
                    <h2 className="text-3xl md:text-5xl font-bold">Latest Stories</h2>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Recent additions to my portfolio.
                    </p>
                </Motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {featured.map((project, index) => (
                        <Motion.div
                            key={project.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <TiltCard project={project} />
                        </Motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
