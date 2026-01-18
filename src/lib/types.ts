// Base Entity for all CMS items
export interface BaseEntity {
    id: string;
    createdAt: string; // ISO Date
    updatedAt: string; // ISO Date
    publishedAt?: string; // ISO Date (if published)
    status: 'draft' | 'published';
    version: number;
}

// Global Site Settings
export interface SiteSettings extends BaseEntity {
    heroTitle: string;
    heroDescription: string;
    email: string;
    instagram: string;
    footerText: string;
    homepageSections: string[]; // Order of section IDs
    seo: {
        defaultTitle: string;
        defaultDescription: string;
        ogImage: string;
    }
}

// Media Library Item
export interface Photo extends BaseEntity {
    url: string;
    caption?: string;
    altText: string;
    tags: string[];
    featured: boolean; // For portfolio highlights
    width?: number;
    height?: number;
    blurDataURL?: string; // Base64 placeholder
    variants?: {
        thumbnail: string; // 300px
        medium: string;    // 800px
        original: string;
    };
}

// Content Blocks for Dynamic Pages
export type ContentBlockType = 'text' | 'image' | 'gallery' | 'quote' | 'video' | 'cta';

export interface ContentBlock {
    id: string;
    type: ContentBlockType;
    content: any; // Flexible content based on type
    // e.g. text: { html: string }, image: { photoId: string }, gallery: { photoIds: string[] }
}

// Dynamic Page (e.g. Home, About)
export interface Page extends BaseEntity {
    slug: string; // e.g. 'home', 'about'
    title: string;
    description?: string; // SEO
    content?: any; // Structured data (e.g. AboutData)
    blocks: ContentBlock[];
}

export interface GalleryItem {
    id: string;
    url: string;
    caption?: string;
    width?: number;
    height?: number;
}

// Project (Extended)
export interface Project extends BaseEntity {
    slug: string;
    title: string;
    description: string;
    content?: any; // Rich text or block content from CMS
    year: string;
    location: string;
    tags: string[];
    tools: string[]; // e.g. "Next.js", "React"
    camera?: string;
    lens?: string;
    coverImage: string; // URL or Photo ID
    galleryImages: GalleryItem[]; // Array of structured items
    featured: boolean;
}

// Legacy types support (mapped or deprecated)
export interface AboutData {
    headline: string;
    bio: string[];
    portrait: string;
}

export interface Gear {
    category: string;
    items: string[];
}

export interface TimelineItem {
    year: string;
    title: string;
    location?: string;
    description: string;
}

// Audit Log
export interface HistoryEntry {
    id: string;
    timestamp: string;
    user: string; // Email or name
    action: 'create' | 'update' | 'delete';
    entityType: 'project' | 'photo' | 'page' | 'settings';
    entityId: string;
    changes?: string; // JSON string diff or summary
    snapshot?: any; // Previous state for rollback
}

// Analytics
export interface AnalyticsEvent {
    id: string;
    sessionId: string;
    timestamp: string;
    type: 'pageview' | 'click' | 'scroll' | 'social';
    path: string;
    data?: {
        target?: string; // For clicks (href or id)
        depth?: number;  // For scroll (25, 50, 75, 100)
        referrer?: string;
        device?: 'mobile' | 'desktop' | 'tablet';
        [key: string]: any;
    };
}
