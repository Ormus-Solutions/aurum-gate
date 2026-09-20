export type OnLow = "human" | "deny" | "ask";

export type ActionPolicy = {
  minProbability: number;
  minConfidence?: number;
  onLow: OnLow;
};

export type AnswerSignal = {
  choice?: string;
  probability: number;
  confidence?: number;
};

export type GateDecision =
  | { ok: true; action: string; signal: AnswerSignal }
  | { ok: false; action: string; reason: OnLow; signal: AnswerSignal };

/** Per-action thresholds for Jev answers. Probability is not confidence. */
export class AurumGate {
  private policies = new Map<string, ActionPolicy>();

  action(name: string, policy: ActionPolicy): this {
    if (policy.minProbability < 0 || policy.minProbability > 1) {
      throw new Error(`minProbability out of range for ${name}`);
    }
    if (
      policy.minConfidence !== undefined &&
      (policy.minConfidence < 0 || policy.minConfidence > 1)
    ) {
      throw new Error(`minConfidence out of range for ${name}`);
    }
    this.policies.set(name, policy);
    return this;
  }

  decide(action: string, signal: AnswerSignal): GateDecision {
    const policy = this.policies.get(action);
    if (!policy) throw new Error(`Unknown action: ${action}`);

    const probOk = signal.probability >= policy.minProbability;
    const confOk =
      policy.minConfidence === undefined ||
      signal.confidence === undefined ||
      signal.confidence >= policy.minConfidence;

    if (probOk && confOk) return { ok: true, action, signal };
    return { ok: false, action, reason: policy.onLow, signal };
  }
}
