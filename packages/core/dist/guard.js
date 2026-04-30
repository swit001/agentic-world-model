"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateGuard = evaluateGuard;
const OPERATORS = ["<=", ">=", "!=", "==", "<", ">"];
function parseLiteral(raw) {
    const trimmed = raw.trim();
    if (trimmed === "true")
        return true;
    if (trimmed === "false")
        return false;
    if (/^"[^"]*"$/.test(trimmed))
        return trimmed.slice(1, -1);
    if (/^'[^']*'$/.test(trimmed))
        return trimmed.slice(1, -1);
    const num = Number(trimmed);
    if (!isNaN(num) && trimmed !== "")
        return num;
    throw new Error(`Unsupported literal value: ${raw}`);
}
function parseExpression(expression) {
    const expr = expression.trim();
    for (const op of OPERATORS) {
        const idx = expr.indexOf(op);
        if (idx === -1)
            continue;
        const left = expr.slice(0, idx).trim();
        const rightRaw = expr.slice(idx + op.length).trim();
        if (!left || !rightRaw)
            continue;
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(left)) {
            throw new Error(`Left side of expression must be a simple identifier, got: "${left}"`);
        }
        const right = parseLiteral(rightRaw);
        return { left, op, right };
    }
    throw new Error(`Cannot parse expression: "${expression}". ` +
        `Only binary comparisons (==, !=, <=, >=, <, >) between an identifier and a literal are supported.`);
}
function compare(left, op, right) {
    switch (op) {
        case "==":
            return left === right;
        case "!=":
            return left !== right;
        case "<":
            return left < right;
        case ">":
            return left > right;
        case "<=":
            return left <= right;
        case ">=":
            return left >= right;
    }
}
function evaluateGuard(guard, context) {
    let parsed;
    try {
        parsed = parseExpression(guard.expression);
    }
    catch (err) {
        return {
            id: guard.id,
            expression: guard.expression,
            passed: false,
            message: guard.message,
            error: err instanceof Error ? err.message : String(err),
        };
    }
    if (!(parsed.left in context)) {
        return {
            id: guard.id,
            expression: guard.expression,
            passed: false,
            message: guard.message,
            error: `Context key "${parsed.left}" not found`,
        };
    }
    const leftVal = context[parsed.left];
    const passed = compare(leftVal, parsed.op, parsed.right);
    return {
        id: guard.id,
        expression: guard.expression,
        passed,
        message: passed ? undefined : guard.message,
    };
}
//# sourceMappingURL=guard.js.map