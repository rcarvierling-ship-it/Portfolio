import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { StatsSection } from "@/components/sections/stats-section";
import { ServicesSection } from "@/components/sections/services-section";
import { RecentPhotos } from "@/components/sections/recent-photos";

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <StatsSection />
      <FeaturedProjects />
      <ServicesSection />
      <RecentPhotos />
    </div>
  );
}
