import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { Project } from '@/lib/types'

async function getProjects(): Promise<Project[]> {
    const filePath = path.join(process.cwd(), 'src/data/projects.json');
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const projects = await getProjects();
    const baseUrl = 'https://rcv-media.com';

    const projectUrls = projects.map((project) => ({
        url: `${baseUrl}/work/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/work`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        ...projectUrls,
    ]
}
