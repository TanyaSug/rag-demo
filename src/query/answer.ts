import OpenAI from "openai";
import { readFile } from "node:fs/promises";
import type { Chunk } from "../types.js";

let client: OpenAI | null = null;

function getClient(): OpenAI {
    if (!client) {
        client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return client;
}

export async function loadChunks(): Promise<Chunk[]> {
    const raw = await readFile("src/store/embeddings.json", "utf-8");
    return JSON.parse(raw) as Chunk[];
}

function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let magA = 0;
    let magB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += (a[i] ?? 0) * (b[i] ?? 0);
        magA += (a[i] ?? 0) ** 2;
        magB += (b[i] ?? 0) ** 2;
    }
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export const MIN_SCORE = 0.3;

export async function retrieve(question: string, chunks: Chunk[], topN = 3) {
    const embeddingRes = await getClient().embeddings.create({
        model: "text-embedding-3-small",
        input: question,
    });
    const queryVector = embeddingRes.data[0]?.embedding ?? [];

    return chunks
        .map((chunk) => ({ chunk, score: cosineSimilarity(queryVector, chunk.embedding) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topN);
}

export async function answerQuestion(question: string, chunks: Chunk[], topN = 3) {
    const ranked = await retrieve(question, chunks, topN);
    const top = ranked.filter((t) => t.score >= MIN_SCORE);

    if (top.length === 0) {
        return {
            answer: "The documents do not contain information about this question.",
            sources: [],
        };
    }

    const context = top.map((t) => `[${t.chunk.source}]\n${t.chunk.text}`).join("\n\n---\n\n");

    const completion = await getClient().chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0,
        messages: [
            {
                role: "system",
                content:
                    "Answer only using the provided context. If the answer is not in the context, say so. Always answer in English.",
            },
            { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` },
        ],
    });

    return {
        answer: completion.choices[0]?.message.content ?? "",
        sources: top.map((t) => ({ source: t.chunk.source, score: t.score.toFixed(3) })),
    };
}