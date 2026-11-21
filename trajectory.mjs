// Trajectory accuracy, relaxed ordering (the default): one step out of place
// scores 0.8 or 0.2 depending on which step moved.
import { compareTrajectories } from '@mastra/evals/scorers/utils';

const trajectory = names => ({ steps: names.map(name => ({ stepType: 'tool_call', name })) });
const expected = trajectory(['verify_identity', 'find_order', 'check_delivery', 'refund', 'notify_customer']);

const runs = [
  ['last step ran first', ['notify_customer', 'verify_identity', 'find_order', 'check_delivery', 'refund']],
  ['first step ran last', ['find_order', 'check_delivery', 'refund', 'notify_customer', 'verify_identity']],
];

for (const [label, actual] of runs) {
  const result = compareTrajectories(trajectory(actual), expected, { ordering: 'relaxed' });
  console.log(`${label.padEnd(20)} score=${result.score}  matchedSteps=${result.matchedSteps}/5  outOfOrderSteps=${JSON.stringify(result.outOfOrderSteps)}`);
}
