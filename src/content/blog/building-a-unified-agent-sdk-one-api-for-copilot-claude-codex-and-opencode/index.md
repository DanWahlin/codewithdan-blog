---
title: "Building a Unified Agent SDK: One API for Copilot, Claude, Codex, and OpenCode"
date: 2026-03-08
draft: true
categories:
  - "ai"
  - "github-copilot"
tags:
  - "ai-agents"
  - "typescript"
  - "sdk"
  - "github-copilot"
  - "claude-code"
  - "codex"
  - "opencode"
series: "Agent SDK"
seriesOrder: 1
coverImage: "cover.webp"
---

If you've built anything that talks to more than one AI coding agent, you already know the problem. Every SDK has its own way of doing things. Copilot gives you event subscriptions with `session.on()` and `sendAndWait()`. Claude Code hands you an async generator. Codex uses threaded streams. OpenCode takes a completely different path with HTTP REST and server-sent events.

Four SDKs. Four paradigms. Four sets of event types, session models, and cleanup patterns. I got tired of writing the same integration code across three different projects, so I built [`@codewithdan/agent-sdk-core`](https://github.com/DanWahlin/agent-sdk-core): a single TypeScript package that normalizes all four into one `AgentProvider` / `AgentSession` interface.

This is the first post in a series about the SDK and what you can build with it. Here, I'll walk you through the design decisions, the provider pattern, and how the unified event stream works under the hood.

## The Problem Up Close

Let's look at what "four paradigms" actually means in code. Here's how you'd stream events from each SDK natively:

**Copilot (event subscriptions):**

```typescript
import { CopilotClient } from '@github/copilot-sdk';

const client = new CopilotClient({ autoRestart: true });
await client.start();

const session = await client.createSession({ model: 'claude-opus-4-20250514' });
session.on((event) => {
  // SDK-specific event shape — different fields, different types
  console.log(event.type, event.content);
});
await session.sendAndWait('Fix the failing tests');
```

**Claude Code (async generator):**

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';

const conversation = query({
  prompt: 'Fix the failing tests',
  options: { model: 'claude-opus-4-20250514' },
});

for await (const message of conversation) {
  // Completely different event structure
  console.log(message.type, message.content);
}
```

**Codex (threaded streams):**

```typescript
import { CodexClient } from '@openai/codex-sdk';

const client = new CodexClient();
const thread = await client.createThread({ model: 'gpt-5.2-codex' });
const stream = await thread.runStreamed('Fix the failing tests');

for await (const item of stream) {
  // Yet another event model
  console.log(item.type, item.content);
}
```

Three SDKs, three completely different patterns for doing the same thing: send a prompt, stream events, get a result. And that's before you add OpenCode's HTTP/SSE model on top.

If you're building a one-off script that talks to a single agent, this is fine. But the moment you're building a tool that needs to support multiple agents (a task runner, a CI integration, a review bot, an IDE plugin) you're maintaining four separate code paths for event handling, session lifecycle, error recovery, and cleanup.

That's the problem `agent-sdk-core` solves.

## The Provider Pattern

The design is straightforward. Three layers:

1. **`AgentProvider`**: Wraps an SDK. Handles startup, shutdown, and session creation.
2. **`AgentSession`**: Wraps a conversation. Handles prompt execution, follow-ups, abort, and cleanup.
3. **`AgentEvent`**: The unified event stream. Same shape regardless of which agent is running.

Here's the provider interface:

```typescript
interface AgentProvider {
  readonly name: AgentType;      // 'copilot' | 'claude' | 'codex' | 'opencode'
  readonly displayName: string;  // 'GitHub Copilot', 'Claude Code', etc.
  readonly model: string;

  start(): Promise<void>;
  stop(): Promise<void>;
  createSession(config: AgentSessionConfig): Promise<AgentSession>;
}
```

And the session interface:

```typescript
interface AgentSession {
  execute(prompt: string, attachments?: AgentAttachment[]): Promise<AgentResult>;
  send(message: string, attachments?: AgentAttachment[]): Promise<void>;
  abort(): Promise<void>;
  destroy(): Promise<void>;
  readonly sessionId: string | null;
}
```

Every provider implements both interfaces. The consumer code doesn't care which agent is running behind it. You write your event handling once.

## Unified Events: 10 Types, One Shape

Each SDK emits different event types with different names and structures. Copilot has its own event vocabulary. Claude uses message types from the async generator. Codex has item types from its stream. The providers map all of these to 10 unified `AgentEvent` types:

```typescript
type AgentEventType =
  | 'thinking'        // Agent reasoning / intent
  | 'output'          // General text output
  | 'command'         // Command or tool started
  | 'command_output'  // Command execution result
  | 'file_read'       // Agent read a file
  | 'file_write'      // Agent wrote/modified a file
  | 'file_edit'       // Alias for consumers that don't need read/write distinction
  | 'tool_call'       // Generic tool invocation
  | 'test_result'     // Test execution results
  | 'error'           // Error occurred
  | 'complete';       // Agent finished
```

Every event carries the same shape:

```typescript
interface AgentEvent {
  id: string;           // UUID
  contextId: string;    // Your identifier (task ID, run ID, whatever)
  type: AgentEventType;
  content: string;
  timestamp: number;
  metadata?: {
    file?: string;           // File path for read/write events
    command?: string;        // Shell command for command events
    diff?: string;           // Diff content for file changes
    agentType?: AgentType;   // Which agent produced this event
    duration?: number;       // How long an operation took
    error?: string;          // Error details
    testsPassing?: number;   // For test_result events
    testsFailing?: number;
  };
}
```

The mapping happens inside each provider through `classifyToolKind()`, a shared function that translates SDK-specific tool names to the unified types:

```typescript
function classifyToolKind(toolName: string | undefined): AgentEventType {
  if (!toolName) return 'command';
  const name = toolName.toLowerCase();

  if (name === 'read' || name === 'view' || name === 'cat' || name.includes('grep')) {
    return 'file_read';
  }

  if (name === 'write' || name === 'edit' || name === 'multiedit' ||
      name.includes('patch') || name.includes('insert')) {
    return 'file_write';
  }

  return 'command';
}
```

This keeps the classification logic in one place. When a new agent adds a tool called `multi_file_edit`, you update one function, not four providers.

## Quick Start: From Zero to Streaming

Here's the complete flow. Pick a provider, create a session, handle events:

```typescript
import { CopilotProvider, detectAgents } from '@codewithdan/agent-sdk-core';

// Check which agents are installed on the system
const agents = await detectAgents();
console.log(agents);
// [{ name: 'copilot', available: true }, { name: 'claude', available: true }, ...]

// Create and start a provider
const provider = new CopilotProvider();
await provider.start();

// Create a session with your event handler
const session = await provider.createSession({
  contextId: 'my-task-1',
  workingDirectory: '/path/to/project',
  systemPrompt: 'You are a helpful coding assistant.',
  onEvent: (event) => {
    switch (event.type) {
      case 'thinking':
        console.log('🧠', event.content);
        break;
      case 'file_write':
        console.log('📝', event.metadata?.file);
        break;
      case 'command':
        console.log('⚡', event.metadata?.command);
        break;
      case 'test_result':
        console.log(`✅ ${event.metadata?.testsPassing} passing, ❌ ${event.metadata?.testsFailing} failing`);
        break;
      case 'error':
        console.error('💥', event.content);
        break;
    }
  },
});

// Execute a prompt — events stream through onEvent as the agent works
const result = await session.execute('Fix the failing tests');
console.log(result.status); // 'complete' or 'failed'

// Clean up
await session.destroy();
await provider.stop();
```

Want Claude instead? Swap one line:

```typescript
import { ClaudeProvider } from '@codewithdan/agent-sdk-core';

const provider = new ClaudeProvider();
```

Everything else stays identical. Same session config, same event handler, same cleanup. That's the whole point.

## Middleware Hooks: Intercepting Without Modifying

Two hooks let you inject behavior into the session without touching provider code:

**`onPreToolUse`**: Intercepts tool calls before they execute. I use this for worktree path rewriting: when an agent runs in an isolated git worktree, file paths need translating back to the main repo.

**`onPermissionRequest`**: Handles tool approval/denial. Build a deny-list, require confirmation for destructive operations, whatever your security model needs.

```typescript
const session = await provider.createSession({
  contextId: 'task-42',
  workingDirectory: '/worktrees/task-42',
  systemPrompt: 'Fix the auth module.',
  onEvent: handleEvent,
  hooks: {
    onPreToolUse: (input) => {
      // Rewrite paths from worktree to main repo
      return rewritePaths(input, '/worktrees/task-42', '/repos/main');
    },
    onPermissionRequest: (req) => {
      // Deny dangerous tools
      if (dangerousList.has(req.kind)) {
        return { kind: 'denied-by-rules' };
      }
      return { kind: 'approved' };
    },
  },
});
```

These hooks are optional. Most simple use cases don't need them. But when you're running agents in isolated environments (and you should be), they're essential.

## Session Resume

All four SDKs support resuming a previous session, but each does it differently. Copilot has `resumeSession()`. Codex has `resumeThread()`. Claude has a `resume` option. OpenCode uses `session.get()`.

The unified interface handles this with a single `resumeSessionId` field:

```typescript
const session = await provider.createSession({
  contextId: 'task-42',
  workingDirectory: '/path/to/project',
  systemPrompt: 'Continue working on the auth module.',
  resumeSessionId: 'previous-session-id-here',
  onEvent: handleEvent,
});
```

The provider maps `resumeSessionId` to whatever the underlying SDK expects. Your code doesn't need to know which agent it's talking to.

## Peer Dependencies: Install Only What You Use

One thing I wanted to avoid: forcing everyone to install all four SDK packages. If you only use Copilot and Claude, you shouldn't need Codex and OpenCode sitting in your `node_modules`.

The package uses peer dependencies with `optional: true`. Install the core package, then add only the SDKs you need:

```bash
npm install @codewithdan/agent-sdk-core

# Pick your agents
npm install @github/copilot-sdk          # For Copilot
npm install @anthropic-ai/claude-agent-sdk  # For Claude Code
npm install @openai/codex-sdk            # For Codex
npm install @opencode-ai/sdk             # For OpenCode
```

If you try to create a provider for an SDK that isn't installed, you get a clear error at startup, not a cryptic module resolution failure at runtime.

## What's Next

This post covered the foundation: why a unified interface matters, how the provider pattern works, and what the event stream looks like. The SDK is currently used across three projects: [copilot-kanban-agent](https://github.com/DanWahlin/copilot-kanban-board), agentmic, and zingit.

In the next post, I'll walk through one of those projects end-to-end: a Kanban board where you drag a task card to "In Progress" and an AI agent picks it up, streams its work in real-time, and creates a PR when it's done. That's where the unified SDK really clicks: you can swap agents per task without changing a line of orchestration code.

The package is open source at [github.com/DanWahlin/agent-sdk-core](https://github.com/DanWahlin/agent-sdk-core). If you're building agent-powered dev tools and fighting the multi-SDK problem, give it a look.
