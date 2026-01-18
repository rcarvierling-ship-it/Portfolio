"use client"

import { Hero } from "@/components/sections/hero"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { StatsSection } from "@/components/sections/stats-section"
import { ServicesSection } from "@/components/sections/services-section"
import { RecentPhotos } from "@/components/sections/recent-photos"
import { HomeData } from "@/lib/types"

interface HomeViewProps {
    data?: HomeData;
}

export function HomeView({ data }: HomeViewProps) {
    const heroTitle = data?.hero?.title || "Capturing light, emotion, and the moments in between.";
    const heroDescription = data?.hero?.description || "Reese Vierling (RCV.Media) — Senior Frontend Engineer & Creative Developer specializing in interactive web applications and 3D experiences.";

    return (
        <div className="flex flex-col gap-0">
            <Hero title={heroTitle} description={heroDescription} />
            <StatsSection
                line1={data?.stats?.line1}
                line2={data?.stats?.line2}
            />
            <FeaturedProjects />
            <ServicesSection services={data?.services} />
            <RecentPhotos />
        </div>
    );
}
