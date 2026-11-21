// Completeness scorer: a question and an answer in a non-Latin script always score 1,
// and score 0 as soon as the answer contains a digit or a Latin word.
import { createCompletenessScorer } from '@mastra/evals/scorers/prebuilt';
import { createAgentTestRun, createTestMessage } from '@mastra/evals/scorers/utils';

const scorer = createCompletenessScorer();
const cases = [
  ['English, unrelated answer', 'Where is my order and when will the courier arrive?', 'We have great discounts on headphones this week.'],
  ['Japanese, unrelated answer', '注文はどこにあり、配達員はいつ到着しますか。', '今週はヘッドホンがとてもお得です。'],
  ['Chinese, unrelated answer', '我的订单在哪里，快递员什么时候到？', '本周耳机有很大的折扣。'],
  ['Russian, unrelated answer', 'Где мой заказ и когда приедет курьер?', 'На этой неделе у нас отличные скидки на наушники.'],
  ['Russian, correct answer with a time', 'Где мой заказ и когда приедет курьер?', 'Ваш заказ в пути, курьер приедет завтра до 18:00.'],
];

for (const [label, question, answer] of cases) {
  const result = await scorer.run(
    createAgentTestRun({
      inputMessages: [createTestMessage({ role: 'user', content: question, id: 'q' })],
      output: [createTestMessage({ role: 'assistant', content: answer, id: 'a' })],
    }),
  );
  const { inputElements, outputElements } = result.preprocessStepResult;
  console.log(`${label.padEnd(36)} score=${result.score}  inputElements=${inputElements.length}  outputElements=${JSON.stringify(outputElements)}`);
}
