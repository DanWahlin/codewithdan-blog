---
title: "From Kanban Card to Merged PR: How I Built a Board Where AI Does the Coding"
date: 2026-03-18
draft: true
categories:
  - "ai"
  - "github-copilot"
tags:
  - "agent-sdk"
  - "agentic-workflows"
  - "kanban"
  - "typescript"
  - "developer-productivity"
coverImage: "cover.webp"
series: "Agent SDK Core"
seriesOrder: 3
---

Most AI coding tools still make you work like this: open a chat window, write a prompt, wait, copy something back into your editor, then figure out what happened. It works, but it feels like you're managing an intern through a keyhole.

I wanted something different.

I wanted to throw a task onto a board, pick an agent, and let it do the work in an isolated branch while I watched the progress stream back in real time. Then, if the result looked good, I wanted to merge it locally or open a PR. No prompt cemetery. No mystery meat scripts. Just a workflow that fits how a lot of us already think about work: backlog, in progress, review, done.

So I built [AI Agent Board](https://github.com/DanWahlin/ai-agent-board).

It's a drag-and-drop Kanban board that can hand coding tasks to GitHub Copilot, Claude Code, Codex, or OpenCode. Under the covers it uses [agent-sdk-core](https://github.com/DanWahlin/agent-sdk-core) to normalize those agents behind one interface, which means the UI and orchestration code don't care which provider is running.

Here's how it works, and more importantly, why I think this shape of tool matters.

## The Workflow I Actually Wanted

The core interaction is simple:

1. Create a task in the Backlog column.
2. Drag it to In Progress.
3. Pick the repo path, branch name, agent type, and whether to use a git worktree.
4. Start the agent.
5. Watch events stream back as it reads files, runs commands, edits code, and finishes.
6. Merge locally or create a PR.

That's the whole idea.

I didn't want a fancy demo where an agent writes a todo app in a vacuum. I wanted something that works with a real repository, real branches, real git operations, and real task state.

The board gives each task a few key pieces of configuration:

- **Repo path**: where the code lives
- **Branch name**: where the changes should go
- **Base branch**: usually `main`
- **Agent type**: Copilot, Claude, Codex, or OpenCode
- **Worktree toggle**: whether the task should run in its own isolated checkout

That last one matters a lot.

If you're going to let multiple agents work on related tasks, or even just keep your main repo clean while an agent does its thing, git worktrees are the right move. They make the whole setup much less chaotic.

## Why a Kanban Board Makes Sense for Agents

A board sounds almost too obvious, but I think that's the point.

Developers already know how to reason about work in columns. Product teams do too. So instead of inventing some brand new mental model for agent execution, I used one people already understand.

A card on the board isn't just a note. It's the execution contract.

It knows:

- what needs to be done
- which repo to work in
- which agent should handle it
- whether it needs a worktree
- what branch will hold the changes

That turns an agent run into something visible and trackable instead of a one-off chat session that disappears into the void five minutes later.

I also wanted the state transitions to mean something. A task moving from **Backlog** to **In Progress** isn't just a visual change. It means a real execution is about to happen. When it lands in **Review**, the work is ready for a human eyeball. That's a much better contract than "the chat says it's done, probably."

## The Multi-Agent Piece

One of the reasons I built [agent-sdk-core](https://github.com/DanWahlin/agent-sdk-core) was that every coding agent SDK has a different personality disorder.

Copilot, Claude Code, Codex, and OpenCode don't expose the same session model, event model, or lifecycle. If you build directly against each one, your UI and orchestration layer turns into a pile of adapter code pretty quickly.

In AI Agent Board, the server initializes all four providers through a common interface:

```typescript
this.providers.set('copilot', new CopilotProvider());
this.providers.set('claude', new ClaudeProvider());
this.providers.set('codex', new CodexProvider());
this.providers.set('opencode', new OpenCodeProvider());

this.availableAgents = await detectAgents();
const available = this.availableAgents.filter(a => a.available);

for (const info of available) {
  const provider = this.providers.get(info.name);
  if (provider) {
    await provider.start();
  }
}
```

That code is from the board's `AgentManager`, and it's the reason the rest of the app can stay sane. The client just asks for available agents and lets you pick one for a task. The backend handles the provider-specific weirdness.

This is the part I care about most: the board is not locked to one vendor runtime.

That's not a nice-to-have. It's the whole game if you're building tools for real developers. Some people use Copilot. Some use Claude Code. Some want Codex. A good orchestration layer shouldn't force everybody into the same lane.

## Running Each Task in a Real Repo

A lot of agent demos stop right before the interesting part. They'll show prompt in, answer out, maybe a code edit, then everybody goes home happy.

But real development means repo paths, branches, merges, cleanup, and failure handling.

When a task starts, the board can create a git worktree automatically:

```typescript
setupWorktree(task: Task): string | undefined {
  if (!task.useWorktree || !task.repoPath || !task.branchName) return undefined;

  const worktreePath = fs.mkdtempSync(path.join(os.tmpdir(), `agentboard-${task.id}-`));
  const baseBranch = task.baseBranch || 'main';

  execFileSync(
    'git', ['worktree', 'add', '-b', task.branchName, worktreePath, baseBranch],
    { cwd: task.repoPath, stdio: 'pipe' },
  );

  return worktreePath;
}
```

That gives the agent its own isolated workspace. No stepping on your main checkout. No weird half-finished branch clutter in the directory you're actively using.

Then the task gets a system prompt that tells the agent exactly where it is allowed to work:

```typescript
const systemPrompt = `
<context>
You are a coding agent working on a task in the project directory: ${workingDirectory}
Task: ${safeTitle}
${worktreePath ? `\nIMPORTANT: All file paths MUST be under ${worktreePath}. Do NOT reference or edit files at ${task.repoPath} directly.` : ''}
${!hasGit ? `\nIMPORTANT: This directory is not a git repository. Run \`git init\` first before making any changes, so all work is tracked.` : ''}
Complete the task described in the user prompt. Be thorough, read relevant files,
make precise edits, and verify your changes compile/pass tests when applicable.
</context>
`;
```

I like this approach because it keeps the contract explicit. The board isn't just firing a prompt into the void. It's giving the agent operating instructions tied to the repo and task context.

## Streaming What the Agent Is Doing

One thing I can't stand in agent tooling is silence.

If an agent is working, I want to know whether it's thinking, reading, editing, running a command, or failing spectacularly. "Hang on while magic happens" is not a UX strategy.

The board normalizes provider events into a shared `AgentEvent` shape:

```typescript
export interface AgentEvent {
  id: string;
  taskId: string;
  type:
    | 'thinking'
    | 'tool_call'
    | 'file_read'
    | 'file_write'
    | 'file_edit'
    | 'command'
    | 'command_output'
    | 'output'
    | 'test_result'
    | 'error'
    | 'complete';
  content: string;
  timestamp: number;
}
```

Those events are broadcast over WebSocket to the UI, which means the board can show a live feed of what each task is doing without caring whether the underlying provider is Copilot or Claude Code.

That turns out to be more important than people think.

Once you can see the event stream, the agent stops feeling mystical and starts feeling debuggable. You can tell whether it chose the wrong file, hit a bad command, or actually finished cleanly.

## Task Groups, Because One Agent Run Usually Isn't Enough

Single tasks are useful, but I also wanted a way to launch a batch of related work without manually babysitting every card.

That's where **Task Groups** come in.

A group lets you define multiple child tasks, set a max concurrency value, and run them in parallel. The UI shows aggregate progress, and the server manages the queue.

Here's the client-side shape used to create a group:

```typescript
createGroup: (data: {
  title: string;
  description?: string;
  priority?: Priority;
  repoPath?: string;
  baseBranch?: string;
  maxConcurrency: number;
  children: CreateGroupChild[];
  autoRun?: boolean;
}) => request<TaskGroupWithChildren>('/groups', {
  method: 'POST',
  body: JSON.stringify(data)
})
```

On the server, each child task gets a generated branch name when worktrees are enabled:

```typescript
const childDefs = children.map((child: any, i: number) => ({
  id: uuid(),
  title: child.title.trim(),
  description: child.description?.trim() || '',
  priority: child.priority || group.priority,
  agentType: child.agentType || 'copilot',
  useWorktree: child.useWorktree ?? true,
  branchName: child.useWorktree !== false
    ? `group/${groupId.slice(0, 8)}/${i}-${slugify(child.title)}`
    : undefined,
  groupId,
  groupOrder: i,
}));
```

That's a small detail, but it's the kind of thing that makes the workflow usable. You get deterministic, understandable branch names instead of a random pile of junk.

On the UI side, the Group Panel shows exactly what's happening, including completed count, elapsed time, and how many child tasks are currently running.

This is where the board starts to feel less like "AI chat with extra steps" and more like a lightweight execution system.

## Merge Locally or Create a PR

If an agent finishes successfully, the next question is obvious: now what?

I didn't want "copy the files somewhere else" to be the answer.

The board exposes both local merge and PR creation routes. Here's the client API for those actions:

```typescript
mergeLocal: (id: string) =>
  request<{ merged: boolean; baseBranch: string }>(`/tasks/${id}/merge-local`, { method: 'POST' }),

createPR: (id: string) =>
  request<{ url: string }>(`/tasks/${id}/create-pr`, { method: 'POST' }),
```

And on the server, a successful merge or PR creation will clean up the worktree:

```typescript
router.post('/:id/merge-local', asyncHandler(async (req, res) => {
  const result = await agentManager.mergeLocal(task);
  if (task.worktreePath) {
    try { agentManager.removeWorktree(task); } catch {}
    await repo.update(id, { worktreePath: undefined });
  }
  res.json(result);
}));
```

That cleanup step matters more than it sounds like it should. Agent workflows get messy fast if you don't aggressively clean up temp state.

## What I'd Actually Use This For

If I were using this day to day, here are the kinds of tasks I'd hand it:

- small UI fixes across a React app
- refactors that can be split into parallel child tasks
- test cleanup work
- doc and README improvements across a repo
- repetitive code updates with clear acceptance criteria

What I would **not** do is throw a vague "make the architecture better" card at it and hope for the best. That's how you end up reviewing chaos.

Agent boards work best when the task is concrete, the repo path is clear, and the human still owns the review step.

That's also why the board's final columns matter. **Review** is not optional theater. It's the point where you decide whether the agent actually did something useful or just stayed busy in public.

## Try This Yourself

If you want to run AI Agent Board locally, here's the quick start from the repo:

```bash
git clone https://github.com/DanWahlin/ai-agent-board.git
cd ai-agent-board
npm install
npm run dev
```

That starts the server and client together. Then open `http://localhost:8081`.

You'll need at least one authenticated agent CLI on your machine. The board can detect available providers at startup, so you don't have to wire them all up just to get going.

If you want to create a task group through the API, the payload looks like this:

```json
{
  "title": "Refactor settings area",
  "repoPath": "~/projects/my-app",
  "baseBranch": "main",
  "maxConcurrency": 2,
  "children": [
    {
      "title": "Update settings form validation",
      "agentType": "copilot",
      "useWorktree": true
    },
    {
      "title": "Add tests for settings API",
      "agentType": "claude",
      "useWorktree": true
    }
  ],
  "autoRun": true
}
```

That's a pretty good summary of the whole philosophy: define real work, route it to the right agent, isolate it, stream it, then review the result.

I think more developer tools are going to move in this direction. Not because boards are trendy, but because agent workflows need state, visibility, and git-native execution if they're going to be useful outside of a demo.

If you want agents to do real work, give them a real workflow. A card, a repo, a branch, a review step, and a cleanup path. Everything else is just chat with better lighting.
