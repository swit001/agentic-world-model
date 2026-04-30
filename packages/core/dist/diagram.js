"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMermaid = generateMermaid;
function generateMermaid(world) {
    const lines = ["stateDiagram-v2"];
    for (const [transName, trans] of Object.entries(world.transitions)) {
        lines.push(`  ${trans.from} --> ${trans.to}: ${transName}`);
    }
    return lines.join("\n");
}
//# sourceMappingURL=diagram.js.map