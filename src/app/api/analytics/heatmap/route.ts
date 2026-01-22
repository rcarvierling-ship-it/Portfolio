import { NextResponse } from 'next/server';
import { PageHeatmapData } from '@/lib/types';

// Mock storage
let heatmapStore: Record<string, PageHeatmapData> = {
    '/': {
        path: '/',
        totalSessions: 1250,
        cursorMap: generateMockHeatmap(),
        scrollMap: generateMockScrollMap()
    },
    '/about': {
        path: '/about',
        totalSessions: 850,
        cursorMap: generateMockHeatmap(),
        scrollMap: generateMockScrollMap()
    }
};

function generateMockHeatmap() {
    const points = [];
    // CTA Button area (approx)
    points.push({ x: 50, y: 40, value: 95 });
    // Nav area
    points.push({ x: 90, y: 5, value: 80 });
    // Random scatter
    for (let i = 0; i < 50; i++) {
        points.push({
            x: Math.random() * 100,
            y: Math.random() * 100, // Top fold focus
            value: Math.random() * 50
        });
    }
    return points;
}

function generateMockScrollMap() {
    // Dropoff curve
    return Array.from({ length: 10 }, (_, i) => ({
        depth: (i + 1) * 10,
        count: Math.floor(1000 * Math.pow(0.8, i)),
        dwellTime: Math.random() * 5000 + 1000
    }));
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '/';

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json(heatmapStore[path] || heatmapStore['/']);
}

export async function POST(request: Request) {
    // Ingest generic event
    // In a real implementation: Parse body, increment counters in grid buckets
    return NextResponse.json({ success: true });
}
