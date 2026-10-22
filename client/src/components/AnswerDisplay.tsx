import { Box, Chip, Paper, Typography } from "@mui/material";
import type { AskResponse } from "../types";

interface AnswerDisplayProps {
    result: AskResponse;
}

export function AnswerDisplay({ result }: AnswerDisplayProps) {
    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="overline">Answer</Typography>
            <Typography sx={{ whiteSpace: "pre-wrap", mb: 2 }}>{result.answer}</Typography>

            {result.sources.length > 0 && (
                <>
                    <Typography variant="overline">Sources</Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                        {result.sources.map((source, index) => (
                            <Chip
                                key={`${source.source}-${index}`}
                                label={`${source.source} (${source.score})`}
                                size="small"
                                variant="outlined"
                            />
                        ))}
                    </Box>
                </>
            )}
        </Paper>
    );
}
