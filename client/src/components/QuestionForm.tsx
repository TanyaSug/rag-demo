import { useState } from "react";
import type { FormEvent } from "react";
import { Box, Button, TextField } from "@mui/material";

interface QuestionFormProps {
    onSubmit: (question: string) => void;
    loading: boolean;
}

export function QuestionForm({ onSubmit, loading }: QuestionFormProps) {
    const [question, setQuestion] = useState("");

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const trimmed = question.trim();
        if (trimmed) {
            onSubmit(trimmed);
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 2 }}>
            <TextField
                fullWidth
                label="Ask a question about the documents"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                slotProps={{ htmlInput: { maxLength: 500 } }}
                disabled={loading}
            />
            <Button type="submit" variant="contained" disabled={loading || !question.trim()}>
                {loading ? "Thinking..." : "Ask"}
            </Button>
        </Box>
    );
}
