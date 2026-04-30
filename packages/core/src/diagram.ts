import type { World } from "./types.js";

export function generateMermaid(world: World): string {
  const lines: string[] = ["stateDiagram-v2"];

  for (const [transName, trans] of Object.entries(world.transitions)) {
    lines.push(`  ${trans.from} --> ${trans.to}: ${transName}`);
  }

  return lines.join("\n");
}
