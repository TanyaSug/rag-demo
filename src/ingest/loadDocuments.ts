import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { SourceDocument } from "../types.js";

const DOCUMENTS_DIR = path.resolve("data/documents");
const SUPPORTED_EXTENSIONS = [".md", ".txt", ".jsx"];

export async function loadDocuments(): Promise<SourceDocument[]> {
    const files = await readdir(DOCUMENTS_DIR);

    const supported = files.filter((file) =>
        SUPPORTED_EXTENSIONS.includes(path.extname(file).toLowerCase())
    );

    return Promise.all(
        supported.map(async (filename) => ({
            filename,
            text: await readFile(path.join(DOCUMENTS_DIR, filename), "utf-8"),
        }))
    );
}