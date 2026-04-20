---
title: "Coding Agents Are Becoming Project Participants, Not Just Code Generators"
date: 2026-04-17
draft: true
categories:
  - "github"
  - "ai"
  - "copilot"
  - "agents"
tags:
  - "github-copilot"
  - "coding-agents"
  - "project-management"
  - "ai-agent-board"
  - "mcp"
coverImage: "cover.webp"
---

Three things shipped in the same week at the end of March, and together they tell a story that's bigger than any one feature.

GitHub's Copilot coding agent can now [resolve merge conflicts on PRs](https://github.blog/changelog/2026-03-26-ask-copilot-to-resolve-merge-conflicts-on-pull-requests/). Agent sessions are [visible inside Issues and Projects](https://github.blog/changelog/2026-03-26-agent-activity-in-github-issues-and-projects/). And the [Copilot for Jira integration](https://github.blog/changelog/2026-03-25-github-copilot-for-jira-public-preview-enhancements/) now pulls Confluence pages into agent context via MCP.

None of these are about writing new code. They're about agents doing the *other* work: resolving conflicts, showing up in project boards, reading design docs. Agents are becoming project participants.

I've been building toward this idea for months with my own [AI Agent Board](https://github.com/codewithdan/ai-agent-board) project. Seeing GitHub ship native versions of things I built independently tells me the trajectory is real. Let me walk you through what changed, why it matters, and where the gaps still are.

## Merge Conflicts: The First "Maintenance" Task

Before March 26, the Copilot coding agent could fix failing CI, address review comments, and make ad-hoc code changes on PRs. All creation or repair work. Now you can comment `@copilot merge in main and resolve the conflicts` on a PR, and the agent pulls main, resolves the conflicts in its cloud sandbox, verifies the build still passes, and pushes.

This is a small feature with big implications. Merge conflicts are pure maintenance. Nobody writes them on their sprint board. They just happen, and someone has to deal with them. Giving that to an agent means coding agents aren't just generating new code anymore. They're maintaining existing code.

If you've ever had a PR sit for three days because the author was on PTO and main diverged, you know why this matters.

## Agent Status in Issues and Projects

This one caught my attention because it's exactly what I built in [AI Agent Board](https://github.com/codewithdan/ai-agent-board).

GitHub now shows agent session status directly in the Issue sidebar when a coding agent is assigned. You can see whether the agent is queued, working, waiting for review, or completed. Even better, agent sessions show up in Project table and board views alongside human work.

Here's what that means in practice: your project board has cards for human tasks and agent tasks, and you can track them the same way. The agent isn't a black box running somewhere. It's a visible participant with a status.

I've been doing this with my own board for a while now. The AI Agent Board is a Kanban board where you drag cards into columns, and when a card hits "In Progress," an AI agent picks it up. The board shows real-time agent status, event streams, and lets you follow up with the agent mid-task:

```typescript
// From ai-agent-board's AgentManager — real-time status broadcasting
import { CopilotProvider, ClaudeProvider, CodexProvider, OpenCodeProvider, detectAgents } from '@codewithdan/agent-sdk-core';

export class AgentManager {
  private providers = new Map<AgentType, AgentProvider>();
  private sessions = new Map<string, ManagedSession>();

  async startAgent(task: Task, onStatus: (status: Task['agentStatus']) => void) {
    const provider = this.providers.get(task.agentType);
    if (!provider) throw new Error(`No provider for ${task.agentType}`);

    const session = await provider.createSession({
      prompt: task.description,
      repoPath: task.repoPath,
      onEvent: (event) => {
        // Broadcast every event to the board via WebSocket
        broadcast({ type: 'agent:event', taskId: task.id, event });
      },
    });

    await session.execute(task.title);
  }
}
```

The key difference: GitHub's version is baked into their platform. Mine runs on top of four different agent SDKs (Copilot, Claude Code, Codex, OpenCode) through a [unified SDK](https://github.com/codewithdan/agent-sdk-core) I built. GitHub gives you status visibility for their agent. My board gives you status visibility for any agent, plus the ability to orchestrate groups of tasks with concurrency controls.

## Confluence Context via MCP: Agents Reading the Spec

The Jira integration update is interesting because of what it enables, not what it is. Copilot for Jira now supports pulling Confluence pages into agent context through Atlassian's MCP server. You set up a Personal Access Token, and when the agent works on a Jira ticket, it can reference the design docs and specs linked in Confluence.

This is MCP doing what it was designed for: connecting agents to the knowledge they need to do good work. A coding agent that can read the spec before writing code is fundamentally different from one that only sees the ticket title and description.

For anyone building agent workflows, this pattern is worth paying attention to. The agent isn't just receiving instructions. It's actively pulling context from external systems. That's the shift from "code generator" to "project participant."

## What's Still Missing

GitHub is making real progress, but there are gaps I've had to solve in my own project that don't have platform-level answers yet.

**Multi-agent orchestration.** GitHub's agent visibility works for one agent on one issue. What about running five agents in parallel on related tasks? In AI Agent Board, I built Task Groups for this:

```typescript
// Task Groups: run multiple agent tasks with concurrency control
interface GroupQueue {
  groupId: string;
  maxConcurrency: number;     // How many agents run simultaneously
  pendingTaskIds: string[];   // Waiting to start
  runningTaskIds: Set<string>; // Currently executing
  completedTaskIds: Set<string>;
  failedTaskIds: Set<string>;
}
```

You create a group of related tasks, set a concurrency limit, and the board manages the queue. When one agent finishes, the next task starts automatically. The group card on the board shows aggregate progress. GitHub doesn't have anything like this yet.

**Git worktree isolation.** When multiple agents work on the same repo, they need separate working directories. I use git worktrees so each agent gets its own branch and directory without stepping on other agents' changes:

```typescript
// From the git routes — worktree-based branch isolation
// POST /api/tasks/:id/create-pr — create a PR from the worktree branch
// Worktrees auto-clean after successful merge or PR creation
```

GitHub's coding agent runs in a cloud sandbox, so isolation is handled for you. But if you're running agents locally (which I prefer for private repos), worktree management is something you have to build yourself.

**Agent choice per task.** Different tasks are better suited to different agents. A refactoring task might work best with Claude Code, while a GitHub-specific automation might be better with Copilot. In my board, each task card has an agent selector:

```typescript
// Agent types supported — each task picks the best agent for the job
type AgentType = 'copilot' | 'claude' | 'codex' | 'opencode';
```

GitHub's platform naturally only offers the Copilot agent. If you want to mix and match, you need your own orchestration layer.

## Where This Is Heading

The pattern is clear: agents are moving from "write this function" to "participate in this project." Merge conflicts today. Code reviews tomorrow. Sprint planning next quarter. (I'm half joking about that last one. Half.)

What I find encouraging is that GitHub is building the planning surface for agents at the platform level. That validates the bet I made with AI Agent Board: the future isn't just smarter code generation, it's agents that show up in your workflow tools as tracked participants.

If you want to try this out, here are three things you can do today:

1. **Try the merge conflict feature.** Next time a PR has conflicts, comment `@copilot merge in main and resolve the conflicts` instead of doing it yourself. See how it handles your codebase.

2. **Turn on agent visibility in Projects.** If you're using GitHub Projects, assign an issue to the Copilot coding agent and watch the status appear in your board view.

3. **Check out [AI Agent Board](https://github.com/codewithdan/ai-agent-board)** if you want multi-agent orchestration, task groups, and the ability to use Copilot, Claude Code, Codex, or OpenCode from a single Kanban interface.

The tools are catching up to the idea. Agents aren't just writing code for you. They're working *with* you.
