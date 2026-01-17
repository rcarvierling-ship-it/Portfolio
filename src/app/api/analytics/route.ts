import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'analytics-data.json');

interface AnalyticsData {
    pageViews: Record<string, number>; // "2025-01-17": 12
    totalViews: number;
    visitors: Record<string, boolean>; // Simple visitor tracking by date-ip hash
}

// Initial data structure
const getInitialData = (): AnalyticsData => ({
    pageViews: {},
    totalViews: 0,
    visitors: {},
});

function readData(): AnalyticsData {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return getInitialData();
        }
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading analytics file:", error);
        return getInitialData();
    }
}

function writeData(data: AnalyticsData) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing analytics file:", error);
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    const { path } = body;
    const date = new Date().toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue"

    const data = readData();

    // Update views
    data.totalViews = (data.totalViews || 0) + 1;
    data.pageViews[date] = (data.pageViews[date] || 0) + 1;

    writeData(data);

    return NextResponse.json({ success: true });
}

export async function GET() {
    const data = readData();

    // Transform for dashboard { day: "Mon", views: 12 }
    const chartData = Object.entries(data.pageViews).map(([day, views]) => ({
        day,
        views
    }));

    // Ensure all days (or at least recent ones) are present ideally, 
    // but for simplicity we return what we have. 
    // We can sort or fill gaps in the frontend if needed.

    return NextResponse.json({
        totalViews: data.totalViews,
        chartData: chartData
    });
}
