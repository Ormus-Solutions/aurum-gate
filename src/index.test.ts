import { describe, it, expect } from 'vitest';
import { AurumGate, gateFromAutoFloors } from './index.js';

const gate = new AurumGate({
  thresholds: {
    send: { minProbability: 0.6, autoConfidence: 0.9, refuseBelow: 0.25 },
  },
});

describe('AurumGate', () => {
  it('autos when probability and confidence clear floors', () => {
    const r = gate.resolve({ actionId: 'send', probability: 0.8, confidence: 0.95 });
    expect(r.decision).toBe('auto');
  });

  it('escalates when confidence is soft', () => {
    const r = gate.resolve({ actionId: 'send', probability: 0.8, confidence: 0.7 });
    expect(r.decision).toBe('escalate');
    expect(r.escalateLabel).toBeDefined();
  });

  it('refuses below refuse floor', () => {
    const r = gate.resolve({ actionId: 'send', probability: 0.1, confidence: 0.1 });
    expect(r.decision).toBe('refuse');
  });

  it('uses default threshold for unknown actions', () => {
    const r = gate.resolve({ actionId: 'unknown', probability: 0.9, confidence: 0.95 });
    expect(['auto', 'escalate', 'refuse']).toContain(r.decision);
  });

  it('gateFromAutoFloors builds usable gates', () => {
    const g = gateFromAutoFloors({ x: 0.99 });
    expect(g.resolve({ actionId: 'x', probability: 0.9, confidence: 0.5 }).decision).toBe('escalate');
  });

  it('routeMany returns aligned results', () => {
    const out = gate.routeMany([
      { actionId: 'send', probability: 0.9, confidence: 0.95 },
      { actionId: 'send', probability: 0.1, confidence: 0.1 },
    ]);
    expect(out).toHaveLength(2);
    expect(out[0]?.decision).toBe('auto');
    expect(out[1]?.decision).toBe('refuse');
  });
});
