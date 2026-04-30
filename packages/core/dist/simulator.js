"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateTransition = simulateTransition;
const guard_js_1 = require("./guard.js");
function simulateTransition(world, input) {
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
    const guards = (trans.guards ?? []).map((g) => (0, guard_js_1.evaluateGuard)(g, context));
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
//# sourceMappingURL=simulator.js.map