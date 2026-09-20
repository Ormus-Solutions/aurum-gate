import { AurumGate, gateFromAutoFloors } from './index.js';

/** Demo with mocked Jev-style scores — no live API. */
const gate = new AurumGate({
  thresholds: {
    'refund.issue': {
      minProbability: 0.7,
      autoConfidence: 0.92,
      refuseBelow: 0.3,
      escalateLabel: 'finance-ops',
    },
    'ticket.close': {
      minProbability: 0.6,
      autoConfidence: 0.8,
      refuseBelow: 0.2,
    },
  },
});

const samples = [
  { actionId: 'refund.issue', probability: 0.88, confidence: 0.95 },
  { actionId: 'refund.issue', probability: 0.72, confidence: 0.7 },
  { actionId: 'ticket.close', probability: 0.4, confidence: 0.5 },
  { actionId: 'ticket.close', probability: 0.1, confidence: 0.15 },
];

console.log('=== Aurum Gate — Pattern 2 confidence routing ===\n');
for (const s of samples) {
  const r = gate.resolve(s);
  console.log(`${r.actionId}: ${r.decision.toUpperCase()} — ${r.reason}`);
}

const quick = gateFromAutoFloors({ 'doc.publish': 0.9, 'cache.purge': 0.75 });
console.log('\nQuick floors:', quick.resolve({ actionId: 'doc.publish', probability: 0.95, confidence: 0.91 }));
