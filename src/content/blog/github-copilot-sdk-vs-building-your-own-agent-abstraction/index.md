---
title: "GitHub's Copilot SDK Just Dropped: When to Use It vs. Building Your Own Agent Abstraction"
date: 2026-03-11
draft: true
categories:
  - "ai"
  - "github-copilot"
tags:
  - "copilot-sdk"
  - "agent-sdk"
  - "agentic-workflows"
  - "typescript"
coverImage: "cover.webp"
series: "Agent SDK Core"
seriesOrder: 2
---

Yesterday GitHub released the [Copilot SDK](https://github.com/github/copilot-sdk) in technical preview. Four languages. Full programmatic access to the same agentic engine behind Copilot CLI. You can now embed Copilot's planning, tool invocation, and file editing directly into your own apps.

I've been building something in the same space: [agent-sdk-core](https://github.com/DanWahlin/agent-sdk-core), a unified TypeScript interface that normalizes four different AI coding agent SDKs (Copilot, Claude Code, Codex, and OpenCode) into one API. So when I saw the Copilot SDK announcement, my first thought was: "Does this replace what I built?"

Short answer: no. They solve different problems. Here's how.

## What the Copilot SDK Actually Is

The Copilot SDK gives you programmatic control over GitHub Copilot CLI via JSON-RPC. Your app talks to the SDK client, which manages a Copilot CLI process running in server mode:

```
Your Application → SDK Client → (JSON-RPC) → Copilot CLI (server mode)
```

Here's what a basic session looks like in TypeScript ([source: official repo](https://github.com/github/copilot-sdk/tree/main/nodejs)):

```typescript
import { CopilotClient } from "@github/copilot-sdk";

const client = new CopilotClient();
await client.start();

const session = await client.createSession({
  model: "gpt-5",
});

const done = new Promise<void>((resolve) => {
  session.on("assistant.message", (event) => {
    console.log(event.data.content);
  });
  session.on("session.idle", () => {
    resolve();
  });
});

await session.send({ prompt: "What is 2+2?" });
await done;

await session.disconnect();
await client.stop();
```

It supports custom tools, system messages, session resume via `resumeSession()`, BYOK (bring your own API keys from OpenAI, Azure AI Foundry, or Anthropic), hooks for lifecycle events, and even `Symbol.asyncDispose` for automatic cleanup. The [getting started guide](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md) and [cookbook](https://github.com/github/awesome-copilot/blob/main/cookbook/copilot-sdk/nodejs/README.md) have more patterns.

This is a solid SDK. If Copilot is your agent runtime, this is the way to embed it.

## What agent-sdk-core Does Differently

agent-sdk-core doesn't wrap one agent runtime. It normalizes four of them behind a single interface. The problem it solves: every AI coding agent SDK uses a completely different API pattern.

- **Copilot** uses event subscriptions: `session.on(callback)` + `sendAndWait()`
- **Claude Code** uses async generators: `for await (const msg of query(...))`
- **Codex** uses threaded streams: `thread.runStreamed()`
- **OpenCode** uses HTTP REST sessions + SSE event streaming

If you're building a tool that needs to work with more than one agent, you're writing four separate integration layers. agent-sdk-core collapses that into one:

```typescript
import { CopilotProvider, detectAgents } from '@codewithdan/agent-sdk-core';

const agents = await detectAgents();

const provider = new CopilotProvider();
await provider.start();

const session = await provider.createSession({
  contextId: 'my-task-1',
  workingDirectory: '/path/to/project',
  systemPrompt: 'You are a helpful coding assistant.',
  onEvent: (event) => {
    console.log(event.type, event.content);
    // thinking, output, command, file_read, file_write, error, complete, ...
  },
});

const result = await session.execute('Fix the failing tests');
console.log(result.status); // 'complete' or 'failed'

await session.destroy();
await provider.stop();
```

Swap `CopilotProvider` for `ClaudeProvider`, `CodexProvider`, or `OpenCodeProvider` and everything else stays the same. Same event types, same lifecycle, same callbacks.

## The Real Difference: Single Runtime vs. Multi-Provider

Here's the decision tree:

**Use the Copilot SDK when:**
- Copilot is your only agent runtime
- You want the deepest possible integration with Copilot's features (model picker, BYOK, custom tools via their schema, infinite sessions with context compaction)
- You need Python, Go, or .NET (agent-sdk-core is TypeScript only)
- You want GitHub-managed auth (OAuth, signed-in user, environment tokens)

**Use a multi-provider abstraction when:**
- Your app lets users pick their agent (some teams run Claude Code, others run Copilot, others run Codex)
- You're building developer tools where agent flexibility is a feature
- You want to compare agent performance on the same tasks with the same event format
- You need to swap agents without rewriting your event handling, UI rendering, or orchestration logic

This isn't theoretical. [ai-agent-board](https://github.com/DanWahlin/copilot-kanban-board), the Kanban-style task runner I built on top of agent-sdk-core, lets you pick a different agent for every task card. One task runs on Copilot, the next on Claude Code, a third on Codex. Same streaming UI, same event pipeline, same merge flow. That only works because the abstraction layer handles the SDK differences.

## Where They Overlap (and Where They Don't)

Both SDKs handle the same core workflow: create a client, start a session, send prompts, receive events, clean up. Let me compare a few specifics:

**Session Resume**

Copilot SDK: `client.resumeSession(sessionId)` returns the session with workspace path populated.

agent-sdk-core: `provider.createSession({ resumeSessionId })` maps to Copilot's `resumeSession()`, Codex's `resumeThread()`, Claude's `resume` option, and OpenCode's `session.get()`. One parameter, four implementations.

**Event Handling**

Copilot SDK uses named events on the session:
```typescript
session.on("assistant.message", (event) => { ... });
session.on("tool.call", (event) => { ... });
session.on("session.idle", () => { ... });
```

agent-sdk-core uses a single `onEvent` callback with typed `AgentEvent` objects:
```typescript
onEvent: (event) => {
  switch (event.type) {
    case 'output': // agent text
    case 'command': // shell command about to run
    case 'file_write': // file being written
    case 'thinking': // reasoning tokens
    case 'complete': // done
    // ... 10 types total
  }
}
```

The tradeoff: the Copilot SDK gives you Copilot-specific event granularity. agent-sdk-core gives you a consistent event vocabulary that works across all four agents, which means your UI code doesn't care which agent is running.

**Tool Configuration**

The Copilot SDK lets you define custom tools exposed to the CLI, configure which built-in tools are available, and integrate MCP servers. That's deeper than what agent-sdk-core does today. agent-sdk-core's middleware hooks (`onPreToolUse`, `onPermissionRequest`) let you intercept and modify tool behavior, but the tool definition itself comes from each underlying SDK.

## What the Copilot SDK Launch Means for Multi-Agent Tooling

GitHub's [announcement post](https://github.blog/ai-and-ml/github-copilot/the-era-of-ai-as-text-is-over-execution-is-the-new-interface/) frames this as "the era of AI as text is over, execution is the new interface." That's the right framing. Every major player is shipping programmable agent runtimes right now: GitHub with the Copilot SDK, Anthropic with Claude Code's SDK patterns, Cursor with Automations. The question isn't whether agents are becoming embeddable infrastructure. They already are.

The interesting implication: as each vendor ships their own SDK, the API surface area between them grows. Copilot uses JSON-RPC to a CLI server process. Claude uses async generators. Codex uses threaded streams. These aren't converging toward a shared standard. If anything, they're diverging, each optimizing for their own runtime model.

That divergence is exactly why multi-provider abstractions exist. Not to replace vendor SDKs, but to give application developers a stable interface while the runtimes underneath keep changing.

## Try This Yourself

If you want to experiment with the Copilot SDK:

```bash
npm install @github/copilot-sdk
```

You'll need the [Copilot CLI installed](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli) and a Copilot subscription (there's a free tier), unless you're using BYOK mode.

If you want to try agent-sdk-core with multiple agents:

```bash
npm install @codewithdan/agent-sdk-core
# Install whichever agent SDKs you want to use:
npm install @github/copilot-sdk          # Copilot
npm install @anthropic-ai/claude-agent-sdk # Claude Code
npm install @openai/codex-sdk             # Codex
npm install @opencode-ai/sdk              # OpenCode
```

Both repos are open source. The Copilot SDK has [cookbooks for TypeScript, Python, Go, and .NET](https://github.com/github/awesome-copilot/blob/main/cookbook/copilot-sdk). agent-sdk-core has a [full README walkthrough](https://github.com/DanWahlin/agent-sdk-core) and you can see it in action in the [ai-agent-board](https://github.com/DanWahlin/copilot-kanban-board) project.

The right tool depends on whether you're building for one agent or many. If Copilot is your runtime, the official SDK is the obvious choice. If you need agent flexibility, an abstraction layer saves you from writing the same integration four times.

Pick the architecture that matches your problem. Then ship something.
