import { NextResponse } from 'next/server';

// Mock data generator for analytics since we don't have a real DB with populated EXIF yet
export async function GET() {
    // In a real app, this would query the DB for all Photos and Projects,
    // aggregate count of unique camera/lens models, and average engagement stats.

    const mockStats = {
        cameraDistribution: [
            { name: "Sony A7R V", count: 45, engagement: 98 },
            { name: "Fujifilm X100V", count: 32, engagement: 92 },
            { name: "Leica Q2", count: 18, engagement: 95 },
            { name: "iPhone 15 Pro", count: 12, engagement: 75 },
            { name: "Canon R5", count: 8, engagement: 88 }
        ],
        lensDistribution: [
            { name: "Sony 24-70mm GM II", count: 38, engagement: 96 },
            { name: "Sony 35mm f/1.4 GM", count: 25, engagement: 99 },
            { name: "Voigtlander 40mm", count: 15, engagement: 94 },
            { name: "Fujinon 23mm", count: 32, engagement: 92 }
        ],
        // Trend over last 6 months
        usageTrend: [
            { month: "Aug", sony: 10, fuji: 5, leica: 2 },
            { month: "Sep", sony: 12, fuji: 8, leica: 2 },
            { month: "Oct", sony: 15, fuji: 6, leica: 4 },
            { month: "Nov", sony: 8, fuji: 10, leica: 5 },
            { month: "Dec", sony: 4, fuji: 15, leica: 8 }, // Switched to Fuji/Leica more?
            { month: "Jan", sony: 6, fuji: 12, leica: 10 }
        ],
        topCombinations: [
            { gear: "Sony A7R V + 35mm GM", shotCount: 22, avgEngagement: 99 },
            { gear: "Leica Q2", shotCount: 18, avgEngagement: 95 },
            { gear: "Fuji X100V", shotCount: 32, avgEngagement: 92 },
        ]
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(mockStats);
}
