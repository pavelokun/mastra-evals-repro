// Textual difference scorer: memory grows with input length squared.
// usage: node textual-difference.mjs [characters per text]   (default 15000; 30000 crashes Node)
import { createTextualDifferenceScorer } from '@mastra/evals/scorers/prebuilt';
import { createAgentTestRun, createTestMessage } from '@mastra/evals/scorers/utils';

const length = Number(process.argv[2] ?? 15000);
const original = 'lorem ipsum dolor sit amet '.repeat(Math.ceil(length / 27)).slice(0, length);
const edited = original.replace(/o/g, '0');

const started = performance.now();
const result = await createTextualDifferenceScorer().run(
  createAgentTestRun({
    inputMessages: [createTestMessage({ role: 'user', content: original, id: 'q' })],
    output: [createTestMessage({ role: 'assistant', content: edited, id: 'a' })],
  }),
);
const seconds = ((performance.now() - started) / 1000).toFixed(1);
const peakMb = Math.round(process.resourceUsage().maxRSS / 1024);
console.log(`characters=${length}  score=${result.score.toFixed(3)}  time=${seconds}s  peakRSS=${peakMb}MB`);
