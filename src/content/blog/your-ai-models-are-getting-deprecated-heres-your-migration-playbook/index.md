---
title: "Your AI Models Are Getting Deprecated. Here's Your Migration Playbook."
date: 2026-02-26
draft: true
categories:
  - "ai"
  - "github-copilot"
tags:
  - "ai"
  - "github-copilot"
  - "model-management"
  - "devops"
  - "enterprise"
coverImage: "cover.webp"
---

Two model deprecation notices landed in the same week. GitHub pulled selected Anthropic and OpenAI models from Copilot on February 17. OpenAI retired several legacy ChatGPT models on February 13. And in the middle of all that, GitHub added Gemini 3.1 Pro to Copilot and expanded the model picker to Business and Enterprise plans.

If your team treats model updates as someone else's problem, that week was a wake-up call. If you already have a playbook, it was validation. Either way, model migration is now routine engineering work, not a surprise disruption.

Here's the playbook I'd use to keep a team running smoothly through these cycles.

## Why This Keeps Happening

AI model providers are iterating fast. OpenAI, Anthropic, and Google all ship new versions on overlapping timelines, and older models get sunset to free up capacity and push adoption forward. GitHub Copilot now offers models from multiple providers through the model picker, which means your team might be consuming three or four different models across different workflows.

That's powerful. It's also a maintenance surface.

When a model you depend on gets deprecated, the impact depends on how tightly you've coupled your workflows to it. A team that hardcoded `gpt-4o` into every prompt template has a different week than a team that runs evaluations against a baseline and routes by task class.

## Step 1: Know What You're Running

You can't migrate what you can't see. Start by inventorying which models your team actually uses and where.

