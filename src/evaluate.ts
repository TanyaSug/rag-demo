import "dotenv/config";
import { readFile } from "node:fs/promises";
import { loadChunks, retrieve, MIN_SCORE } from "./query/answer.js";

interface EvalCase {
    question: string;
    expectAnswer: boolean;
}

const cases = JSON.parse(await readFile("data/eval.json", "utf-8")) as EvalCase[];
const chunks = await loadChunks();

const results: { question: string; expectAnswer: boolean; topScore: number }[] = [];

for (const c of cases) {
    const ranked = await retrieve(c.question, chunks, 1);
    results.push({ ...c, topScore: ranked[0]?.score ?? 0 });
}

console.log(`\nThreshold in use: ${MIN_SCORE}\n`);

for (const r of results) {
    const passed = r.topScore >= MIN_SCORE;
    const ok = passed === r.expectAnswer ? "OK  " : "FAIL";
    console.log(`${ok} ${r.topScore.toFixed(3)}  expect=${r.expectAnswer}  ${r.question}`);
}

console.log("\nThreshold sweep:");
for (let t = 0.1; t <= 0.5001; t += 0.05) {
    const correct = results.filter((r) => (r.topScore >= t) === r.expectAnswer).length;
    console.log(`  ${t.toFixed(2)}  ${correct}/${results.length} correct`);
}
