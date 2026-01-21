import OpenAI from 'openai';
import { auth } from "@/auth";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
});

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const { title, tags, imageCaptions, currentDescription } = await req.json();

        const prompt = `
You are a creative professional portfolio copywriter. 
Write a compelling, sophisticated, and engaging project description for a portfolio case study.

**Project Details:**
- **Title**: ${title}
- **Tags**: ${tags?.join(', ')}
${imageCaptions ? `- **Visual Context**: ${imageCaptions.join('; ')}` : ''}
${currentDescription ? `- **Draft/Notes**: ${currentDescription}` : ''}

**Style Guidelines:**
- Tone: Professional, innovative, high-end "Antigravity" aesthetic.
- Length: 2-3 paragraphs.
- Focus on the creative challenge, the solution, and the impact.
- Do NOT use cliches. Use active voice.

Write only the description text.
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            stream: true,
            messages: [{ role: 'user', content: prompt }],
        });

        // Create a Web Standard ReadableStream
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of response) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                    controller.close();
                } catch (err) {
                    controller.error(err);
                }
            },
        });

        return new Response(stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });

    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return new Response(error.message || 'Failed to generate description', { status: 500 });
    }
}
