import fs from 'fs';
import path from 'path';
import {
    Project, SiteSettings, Photo, Page, HistoryEntry, BaseEntity, AnalyticsEvent
} from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'src/data');

// Helper to read JSON
function readJson<T>(filename: string): T {
    const filePath = path.join(DATA_DIR, filename);
    try {
        if (!fs.existsSync(filePath)) return [] as unknown as T;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [] as unknown as T;
    }
}

// Helper to write JSON
function writeJson(filename: string, data: any): boolean {
    const filePath = path.join(DATA_DIR, filename);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        return false;
    }
}

// --- History Logging ---
function logHistory(
    action: HistoryEntry['action'],
    entityType: HistoryEntry['entityType'],
    entityId: string,
    user: string,
    changes?: string,
    snapshot?: any
) {
    const history = readJson<HistoryEntry[]>('history.json') || [];
    const entry: HistoryEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        user,
        action,
        entityType,
        entityId,
        changes,
        snapshot
    };
    history.unshift(entry); // Add to top
    // Limit log size to 1000 entries
    if (history.length > 1000) history.length = 1000;
    writeJson('history.json', history);
}

// --- Generic CRUD Helpers ---
function getAll<T extends BaseEntity>(filename: string, includeDrafts: boolean = false): T[] {
    const items = readJson<T[]>(filename);
    if (includeDrafts) return items;
    return items.filter(item => item.status === 'published');
}

function getById<T extends BaseEntity>(filename: string, id: string): T | undefined {
    const items = readJson<T[]>(filename);
    return items.find(item => item.id === id);
}

function save<T extends BaseEntity>(
    filename: string,
    item: T,
    entityType: HistoryEntry['entityType'],
    user: string
): boolean {
    const items = readJson<T[]>(filename);
    const index = items.findIndex(i => i.id === item.id);
    let action: HistoryEntry['action'] = 'update';
    let snapshot: any = null;

    if (index >= 0) {
        // Update
        snapshot = items[index]; // Capture state BEFORE update
        items[index] = { ...items[index], ...item, updatedAt: new Date().toISOString() };
    } else {
        // Create
        action = 'create';
        item.createdAt = new Date().toISOString();
        item.updatedAt = new Date().toISOString();
        item.version = 1;
        items.unshift(item);
    }

    const success = writeJson(filename, items);
    if (success) {
        logHistory(action, entityType, item.id, user, undefined, snapshot);
    }
    return success;
}

function deleteItem<T extends BaseEntity>(
    filename: string,
    id: string,
    entityType: HistoryEntry['entityType'],
    user: string
): boolean {
    const items = readJson<T[]>(filename);
    const newItems = items.filter(i => i.id !== id);
    if (newItems.length === items.length) return false; // Not found

    const success = writeJson(filename, newItems);
    if (success) {
        logHistory('delete', entityType, id, user);
    }
    return success;
}

// --- Specific Accessors ---

// Helper to save all (bulk)
function saveAll<T extends BaseEntity>(
    filename: string,
    items: T[],
    entityType: HistoryEntry['entityType'],
    user: string
): boolean {
    const success = writeJson(filename, items);
    if (success) {
        logHistory('update', entityType, 'bulk-reorder', user);
    }
    return success;
}

// PROJECTS
export const fileProjects = 'projects.json';
export const getProjects = (includeDrafts = false) => getAll<Project>(fileProjects, includeDrafts);
export const getProject = (slug: string) => readJson<Project[]>(fileProjects).find(p => p.slug === slug);
export const saveProject = (project: Project, user: string) => save(fileProjects, project, 'project', user);
export const saveProjects = (projects: Project[], user: string) => saveAll(fileProjects, projects, 'project', user);
export const deleteProject = (id: string, user: string) => deleteItem(fileProjects, id, 'project', user);

// PHOTOS
export const filePhotos = 'photos.json';
export const getPhotos = (includeDrafts = false) => getAll<Photo>(filePhotos, includeDrafts);
export const savePhoto = (photo: Photo, user: string) => save(filePhotos, photo, 'photo', user);
export const savePhotos = (photos: Photo[], user: string) => saveAll(filePhotos, photos, 'photo', user);
export const deletePhoto = (id: string, user: string) => deleteItem(filePhotos, id, 'photo', user);

// PAGES
export const filePages = 'pages.json';
export const getPages = (includeDrafts = false) => getAll<Page>(filePages, includeDrafts);
export const getPage = (slug: string) => readJson<Page[]>(filePages).find(p => p.slug === slug);
export const savePage = (page: Page, user: string) => save(filePages, page, 'page', user);

// SETTINGS
export const fileSettings = 'settings.json';
export const getSettings = (): SiteSettings => {
    return readJson<SiteSettings>(fileSettings) || {} as SiteSettings;
};
export const saveSettings = (settings: SiteSettings, user: string) => {
    // Settings is a single object, not array, so custom save logic needed or wrap in save
    // But our save() expects array. Let's customize for settings.
    const success = writeJson(fileSettings, {
        ...settings,
        updatedAt: new Date().toISOString()
    });
    if (success) logHistory('update', 'settings', 'global', user);
    return success;
};

// HISTORY
export const getHistory = () => readJson<HistoryEntry[]>('history.json');

// ANALYTICS
export const fileAnalytics = 'analytics_events.json';
export const trackAnalyticsEvent = (event: AnalyticsEvent) => {
    // Append-only log
    const events = readJson<AnalyticsEvent[]>(fileAnalytics) || [];
    events.push(event);
    // Optional: Rotate/Archive logs if too large? For now keep it simple.
    return writeJson(fileAnalytics, events);
};
export const getAnalyticsEvents = () => readJson<AnalyticsEvent[]>(fileAnalytics);
