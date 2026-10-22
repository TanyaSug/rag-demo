export interface Source {
    source: string;
    score: string;
}

export interface AskResponse {
    answer: string;
    sources: Source[];
}
