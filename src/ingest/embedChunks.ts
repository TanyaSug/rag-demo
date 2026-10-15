import OpenAI from "openai";
import type { Chunk } from "../types.js";

let client: OpenAI | null = null;

function getClient(): OpenAI {
    if (!client) {
        client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return client;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    const BATCH_SIZE = 100;

    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
        const batch = texts.slice(i, i + BATCH_SIZE);
        const response = await getClient().embeddings.create({
            model: "text-embedding-3-small",
            input: batch,
        });
        embeddings.push(...response.data.map((d) => d.embedding));
    }

    return embeddings;
}

export function toChunks(
    source: string,
    texts: string[],
    embeddings: number[][]
): Chunk[] {
    return texts.map((text, i) => ({
        text,
        source,
        embedding: embeddings[i] ?? [],
    }));
}