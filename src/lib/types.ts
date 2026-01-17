export interface Project {
    title: string;
    slug: string;
    year: string;
    tags: string[]; // e.g. "Portrait", "Street", "B&W"
    description: string;
    location: string;
    camera?: string; // e.g. "Sony A7IV"
    lens?: string; // e.g. "35mm GM"
    coverImage: string;
    galleryImages: string[]; // Array of image paths
    featured: boolean;
}

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
