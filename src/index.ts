/**
 * @ormus/aurum-gate — confidence-gated action router (Jev Pattern 2).
 * Decide auto / escalate / refuse from probability × confidence floors.
 */

export type GateDecision = 'auto' | 'escalate' | 'refuse';

export interface ActionThreshold {
  /** Minimum model probability to consider the action at all. */
  minProbability: number;
  /** Minimum confidence (0–1) required for fully automatic execution. */
  autoConfidence: number;
  /** Floor below which we refuse rather than escalate. */
  refuseBelow?: number;
  /** Human-in-the-loop label when escalating. */
  escalateLabel?: string;
}

export interface GateInput {
  actionId: string;
  probability: number;
  confidence: number;
  metadata?: Record<string, unknown>;
}

export interface GateResult {
  actionId: string;
  decision: GateDecision;
  probability: number;
  confidence: number;
  reason: string;
  escalateLabel?: string;
}

export interface AurumGateConfig {
  thresholds: Record<string, ActionThreshold>;
  defaultThreshold?: ActionThreshold;
}

const DEFAULT: ActionThreshold = {
  minProbability: 0.55,
  autoConfidence: 0.85,
  refuseBelow: 0.25,
  escalateLabel: 'human-review',
};

export class AurumGate {
  private readonly thresholds: Record<string, ActionThreshold>;
  private readonly defaultThreshold: ActionThreshold;

  constructor(config: AurumGateConfig) {
    this.thresholds = config.thresholds;
    this.defaultThreshold = config.defaultThreshold ?? DEFAULT;
  }

  resolve(input: GateInput): GateResult {
    const t = this.thresholds[input.actionId] ?? this.defaultThreshold;
    const refuseFloor = t.refuseBelow ?? 0;

    if (input.confidence < refuseFloor || input.probability < refuseFloor) {
      return {
        ...base(input),
        decision: 'refuse',
        reason: `Below refuse floor (${refuseFloor}): p=${input.probability.toFixed(3)} c=${input.confidence.toFixed(3)}`,
      };
    }

    if (input.probability < t.minProbability) {
      return {
        ...base(input),
        decision: 'escalate',
        reason: `Probability ${input.probability.toFixed(3)} < min ${t.minProbability}`,
        escalateLabel: t.escalateLabel,
      };
    }

    if (input.confidence >= t.autoConfidence) {
      return {
        ...base(input),
        decision: 'auto',
        reason: `Confidence ${input.confidence.toFixed(3)} ≥ auto floor ${t.autoConfidence}`,
      };
    }

    return {
      ...base(input),
      decision: 'escalate',
      reason: `Confidence ${input.confidence.toFixed(3)} below auto floor ${t.autoConfidence}`,
      escalateLabel: t.escalateLabel,
    };
  }

  routeMany(inputs: GateInput[]): GateResult[] {
    return inputs.map((i) => this.resolve(i));
  }
}

function base(input: GateInput): Pick<GateResult, 'actionId' | 'probability' | 'confidence'> {
  return {
    actionId: input.actionId,
    probability: input.probability,
    confidence: input.confidence,
  };
}

/** Convenience: build a gate from a flat map of action → autoConfidence. */
export function gateFromAutoFloors(
  floors: Record<string, number>,
  opts?: Partial<ActionThreshold>,
): AurumGate {
  const thresholds: Record<string, ActionThreshold> = {};
  for (const [id, autoConfidence] of Object.entries(floors)) {
    thresholds[id] = {
      minProbability: opts?.minProbability ?? 0.55,
      autoConfidence,
      refuseBelow: opts?.refuseBelow ?? 0.2,
      escalateLabel: opts?.escalateLabel ?? 'human-review',
    };
  }
  return new AurumGate({ thresholds });
}
