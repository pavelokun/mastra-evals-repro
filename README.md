# Reproductions for three bugs in `@mastra/evals` code scorers

Each script uses only the published packages (`@mastra/evals` 1.10.11, `@mastra/core` 1.85.0), makes no LLM calls and needs no API key. Node 22.

```bash
npm install
```

## 1. Completeness scorer: non-Latin text always scores 1

```bash
node completeness.mjs
```

```text
English, unrelated answer            score=0  inputElements=11  outputElements=["we","great","discounts","headphones","week","have","on","this"]
Japanese, unrelated answer           score=1  inputElements=0  outputElements=[]
Chinese, unrelated answer            score=1  inputElements=0  outputElements=[]
Russian, unrelated answer            score=1  inputElements=0  outputElements=[]
Russian, correct answer with a time  score=0  inputElements=0  outputElements=["18","00"]
```

Patch with tests: [`patches/1-completeness-non-latin.patch`](patches/1-completeness-non-latin.patch)

## 2. Trajectory accuracy, relaxed ordering: one misplaced step scores 0.8 or 0.2

```bash
node trajectory.mjs
```

```text
last step ran first  score=0.8  matchedSteps=4/5  outOfOrderSteps=["notify_customer"]
first step ran last  score=0.2  matchedSteps=1/5  outOfOrderSteps=["find_order","check_delivery","refund","notify_customer"]
```

Patch with tests: [`patches/2-trajectory-relaxed-order.patch`](patches/2-trajectory-relaxed-order.patch)

## 3. Textual difference scorer: out of memory on long texts

```bash
node textual-difference.mjs 15000
node textual-difference.mjs 30000
```

```text
characters=15000  score=0.889  time=4.4s  peakRSS=1461MB
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

Patch with tests: [`patches/3-textual-difference-memory.patch`](patches/3-textual-difference-memory.patch)

## Patches

The patches apply to `mastra-ai/mastra` `main` at `6c4a155`:

```bash
git apply patches/*.patch
cd packages/evals && pnpm vitest run --project unit:packages/evals
```

With all three applied the package's unit suite passes (411 tests, 6 of them new). The 6 new tests fail without the fixes.