For GitHub Copilot, the new [organization-level usage metrics dashboard](https://github.blog/changelog/2026-02-20-organization-level-copilot-usage-metrics-dashboard-available-in-public-preview/) (public preview as of Feb 20) gives org owners visibility into adoption patterns. Pair that with the [PR throughput and time-to-merge metrics API](https://github.blog/changelog/2026-02-19-pull-request-throughput-and-time-to-merge-available-in-copilot-usage-metrics-api/) to see not just who's using Copilot, but what the measurable delivery impact looks like.

For custom integrations (API calls, agents, internal tools), audit your codebase for hardcoded model names. A quick grep gets you surprisingly far:

```bash
# Find hardcoded model references across your codebase
grep -rn "model.*['\"]gpt-\|model.*['\"]claude-\|model.*['\"]gemini-" \
  --include="*.ts" --include="*.py" --include="*.json" --include="*.yaml" \
  src/ config/
```

Build a simple inventory:

```typescript
// model-inventory.ts
// Document what you're running and why

interface ModelAssignment {
  model: string;
  taskClass: string;     // "code-completion" | "code-review" | "chat" | "agent"
  surface: string;       // "copilot-vscode" | "api-direct" | "copilot-cli" | "agent-runtime"
  fallback?: string;     // What to route to if this model is unavailable
  lastEvaluated: string; // When you last confirmed this model fits the task
}

const assignments: ModelAssignment[] = [
  {
    model: "claude-sonnet-4-5",
    taskClass: "code-review",
    surface: "copilot-vscode",
    fallback: "claude-sonnet-4-6",
    lastEvaluated: "2026-02-15"
  },
  {
    model: "gpt-5-codex",
    taskClass: "code-completion",
    surface: "api-direct",
    fallback: "gpt-5.2-codex",
    lastEvaluated: "2026-02-20"
  },
  // ... every model your team touches
];
```

This isn't over-engineering. When the next deprecation notice hits, you'll know in seconds what's affected and what to switch to.

## Step 2: Build Evaluation Baselines

The worst way to pick a replacement model is vibes. The second worst way is reading benchmarks. Benchmarks tell you how a model performs on *their* tasks, not yours.

Set up lightweight evaluations tied to your actual workloads. You don't need a full ML evaluation framework. A structured set of test prompts with expected outcomes will do:

```typescript
// eval-suite.ts
interface EvalCase {
  id: string;
  taskClass: string;
  prompt: string;
  context?: string;       // File contents, conversation history, etc.
  expectedBehavior: string; // What a good response looks like
  scoringCriteria: string[];
}

const evalCases: EvalCase[] = [
  {
    id: "review-null-check",
    taskClass: "code-review",
    prompt: "Review this TypeScript function for potential runtime errors",
    context: `function getUser(id: string) {
  const user = users.find(u => u.id === id);
  return user.name; // potential null reference
}`,
    expectedBehavior: "Flags the potential null/undefined access on user.name",
    scoringCriteria: [
      "Identifies the null reference risk",
      "Suggests optional chaining or null check",
      "Doesn't hallucinate other issues"
    ]
  },
  {
    id: "completion-react-hook",
    taskClass: "code-completion",
    prompt: "Complete this custom React hook for debounced search",
    context: `import { useState, useEffect } from 'react';

export function useDebouncedSearch(query: string, delayMs: number) {
  // complete this hook
`,
    expectedBehavior: "Returns debounced value using setTimeout/clearTimeout pattern",
    scoringCriteria: [
      "Correct cleanup in useEffect return",
      "Uses state for debounced value",
      "Handles delay parameter correctly"
    ]
  }
];
```

Run this suite against your current model, record the results, and you've got a baseline. When it's time to evaluate a replacement, run the same suite and compare. This turns "does the new model feel good?" into "does the new model pass our bar?"

## Step 3: Design Fallback Routing

If your app or workflow calls a single model endpoint with no fallback, a deprecation is a hard stop. Design routing that can absorb model changes without code deploys.

Here's a pattern I like:

```typescript
// model-router.ts
interface ModelRoute {
  primary: string;
  fallbacks: string[];
  taskClass: string;
}

const routes: ModelRoute[] = [
  {
    taskClass: "code-review",
    primary: "claude-sonnet-4-6",
    fallbacks: ["claude-sonnet-4-5", "gpt-5-codex"]
  },
  {
    taskClass: "code-completion",
    primary: "gpt-5.2-codex",
    fallbacks: ["gpt-5-codex", "gemini-3.1-pro"]
  }
];

async function routeRequest(taskClass: string, prompt: string): Promise<string> {
  const route = routes.find(r => r.taskClass === taskClass);
  if (!route) throw new Error(`No route for task class: ${taskClass}`);

  const models = [route.primary, ...route.fallbacks];

  for (const model of models) {
    try {
      const response = await callModel(model, prompt);
      return response;
    } catch (err) {
      console.warn(`Model ${model} failed, trying next fallback...`);
      continue;
    }
  }

  throw new Error(`All models failed for ${taskClass}`);
}
```

For GitHub Copilot specifically, the "Auto" model selection option already does lightweight routing under the hood. But if your team has preferences per task type, configure those explicitly through the model picker and document why. "We use Sonnet 4.6 for reviews because it catches more edge cases in our eval suite" is a decision. "We use whatever's default" is a gamble.

## Step 4: Set Up Deprecation Monitoring

Don't wait for surprises. Subscribe to the sources that announce changes:

- **GitHub Changelog**: [github.blog/changelog](https://github.blog/changelog/) (filter for "Copilot")
- **OpenAI Model Deprecations**: [platform.openai.com/docs/deprecations](https://platform.openai.com/docs/deprecations)
- **Anthropic API Changes**: [docs.anthropic.com](https://docs.anthropic.com)
- **Google AI Studio**: Model availability notes in the [Gemini API docs](https://ai.google.dev/gemini-api/docs)

Better yet, automate it. A weekly check that hits the model listing endpoints and compares against your inventory catches changes before the blog post:

```bash
#!/bin/bash
# check-model-availability.sh
# Run weekly via cron. Alerts if any model in your inventory is missing.

INVENTORY_MODELS=("gpt-5-codex" "gpt-5.2-codex" "claude-sonnet-4-6" "gemini-3.1-pro")

for model in "${INVENTORY_MODELS[@]}"; do
  # Check against your provider's model listing endpoint
  if ! curl -s "https://api.openai.com/v1/models" \
    -H "Authorization: Bearer $OPENAI_API_KEY" | \
    jq -e ".data[] | select(.id == \"$model\")" > /dev/null 2>&1; then
    echo "WARNING: $model not found in available models"
    # Send alert to Slack, Teams, email, etc.
  fi
done
```

## Step 5: Schedule Quarterly Migration Audits

The final piece is making migration a regular practice, not a fire drill. Add a quarterly review to your team calendar:

1. **Update the inventory**: Are any new models in use? Any old ones retired?
2. **Run eval baselines**: Has model performance shifted? (Providers update models in place sometimes.)
3. **Check fallback health**: Are your fallback models still available and performing?
4. **Review deprecation timeline**: What's coming in the next 90 days?
5. **Update routing config**: Promote better-performing models, drop deprecated ones.

This takes about an hour per quarter. Compare that to the scramble of discovering a deprecated model in production on a Monday morning.

## The Bigger Picture

GitHub Copilot now supports models from OpenAI, Anthropic, and Google in the same interface. The model picker is available across Pro, Business, and Enterprise plans. Gemini 3.1 Pro just entered public preview. [Code referencing](https://github.blog/changelog/2026-02-18-copilot-coding-agent-supports-code-referencing/) in coding agent logs improves provenance tracking.

All of these features point in the same direction: model choice is becoming a first-class engineering decision with real implications for cost, quality, and compliance. The teams that treat it that way will absorb deprecation cycles without breaking stride. The teams that don't will keep having bad Mondays.

## Try This Yourself

1. Run the `grep` command from Step 1 against your codebase right now. Count how many hardcoded model names you find.
2. Pick your most important AI workflow and write three eval cases for it. Just three.
3. Check the [GitHub Changelog](https://github.blog/changelog/) for Copilot updates from the last 30 days. Notice how many involve model changes.

That's your starting point. The playbook grows from there.
