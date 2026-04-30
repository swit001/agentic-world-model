import { describe, it, expect } from "vitest";
import { join } from "path";
import { loadWorld } from "./loader.js";
import { validateWorld } from "./validator.js";
import { simulateTransition } from "./simulator.js";
import { predictPaths } from "./predictor.js";
import { generateMermaid } from "./diagram.js";
import { evaluateGuard } from "./guard.js";
import type { World } from "./types.js";

const WORLD_FILE = join(__dirname, "../../../examples/commerce/refund.world.yaml");

function getWorld(): World {
  return loadWorld(WORLD_FILE);
}

describe("validateWorld", () => {
  it("validates a correct world successfully", () => {
    const world = getWorld();
    const result = validateWorld(world);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects a world missing required fields", () => {
    const bad = { name: "bad" } as unknown as World;
    const result = validateWorld(bad);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe("simulateTransition - ALLOW", () => {
  it("allows RequestRefund when all guards pass", () => {
    const world = getWorld();
    const result = simulateTransition(world, {
      transition: "RequestRefund",
      entity: "Order",
      state: "Delivered",
      context: { days_since_delivery: 5, item_refundable: true },
    });
    expect(result.verdict).toBe("ALLOW");
    expect(result.next_state).toBe("RefundRequested");
    expect(result.failed_guards).toHaveLength(0);
  });
});

describe("simulateTransition - failed guard", () => {
  it("denies RequestRefund when refund window exceeded", () => {
    const world = getWorld();
    const result = simulateTransition(world, {
      transition: "RequestRefund",
      entity: "Order",
      state: "Delivered",
      context: { days_since_delivery: 14, item_refundable: true },
    });
    expect(result.verdict).toBe("DENY");
    expect(result.next_state).toBe("Delivered");
    expect(result.failed_guards.some((g) => g.id === "refund_window")).toBe(true);
  });

  it("denies RequestRefund when item is not refundable", () => {
    const world = getWorld();
    const result = simulateTransition(world, {
      transition: "RequestRefund",
      entity: "Order",
      state: "Delivered",
      context: { days_since_delivery: 3, item_refundable: false },
    });
    expect(result.verdict).toBe("DENY");
    expect(result.failed_guards.some((g) => g.id === "refundable_item")).toBe(true);
  });
});

describe("simulateTransition - structural DENY", () => {
  it("denies unknown transition", () => {
    const world = getWorld();
    const result = simulateTransition(world, {
      transition: "NonExistent",
      entity: "Order",
      state: "Delivered",
      context: {},
    });
    expect(result.verdict).toBe("DENY");
  });

  it("denies wrong from-state", () => {
    const world = getWorld();
    const result = simulateTransition(world, {
      transition: "RequestRefund",
      entity: "Order",
      state: "Paid",
      context: { days_since_delivery: 1, item_refundable: true },
    });
    expect(result.verdict).toBe("DENY");
  });

  it("denies mismatched entity", () => {
    const world = getWorld();
    const result = simulateTransition(world, {
      transition: "RequestRefund",
      entity: "Product",
      state: "Delivered",
      context: { days_since_delivery: 1, item_refundable: true },
    });
    expect(result.verdict).toBe("DENY");
  });
});

describe("guard evaluation - unsupported expressions", () => {
  it("returns a failed guard with an error for unsupported expressions", () => {
    const result = evaluateGuard(
      {
        id: "bad_expr",
        expression: "days_since_delivery <= 7 && item_refundable == true",
        message: "not supported",
      },
      { days_since_delivery: 3, item_refundable: true }
    );
    expect(result.passed).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("returns error when context key is missing", () => {
    const result = evaluateGuard(
      { id: "g1", expression: "missing_key == true", message: "msg" },
      {}
    );
    expect(result.passed).toBe(false);
    expect(result.error).toMatch(/not found/);
  });
});

describe("predictPaths", () => {
  it("returns reachable paths within horizon", () => {
    const world = getWorld();
    const result = predictPaths(world, {
      entity: "Order",
      state: "Paid",
      horizon: 3,
    });
    expect(result.paths.length).toBeGreaterThan(0);
    expect(result.from).toBe("Paid");
    expect(result.horizon).toBe(3);
    const states = result.paths.flatMap((p) => p.path);
    expect(states).toContain("Paid");
  });

  it("returns empty paths for terminal state within horizon", () => {
    const world = getWorld();
    const result = predictPaths(world, {
      entity: "Order",
      state: "Refunded",
      horizon: 2,
    });
    expect(result.paths.every((p) => p.path[0] === "Refunded")).toBe(true);
  });
});

describe("generateMermaid", () => {
  it("generates a stateDiagram-v2 with transition labels", () => {
    const world = getWorld();
    const diagram = generateMermaid(world);
    expect(diagram).toContain("stateDiagram-v2");
    expect(diagram).toContain("RequestRefund");
    expect(diagram).toContain("-->");
  });
});
