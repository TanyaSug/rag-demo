export interface SourceDocument {
    filename: string;
    text: string;
}

export interface Chunk {
    text: string;
    source: string;
    embedding: number[];
}