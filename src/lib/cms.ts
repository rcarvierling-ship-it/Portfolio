
import { sql } from '@vercel/postgres';
import {
    Project, SiteSettings, Photo, Page, HistoryEntry, AnalyticsEvent, GalleryItem
} from '@/lib/types';

// --- History Logging ---
async function logHistory(
    action: HistoryEntry['action'],
    entityType: HistoryEntry['entityType'],
    entityId: string,
    user: string,
    changes?: string,
    snapshot?: any
) {
    try {
        const id = Date.now().toString();
        const timestamp = new Date().toISOString();
        await sql`
            INSERT INTO audit_logs (id, timestamp, "user", action, target, details)
            VALUES (${id}, ${timestamp}, ${user}, ${action}, ${entityType + ':' + entityId}, ${changes || JSON.stringify(snapshot || {})})
        `;
    } catch (e) {
        console.error("Audit log error:", e);
    }
}

// --- PROJECTS ---
export const getProjects = async (includeDrafts = false): Promise<Project[]> => {
    try {
        let result;
        if (includeDrafts) {
            result = await sql<Project>`SELECT * FROM projects ORDER BY "order" ASC, created_at DESC`;
        } else {
            result = await sql<Project>`SELECT * FROM projects WHERE status = 'published' ORDER BY "order" ASC, created_at DESC`;
        }
        return result.rows.map(row => {
            const r = row as any;
            return {
                ...r,
                createdAt: r.created_at,
                updatedAt: r.updated_at,
                // Ensure content is parsed if it came back as string (pg usually handles jsonb as object automatically, but valid check)
                content: typeof r.content === 'string' ? JSON.parse(r.content) : r.content,
                tags: r.tags || [],
                tools: r.tools || [],
                galleryImages: ((): GalleryItem[] => {
                    const raw = r.gallery_images;
                    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw || [];
                    return parsed.map((item: any) => typeof item === 'string' ? { id: item, url: item } : item);
                })()
            } as Project;
        });
    } catch (e) {
        console.error("Get Projects Error:", e);
        return [];
    }
};

export const getProject = async (slug: string): Promise<Project | undefined> => {
    try {
        const { rows } = await sql<Project>`SELECT * FROM projects WHERE slug = ${slug} LIMIT 1`;
        if (rows.length === 0) return undefined;
        const row = rows[0] as any;
        return {
            ...row,
            galleryImages: ((): GalleryItem[] => {
                const raw = row.gallery_images;
                const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw || [];
                return parsed.map((item: any) => typeof item === 'string' ? { id: item, url: item } : item);
            })()
        };
    } catch (e) {
        console.error("Get Project Error:", e);
        return undefined;
    }
};

export const saveProject = async (project: Project, user: string): Promise<boolean> => {
    try {
        // Upsert
        await sql`
            INSERT INTO projects (id, slug, title, description, content, tags, tools, year, location, camera, lens, cover_image, gallery_images, featured, status, version, created_at, updated_at, "order")
            VALUES (
                ${project.id}, ${project.slug}, ${project.title}, ${project.description}, ${JSON.stringify(project.content || {})}, 
                ${project.tags as any}, ${project.tools as any}, ${project.year}, ${project.location}, 
                ${project.camera}, ${project.lens}, ${project.coverImage}, ${JSON.stringify(project.galleryImages || [])}, 
                ${project.featured}, ${project.status}, ${project.version}, ${project.createdAt}, ${new Date().toISOString()}, 
                ${(project as any).order || 0}
            )
            ON CONFLICT (id) DO UPDATE SET
                slug = EXCLUDED.slug,
                title = EXCLUDED.title,
                description = EXCLUDED.description,
                content = EXCLUDED.content,
                tags = EXCLUDED.tags,
                tools = EXCLUDED.tools,
                year = EXCLUDED.year,
                location = EXCLUDED.location,
                camera = EXCLUDED.camera,
                lens = EXCLUDED.lens,
                cover_image = EXCLUDED.cover_image,
                gallery_images = EXCLUDED.gallery_images,
                featured = EXCLUDED.featured,
                status = EXCLUDED.status,
                updated_at = EXCLUDED.updated_at,
                "order" = EXCLUDED."order"
        `;
        await logHistory(project.version === 1 ? 'create' : 'update', 'project', project.id, user);
        return true;
    } catch (e) {
        console.error("Save Project Error:", e);
        return false;
    }
};

export const saveProjects = async (projects: Project[], user: string): Promise<boolean> => {
    // Handling bulk update mainly for reordering
    try {
        // Parallel updates? Or transaction? Transaction preferred.
        // For simplicity with Vercel Postgres simple query, we loop.
        for (const p of projects) {
            await saveProject(p, user);
        }
        await logHistory('update', 'project', 'bulk-reorder', user);
        return true;
    } catch (e) {
        console.error("Bulk Save Error:", e);
        return false;
    }
};

export const deleteProject = async (id: string, user: string): Promise<boolean> => {
    try {
        await sql`DELETE FROM projects WHERE id = ${id}`;
        await logHistory('delete', 'project', id, user);
        return true;
    } catch (e) {
        console.error("Delete Project Error:", e);
        return false;
    }
};

// --- PHOTOS ---
export const getPhotos = async (includeDrafts = false): Promise<Photo[]> => {
    try {
        const { rows } = await sql<Photo>`SELECT * FROM photos ORDER BY created_at DESC`;
        return rows;
    } catch (e) {
        return [];
    }
};

export const savePhotos = async (photos: Photo[], user: string): Promise<boolean> => {
    try {
        for (const p of photos) {
            await savePhoto(p, user);
        }
        await logHistory('update', 'photo', 'bulk-reorder', user);
        return true;
    } catch (e) {
        return false;
    }
};

