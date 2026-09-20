# aurum-gate

> Confidence is the karat stamp. Probability opens the door — confidence decides if gold flows automatic, or a human holds the pour.

**@ormus/aurum-gate** is a tiny TypeScript router for **confidence-gated actions** — the Ormus take on **Jev Pattern 2** (per-action floors, human escalations, refuse-below bands). Pair it with TypeSafe Jev / Vercel AI SDK style scoring; this package stays dependency-light and mock-friendly.

Inspired by the public **TypeSafe** and **Vercel** Jev pattern guides, and the spirit of **Daniel Ch’s free master-Jev** teaching: measure twice, act once, escalate when the metal is soft.

## Install

```bash
npm i @ormus/aurum-gate
# peers: ai, @typesafe-ai/sdk (optional at runtime — wire your own scorer)
```

## Quick pour

```ts
import { AurumGate } from '@ormus/aurum-gate';

const gate = new AurumGate({
  thresholds: {
    'refund.issue': { minProbability: 0.7, autoConfidence: 0.92, refuseBelow: 0.3 },
  },
});

gate.resolve({ actionId: 'refund.issue', probability: 0.88, confidence: 0.95 });
// → { decision: 'auto', ... }
```

Decisions: `auto` | `escalate` | `refuse`.

## Liquid Gold siblings

| Repo | Role |
|------|------|
| [aurum-gate](https://github.com/Ormus-Solutions/aurum-gate) | **You are here** — Pattern 2 confidence gates |
| [quicksilver-judge](https://github.com/Ormus-Solutions/quicksilver-judge) | Raven Judge PR pre-filter |
| [gold-assay](https://github.com/Ormus-Solutions/gold-assay) | Vibium UI proof scorer |
| [molten-cascade](https://github.com/Ormus-Solutions/molten-cascade) | Pattern 4 Jev→code→LLM |
| [karat-filter](https://github.com/Ormus-Solutions/karat-filter) | Pattern 5 retrieve-then-judge |
| [liquid-gold](https://github.com/Ormus-Solutions/liquid-gold) | Index of the set |

## Scripts

```bash
npm test      # vitest, mocked — no live API
npm run build
```

## License

MIT © 2026 Ormus Solutions
