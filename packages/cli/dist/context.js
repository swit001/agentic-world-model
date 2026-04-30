"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseContext = parseContext;
function parseContext(raw) {
    if (!raw.trim())
        return {};
    const ctx = {};
    const pairs = raw.split(",");
    for (const pair of pairs) {
        const eqIdx = pair.indexOf("=");
        if (eqIdx === -1)
            continue;
        const key = pair.slice(0, eqIdx).trim();
        const val = pair.slice(eqIdx + 1).trim();
        if (!key)
            continue;
        if (val === "true") {
            ctx[key] = true;
        }
        else if (val === "false") {
            ctx[key] = false;
        }
        else {
            const num = Number(val);
            ctx[key] = !isNaN(num) && val !== "" ? num : val;
        }
    }
    return ctx;
}
//# sourceMappingURL=context.js.map