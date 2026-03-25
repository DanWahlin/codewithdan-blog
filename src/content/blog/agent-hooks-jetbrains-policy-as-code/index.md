---
title: "Agent Hooks in JetBrains: Policy as Code for Your AI Coding Agent"
date: 2026-03-25
draft: true
categories:
  - "github-copilot"
  - "jetbrains"
  - "developer-productivity"
tags:
  - "github-copilot"
  - "jetbrains"
  - "agent-hooks"
  - "policy-as-code"
  - "devops"
coverImage: "cover.webp"
series: "GitHub Copilot"
seriesOrder: 1
---

You've got your AI coding agent running in your IDE. It can write code, run tests, create branches, and even file PRs. But here's the thing: it's your team's code. Your team's rules. And right now, the agent has no idea what those rules are.

Sure, you've got AGENTS.md and CLAUDE.md files for instructions. But that's telling the agent what to do, not what to forbid. You need a way to enforce team policy mid-run. Block certain tools, run linting checks before commits, enforce branch naming conventions. This is where agent hooks come in.

GitHub Copilot for JetBrains just dropped agent hooks into public preview. This is the feature teams have been asking for without realizing it exists.

## What Are Agent Hooks

Hooks let you run custom shell commands at key points during an agent session. We're talking session start, session end, before and after tool use, when a user submits a prompt, and when something goes wrong.

The hooks live in `.github/hooks/hooks.json` in your repository. The file must be on your default branch to be picked up.

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [...],
    "sessionEnd": [...],
    "userPromptSubmitted": [...],
    "preToolUse": [...],
    "postToolUse": [...],
    "errorOccurred": [...]
  }
}
```

Each hook runs a bash or PowerShell command you specify. The real magic is that these scripts receive JSON input about what's happening in the agent session. That means you can inspect what's about to happen and decide what to do about it.

## A Real-World Example

Let's say you want to block the agent from running git commands directly in the main branch. Here's a preToolUse hook that checks the tool being called and the branch:

```bash
#!/bin/bash
# block-main-branch.sh - prevent git pushes to main
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName')
TOOL_ARGS=$(echo "$INPUT" | jq -r '.toolArgs')

# Only care about bash tool
if [ "$TOOL_NAME" != "bash" ]; then
  exit 0
fi

# Check if this is a git push to main
COMMAND=$(echo "$TOOL_ARGS" | jq -r '.command')
if echo "$COMMAND" | grep -qE "git.*push.*main|git.*push.*origin.*main"; then
  echo '{"error": "Cannot push to main branch directly. Use PR workflow."}' >&2
  exit 1
fi

exit 0
```

Now wire it up in your hooks.json:

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "bash": "./scripts/block-main-branch.sh",
        "cwd": ".",
        "timeoutSec": 10
      }
    ]
  }
}
```

If the agent tries to push to main, the hook blocks it and returns an error. The agent sees that error and can react appropriately. This is policy as code, and it actually runs during the agent's work.

## Practical Hooks You Can Use Today

Here are some hooks that don't require much imagination because every team needs them:

### Enforce Branch Naming

The agent creates branches. Sometimes they're named things like "fix-123" when your team needs "feat/JIRA-123-description". Hook that:

```json
"preToolUse": [
  {
    "type": "command",
    "bash": "./scripts/validate-branch-name.sh",
    "timeoutSec": 5
  }
]
```

The script checks if `toolName` is "create_branch" and validates the branch name against your team's convention.

### Run Linting Before File Writes

You want every file that hits disk to pass your linting rules. Use a postToolUse hook on the "replace_string_in_file" tool:

```json
"postToolUse": [
  {
    "type": "command",
    "bash": "./scripts/lint-on-save.sh",
    "cwd": ".",
    "timeoutSec": 30
  }
]
```

The hook receives the file path in its input, runs your linter, and reports back. If linting fails, the agent knows not to proceed.

### Log Every Prompt for Audit

Your team might need to know what questions developers are asking the agent. Hook userPromptSubmitted:

```json
"userPromptSubmitted": [
  {
    "type": "command",
    "bash": "./scripts/log-prompt.sh",
    "env": {
      "LOG_LEVEL": "INFO"
    }
  }
]
```

Write the prompt to a file, send it to your logging system, or trigger CI pipeline analytics. You decide.

### Session Auditing

Want to know when agents start and end, how long they ran, and what they did? Hook sessionStart and sessionEnd:

```json
"sessionStart": [
  {
    "type": "command",
    "bash": "echo \"Session started: $(date)\" >> logs/agent-sessions.log"
  }
],
"sessionEnd": [
  {
    "type": "command",
    "bash": "echo \"Session ended: $(date)\" >> logs/agent-sessions.log"
  }
]
```

## Getting Started

1. Create a `.github/hooks/` folder in your repository
2. Add your `hooks.json` file with at least one hook
3. Commit it to the default branch

The hooks won't run in preview until your admin enables Editor preview features ( Copilot Business or Enterprise).

## Debugging Your Hooks

The docs have solid debugging tips: enable verbose logging with `set -x` in your bash scripts, test locally by piping sample input:

```bash
echo '{"timestamp":1704614400000,"cwd":"/tmp","toolName":"bash","toolArgs":{"command":"ls"}}' | ./my-hook.sh
```

Validate your JSON output with `jq -c` to ensure it's valid and on a single line.

## Why This Matters

This is the missing piece between "agent can do anything" and "agent follows team rules." Before hooks, you had two options: trust the agent blindly or don't use it. Now you can impose the same constraints you'd put on a human teammate.

The agent doesn't read your team's culture. It doesn't know that main is protected or that branch names need JIRA prefixes. But hooks let you teach it. That's the policy as code movement, and it's finally landing in the IDE.

---

Try adding one hook this week. Start small. Maybe just log what prompts are being submitted. Once you see the data, you'll find more uses for it. And if you're on Copilot Business or Enterprise, tell your admin to enable the preview. This is worth trying.