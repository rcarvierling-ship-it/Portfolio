import { Project, Photo, Page, HomeData, AboutData, ContactData, ServiceItem } from "@/lib/types";

// --- Mock Data Generators ---

const generateMockProjects = (count: number): Project[] => {
    const projects: Project[] = [];
    const categories = ['Commercial', 'Editorial', 'Travel', 'Product'];

    for (let i = 0; i < count; i++) {
        projects.push({
            id: `mock-project-${i + 1}`,
            title: `Project ${i + 1} - ${categories[i % categories.length]}`,
            slug: `mock-project-${i + 1}`,
            // category removed as it is not in Project type
            description: "This is a simulated project description. In sandbox mode, you can edit this text freely.",
            tags: ["Concept", "Production", "Editing", categories[i % categories.length]],
            coverImage: `/api/placeholder/800/600?text=Project+${i + 1}`, // Mapped to coverImage
            galleryImages: [], // Added required field
            tools: [], // Added required field
            year: "2024", // Added required field
            location: "New York, NY", // Added required field
            featured: i < 3,
            status: i % 5 === 0 ? 'draft' : 'published',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(), // Added required field
            version: 1 // Added required field
        });
    }
    return projects;
};

const generateMockPhotos = (count: number): Photo[] => {
    const photos: Photo[] = [];
    for (let i = 0; i < count; i++) {
        photos.push({
            id: `mock-photo-${i + 1}`,
            url: `/api/placeholder/1000/1000?text=Photo+${i + 1}`,
            width: 1000,
            height: 1000,
            altText: `Mock Photo ${i + 1}`, // Fixed prop name
            caption: `Simulated caption for photo ${i + 1}`,
            tags: ["Street", "Light", "Shadow"],
            status: i % 4 === 0 ? 'draft' : 'published',
            featured: false, // Added required field
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(), // Added required field
            version: 1 // Added required field
        });
    }
    return photos;
}

const defaultHomeData: HomeData = {
    hero: {
        title: "[SANDBOX] Hero Title",
        description: "This content exists only in your browser memory.",
        ctaPrimary: { text: "Mock Button", link: "#", show: true },
        ctaSecondary: { text: "Reset Sandbox", link: "#", show: true },
        defaultTheme: 'dark'
    },
    stats: { line1: "SANDBOX MODE • NO REAL DATA •", line2: "EXPERIMENT FREELY • BREAK THINGS •" },
    services: [
        { id: "s1", title: "Mock Service 1", subtitle: "Testing layouts", description: "Use this to test long descriptions.", color: "from-pink-500/20 to-rose-500/20", iconName: "Sparkles", show: true },
        { id: "s2", title: "Mock Service 2", subtitle: "Testing colors", description: "Use this to test interactions.", color: "from-blue-500/20 to-indigo-500/20", iconName: "Code2", show: true },
        { id: "s3", title: "Invisible Service", subtitle: "Should be hidden", description: "You shouldn't see this if toggled off.", color: "from-green-500/20 to-emerald-500/20", iconName: "Camera", show: false },
    ],
    settings: {
        backgroundEffects: true,
        animationIntensity: 'normal',
        showScrollIndicator: true,
        sectionSpacing: 'default'
    }
};

// --- Store Class ---

export class MockStore {
    projects: Project[];
    photos: Photo[];
    pages: Record<string, Page>;
    analytics: {
        liveVisitors: number;
        pageViews: number[];
    };

