"use client"

import { Hero } from "@/components/sections/hero"
import { StatsSection } from "@/components/sections/stats-section"
import { ServicesSection } from "@/components/sections/services-section"
import { MarqueeSection } from "@/components/sections/marquee-section"
import { HomeData } from "@/lib/types"

interface HomeViewProps {
    data?: HomeData;
    featuredProjectsNode: React.ReactNode;
    recentPhotosNode: React.ReactNode;
}

export function HomeView({ data, featuredProjectsNode, recentPhotosNode }: HomeViewProps) {
    const heroTitle = data?.hero?.title || "Capturing light, emotion, and the moments in between.";
    const heroDescription = data?.hero?.description || "Reese Vierling (RCV.Media) — Senior Frontend Engineer & Creative Developer specializing in interactive web applications and 3D experiences.";

    return (
        <div className="flex flex-col gap-0">
            <Hero title={heroTitle} description={heroDescription} images={data?.hero?.images} />
            <StatsSection
                line1={data?.stats?.line1}
                line2={data?.stats?.line2}
            />
            {featuredProjectsNode}
            <ServicesSection services={data?.services} />
            <ServicesSection services={data?.services} />
            <MarqueeSection keywords={data?.marquee?.keywords} />
            {recentPhotosNode}
            {recentPhotosNode}
        </div>
    );
}
