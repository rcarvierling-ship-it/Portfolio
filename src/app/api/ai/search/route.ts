
import { NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/embeddings';
import { getProjects, getPhotos } from '@/lib/cms';

export const dynamic = 'force-dynamic';

// Simple Cosine Similarity
function cosineSimilarity(vecA: number[], vecB: number[]) {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
}

export async function POST(req: Request) {
    try {
        const { query } = await req.json();
        if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 });

        // 1. Embed Query
        const queryEmbedding = await generateEmbedding(query);
        if (!queryEmbedding) return NextResponse.json({ error: "Failed to embed query" }, { status: 500 });

        // 2. Fetch Data (Optimized: In a real app with >1000 items, use pgvector. Here we do in-memory for zero-config)
        const [projects, photos] = await Promise.all([
            getProjects(false), // Only published
            getPhotos(false)
        ]);

        // 3. Rank Results
        const results = [];

        // Projects
        for (const p of projects) {
            const embedding = (p as any).embedding;
            // Note: In pg/vercel-postgres, jsonb array comes back as object/array. simpler cast:
            if (embedding && Array.isArray(embedding)) {
                const score = cosineSimilarity(queryEmbedding, embedding);
                if (score > 0.4) { // Threshold
                    results.push({
                        type: 'project',
                        id: p.id,
                        title: p.title,
                        slug: p.slug,
                        image: p.coverImage,
                        score,
                        description: p.description
                    });
                }
            }
        }

        // Photos
        for (const p of photos) {
            const embedding = (p as any).embedding;
            if (embedding && Array.isArray(embedding)) {
                const score = cosineSimilarity(queryEmbedding, embedding);
                if (score > 0.45) { // Slightly higher threshold for photos maybe?
                    results.push({
                        type: 'photo',
                        id: p.id,
                        title: p.caption || "Untitled Photo",
                        slug: null, // photos might not have individual pages yet
                        image: p.url,
                        score,
                        description: p.altText
                    });
                }
            }
        }

        // Sort by score DESC
        results.sort((a, b) => b.score - a.score);

        return NextResponse.json({ results: results.slice(0, 10) }); // Top 10

    } catch (e: any) {
        console.error("Search Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
