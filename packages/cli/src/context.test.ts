import { describe, it, expect } from "vitest";
import { parseContext } from "./context.js";

describe("parseContext", () => {
  it("parses numeric values", () => {
    const ctx = parseContext("days_since_delivery=5");
    expect(ctx.days_since_delivery).toBe(5);
  });

  it("parses boolean true", () => {
    const ctx = parseContext("item_refundable=true");
    expect(ctx.item_refundable).toBe(true);
  });

  it("parses boolean false", () => {
    const ctx = parseContext("item_refundable=false");
    expect(ctx.item_refundable).toBe(false);
  });

  it("parses string values", () => {
    const ctx = parseContext("customer_tier=gold");
    expect(ctx.customer_tier).toBe("gold");
  });

  it("parses multiple comma-separated pairs", () => {
    const ctx = parseContext("days_since_delivery=5,item_refundable=true");
    expect(ctx.days_since_delivery).toBe(5);
    expect(ctx.item_refundable).toBe(true);
  });

  it("returns empty object for empty string", () => {
    const ctx = parseContext("");
    expect(ctx).toEqual({});
  });

  it("handles mixed types in one context string", () => {
    const ctx = parseContext("count=3,flag=false,tier=silver");
    expect(ctx.count).toBe(3);
    expect(ctx.flag).toBe(false);
    expect(ctx.tier).toBe("silver");
  });
});
