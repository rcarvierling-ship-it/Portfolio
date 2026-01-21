
import { generateEmbedding } from '@/lib/embeddings';
import { getProjects, getPhotos, getSettings } from '@/lib/cms';
import OpenAI from "openai";

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
});

// Reusing cosine sim logic
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

async function getContext(query: string) {
    try {
        const embedding = await generateEmbedding(query);
        if (!embedding) return "";

        const [projects, photos, settings] = await Promise.all([
            getProjects(false),
            getPhotos(false),
            getSettings()
        ]);

        const scoredItems = [];

        for (const p of projects) {
            const emb = (p as any).embedding;
            if (emb && Array.isArray(emb)) {
                scoredItems.push({
                    text: `Project: ${p.title}. Description: ${p.description}. Tags: ${p.tags?.join(', ')}.`,
                    score: cosineSimilarity(embedding, emb)
                });
            }
        }

        for (const p of photos) {
            const emb = (p as any).embedding;
            if (emb && Array.isArray(emb)) {
                scoredItems.push({
                    text: `Photo: ${p.caption || "Untitled"}. Context: ${p.altText || ""}.`,
                    score: cosineSimilarity(embedding, emb)
                });
            }
        }

        scoredItems.sort((a, b) => b.score - a.score);

        // Take top 3 relevant chunks
        const topItems = scoredItems.slice(0, 3).map(i => i.text).join("\n---\n");
        return `Relevant Portfolio Context:\n${topItems}`;
    } catch (e) {
        console.error("Context retrieval failed", e);
        return "";
    }
}

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy-key-for-build") {
            return new Response("OpenAI API Key is not set.", { status: 503 });
        }

        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1];

        // 1. Retrieve Context (RAG)
        const context = await getContext(lastMessage.content);

        // 2. System Prompt
        const systemPrompt = `
        You are "Echo", a digital twin assistant for Reese Vierling (a Visual Director & Photographer).
        Your tone is professional, creative, slightly avant-garde, and helpful.
        
        Use the following context from Reese's portfolio to answer questions. 
        If the answer isn't in the context, use your general knowledge but mention you are "improvising based on general principles" or ask the user to contact Reese directly for specifics.
        
        Context:
        ${context}
        
        Keep answers concise (under 3-4 sentences) unless asked for detail.
        `;

        // 3. Stream Response
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            stream: true,
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
        });

        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of response) {
                    const text = chunk.choices[0]?.delta?.content || "";
                    controller.enqueue(new TextEncoder().encode(text));
                }
                controller.close();
            },
        });

        return new Response(stream, { headers: { "Content-Type": "text/plain" } });

    } catch (e: any) {
        return new Response(e.message, { status: 500 });
    }
}
