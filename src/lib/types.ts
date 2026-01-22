// Base Entity for all CMS items
export interface BaseEntity {
    id: string;
    createdAt: string; // ISO Date
    updatedAt: string; // ISO Date
    publishedAt?: string; // ISO Date (if published)
    status: 'draft' | 'published';
    version: number;
}

// Metadata Overlay Configuration
export interface MetadataOverlayConfig {
    show: boolean; // Master toggle
    mode: 'always' | 'hover';
    position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
    fields: {
        camera: boolean;
        lens: boolean;
        settings: boolean; // ISO, Shutter, Aperture combined
        date: boolean;
    };
    style: 'minimal' | 'badge' | 'terminal';
}

// Global Site Settings
export interface SiteSettings extends BaseEntity {
    pinnedItems?: PinnedItem[];
    metadataOverlay?: MetadataOverlayConfig; // Global default
    heroTitle: string;
    // ... (rest of SiteSettings)
}

// Media Library Item
export interface Photo extends BaseEntity {
    url: string;
    // ...
    metadataOverlay?: MetadataOverlayConfig; // Per-photo override
    colors?: string[]; // Array of hex codes
    mood?: string;     // AI-detected vibe (e.g. "Cyberpunk", "Minimalist")
}

// Project
export interface Project extends BaseEntity {
    // ...
    metadataOverlay?: MetadataOverlayConfig; // Per-project override
    slug: string;
    // ...
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
    content?: any; // Structured data (e.g. AboutData, HomeData)
    blocks: ContentBlock[];
}

export interface ServiceItem {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    color: string;
    iconName?: 'Camera' | 'Video' | 'Code2' | 'Sparkles'; // Store icon name as string
    show?: boolean;
    link?: string; // Optional link URL
}

export interface HomeData {
    hero: {
        title: string;
        description: string;
        images?: string[]; // Background images for ambient parallax grid
        ctaPrimary?: { text: string; link: string; show: boolean };
        ctaSecondary?: { text: string; link: string; show: boolean };
        defaultTheme?: 'dark' | 'light';
    };
    stats: {
        line1: string;
        line2: string;
    };
    services: ServiceItem[];
    marquee?: {
        show?: boolean;
        keywords: string[];
    };
    settings?: {
        backgroundEffects: boolean;
        animationIntensity: 'normal' | 'reduced';
        showScrollIndicator: boolean;
        sectionSpacing: 'small' | 'default' | 'large';
    };
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
// Mapped types for specific page content structure
export interface AboutData {
    headline: string;
    bio: string[];
    portrait: string;
    // Gear and timeline are usually separate blocks or arrays, but can be part of data for now
    gear?: Gear[];
    timeline?: TimelineItem[];
}

export interface ContactData {
    title: string;
    description: string;
    email: string;
    instagram: string;
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
        geo?: {
            country?: string;
            city?: string;
            lat?: string;
            lng?: string;
            region?: string;
        };
        [key: string]: any;
    };
}
