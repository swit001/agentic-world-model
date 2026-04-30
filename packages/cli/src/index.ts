#!/usr/bin/env node
import { Command } from "commander";
import {
  loadWorld,
  validateWorld,
  simulateTransition,
  predictPaths,
  generateMermaid,
} from "@agentic-world-model/core";
import { parseContext } from "./context.js";

const program = new Command();

program
  .name("awm")
  .description("Agentic World Model CLI")
  .version("0.1.0");

program
  .command("validate <file>")
  .description("Validate a world YAML file")
  .action((file: string) => {
    try {
      const world = loadWorld(file);
      const result = validateWorld(world);
      if (result.valid) {
        console.log(JSON.stringify({ valid: true, world: world.name }, null, 2));
        process.exit(0);
      } else {
        console.error(JSON.stringify({ valid: false, errors: result.errors }, null, 2));
        process.exit(1);
      }
    } catch (err) {
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
  .action((file: string, transition: string, opts: { entity: string; state: string; context: string }) => {
    try {
      const world = loadWorld(file);
      const context = parseContext(opts.context);
      const result = simulateTransition(world, {
        transition,
        entity: opts.entity,
        state: opts.state,
        context,
      });
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    } catch (err) {
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
  .action((file: string, opts: { entity: string; state: string; horizon: string }) => {
    try {
      const world = loadWorld(file);
      const result = predictPaths(world, {
        entity: opts.entity,
        state: opts.state,
        horizon: parseInt(opts.horizon, 10),
      });
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    } catch (err) {
      console.error(JSON.stringify({ error: String(err) }, null, 2));
      process.exit(1);
    }
  });

program
  .command("diagram <file>")
  .description("Generate a Mermaid stateDiagram-v2 for the world")
  .action((file: string) => {
    try {
      const world = loadWorld(file);
      const diagram = generateMermaid(world);
      console.log(diagram);
      process.exit(0);
    } catch (err) {
      console.error(JSON.stringify({ error: String(err) }, null, 2));
      process.exit(1);
    }
  });

program.parse(process.argv);
