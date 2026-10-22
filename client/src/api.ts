import type { AskResponse } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function askQuestion(question: string): Promise<AskResponse> {
    const response = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error ?? "Request failed.");
    }

    return data as AskResponse;
}
