# Contributing to Agentic World Model

Thank you for your interest in contributing. This project is early-stage and community-shaped.

## Setup

```bash
# Requires Node 18+ and pnpm 8+
pnpm install
pnpm build
pnpm test
```

## Project structure

```
packages/core      # World loading, validation, simulation, prediction, diagram
packages/cli       # CLI powered by commander
schemas/           # JSON Schema for world YAML files
examples/          # Example world definitions
docs/              # Documentation
```

## Contribution areas

- **World schema**: Propose extensions to the YAML format via issue first.
- **Guard language**: New operators or expression types require spec discussion.
- **New examples**: Domain-specific world YAMLs (HR, finance, logistics, etc.) are welcome.
- **Tests**: Every new behavior should have a Vitest test.
- **Docs**: Improvements to README, ROADMAP, or inline docs.

## Pull request guidelines

1. Open an issue before large changes.
2. Keep PRs focused — one concern per PR.
3. All tests must pass: `pnpm test`.
4. Build must succeed: `pnpm build`.
5. Do not introduce `eval` or `Function` constructor usage.
6. Do not add LLM API calls to core or CLI.

## Guard expression rules (v0.1)

The guard parser intentionally supports only:

- Binary operators: `==`, `!=`, `<=`, `>=`, `<`, `>`
- Left side: a context key (identifier)
- Right side: a number, boolean, or quoted string literal

Changes to the expression language require an RFC issue.

## Code style

- TypeScript strict mode is enforced.
- No comments unless the WHY is non-obvious.
- Prefer editing existing files over creating new ones.

## License

By contributing, you agree that your contributions will be licensed under the Apache 2.0 License.
