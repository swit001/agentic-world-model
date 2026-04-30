export interface Guard {
  id: string;
  expression: string;
  message: string;
}

export interface Transition {
  entity: string;
  from: string;
  to: string;
  trigger: string;
  guards?: Guard[];
}

export interface Entity {
  id: string;
  states: string[];
}

export interface Mission {
  scope: string;
}

export interface Verdicts {
  allowed: string[];
}

export interface Audit {
  events: string[];
}

export interface World {
  name: string;
  version: string;
  mission: Mission;
  entities: Record<string, Entity>;
  transitions: Record<string, Transition>;
  verdicts: Verdicts;
  audit: Audit;
}

export type VerdictValue = "ALLOW" | "DENY" | "ESCALATE";

export interface GuardResult {
  id: string;
  expression: string;
  passed: boolean;
  message?: string;
  error?: string;
}

export interface SimulationInput {
  transition: string;
  entity: string;
  state: string;
  context: Record<string, string | number | boolean>;
}

export interface SimulationResult {
  world: string;
  transition: string;
  entity: string;
  from: string;
  to?: string;
  verdict: VerdictValue;
  guards: GuardResult[];
  failed_guards: GuardResult[];
  next_state: string;
}

export interface PredictionInput {
  entity: string;
  state: string;
  horizon: number;
}

export interface PredictionPath {
  path: string[];
  transitions: string[];
}

export interface PredictionResult {
  world: string;
  entity: string;
  from: string;
  horizon: number;
  paths: PredictionPath[];
}
