import fs from 'fs'
import path from 'path'
import { AboutData, Gear, TimelineItem } from "@/lib/types"
import { AboutClient } from "./client_view"

async function getAboutData(): Promise<AboutData> {
    const filePath = path.join(process.cwd(), 'src/data/about.json');
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return { headline: "Error", bio: [], portrait: "" };
    }
}

async function getGearData(): Promise<Gear[]> {
    const filePath = path.join(process.cwd(), 'src/data/gear.json');
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

async function getTimelineData(): Promise<TimelineItem[]> {
    const filePath = path.join(process.cwd(), 'src/data/timeline.json');
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

export default async function AboutPage() {
    const aboutData = await getAboutData();
    const gear = await getGearData();
    const timeline = await getTimelineData();

    return <AboutClient aboutData={aboutData} gear={gear} timeline={timeline} />;
}
