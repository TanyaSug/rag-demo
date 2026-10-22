import { useState } from "react";
import { Alert, Container, Stack, Typography } from "@mui/material";
import { askQuestion } from "./api";
import { QuestionForm } from "./components/QuestionForm";
import { AnswerDisplay } from "./components/AnswerDisplay";
import type { AskResponse } from "./types";

export default function App() {
  const [result, setResult] = useState<AskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk(question: string) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      setResult(await askQuestion(question));
    } catch (err) {
      const isNetworkError = err instanceof TypeError;
      setError(
          isNetworkError
              ? "Could not reach the server. Is it running on port 3001?"
              : err instanceof Error
                  ? err.message
                  : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Stack spacing={3}>
          <Typography variant="h4" component="h1">
            rag-demo
          </Typography>
          <Typography color="text.secondary">
            Ask a question. Answers come only from the indexed documents, with the sources shown.
          </Typography>

          <QuestionForm onSubmit={handleAsk} loading={loading} />

          {error && <Alert severity="error">{error}</Alert>}
          {result && <AnswerDisplay result={result} />}
        </Stack>
      </Container>
  );
}
