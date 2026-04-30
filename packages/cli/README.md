# @agentic-world-model/cli

CLI for agentic-world-model — validate, simulate, predict, and diagram world YAML files.

Part of [agentic-world-model](https://github.com/swit001/agentic-world-model).

## Usage

No install required:

```bash
npx @agentic-world-model/cli validate examples/commerce/refund.world.yaml
```

Or install globally:

```bash
npm install -g @agentic-world-model/cli
awm validate examples/commerce/refund.world.yaml
awm simulate examples/commerce/refund.world.yaml RequestRefund --entity Order --state Delivered --context days_since_delivery=5,item_refundable=true
awm predict examples/commerce/refund.world.yaml --entity Order --state Paid --horizon 3
awm diagram examples/commerce/refund.world.yaml
```

See the [main README](https://github.com/swit001/agentic-world-model#readme) for full documentation.

## License

Apache-2.0
