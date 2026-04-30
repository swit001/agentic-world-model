# World Model Canvas

The **World Model Canvas** is a structured design tool for specifying every component of the expanded world model:

```
W = <M, E, Σ, S, T, C, O, V, H, A>
```

Use it to design a world before writing YAML, review a world in pull requests, or onboard new team members to an existing domain.

---

## Three layers

### Layer 1: World Definition
What the world *is*.

| Symbol | Component | Purpose |
|--------|-----------|---------|
| **M** | Mission & scope | Goal, owner, and explicit boundaries |
| **E** | Entities & ontology | Real-world objects and their relationships |
| **Σ** | State space & SSOT schema | Complete set of valid states per entity |

### Layer 2: World Dynamics
How the world *moves*.

| Symbol | Component | Purpose |
|--------|-----------|---------|
| **S** | Current states | Live snapshot of entity instances in the SSOT |
| **T** | Transitions | All valid state changes with guard expressions |
| **C** | Constraints & policies | World-level rules that cut across entities |

### Layer 3: World Operation
How the world *runs*.

| Symbol | Component | Purpose |
|--------|-----------|---------|
| **O** | Observations & grounding | External signals and expected context schema |
| **V** | Verdicts & outcome contracts | ALLOW / DENY / ESCALATE semantics |
| **H** | Human approvals & escalation | When and how human review is triggered |
| **A** | Audit trail & learning | What is recorded and how it feeds back |

---

## Files

| File | Description |
|------|-------------|
| [`world-model-canvas.template.yaml`](world-model-canvas.template.yaml) | Annotated YAML template — copy and fill in for your domain |
| [`world-model-canvas.schema.json`](world-model-canvas.schema.json) | JSON Schema (draft-07) for validating canvas YAML files |
| [`world-model-canvas.mermaid`](world-model-canvas.mermaid) | Architecture diagram showing how the ten components relate |

---

## Usage

### Start a new world from the template

```bash
cp canvas/world-model-canvas.template.yaml my-world.canvas.yaml
# fill in each section, then validate:
pnpm awm validate my-world.canvas.yaml
```

### Render the architecture diagram

Paste `world-model-canvas.mermaid` into any Mermaid renderer (GitHub markdown, mermaid.live, VS Code Mermaid extension).

### Relationship to `world.yaml`

The canvas is a superset of the core `world.yaml` format. Every valid `world.yaml` file satisfies the M, E, T, V, and A sections of the canvas. The canvas adds Σ (explicit state metadata), S (live state snapshots), C (policy constraints), O (observation grounding), and H (human escalation routing).

A minimal world can start as a `world.yaml` and graduate to a full canvas as operational requirements grow.
