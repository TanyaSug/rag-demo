import "dotenv/config";
import { writeFile } from "node:fs/promises";
import { loadDocuments } from "./ingest/loadDocuments.js";
import { chunkText } from "./ingest/chunkText.js";
import { embedTexts, toChunks } from "./ingest/embedChunks.js";
import type { Chunk } from "./types.js";

async function main() {
    const docs = await loadDocuments();
    const allChunks: Chunk[] = [];

    for (const doc of docs) {
        const texts = chunkText(doc.text);
        const embeddings = await embedTexts(texts);
        allChunks.push(...toChunks(doc.filename, texts, embeddings));
        console.log(`✓ ${doc.filename}: ${texts.length} chunks`);
    }

    await writeFile("src/store/embeddings.json", JSON.stringify(allChunks));
    console.log(`Saved ${allChunks.length} chunks в src/store/embeddings.json`);
}

main();