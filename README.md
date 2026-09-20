# aurum-gate

**Liquid gold for TypeSafe Jev** — confidence-gated action routing.

Jev returns typed Choice / Score / Noul answers with probabilities. Your product still needs a second layer: *when is that number enough to act?* `aurum-gate` encodes per-action floors (probability + confidence) so read-only paths stay cheap and destructive paths stay human.

Part of the Ormus liquid-gold set:
- [quicksilver-judge](https://github.com/Ormus-Solutions/quicksilver-judge) — PR pre-filter
- [gold-assay](https://github.com/Ormus-Solutions/gold-assay) — UI proof scoring
- [molten-cascade](https://github.com/Ormus-Solutions/molten-cascade) — Jev to code to LLM
- [karat-filter](https://github.com/Ormus-Solutions/karat-filter) — retrieve-then-judge

## Install

```bash
npm i aurum-gate
```

## 30-second idea

```ts
import { AurumGate } from "aurum-gate";

const gate = new AurumGate()
  .action("show_balance", { minProbability: 0.6, minConfidence: 0.5, onLow: "human" })
  .action("approve_transfer", { minProbability: 0.9, minConfidence: 0.85, onLow: "ask" });

const d = gate.decide("approve_transfer", {
  choice: "approve_transfer",
  probability: 0.92,
  confidence: 0.88,
});
```

Wire probability / confidence from Jev (or AI SDK providerMetadata.typesafe.confidence). Thresholds are application law — tune on labeled traffic.

## License

MIT (c) Ormus Solutions
