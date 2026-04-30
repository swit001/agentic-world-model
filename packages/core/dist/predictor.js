"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictPaths = predictPaths;
function predictPaths(world, input) {
    const { entity: entityName, state: startState, horizon } = input;
    const paths = [];
    const queue = [
        { state: startState, path: [startState], transitions: [], depth: 0 },
    ];
    while (queue.length > 0) {
        const frame = queue.shift();
        const { state, path, transitions, depth } = frame;
        if (depth >= horizon) {
            paths.push({ path, transitions });
            continue;
        }
        const applicable = Object.entries(world.transitions).filter(([, t]) => t.entity === entityName && t.from === state);
        if (applicable.length === 0) {
            paths.push({ path, transitions });
            continue;
        }
        for (const [transName, trans] of applicable) {
            queue.push({
                state: trans.to,
                path: [...path, trans.to],
                transitions: [...transitions, transName],
                depth: depth + 1,
            });
        }
    }
    return {
        world: world.name,
        entity: entityName,
        from: startState,
        horizon,
        paths,
    };
}
//# sourceMappingURL=predictor.js.map