# Roadmap

## v0.1 — Foundation (current)

- [x] YAML-first world definition format
- [x] JSON Schema validation with AJV
- [x] Safe guard expression parser (no eval)
- [x] Transition simulation engine
- [x] Path prediction engine
- [x] Mermaid stateDiagram-v2 generation
- [x] CLI: validate, simulate, predict, diagram
- [x] Commerce refund example
- [x] CI pipeline

## v0.2 — Richer Constraints

- [ ] Compound guard expressions: `&&`, `||`, parentheses
- [ ] Cross-entity constraints
- [ ] Guard short-circuit evaluation
- [ ] `ESCALATE` verdict support with routing rules
- [ ] Human approval step definitions in YAML
- [ ] Transition cooldown / rate constraints

## v0.3 — Audit and Observability

- [ ] Structured audit log emission (JSON Lines)
- [ ] Audit event hooks
- [ ] World diff / versioning support
- [ ] State snapshot serialization

## v0.4 — Runtime Integration

- [ ] REST API server mode (`awm serve`)
- [ ] OpenAPI spec for world endpoints
- [ ] Webhook emission on verdict
- [ ] Stream-based audit output

## v0.5 — Agent Integration

- [ ] Tool-use schema generation for LLM agents
- [ ] Agent action proposal → simulation pipeline
- [ ] World grounding from observation payloads
- [ ] Multi-agent coordination constraints

## Enterprise / Commercial (not open-source)

- Domain packs: pre-built worlds for finance, HR, legal, logistics
- Production runtime with persistence and HA
- Governance dashboard: drift detection, violation alerts
- World versioning and rollback
- Connector library: Salesforce, SAP, Jira, Slack
- SLA and compliance templates
