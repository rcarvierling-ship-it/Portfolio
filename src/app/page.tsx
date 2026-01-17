import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/featured-projects";

export default function Home() {
  return (
    <div className="flex flex-col gap-10 pb-20">
      <Hero />
      <FeaturedProjects />
    </div>
  );
}
