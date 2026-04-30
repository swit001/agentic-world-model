import { describe, it, expect } from "vitest";
import { spawnSync } from "child_process";
import { join } from "path";

const CLI = join(__dirname, "../dist/index.js");
const WORLD = join(__dirname, "../../../examples/commerce/refund.world.yaml");

function runCli(args: string[]): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, [CLI, ...args], { encoding: "utf8" });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe("simulate exit codes", () => {
  it("exits 0 for ALLOW verdict", () => {
    const { status, stdout } = runCli([
      "simulate", WORLD, "RequestRefund",
      "--entity", "Order",
      "--state", "Delivered",
      "--context", "days_since_delivery=5,item_refundable=true",
    ]);
    const json = JSON.parse(stdout);
    expect(json.verdict).toBe("ALLOW");
    expect(status).toBe(0);
  });

  it("exits 0 for DENY verdict — DENY is a valid simulation result, not a CLI error", () => {
    const { status, stdout } = runCli([
      "simulate", WORLD, "RequestRefund",
      "--entity", "Order",
      "--state", "Delivered",
      "--context", "days_since_delivery=14,item_refundable=true",
    ]);
    const json = JSON.parse(stdout);
    expect(json.verdict).toBe("DENY");
    expect(json.failed_guards.length).toBeGreaterThan(0);
    expect(status).toBe(0);
  });

  it("exits 1 for unreadable file", () => {
    const { status } = runCli([
      "simulate", "/no/such/file.yaml", "RequestRefund",
      "--entity", "Order",
      "--state", "Delivered",
    ]);
    expect(status).toBe(1);
  });
});
