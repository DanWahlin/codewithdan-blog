---
title: "GitHub Stacked PRs: Smaller Reviews Without Slowing Development"
date: 2026-08-04
draft: true
categories:
  - "github"
  - "developer-tools"
  - "ai"
tags:
  - "stacked-pull-requests"
  - "github-cli"
  - "gh-stack"
  - "github-copilot"
  - "ai-agents"
coverImage: "cover.webp"
---

![GitHub Stacked PRs arranged as three connected, reviewable layers](/images/blog/learn-github-stacked-prs/cover.webp)

Say you're building an API that needs a model, validation, and an endpoint. Putting everything into one pull request keeps you moving, but the reviewer has to untangle all three concerns at once. Splitting the work into separate pull requests makes each review easier, but now you have to wait for one to merge before starting the next dependent change.

I've never liked either option.

[GitHub stacked pull requests](https://docs.github.com/en/pull-requests/get-started/about-stacked-prs) give you a third path: split dependent work into small pull requests while continuing to build the layers above them. I created the **[Learn GitHub Stacked PRs](https://github.com/DanWahlin/learn-github-stacked-prs)** repo to make that workflow concrete. It includes a live three-PR stack, a complete GitHub CLI walkthrough, an AI coding agent workshop, a PowerPoint deck, and facilitator resources.

## One Feature, Three Focused Pull Requests

A stack is a linear chain of dependent pull requests in the same repository. The bottom pull request targets the trunk branch, and each pull request above it targets the branch directly below it.

The repo uses a small task API as the running example:

![One stack with model, validation, and API pull requests above main](/images/blog/learn-github-stacked-prs/stack-anatomy.webp)

The stack has three layers:

1. `tasks/model` adds a tested task model and targets `main`
2. `tasks/validation` adds title validation and targets `tasks/model`
3. `tasks/api` adds `POST /tasks` and targets `tasks/validation`

Each pull request shows only the code introduced by that layer. Reviewers can focus on the model contract first, validation second, and the HTTP API last. Meanwhile, development can continue on the dependent branches instead of waiting for each pull request to land.

The public repo keeps this example open as a live stack. You can inspect [the model PR](https://github.com/DanWahlin/learn-github-stacked-prs/pull/21), [the validation PR](https://github.com/DanWahlin/learn-github-stacked-prs/pull/22), and [the API PR](https://github.com/DanWahlin/learn-github-stacked-prs/pull/23). At the time I wrote this, all three were open, ready for review, and based on the intended branch below them.

When it's time to merge, you can land the lowest unmerged pull request by itself or select a higher pull request to merge it and every unmerged layer below it. You can't merge a middle layer by itself while leaving its dependencies open. That rule keeps the chain valid.

## Learn It at Your Own Pace

I wanted the repo to work whether you have five minutes or an hour. The README gives you several paths:

- Read the core concept and decision guide in about five minutes
- Review the live stack in about 15 minutes
- Build the stack with GitHub CLI in 45 to 60 minutes
- Run the AI coding agent workshop in about 55 minutes
- Teach the material with the PowerPoint deck and facilitator guide

There is also a [`gh stack` cheat sheet](https://github.com/DanWahlin/learn-github-stacked-prs/blob/main/docs/cheat-sheet.md), a [troubleshooting guide](https://github.com/DanWahlin/learn-github-stacked-prs/blob/main/docs/troubleshooting.md), and a [glossary](https://github.com/DanWahlin/learn-github-stacked-prs/blob/main/docs/glossary.md) for later reference.

The live stack matters because stacked PRs are easier to understand when you can click through the actual **Files changed** tabs. The model PR changes two files. The validation PR changes two files relative to the model branch. The API PR changes three files relative to validation. You see the review boundary rather than reading another abstract diagram and hoping it sticks.

## Build One Green Layer at a Time

The repo uses GitHub's [`gh stack`](https://github.com/github/gh-stack) extension for GitHub CLI. You'll need Git 2.20 or newer, Node.js 20 or newer, and an authenticated GitHub CLI 2.90 or newer. Install the extension once if `gh stack --version` isn't available:

```bash
gh extension install github/gh-stack
```

The command sequence itself is short:

```bash
gh stack init --base main tasks/model
# Add the model implementation, tests, and commit

gh stack add tasks/validation
# Add validation, tests, and commit

gh stack add tasks/api
# Add the API, tests, and commit

gh stack view --json
gh stack submit --auto --open
```

Those commands are the easy part. The habit I care about is what happens inside each layer:

![Create, implement and test, inspect, and commit each stack layer](/images/blog/learn-github-stacked-prs/layer-build-loop.webp)

Every branch contains the implementation and tests for the behavior it introduces. The model branch has one passing test. Validation builds on it and has four cumulative passing tests. The API layer finishes with six. A tests-only bottom PR that stays red until an implementation arrives above it would defeat the point of a focused, independently reviewable layer.

Before submitting, the walkthrough has you inspect the stack, branch ancestry, changed files, and test results. After submitting, you inspect the live pull requests on GitHub. A successful CLI exit doesn't prove that every base, head, diff, draft state, and stack relationship is correct.

## Build in a Disposable Workshop Repo

The training repo includes a cross-platform Node.js script that creates an isolated learner repository. It supports two modes:

- **Build mode** creates the scaffold so you can build the stack yourself
- **Ready mode** recreates the complete three-PR stack for facilitator practice, a shortened session, or recovery

```bash
git clone https://github.com/DanWahlin/learn-github-stacked-prs.git
node learn-github-stacked-prs/scripts/create-workshop-copy.mjs \
  YOUR-OWNER/my-stacked-prs-workshop \
  --build \
  --private
```

I recommend using the script instead of forking the repo. A fork doesn't copy pull requests, reviews, checks, or the GitHub stack relationship. The workshop also needs all of the branches in one isolated repository so you can safely submit, rebase, synchronize, and eventually merge your own stack.

## Use an AI Coding Agent Without Giving Up the Boundaries

The repo also includes a hands-on workshop for [GitHub Copilot](https://github.com/features/copilot), [GitHub Copilot CLI](https://github.com/features/copilot/cli), and the [GitHub Copilot app](https://github.com/features/ai/github-app). Other coding agents can participate if they load the repo instructions and can run Git, GitHub CLI, tests, and `gh stack`.

The root [`AGENTS.md`](https://github.com/DanWahlin/learn-github-stacked-prs/blob/main/AGENTS.md) file defines the rules that matter for this specific repo: branch order, layer responsibilities, required tests, approval gates, and the evidence an agent must return before remote operations. GitHub also provides an official `gh-stack` agent skill with reusable command guidance.

The workshop starts by asking the agent to plan the stack without changing files. You review the proposed trunk, branch order, responsibilities, exclusions, tests, and commands. Only then does the agent build one layer at a time. It stops again before pushing or submitting anything.

I don't want an agent deciding those boundaries as it goes. It can implement and test the changes, but the human still approves the architecture, history rewrites, publication, synchronization, and merges. Otherwise, an agent working on the API branch may discover that the model needs a change and quietly put the model code in the API pull request. The code might work, but the review boundary is now wrong.

## Lower-Layer Feedback Has a Cost

The biggest tradeoff with stacked PRs appears when feedback changes a lower layer. If the model contract changes, every branch above it depends on the rewritten history.

![Lower-layer feedback moving through rebase, testing, approval, and live PR verification](/images/blog/learn-github-stacked-prs/feedback-cascade.webp)

The workshop uses a specific exercise: add `priority: 'normal'` to every task in the model layer. You update and test the bottom branch, then cascade the change through the dependent branches. After that, you run the full test suite, approve the remote update, and inspect every live pull request again.

Because those commands can rewrite commit IDs or change remote state, the repo puts approval gates around `gh stack rebase`, `gh stack push`, `gh stack sync`, and `gh stack merge` when an agent is involved. It also tells agents never to use a plain force push.

## When a Stack Is the Wrong Tool

Not every set of pull requests should become a stack. Use one when you have two or more reviewable changes that form one linear dependency chain in the same repository.

A normal pull request is a better fit for one isolated change. Independent authentication and billing work should be separate normal pull requests, or separate stacks if each feature has its own dependent layers. GitHub stacks are linear, so a branching dependency graph is a sign that the work needs to be split differently.

There's also a judgment call around review cost. If nobody can explain the acceptance criterion for one layer, or if formatting churn hides the functional change, the stack needs to be restructured. Smaller pull requests only help when the boundaries make sense.

## Try the Repo

If you only have five minutes, read the explanation and decision guide. If you have more time, inspect the three open pull requests and create a private learner copy before running the commands.

**[Explore the Learn GitHub Stacked PRs repo](https://github.com/DanWahlin/learn-github-stacked-prs)**

Stacked PRs add work when a lower branch changes, so I wouldn't use them for every feature. But when several small changes depend on each other, they let reviewers focus on one decision at a time without forcing development to stop after each pull request.

## Resources

- [Learn GitHub Stacked PRs](https://github.com/DanWahlin/learn-github-stacked-prs)
- [About stacked pull requests](https://docs.github.com/en/pull-requests/get-started/about-stacked-prs)
- [`gh stack` CLI command reference](https://docs.github.com/en/pull-requests/reference/stacked-prs-cli-commands)
- [Stack AI-generated code in pull requests](https://docs.github.com/en/copilot/tutorials/stack-ai-generated-code-in-pull-requests)
