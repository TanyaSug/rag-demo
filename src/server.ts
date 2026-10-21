import "dotenv/config";
import express from "express";
import cors from "cors";
import { answerQuestion, loadChunks } from "./query/answer.js";

const PORT = 3001;
const MAX_QUESTION_LENGTH = 500;

const app = express();
app.use(cors());
app.use(express.json());

const chunks = await loadChunks();

app.get("/", (_req, res) => {
    res.json({ name: "rag-demo", endpoints: ["GET /health", "POST /ask"] });
});


app.get("/health", (_req, res) => {
    res.json({ status: "ok", chunks: chunks.length });
});

app.post("/ask", async (req, res) => {
    const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";

    if (!question) {
        res.status(400).json({ error: "Field 'question' is required." });
        return;
    }

    if (question.length > MAX_QUESTION_LENGTH) {
        res.status(400).json({ error: `Question must be ${MAX_QUESTION_LENGTH} characters or fewer.` });
        return;
    }

    try {
        const result = await answerQuestion(question, chunks);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate an answer." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