    constructor() {
        this.projects = generateMockProjects(12);
        this.photos = generateMockPhotos(24);
        this.pages = {
            home: {
                id: 'home',
                slug: 'home',
                title: 'Home',
                status: 'published',
                content: { published: defaultHomeData, draft: defaultHomeData },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: 1,
                blocks: []
            },
            about: {
                id: 'about',
                slug: 'about',
                title: 'About',
                status: 'published',
                content: {
                    published: { headline: "Sandbox User", bio: ["This is a bio."], portrait: "", gear: [], timeline: [] } as AboutData,
                    draft: { headline: "Sandbox User", bio: ["This is a bio."], portrait: "", gear: [], timeline: [] } as AboutData
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: 1,
                blocks: []
            },
            contact: {
                id: 'contact',
                slug: 'contact',
                title: 'Contact',
                status: 'published',
                content: {
                    published: { title: "Sandbox Contact", description: "Fake details.", email: "fake@email.com", instagram: "@fake" } as ContactData,
                    draft: { title: "Sandbox Contact", description: "Fake details.", email: "fake@email.com", instagram: "@fake" } as ContactData
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: 1,
                blocks: []
            }
        };
        this.analytics = {
            liveVisitors: 42,
            pageViews: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
        };
    }

    // --- Actions ---

    reset() {
        this.projects = generateMockProjects(12);
        this.photos = generateMockPhotos(24);
        // Reset pages logic if needed, simplify for now
    }

    // --- Project Actions ---

    addProject(project: Partial<Project>) {
        const newProject: Project = {
            id: `mock-project-${Date.now()}`,
            slug: `mock-project-${Date.now()}`,
            title: project.title || "New Mock Project",
            description: project.description || "Description placeholder",
            tags: project.tags || [],
            coverImage: project.coverImage || "/api/placeholder/800/600",
            galleryImages: [],
            tools: [],
            year: new Date().getFullYear().toString(),
            location: "Sandbox City",
            featured: false,
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
            ...project
        } as Project;
        this.projects.unshift(newProject);
    }

    updateProject(id: string, updates: Partial<Project>) {
        const index = this.projects.findIndex(p => p.id === id);
        if (index !== -1) {
            this.projects[index] = { ...this.projects[index], ...updates, updatedAt: new Date().toISOString() };
        }
    }

    deleteProject(id: string) {
        this.projects = this.projects.filter(p => p.id !== id);
    }

    reorderProjects(activeId: string, overId: string) {
        const oldIndex = this.projects.findIndex((p) => p.id === activeId);
        const newIndex = this.projects.findIndex((p) => p.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
            const [moved] = this.projects.splice(oldIndex, 1);
            this.projects.splice(newIndex, 0, moved);
        }
    }

    // --- Media Actions ---

    addPhoto() {
        // Simulating an upload
        const newPhoto: Photo = {
            id: `mock-photo-${Date.now()}`,
            url: `/api/placeholder/1000/1000?text=New+Upload+${this.photos.length + 1}`,
            width: 1000,
            height: 1000,
            altText: "New Mock Upload",
            caption: "Freshly uploaded to sandbox",
            tags: [],
            status: 'published',
            featured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1
        };
        this.photos.unshift(newPhoto);
    }

    updatePhoto(id: string, updates: Partial<Photo>) {
        const index = this.photos.findIndex(p => p.id === id);
        if (index !== -1) {
            this.photos[index] = { ...this.photos[index], ...updates, updatedAt: new Date().toISOString() };
        }
    }

    deletePhoto(id: string) {
        this.photos = this.photos.filter(p => p.id !== id);
    }

    // --- Analytics Simulation ---

    setLiveVisitors(count: number) {
        this.analytics.liveVisitors = Math.max(0, count);
    }

    simulateSpike() {
        this.analytics.liveVisitors += Math.floor(Math.random() * 50) + 20;
    }

    simulateDrop() {
        this.analytics.liveVisitors = Math.max(0, this.analytics.liveVisitors - Math.floor(Math.random() * 20));
    }

    // --- Chaos Mode ---

    triggerChaos() {
        // Randomly delete 30% of projects
        this.projects = this.projects.filter(() => Math.random() > 0.3);

        // Shuffle photos completely
        this.photos = this.photos.sort(() => Math.random() - 0.5);

        // Corrupt analytics
        this.analytics.liveVisitors = 9999;
        this.analytics.pageViews = this.analytics.pageViews.map(() => Math.floor(Math.random() * 5000));

        console.warn("CHAOS MODE ACTIVATED: Data scrambled.");
    }

    // --- Helper ---

    updatePage(slug: string, content: any) {
        if (this.pages[slug]) {
            this.pages[slug].content = content;
        }
    }

    getHomeData() {
        return this.pages['home'].content?.draft as HomeData;
    }
}

export const sandboxStore = new MockStore();
