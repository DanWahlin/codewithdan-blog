---
title: "GitHub Will Train on Your Copilot Data Starting April 24: What Actually Changed"
date: 2026-04-01
draft: true
categories:
  - "ai"
  - "github-copilot"
tags:
  - "github-copilot"
  - "privacy"
  - "ai-training"
  - "developer-tools"
coverImage: "cover.webp"
---

On March 25, GitHub [announced](https://github.blog/news-insights/company-news/updates-to-github-copilot-interaction-data-usage-policy/) that starting April 24, interaction data from Copilot Free, Pro, and Pro+ users will be used to train AI models by default. If you haven't heard yet, you've got about three weeks to decide what to do. If you have heard, you've probably seen the range of reactions: from "this was always the deal" to "they're stealing my code."

The reality is somewhere in between, and it's worth spending five minutes understanding what actually changed before you react.

## Who This Affects (and Who It Doesn't)

Let's start with the easy part. **Copilot Business and Enterprise users: you're not affected.** Your agreements explicitly prohibit GitHub from using interaction data for model training. Nothing changed for you.

**Students and teachers** who access Copilot Pro for free are also excluded.

This applies to individual users on **Free, Pro, and Pro+** plans. That's a significant number of developers, including plenty of folks who use Copilot on side projects, open-source work, or personal repos.

## What Data Are We Talking About?

Here's where it gets nuanced. GitHub is collecting **interaction data**, not your repositories at rest. That distinction matters.

When you have the setting enabled, GitHub may collect:

- **Inputs you send to Copilot** (prompts, code snippets shown to the model)
- **Outputs you accept or modify** (the suggestions you keep)
- **Code context around your cursor** (what Copilot saw when generating a suggestion)
- **Comments and documentation you write**
- **File names, repo structure, and navigation patterns**
- **Feature interactions** (chat, inline suggestions, thumbs up/down)

What they're *not* collecting for training:

- Content from your private repos **at rest** (just sitting in GitHub, untouched)
- Anything from Business or Enterprise accounts
- Data from users who opt out

That "at rest" phrase is deliberate, and it's the part that trips people up. Copilot *does* process code from your private repos when you're actively using it. That's how it works: it reads your code to give you relevant suggestions. The new policy means that interaction data, the back-and-forth between you and Copilot during active sessions, can now be used for training.

Think of it this way: your private repo sitting in GitHub is untouched. But the moment you open a file and Copilot generates a suggestion based on it, that interaction (what it saw, what it suggested, whether you accepted it) is in scope.

## How to Opt Out

If you want out, it takes about 30 seconds:

1. Go to [github.com/settings/copilot](https://github.com/settings/copilot)
2. Find the **Privacy** section
3. Toggle off the setting that allows GitHub to use your data for product improvements

If you previously opted out of data collection for product improvements, **your preference was preserved**. You don't need to do anything. GitHub kept your existing choice, which is the right call.

## Should You Actually Opt Out?

Here's my take. This is a reasonable tradeoff for most individual developers, and I think the panic is overblown. Here's why:

**The data stays in-house.** GitHub and Microsoft personnel working on AI model development can access it. Service providers who help with training are bound by contracts. Third-party model providers don't get it. Your code snippets aren't being handed to competitors.

**Real-world data makes better models.** GitHub's blog post mentions that training on Microsoft employee interaction data already improved suggestion acceptance rates across multiple languages. That tracks with how ML works: models trained on synthetic or curated data hit a ceiling. Real usage patterns from real codebases push past it.

**The industry norm is moving here.** Most AI-powered tools, from writing assistants to code completion, use interaction data to improve their models. GitHub is being more transparent about it than many competitors, and the opt-out is straightforward.

That said, there are valid reasons to opt out:

- **You work on proprietary code in personal repos** and your employer's IP policy doesn't allow this kind of data sharing
- **You contribute to projects with strict licensing** that could create complications
- **You just don't want to participate**, and that's a perfectly fine reason on its own

The key question isn't "is this evil?" It's "does this matter for my specific situation?" For most developers writing side projects, learning new frameworks, or contributing to open source, the answer is probably no. For someone writing proprietary algorithms in a personal repo that their employer technically owns, the answer might be different.

## What I'd Actually Do

If I'm using Copilot on personal projects and open-source work, I'd leave it enabled. The model gets better, my suggestions get better. Fair trade.

If I'm working on anything where data sharing could create a licensing or IP question, I'd opt out as a precaution. Not because I think GitHub is going to do something nefarious, but because "I opted out" is a much simpler conversation than explaining the nuances of interaction data vs. data at rest to a legal team.

## The Bigger Picture

This is the third major AI data policy conversation in the last year, and it won't be the last. The pattern is consistent: companies need real-world data to improve models, users want control over how their data is used, and the answer keeps landing on opt-out mechanisms.

What matters more than any individual policy change is whether the company gives you a clear, accessible way to say no. GitHub does. The setting exists, it's easy to find, and previous preferences are preserved. That's the baseline every AI tool should meet.

You've got until April 24. Take two minutes, check your settings, make a decision, and move on. The sky isn't falling, but informed choices beat default ones.

**Links:**
- [GitHub's official announcement](https://github.blog/news-insights/company-news/updates-to-github-copilot-interaction-data-usage-policy/)
- [Privacy settings](https://github.com/settings/copilot)
- [Community FAQ and discussion](https://github.com/orgs/community/discussions/188488)
