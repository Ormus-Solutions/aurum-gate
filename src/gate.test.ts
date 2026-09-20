import { describe, expect, it } from "vitest";
import { AurumGate } from "./gate.js";

describe("AurumGate", () => {
  const gate = new AurumGate()
    .action("show_balance", {
      minProbability: 0.6,
      minConfidence: 0.5,
      onLow: "human",
    })
    .action("approve_transfer", {
      minProbability: 0.9,
      minConfidence: 0.85,
      onLow: "ask",
    });

  it("allows clear read-only", () => {
    const d = gate.decide("show_balance", { probability: 0.8, confidence: 0.7 });
    expect(d.ok).toBe(true);
  });

  it("asks on soft transfer", () => {
    const d = gate.decide("approve_transfer", { probability: 0.8, confidence: 0.9 });
    expect(d.ok).toBe(false);
    if (!d.ok) expect(d.reason).toBe("ask");
  });

  it("allows hard transfer", () => {
    const d = gate.decide("approve_transfer", { probability: 0.95, confidence: 0.9 });
    expect(d.ok).toBe(true);
  });
});
