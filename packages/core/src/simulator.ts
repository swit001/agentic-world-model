import { evaluateGuard } from "./guard.js";
import type {
  World,
  SimulationInput,
  SimulationResult,
  GuardResult,
} from "./types.js";

export function simulateTransition(
  world: World,
  input: SimulationInput
): SimulationResult {
  const { transition: transName, entity: entityName, state, context } = input;

  const trans = world.transitions[transName];
  if (!trans) {
    return {
      world: world.name,
      transition: transName,
      entity: entityName,
      from: state,
      verdict: "DENY",
      guards: [],
      failed_guards: [],
      next_state: state,
    };
  }

  if (trans.entity !== entityName) {
    return {
      world: world.name,
      transition: transName,
      entity: entityName,
      from: state,
      verdict: "DENY",
      guards: [],
      failed_guards: [],
      next_state: state,
    };
  }

  if (trans.from !== state) {
    return {
      world: world.name,
      transition: transName,
      entity: entityName,
      from: state,
      verdict: "DENY",
      guards: [],
      failed_guards: [],
      next_state: state,
    };
  }

  const guards: GuardResult[] = (trans.guards ?? []).map((g) =>
    evaluateGuard(g, context)
  );
  const failed = guards.filter((g) => !g.passed);

  if (failed.length === 0) {
    return {
      world: world.name,
      transition: transName,
      entity: entityName,
      from: state,
      to: trans.to,
      verdict: "ALLOW",
      guards,
      failed_guards: [],
      next_state: trans.to,
    };
  }

  return {
    world: world.name,
    transition: transName,
    entity: entityName,
    from: state,
    verdict: "DENY",
    guards,
    failed_guards: failed,
    next_state: state,
  };
}
