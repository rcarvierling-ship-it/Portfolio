import { MetadataRoute } from 'next'
import { getProjects } from '@/lib/cms'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const projects = await getProjects();
    // const pages = await getPages(); // getPages is not exported or used in sitemap currently, commenting out until Pages feature is fully implemented or imported correctly via CMS.
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
