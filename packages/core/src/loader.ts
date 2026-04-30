import { readFileSync } from "fs";
import { parse } from "yaml";
import type { World } from "./types.js";

export function loadWorld(filePath: string): World {
  const raw = readFileSync(filePath, "utf-8");
  const parsed = parse(raw) as World;
  return parsed;
}
