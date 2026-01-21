
import { NextResponse } from 'next/server';
import { getPhotos } from '@/lib/cms';

export const dynamic = 'force-dynamic';

function cosineSimilarity(vecA: number[], vecB: number[]) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const allPhotos = await getPhotos();

        const targetPhoto = allPhotos.find(p => p.id === id);

        if (!targetPhoto) {
            return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
        }

        // 1. Get embedding of target (if exists)
        // Note: We need to access the 'embedding' property which might not be on the public type yet, 
        // but it is in the DB object returned by getPhotos/sql.
        // We'll cast to any for now since our Public type doesn't expose it to avoid leaking massive arrays to client unless needed.
        const targetEmbedding = (targetPhoto as any).embedding as number[];

        if (!targetEmbedding) {
            return NextResponse.json({ related: [] }); // No embedding, no relations
        }

        // 2. Score all other photos
        const scored = allPhotos
            .filter(p => p.id !== id && (p as any).embedding) // Exclude self and invalid
            .map(p => ({
                photo: p,
                score: cosineSimilarity(targetEmbedding, (p as any).embedding as number[])
            }))
            .sort((a, b) => b.score - a.score) // Sort desc matches
            .slice(0, 6); // Top 6

        return NextResponse.json({
            related: scored.map(s => s.photo)
        });

    } catch (error) {
        console.error("Related Photos Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
