#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const core_1 = require("@agentic-world-model/core");
const context_js_1 = require("./context.js");
const program = new commander_1.Command();
program
    .name("awm")
    .description("Agentic World Model CLI")
    .version("0.1.0");
program
    .command("validate <file>")
    .description("Validate a world YAML file")
    .action((file) => {
    try {
        const world = (0, core_1.loadWorld)(file);
        const result = (0, core_1.validateWorld)(world);
        if (result.valid) {
            console.log(JSON.stringify({ valid: true, world: world.name }, null, 2));
            process.exit(0);
        }
        else {
            console.error(JSON.stringify({ valid: false, errors: result.errors }, null, 2));
            process.exit(1);
        }
    }
    catch (err) {
        console.error(JSON.stringify({ valid: false, error: String(err) }, null, 2));
        process.exit(1);
    }
});
program
    .command("simulate <file> <transition>")
    .description("Simulate a transition on a world")
    .requiredOption("--entity <entity>", "Entity name")
    .requiredOption("--state <state>", "Current state")
    .option("--context <context>", "Comma-separated key=value pairs", "")
    .action((file, transition, opts) => {
    try {
        const world = (0, core_1.loadWorld)(file);
        const context = (0, context_js_1.parseContext)(opts.context);
        const result = (0, core_1.simulateTransition)(world, {
            transition,
            entity: opts.entity,
            state: opts.state,
            context,
        });
        console.log(JSON.stringify(result, null, 2));
        process.exit(0);
    }
    catch (err) {
        console.error(JSON.stringify({ error: String(err) }, null, 2));
        process.exit(1);
    }
});
program
    .command("predict <file>")
    .description("Predict possible transition paths")
    .requiredOption("--entity <entity>", "Entity name")
    .requiredOption("--state <state>", "Starting state")
    .option("--horizon <number>", "Number of steps ahead", "3")
    .action((file, opts) => {
    try {
        const world = (0, core_1.loadWorld)(file);
        const result = (0, core_1.predictPaths)(world, {
            entity: opts.entity,
            state: opts.state,
            horizon: parseInt(opts.horizon, 10),
        });
        console.log(JSON.stringify(result, null, 2));
        process.exit(0);
    }
    catch (err) {
        console.error(JSON.stringify({ error: String(err) }, null, 2));
        process.exit(1);
    }
});
program
    .command("diagram <file>")
    .description("Generate a Mermaid stateDiagram-v2 for the world")
    .action((file) => {
    try {
        const world = (0, core_1.loadWorld)(file);
        const diagram = (0, core_1.generateMermaid)(world);
        console.log(diagram);
        process.exit(0);
    }
    catch (err) {
        console.error(JSON.stringify({ error: String(err) }, null, 2));
        process.exit(1);
    }
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map