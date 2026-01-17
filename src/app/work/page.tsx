import fs from 'fs'
import path from 'path'
import { Project } from "@/lib/types"
import { WorkClient } from "./client_view"

async function getProjects(): Promise<Project[]> {
    const filePath = path.join(process.cwd(), 'src/data/projects.json');
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

export default async function WorkPage() {
    const projects = await getProjects();
    return <WorkClient projects={projects} />;
}
