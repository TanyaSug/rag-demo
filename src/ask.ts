import "dotenv/config";
import { answerQuestion, loadChunks } from "./query/answer.js";

const question = process.argv.slice(2).join(" ").trim();

if (!question) {
    console.log('Usage: npm run ask -- "your question"');
    process.exit(1);
}

const chunks = await loadChunks();
const result = await answerQuestion(question, chunks);

console.log("\nAnswer:\n" + result.answer);
console.log("\nSources:", result.sources);
