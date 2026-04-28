---
title: "Copilot Pricing Finally Matches How Agents Actually Work"
date: 2026-04-28
draft: true
categories:
  - "github-copilot"
  - "ai"
tags:
  - "github-copilot"
  - "coding-agents"
  - "agentic-workflows"
  - "developer-productivity"
coverImage: "cover.webp"
---

If you've been running coding agents for anything more serious than autocomplete, you already know the secret: agents are expensive.

Not "I asked a chat question" expensive. More like "I kicked off a multi-step coding session, it read half the repo, ran tests three times, fixed the failure, then tried again" expensive.

GitHub just said the quiet part out loud.

On April 20, GitHub [paused new sign-ups for Copilot Pro, Pro+, and Student plans](https://github.blog/news-insights/company-news/changes-to-github-copilot-individual-plans/), tightened usage limits, and moved Opus 4.7 behind Pro+. A week later, GitHub announced that [Copilot is moving to usage-based billing on June 1, 2026](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/).

That sounds like a pricing story. I think it's really an architecture story.

The pricing model built for autocomplete doesn't fit agents that run for minutes, spawn subagents, read files, edit code, and rerun tests. If you're building agentic developer tools, or just using them heavily, this is the moment to treat agent compute like a real engineering resource.

## What Changed

GitHub's April 20 post was unusually direct:

> Agentic workflows have fundamentally changed Copilot's compute demands. Long-running, parallelized sessions now regularly consume far more resources than the original plan structure was built to support.

Here's the practical version:

- New sign-ups for Copilot Pro, Pro+, and Student plans were paused.
- Individual plan usage limits were tightened.
- Pro+ has over 5X the limits of Pro.
- Opus models are no longer available on Pro. Opus 4.7 remains available on Pro+.
- Copilot now has session limits and weekly token-based limits.
- VS Code and Copilot CLI show usage when you're approaching a limit.

Then the April 27 post made the bigger shift official: starting June 1, Copilot plans move from premium request units to GitHub AI Credits. Usage will be calculated from token consumption, including input, output, and cached tokens, using the listed API rates for each model.

Base plan pricing isn't changing. Copilot Pro stays $10/month and Pro+ stays $39/month. But the unit of account changes from "requests" to "actual usage."

That's the important part.

## Why Requests Were the Wrong Unit

A request sounds simple until you compare these two actions:

1. "Explain this TypeScript error."
2. "Refactor the auth flow, update tests, run the suite, fix anything that breaks, and open a PR."

Those are both "requests" from a user's point of view. They are not remotely the same from an inference cost point of view.

The second one may involve:

- reading many files
- carrying a large context window
- generating multiple patches
- running commands
- handling command output
- retrying after failures
- using a more expensive model
- staying alive for a long-running session

If you run several of those in parallel, the cost curve changes fast.

I've seen this firsthand while building [agent-sdk-core](https://github.com/DanWahlin/agent-sdk-core) and [AI Agent Board](https://github.com/DanWahlin/ai-agent-board). A single card on the board can become a real coding session with file reads, tool calls, commands, follow-up messages, and a review step. A task group can run multiple child tasks concurrently.

That's incredibly useful. It's also not the same product as inline completion.

Autocomplete is a quick assist. Agentic coding is delegated work.

Those need different pricing models.

## The New Mental Model: Agent Runs Are Jobs

This is the shift I think developers need to make.

Stop thinking about agent work as chat messages. Start thinking about agent work as jobs.

A job has:

- scope
- duration
- resource usage
- concurrency
- failure modes
- retry behavior
- a human review step

That mental model changes how you design workflows.

If an agent is working on one isolated bug fix, great. Let it run. If you're launching ten agents across the same repo with broad prompts and a frontier model, that's no longer casual usage. That's a compute workload.

GitHub even calls out parallel workflows directly. Their guidance says to reduce parallel workflows when you're nearing limits because tools like `/fleet` result in higher token consumption.

That's not a knock on parallelism. Parallelism is one of the best parts of agentic development. But parallelism needs a budget, a queue, and a reason.

## A Cost-Aware Agent Runner

You don't need a full billing system to build better agent workflows. Start by making each run visible.

Here's a small TypeScript example using `agent-sdk-core`. It wraps a session with a duration budget, event counting, and a progress summary. It doesn't estimate token cost, because the provider usage page is the source of truth for that. But it does give you the operational signals you need before you hand a task to an agent.

```typescript
import {
  CopilotProvider,
  ProgressAggregator,
  type AgentEvent,
  type AgentProvider,
} from '@codewithdan/agent-sdk-core';

type RunOptions = {
  contextId: string;
  workingDirectory: string;
  prompt: string;
  maxDurationMs: number;
};

type RunReport = {
  status: 'complete' | 'failed' | 'timed-out';
  durationMs: number;
  eventCounts: Record<string, number>;
  summaries: string[];
  error?: string;
};

export async function runWithBudget(
  provider: AgentProvider,
  options: RunOptions,
): Promise<RunReport> {
  const startedAt = Date.now();
  const eventCounts: Record<string, number> = {};
  const summaries: string[] = [];

  const progress = new ProgressAggregator((summary) => {
    summaries.push(summary);
    console.log(`[agent:${options.contextId}] ${summary}`);
  }, 10_000);

  const session = await provider.createSession({
    contextId: options.contextId,
    workingDirectory: options.workingDirectory,
    systemPrompt: [
      'You are working inside a real repository.',
      'Keep the task focused.',
      'Prefer small, reviewable changes.',
      'Run relevant tests when applicable.',
    ].join('\n'),
    onEvent: (event: AgentEvent) => {
      eventCounts[event.type] = (eventCounts[event.type] ?? 0) + 1;
      progress.push(event);
    },
  });

  const timeout = setTimeout(() => {
    void session.abort();
  }, options.maxDurationMs);

  try {
    const result = await session.execute(options.prompt);
    const durationMs = Date.now() - startedAt;

    return {
      status: durationMs >= options.maxDurationMs ? 'timed-out' : result.status,
      durationMs,
      eventCounts,
      summaries,
      error: result.error,
    };
  } finally {
    clearTimeout(timeout);
    progress.stop();
    await session.destroy();
  }
}

async function main() {
  const provider = new CopilotProvider();
  await provider.start();

  try {
    const report = await runWithBudget(provider, {
      contextId: 'fix-settings-tests',
      workingDirectory: '/path/to/your/repo',
      prompt: 'Fix the failing settings tests. Keep the change minimal.',
      maxDurationMs: 10 * 60 * 1000,
    });

    console.log(JSON.stringify(report, null, 2));
  } finally {
    await provider.stop();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

The point isn't that event counts equal dollars. They don't.

The point is that every serious agent workflow should answer basic questions:

- How long did this run?
- What did it do?
- Did it read 3 files or 80?
- Did it run tests?
- Did it retry the same command repeatedly?
- Did it finish cleanly or time out?

If you can't answer those, you don't have an agent workflow. You have an expensive black box.

## Keep Parallelism, Add Discipline

I still like parallel agents. A lot.

In AI Agent Board, Task Groups let you define multiple child tasks and set a concurrency limit. That's exactly the kind of feature that becomes more important under usage-based billing, not less.

The wrong response is "never run agents in parallel."

The better response is:

- run parallel tasks only when they are independent
- cap concurrency per repo
- use smaller models for mechanical work
- reserve expensive models for ambiguous work
- split broad tasks into reviewable pieces
- stop sessions that are wandering
- track what happened after every run

Here's a simple concurrency queue you can drop around agent jobs. It runs at most `maxConcurrency` tasks at a time and preserves the result for each task.

```typescript
type AgentJob<T> = () => Promise<T>;

export async function runWithConcurrency<T>(
  jobs: AgentJob<T>[],
  maxConcurrency: number,
): Promise<T[]> {
  const results: T[] = new Array(jobs.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < jobs.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await jobs[currentIndex]();
    }
  }

  const workers = Array.from(
    { length: Math.min(maxConcurrency, jobs.length) },
    () => worker(),
  );

  await Promise.all(workers);
  return results;
}
```

That's not fancy. It doesn't need to be.

The important part is that concurrency becomes an explicit decision instead of an accidental side effect of opening five agent sessions because you got impatient.

## Prompt Scope Is Now a Cost Control

Developers already know vague prompts produce vague results. Now vague prompts can also produce surprise usage.

Compare these two tasks:

**Bad:**

```text
Clean up the settings area and make it better.
```

**Better:**

```text
Fix the failing tests in packages/settings.
Do not change public APIs.
Run npm test -- --runInBand packages/settings when finished.
If the failure requires a larger refactor, stop and explain the issue instead of making broad changes.
```

The second prompt gives the agent boundaries. It tells the agent where to work, what not to change, which verification command to run, and when to stop.

That matters for quality. It also matters for cost.

GitHub's own guidance says to use plan mode to improve task efficiency. I agree with that. For bigger tasks, planning first is usually cheaper than letting an agent wander through the repo and discover the architecture by trial and error.

## What I'd Actually Do

If you're using Copilot casually, this probably doesn't change much. Code completions and Next Edit suggestions remain included in all plans and don't consume AI Credits according to GitHub's April 27 announcement.

If you're using agentic workflows heavily, I'd change a few habits now:

**1. Watch usage in VS Code and Copilot CLI.** GitHub added usage visibility when you're approaching limits. Don't ignore it.

**2. Treat expensive models like senior reviewers.** Use them where judgment matters. Don't burn them on rote file renames or simple test updates.

**3. Add timeouts to your own agent tooling.** A runaway agent session is now a reliability problem and a cost problem.

**4. Queue parallel work.** Parallel agents are great when the tasks are independent. They are wasteful when they fight over the same files or duplicate discovery work.

**5. Make every run reviewable.** Keep the branch, event stream, commands, and test output attached to the task. If you can't review it, don't merge it.

This is one reason I like the board model for agent work. A card gives you a place to attach scope, agent choice, branch name, worktree path, status, events, and review outcome. That's much more cost-aware than a pile of disconnected chat sessions.

## The Bigger Signal

The interesting part of GitHub's announcement isn't that prices are changing. Prices always change.

The interesting part is that agentic development is becoming real enough to break the old business model.

That tells me agents have crossed a line. They are no longer just smarter autocomplete. They are long-running execution systems that consume meaningful compute and need real operational controls.

That's good news if you're building serious developer tools. It means the workflow is valuable enough that people are using it hard.

But it also means we need to grow up a bit.

Give agents a clear task. Give them an isolated branch. Give them a budget. Give them a review step. Then let them work.

That's how this becomes sustainable.
