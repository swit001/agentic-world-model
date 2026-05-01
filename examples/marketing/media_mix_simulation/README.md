# Marketing: Media Mix Simulation

An advanced example showing how Agentic World Model runs a full neural-to-symbolic execution pipeline for media budget optimization.

> The neural layer simulates possible futures.
> The symbolic layer decides which futures are executable.
> The marketer chooses which executable future to commit.
> The runtime tracks whether that future came true.

---

## What this example shows

This is not a rule validator. It is a complete execution pipeline:

1. **Neural simulation** — an optimizer generates multiple media mix scenarios, each with predicted ROAS, expected lift, confidence, and rationale
2. **Actionability check** — the symbolic world model evaluates guards on each scenario (confidence, ROAS lift, budget, inventory, audience policy risk)
3. **Marketer approval** — only actionable scenarios are routed for human review
4. **Symbolic commit** — the approved scenario is committed as the declared future state
5. **Launch** — the campaign goes live
6. **Tracking** — predicted vs. actual performance is measured in real time
7. **Drift detection** — when prediction error exceeds the MAPE threshold, a drift event is triggered
8. **Resimulation** — the world loops back to `SimulationReady`, and the neural optimizer runs again with updated beliefs

---

## Pipeline

```
Monitoring
  → GenerateScenarios → SimulationReady
  → SelectScenario    → ScenarioSelected     (guards: confidence, roas_lift, budget, inventory, policy)
  → RequestApproval   → AwaitingMarketerApproval
  → ApproveScenario   → Approved
  → CommitScenario    → Committed            (guard: marketer_approved)
  → LaunchScenario    → Live
  → StartTracking     → Tracking
  → DetectPredictionDrift → DriftDetected    (guard: prediction_mape > threshold)
  → RequestResimulation   → ResimulationRequired
  → RegenerateScenarios   → SimulationReady  (loop)
```

---

## Files

| File | Purpose |
|------|---------|
| [`media_mix.world.yaml`](media_mix.world.yaml) | World definition: states, transitions, and guards |
| [`current_state.json`](current_state.json) | Live entity state: current ROAS, budget, channel mix, signals |
| [`scenarios.json`](scenarios.json) | Neural optimizer output: 3 scenarios, actionability results, recommended scenario |
| [`tracking.json`](tracking.json) | Predicted vs. actual performance, drift detection, learning hooks |

---

## Try it

### 1. Validate the world

```bash
npx @agentic-world-model/cli@latest validate examples/marketing/media_mix_simulation/media_mix.world.yaml
```

### 2. Select an actionable scenario

Scenario A passes all guards (confidence 0.74, lift 0.116, no policy risk):

```bash
npx @agentic-world-model/cli@latest simulate examples/marketing/media_mix_simulation/media_mix.world.yaml SelectScenario \
  --entity MediaPlan --state SimulationReady \
  --context confidence=0.74,predicted_roas_lift=0.116,total_budget=100000,inventory_available=true,audience_policy_risk=medium
```

Expected verdict: `ALLOW`

### 3. Try a weak scenario — ROAS lift too low

Scenario B fails the `roas_lift_threshold` guard (lift 0.063 < required 0.08):

```bash
npx @agentic-world-model/cli@latest simulate examples/marketing/media_mix_simulation/media_mix.world.yaml SelectScenario \
  --entity MediaPlan --state SimulationReady \
  --context confidence=0.69,predicted_roas_lift=0.063,total_budget=100000,inventory_available=true,audience_policy_risk=medium
```

Expected verdict: `DENY`

### 4. Try commit without marketer approval

```bash
npx @agentic-world-model/cli@latest simulate examples/marketing/media_mix_simulation/media_mix.world.yaml CommitScenario \
  --entity MediaPlan --state Approved \
  --context marketer_approved=false
```

Expected verdict: `DENY`

### 5. Commit with marketer approval

```bash
npx @agentic-world-model/cli@latest simulate examples/marketing/media_mix_simulation/media_mix.world.yaml CommitScenario \
  --entity MediaPlan --state Approved \
  --context marketer_approved=true
```

Expected verdict: `ALLOW`

### 6. Detect prediction drift

Actual MAPE of 0.146 exceeds the threshold of 0.12:

```bash
npx @agentic-world-model/cli@latest simulate examples/marketing/media_mix_simulation/media_mix.world.yaml DetectPredictionDrift \
  --entity MediaPlan --state Tracking \
  --context prediction_mape=0.146
```

Expected verdict: `ALLOW` (drift confirmed, transition to `DriftDetected`)

### 7. Request resimulation

```bash
npx @agentic-world-model/cli@latest simulate examples/marketing/media_mix_simulation/media_mix.world.yaml RequestResimulation \
  --entity MediaPlan --state DriftDetected \
  --context resimulation_required=true
```

Expected verdict: `ALLOW` (loops back to `SimulationReady`)

---

## What developers should notice

**Guards are not just validation — they are the boundary between neural and symbolic.**
The neural optimizer can generate any scenario. The symbolic world model is what makes a scenario *executable*. Scenario C has the highest predicted ROAS (2.72) but cannot be committed because its audience policy risk is `high`. The world enforces this without exception.

**Confidence and ROAS lift are first-class guards.**
The world does not trust the neural layer blindly. A scenario must meet minimum confidence and minimum lift thresholds before it can enter the approval flow. Scenario B is blocked here — not by a human, by the world.

**Marketer approval is a symbolic gate, not a UI pattern.**
`CommitScenario` requires `marketer_approved == true` as a guard. This means the commit cannot happen — in any code path, by any agent — without that context value being set. The approval is enforced at the world level.

**Prediction drift closes the loop.**
When actual performance diverges from predictions beyond the MAPE threshold, the world transitions to `DriftDetected` and surfaces learning hooks. The neural optimizer reruns with updated channel saturation and audience overlap assumptions. The world model is not a one-shot validator — it is a runtime that learns.
