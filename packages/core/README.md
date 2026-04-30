# @agentic-world-model/core

Core world model engine — validator, simulator, predictor, and diagram generator.

Part of [agentic-world-model](https://github.com/swit001/agentic-world-model).

## Install

```bash
npm install @agentic-world-model/core
```

## Usage

```ts
import { loadWorld, validateWorld, simulateTransition, predictPaths, generateMermaid } from "@agentic-world-model/core";

const world = loadWorld("path/to/world.yaml");
const result = validateWorld(world);
```

See the [main README](https://github.com/swit001/agentic-world-model#readme) for full documentation.

## License

Apache-2.0