export const savePhoto = async (photo: Photo, user: string): Promise<boolean> => {
    try {
        await sql`
            INSERT INTO photos (id, url, alt_text, caption, width, height, blur_data_url, variants, tags, featured, status, created_at, updated_at)
            VALUES (
                ${photo.id}, ${photo.url}, ${photo.altText}, ${photo.caption}, ${photo.width}, ${photo.height}, 
                ${photo.blurDataURL}, ${JSON.stringify(photo.variants)}, ${photo.tags as any}, ${photo.featured}, 
                ${photo.status}, ${photo.createdAt}, ${new Date().toISOString()}
            )
            ON CONFLICT (id) DO UPDATE SET
                alt_text = EXCLUDED.alt_text,
                caption = EXCLUDED.caption,
                tags = EXCLUDED.tags,
                featured = EXCLUDED.featured,
                updated_at = EXCLUDED.updated_at
        `;
        await logHistory('create', 'photo', photo.id, user);
        return true;
    } catch (e) {
        console.error("Save Photo Error:", e);
        return false;
    }
};

export const deletePhoto = async (id: string, user: string): Promise<boolean> => {
    try {
        await sql`DELETE FROM photos WHERE id = ${id}`;
        await logHistory('delete', 'photo', id, user);
        return true;
    } catch (e) {
        return false;
    }
};
// --- PAGES ---
export const getPages = async (includeDrafts = false): Promise<Page[]> => {
    try {
        let result;
        if (includeDrafts) {
            result = await sql<Page>`SELECT * FROM pages ORDER BY created_at DESC`;
        } else {
            result = await sql<Page>`SELECT * FROM pages WHERE status = 'published' ORDER BY created_at DESC`;
        }
        return result.rows.map(row => ({
            ...row,
            createdAt: (row as any).created_at,
            updatedAt: (row as any).updated_at,
            content: typeof (row as any).content === 'string' ? JSON.parse((row as any).content) : (row as any).content || {},
            blocks: typeof (row as any).blocks === 'string' ? JSON.parse((row as any).blocks) : (row as any).blocks || []
        })) as unknown as Page[];
    } catch (e) {
        return [];
    }
};

export const getPage = async (slug: string): Promise<Page | undefined> => {
    try {
        const { rows } = await sql<Page>`SELECT * FROM pages WHERE slug = ${slug} LIMIT 1`;
        if (rows.length === 0) return undefined;
        const row = rows[0] as any;
        return {
            ...row,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            content: typeof row.content === 'string' ? JSON.parse(row.content) : row.content || {},
            blocks: typeof row.blocks === 'string' ? JSON.parse(row.blocks) : row.blocks || []
        } as Page;
    } catch (e) {
        return undefined;
    }
};

export const savePage = async (page: Page, user: string): Promise<boolean> => {
    try {
        await sql`
            INSERT INTO pages (id, slug, title, description, content, blocks, status, version, created_at, updated_at)
            VALUES (
                ${page.id}, ${page.slug}, ${page.title}, ${page.description || ''},
                ${JSON.stringify(page.content || {})}, ${JSON.stringify(page.blocks || [])},
                ${page.status}, ${page.version}, ${page.createdAt}, ${new Date().toISOString()}
            )
            ON CONFLICT (id) DO UPDATE SET
                slug = EXCLUDED.slug,
                title = EXCLUDED.title,
                description = EXCLUDED.description,
                content = EXCLUDED.content,
                blocks = EXCLUDED.blocks,
                status = EXCLUDED.status,
                updated_at = EXCLUDED.updated_at
        `;
        await logHistory(page.version === 1 ? 'create' : 'update', 'page', page.id, user);
        return true;
    } catch (e) {
        console.error("Save Page Error:", e);
        return false;
    }
};

// --- SETTINGS ---
export const getSettings = async (): Promise<SiteSettings> => {
    try {
        const { rows } = await sql`SELECT value FROM settings WHERE key = 'global' LIMIT 1`;
        if (rows.length > 0) return rows[0].value as SiteSettings;
        return {} as SiteSettings;
    } catch (e) {
        return {} as SiteSettings;
    }
};

export const saveSettings = async (settings: SiteSettings, user: string): Promise<boolean> => {
    try {
        await sql`
            INSERT INTO settings (key, value, updated_at)
            VALUES ('global', ${JSON.stringify(settings)}, ${new Date().toISOString()})
            ON CONFLICT (key) DO UPDATE SET
                value = EXCLUDED.value,
                updated_at = EXCLUDED.updated_at
        `;
        await logHistory('update', 'settings', 'global', user);
        return true;
    } catch (e) {
        console.error("Save Settings Error:", e);
        return false;
    }
};

// --- HISTORY ---
export const getHistory = async (): Promise<HistoryEntry[]> => {
    try {
        const { rows } = await sql<HistoryEntry>`SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100`;
        return rows;
    } catch (e) {
        return [];
    }
};

// --- ANALYTICS ---
export const trackAnalyticsEvent = async (event: AnalyticsEvent) => {
    try {
        await sql`
            INSERT INTO analytics_events (id, session_id, type, path, data, timestamp)
            VALUES (
                ${event.id}, ${event.sessionId}, ${event.type}, ${event.path}, 
                ${JSON.stringify(event.data || {})}, ${event.timestamp}
            )
        `;
        return true;
    } catch (e) {
        console.error("Analytics Error:", e);
        return false;
    }
};

export const getAnalyticsEvents = async (): Promise<AnalyticsEvent[]> => {
    try {
        const { rows } = await sql<AnalyticsEvent>`SELECT * FROM analytics_events ORDER BY timestamp DESC LIMIT 500`;
        return rows;
    } catch (e) {
        return [];
    }
};

