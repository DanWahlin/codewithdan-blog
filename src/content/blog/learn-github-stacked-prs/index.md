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

[GitHub stacked pull requests](https://docs.github.com/en/pull-requests/get-started/about-stacked-prs) solve that tradeoff. They let you split a feature into smaller, dependent pull requests while continuing work on the branches above them. I created the **[Learn GitHub Stacked PRs](https://github.com/DanWahlin/learn-github-stacked-prs)** repo because I wanted a concrete, hands-on example that shows the review boundaries and complete workflow, not just another diagram explaining the idea.

To make that useful whether you're learning on your own or teaching a team, the repo includes:

- A [live three-PR stack walkthrough](https://github.com/DanWahlin/learn-github-stacked-prs/blob/main/docs/review-walkthrough.md) that shows the model, validation, and API review boundaries
- A complete [GitHub CLI walkthrough](https://github.com/DanWahlin/learn-github-stacked-prs/blob/main/docs/build-the-stack.md) for building and submitting the stack yourself
- A 55-minute [AI coding agent workshop](https://github.com/DanWahlin/learn-github-stacked-prs/blob/main/docs/workshop/README.md) with planning, implementation, verification, and approval checkpoints
- A downloadable [PowerPoint deck](https://github.com/DanWahlin/learn-github-stacked-prs/raw/refs/heads/main/github-stacked-prs.pptx) and [facilitator guide](https://github.com/DanWahlin/learn-github-stacked-prs/blob/main/docs/facilitator-guide.md) for team training
- A [`gh stack` cheat sheet](https://github.com/DanWahlin/learn-github-stacked-prs/blob/main/docs/cheat-sheet.md), [troubleshooting guide](https://github.com/DanWahlin/learn-github-stacked-prs/blob/main/docs/troubleshooting.md), and [glossary](https://github.com/DanWahlin/learn-github-stacked-prs/blob/main/docs/glossary.md) for quick reference

## One Feature, Three Focused Pull Requests

A stack is a linear chain of dependent pull requests in the same repository. The bottom pull request targets the trunk branch (`main` in this example), and each pull request above it targets the branch directly below it.

The repo uses a small task API as the running example:

![One stack with model, validation, and API pull requests above main](/images/blog/learn-github-stacked-prs/stack-anatomy.webp)

The stack has three layers:

1. `tasks/model` adds a tested task model and targets `main`
2. `tasks/validation` adds title validation and targets `tasks/model`
3. `tasks/api` adds `POST /tasks` and targets `tasks/validation`

Each pull request shows only the code introduced by that layer. Reviewers can focus on the model contract first, validation second, and the HTTP API last. Meanwhile, development can continue on the dependent branches instead of waiting for each pull request to land.

The repo keeps [the model PR](https://github.com/DanWahlin/learn-github-stacked-prs/pull/21), [the validation PR](https://github.com/DanWahlin/learn-github-stacked-prs/pull/22), and [the API PR](https://github.com/DanWahlin/learn-github-stacked-prs/pull/23) open and ready for review so you can inspect the complete stack.

Start with each PR's **Files changed** tab. The model PR changes two files, validation changes two files relative to the model branch, and the API layer changes three relative to validation. Seeing those small diffs makes the review boundaries easier to understand than another diagram would.

The [training-resource workflow](https://github.com/DanWahlin/learn-github-stacked-prs/actions/workflows/verify-training-resource.yml) checks that the live PR boundaries still match the documentation and runs the tests on every branch in the example. That keeps the stack and workshop in sync.

Those review boundaries also determine how the stack can merge. You can land the lowest unmerged pull request by itself or select a higher pull request to merge it and every unmerged layer below it. You can't merge a middle layer by itself while leaving its dependencies open. That rule keeps the chain valid.

## Build One Green Layer at a Time

Once the review boundaries make sense, the next step is to build the same stack yourself. The repo uses GitHub's [`gh stack`](https://github.com/github/gh-stack) extension for GitHub CLI. You'll need Git 2.20 or newer, Node.js 20 or newer, and an authenticated GitHub CLI 2.90 or newer. Install the extension once if `gh stack --version` isn't available:

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

Before submitting, the walkthrough has you inspect the branch order, changed files, and test results. Check the pull requests on GitHub afterward too. A successful command doesn't guarantee that each PR targets the right branch or contains the diff you expected.

## Build in a Disposable Workshop Repo

Practice those commands somewhere you can safely rebase, synchronize, and merge. The training repo includes a cross-platform Node.js script that creates an isolated learner repository in one of two modes:

- **Build mode** creates the scaffold so you can build the stack yourself
- **Ready mode** creates the finished three-PR stack so you can inspect it or reset a workshop

```bash
git clone https://github.com/DanWahlin/learn-github-stacked-prs.git
node learn-github-stacked-prs/scripts/create-workshop-copy.mjs \
  YOUR-OWNER/my-stacked-prs-workshop \
  --build \
  --private
```

I recommend using the script instead of forking the repo. A fork doesn't copy pull requests, reviews, checks, or the GitHub stack relationship. The workshop also needs all of the branches in one isolated repository so you can safely submit, rebase, synchronize, and eventually merge your own stack.

## Use an AI Coding Agent Without Giving Up the Boundaries

With an isolated repo in place, you can build each layer manually or hand the implementation to an AI coding agent. The hands-on workshop supports [GitHub Copilot](https://github.com/features/copilot), [GitHub Copilot CLI](https://github.com/features/copilot/cli), and the [GitHub Copilot app](https://github.com/features/ai/github-app). Other coding agents can participate if they load the repo instructions and can run Git, GitHub CLI, tests, and `gh stack`.

The root [`AGENTS.md`](https://github.com/DanWahlin/learn-github-stacked-prs/blob/main/AGENTS.md) file defines the rules that matter for this specific repo: branch order, layer responsibilities, required tests, approval gates, and the evidence an agent must return before remote operations. GitHub also provides an official `gh-stack` agent skill with reusable command guidance.

The workshop starts by asking the agent to plan the stack without changing files. You review the proposed trunk, branch order, responsibilities, exclusions, tests, and commands. Only then does the agent build one layer at a time. It stops again before pushing or submitting anything.

I added those approval points to keep the stack from drifting. An agent working on the API branch might decide the model also needs a change and put both changes in the same pull request. The tests may still pass, but reviewers now have to sort out code that belongs in two different layers.

## Lower-Layer Feedback Has a Cost

Those approval gates become especially important when review feedback changes a lower branch. If the model contract changes, you have to carry that update through every branch above it.

![Lower-layer feedback moving through rebase, testing, approval, and live PR verification](/images/blog/learn-github-stacked-prs/feedback-cascade.webp)

The workshop uses a specific exercise: add `priority: 'normal'` to every task in the model layer. You update and test the bottom branch, then cascade the change through the dependent branches. After that, you run the full test suite, approve the remote update, and inspect every live pull request again.

For that reason, the agent must ask before running `gh stack rebase`, `gh stack push`, `gh stack sync`, or `gh stack merge`. Those commands can rewrite commits or update the remote stack. The instructions also prohibit a plain force push.

## When a Stack Is the Wrong Tool

That cascade cost is the main reason not to use a stack by default. Use one when you have two or more reviewable changes that form one linear dependency chain in the same repository.

A normal pull request is a better fit for one isolated change. Independent authentication and billing work should be separate normal pull requests, or separate stacks if each feature has its own dependent layers. GitHub stacks are linear, so a branching dependency graph is a sign that the work needs to be split differently.

Each layer should have a clear purpose that a reviewer can explain. If formatting changes hide the functional work or the layer doesn't have a clear review boundary, reorganize the stack before submitting it.

## Try the Repo

If this workflow fits your feature, start with the live stack. When you're ready to try the commands, create a private learner copy and build one yourself.

**[Explore the Learn GitHub Stacked PRs repo](https://github.com/DanWahlin/learn-github-stacked-prs)**

Stacked PRs add work when a lower branch changes, so I wouldn't use them for every feature. But when several small changes depend on each other, they let reviewers focus on one decision at a time without forcing development to stop after each pull request.

## Official References

- [About stacked pull requests](https://docs.github.com/en/pull-requests/get-started/about-stacked-prs)
- [`gh stack` CLI command reference](https://docs.github.com/en/pull-requests/reference/stacked-prs-cli-commands)
- [Stack AI-generated code in pull requests](https://docs.github.com/en/copilot/tutorials/stack-ai-generated-code-in-pull-requests)
