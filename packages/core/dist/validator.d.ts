import type { World } from "./types.js";
export interface ValidationResult {
    valid: boolean;
    errors: string[];
}
export declare function validateWorld(world: World): ValidationResult;
//# sourceMappingURL=validator.d.ts.map