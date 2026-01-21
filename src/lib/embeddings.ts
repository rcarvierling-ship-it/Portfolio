
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
});

export async function generateEmbedding(text: string): Promise<number[] | null> {
    try {
        if (!text || text.trim().length === 0) return null;

        // Clean text (remove newlines, extra spaces)
        const cleanText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: cleanText,
            encoding_format: "float",
        });

        return response.data[0].embedding;
    } catch (error) {
        console.error("Error generating embedding:", error);
        return null;
    }
}
