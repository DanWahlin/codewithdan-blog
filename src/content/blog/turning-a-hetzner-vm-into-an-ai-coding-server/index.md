---
title: "How I Turned a VPS into an Always-On AI Coding Server"
date: 2026-07-14
draft: false
categories:
  - "ai"
  - "developer-tools"
  - "devops"
tags:
  - "hetzner"
  - "hermes-agent"
  - "openclaw"
  - "tailscale"
  - "cloudflare-tunnel"
  - "telegram"
  - "github-copilot-cli"
  - "claude-code"
  - "codex"
  - "grok-build"
coverImage: "cover.webp"
---

![Always-on AI coding VPS controlled from Telegram](/images/blog/turning-a-hetzner-vm-into-an-ai-coding-server/cover.webp)

Have you ever wanted an AI coding agent to keep working after you close your laptop, or to reach it from your phone while you're away? That's what pushed me to turn a virtual private server (VPS) into an always-on coding environment.

A VPS is a cloud-hosted virtual machine (VM) that you manage. Mine has become part development server, part agent host, and part small private cloud. It also taught me a few lessons about permissions, process ownership, and how quickly an architecture diagram can become fiction.

I've been running this setup on a [Hetzner VPS](https://www.hetzner.com/cloud/) for over 5 months now. It hosts [Hermes Agent](https://hermes-agent.nousresearch.com/docs), [OpenClaw](https://docs.openclaw.ai/), GitHub Copilot CLI, Claude Code, Codex, Grok Build, project-specific Telegram bots, databases, containers, web apps, and supporting services. I'll walk through how the system evolved, what it costs, how the access paths work, what I've built with it, and what I'd change if I started over.

## The VPS I'm Using

My VPS is a [Hetzner CAX41](https://www.hetzner.com/cloud/cost-optimized) cloud server in the Nuremberg region. The underlying VM is an ARM64 machine based on shared Ampere processors. I did a lot of research on various VPS options and this one ended up being exactly what I needed for a relatively cheap monthly price. I could've gone even cheaper, but if my intial experiment panned out (which it did), I didn't want to have to worry about moving everything to a more powerful VM in the future.

> **Note:** Those of you that know I work at Microsoft may wonder why I didn't go with a VM on Azure. I explored that option first actually and found a lot of powerful VM options to chose from. But, in the end I wanted a VM that was super cheap yet powerful enough to run Hermes, OpenClaw, and my coding agents. The Hetzner VM fit the bill. If I end up wanting a more powerful VM I'll look to Azure since I've had success running more robust VMs there in the past, but my tiny, cheap, and mighty VM on Hetzner is working fine for now.

| Resource | VM configuration |
|---|---:|
| Architecture | ARM64 (`aarch64`) |
| Shared vCPUs | 16 |
| Memory | 32 GB advertised, about 30 GiB visible to Linux |
| Storage | 320 GB advertised, about 301 GiB visible to Linux |
| Operating system | Ubuntu 24.04 LTS |
| Region | Nuremberg, Germany |

ARM64 has worked surprisingly well and exceeded my expectations. It's cost-effective, performance has been solid, and every major tool I use has an ARM64-compatible path. The main caveat is third-party binaries and container images: "runs on Linux" doesn't always mean "runs on your Linux architecture." The VPS doesn't have a GPU, so the coding agents call cloud-hosted models through my existing subscriptions. 

I originally treated the VPS as a **$36-per-month** experiment (the monthly price has risen a little since I set things up). AI models, coding agent subscriptions, and domain costs are separate of course, but I already had those for my normal day-to-day development work.

After using it for a few weeks starting back in Febuary 2026, the VPS earned a permanent spot in my workflow. It's now a daily driver for work and personal projects that I can easily access from my laptop, tablet, or phone. The majority of my work projects are publicly accessible - typically repos on [github.com](https://github.com) - which works well for the VPS scenario. In cases where I need to access internal resources I work directly on my work machine.

### Examples of How I'm Using It

I use the VPS all the time from my office or whenever I'm out and have a few minutes to get something done. It really proved its value during a recent trip to Disney World.

While waiting in line for Big Thunder Mountain Railroad, I had an idea for a new ZenSquirrel feature (an app I've been building out for awhile now). Through Telegram, I asked a coding agent on the VPS to use an [AI wireframe skill](https://github.com/paperclipai/paperclip/tree/master/packages/skills-catalog/catalog/bundled/product/wireframe) to explore the idea. By the time I got on the ride, the initial wireframes were ready to go.

My wife reviewed them while we were still in line and was genuinely impressed that I could do all of this from my phone. She's not easily impressed 😀. Here's the seven-screen wireframe summary the agent created. While not shown in the image, it also created full wireframes with details about API calls and more for each of the individual screens.

![Seven-screen Plan My Day wireframe flow created from the VPS](/images/blog/turning-a-hetzner-vm-into-an-ai-coding-server/plan-my-day-wireframe-flow.webp)

Those wireframes didn't remain a throwaway prototype. From Telegram, I used a coding agent on the VPS to turn them into a complete Plan My Day feature in the app. The implementation also handles recurring plans, reminders, time zones, completion tracking, streaks, and morning notifications. It touched 84 files and added 101 API tests, along with client and end-to-end test coverage.

I didn't trust the first working version just because it looked good. A multi-agent review produced 29 verified findings, including problems with daylight saving time, the app's 3 AM day boundary, empty plans counting as missed days, and completion events not being recorded for every content type. The agents fixed those findings and reran the test suites before deployment.

That's just one of many scenarios where the VPS stopped feeling like a remote terminal and started feeling like a small development team I could reach from my phone. I can build from any location where I have connectivity without having to keep my laptop open and running.

Now that you've heard a few stories around how I'm using the VPS (there are many more), let's walk through how I got started with it.

## Phase 1: OpenClaw and the First Agent Workflows

[OpenClaw](https://openclaw.ai) was the original agent gateway I installed on the VPS. It was the "hot" technology everyone was talking about at the time and I needed a way try it out in a sandbox environment that was completely separate from my work machine. After doing some research, I decided that the Hetzner VPS was a perfect option since it was cheap and completely isolated. 

After getting OpenClaw installed, I ended up using it for much more than chat. It became the first automation layer for:

- Telegram conversations
- Scheduled research agents
- Blog and social posts "skeleton" draft generation
- Copy editing and fact verification
- Content review
- Health checks and housekeeping
- Copilot CLI, Claude Code, and Codex as coding workers that OpenClaw could orchestrate

The early content pipeline used a filesystem-based handoff model:

```text
Research -> Blog -> Social -> Copy Editor -> Verifier -> Review
```

Agents wrote shared state, status files, handoff JSON, and Markdown drafts to a common workspace. It wasn't glamorous, but it was easy to inspect and debug and provided a nice starting point for ideas. A file-based workflow also gave different agents a neutral way to exchange work without introducing another service.

Over time, I moved the content workflow out of the OpenClaw-specific workspace and into an agent-neutral directory:

```text
~/content-pipeline
```

That was an important design change. The workflow can now be called by any agent without pretending one runtime owns it.

While I don't use it as often nowadays, OpenClaw still has a role on the VPS. It remains installed with its own gateway, Telegram channel, sessions, memory, and dashboard. I treat it as a parallel agent runtime rather than the center of every workflow.

## Phase 2: Making Hermes the Primary Operator

I added [Hermes Agent](https://hermes-agent.nousresearch.com/docs) near the end of March 2026. Initially, I added it just to try it out but quickly saw how stable it was and ended up making it my primary operator on the VPS.

The first job was simple: make Hermes reachable through Telegram and keep its gateway running after I disconnected from SSH. That meant installing a systemd service, fixing service-user permissions, and verifying that the bot survived restarts. Hermes made that easy to do.

Hermes gradually became the primary operator because it combined several things I wanted in one place:

- Telegram and other messaging gateways
- Persistent memory across sessions
- Self-learning and procedural improvement
- Searchable session history
- Reusable skills and runbooks
- Scheduled jobs
- Background subagents
- File, shell, browser, GitHub, and integration tools
- Multiple isolated profiles

Hermes is also useful when another tool on the VPS gets stuck. Telegram bridges occasionally stop responding or leave a stale poller behind, so I ask Hermes to inspect the process tree, repair the service, and verify the result. I also use it for storage cleanup, security updates, and the boring scheduled maintenance that matters but isn't how I want to spend an afternoon. It's become my "go to" resource (my primary operator as mentioned earlier) for resolving issues since it's always available on the VPS.

Support for [multiple profiles in Hermes](https://hermes-agent.nousresearch.com/docs/user-guide/profiles) also turned out to be especially useful. Instead of putting every project and personality into one giant context, I created separate profiles each with their own Telegram bot:
- General/default operations - the generalist profile.
- Work tasks - used for publicly accessible work I'm doing
- ZenSquirrel development - a personal project I've been working on
- X/LinkedIn  - social reading and research

Additional profiles can exist on disk without getting their own always-on gateway. Each profile can have separate memory, skills, Telegram bot, working directory, and behavioral rules. That isolation is much easier to reason about versus having one agent that knows everything and touches everything.

## Phase 3: Installing the Coding Agents

The VPS eventually turned into a shared host for several coding-agent CLIs. 

Here are the main tools installed on the server:

| Tool | Main role |
|---|---|
| Hermes Agent | Persistent operator, Telegram, memory, cron, tools, integrations |
| OpenClaw | Parallel gateway, Telegram, sessions, compatibility workflows |
| GitHub Copilot CLI | GitHub-focused coding and agent workflows |
| Claude Code | Autonomous coding and project work |
| Codex CLI | OpenAI coding agent and implementation work |
| Grok Build CLI | Grok Build coding and review experiments |
| OpenCode | Additional coding-agent harness and model access |
| ACPx | Agent Client Protocol launcher and integration layer |
| GitHub CLI | Repository, issue, pull request, and workflow operations |

Not every tool runs continuously. Most coding agents are better treated as workers that my primary operator starts for a bounded task.

I split them into two roles:

- **Hermes and OpenClaw are operators.** They manage conversations, memory, tools, schedules, and handoffs.
- **Copilot CLI, Claude Code, Codex, Grok, and OpenCode are coding workers.** They inspect repositories, edit files, run tests, and return results.

Trying to make every coding CLI its own always-on general assistant creates duplicated memory, duplicated bots, competing processes, and a lot of operational lint which is why allowing the primary operator to delegate to coding agents is quite helpful.

### Why I Use Multiple Coding Agents

Hermes is my day-to-day operator, but [Copilot CLI](https://github.com/features/copilot/cli) is my go-to coding worker on the VPS. When I'm on my laptop, I usually work through [GitHub Copilot app](https://github.com/features/ai/github-app), but I also push a lot of work up to the VPS through a terminal that's connected via SSH and Tailscale. For larger jobs, Hermes delegates to one or more Copilot CLI instances and checks their results.

I also use Claude Code, Codex, and Grok Build when a different harness or model provides a useful second or third opinion. Different harnesses catch different mistakes, which gives me useful checks and balances. For example, after adding Hermes and OpenClaw attachment support to my [shared agent SDK project](https://github.com/DanWahlin/agent-sdk-core), I asked Copilot CLI to perform a production-readiness review instead of continuing with the builder that wrote the feature. It found a high-severity file-handling problem: the SDK's path check looked safe lexically, but `readFile()` could still follow a symlink outside the permitted working directory.

The follow-up change resolved paths to their canonical filesystem locations before reading them and added regression tests for Hermes and OpenClaw attachments. One agent built the feature, another attacked its assumptions, and the operator required evidence before accepting either answer.

In another case, I used Copilot CLI to audit my [blog](https://blog.codewithdan.com), including its RSS feed, search index, sitemap, and generated social images. Even though hosting the blog on the VPS was working well, the audit showed that GitHub Pages was a better home for the public site for a variety of reasons. I moved deployment to a tag-based GitHub workflow, then verified the custom domain and HTTPS configuration.

Once the new deployment worked, Copilot removed the obsolete VPS infrastructure: the systemd webhook service, its environment file, the GitHub webhook, old Cloudflare Tunnel routes, and the Kubernetes namespace that had hosted the blog. Hermes double-checked the cleanup.

The repository stayed on the VPS for writing and local builds, but the public site no longer depended on it. A useful server shouldn't only help you add infrastructure. Occasionally it should help you delete some too.

The blog uses Markdown rendered by Astro, so I still needed a practical way to edit posts on the VPS. Something that I could use on my laptop, tablet, or phone. So, I had Hermes build a custom Markdown editor and securely expose it through Cloudflare Tunnel. I'm literally using it right now as I type this sentence.

![CodeWithDan content editor displaying the VPS article in preview mode](/images/blog/turning-a-hetzner-vm-into-an-ai-coding-server/content-editor-preview.webp)

I also used the VPS to build a custom Telegram bridge for Grok Build through the Agent Client Protocol (ACP). I already had a bridge for Copilot CLI, so I used that implementation as the foundation.

The resulting TypeScript project handles private pairing, one-owner authorization, a single-poller lock, streamed Telegram drafts, and interactive permission buttons. It also includes secret redaction, health snapshots, cancellation, and a strict environment allowlist for the Grok subprocess.

The implementation added more than 4,000 lines across the bridge, tests, documentation, and a live ACP smoke test. One coding agent built it, another reviewed it, and Hermes made the final go/no-go decision. Once it was ready, I asked Hermes to start it up.

I did all that work from my phone while at Disney World too in between all of the discussions with my family.

### Your VPS Region Can Affect Model Access

The server's location matters for more than latency. Grok Build is installed, but I don't run its Telegram bridge continuously right now because the model I want isn't currently available from this VPS since it's hosted in Germany. xAI's documentation says Grok Build uses Grok 4.5. When I tested it in July 2026, the authenticated CLI catalog still labeled the available `grok-build` route as Grok 4.3, while `grok-build-latest` returned a regional `403` error. The same account can use Grok Build with Grok 4.5 from my laptop, but not from this server in Germany. 

The bottom line: region can affect model availability, so verify the exact model route from the location where the VPS will run before you commit to a provider and region.

## Phase 4: Using Telegram as the Control Plane

Telegram is an interface I use quite often because it works from my phone, tablet, and desktop without exposing a shell directly. You'd be surprised with how much you can get done with it alone.

The VPS uses Telegram in several ways:

1. **Hermes gateways** provide native chat access to separate profiles.
2. **OpenClaw** has its own Telegram channel and agent sessions.
3. **Claude Code** uses the official Telegram plugin in a dedicated service account.
4. **Copilot CLI** has been connected through a session-aware Telegram extension. [I blogged about it here](https://blog.codewithdan.com/using-telegram-with-github-copilot-cli) but now use a custom implementation of the bridge that builds upon the repo I mention in the post.
5. **Grok Build** has a custom Telegram bridge based on the one I use for Copilot CLI.

Telegram isn't just a notification layer in this setup. A securely paired user can ask an agent to inspect files, run commands, edit code, or trigger longer work. That makes the bot a form of remote developer access.

I use a few rules to keep that manageable:

- One bot token has exactly one poller.
- Bots are paired or allowlisted to my Telegram user so that they're locked down.
- Tokens live in mode-`600` files or service environments, never in repositories.
- Separate projects use separate bots and profiles.
- Coding agents don't automatically inherit every Telegram plugin on the machine.
- External publishing and destructive actions still require explicit approval.

The "one token, one poller" rule earned its place. At one point, the custom bridge I built for Grok Build imported a Claude-compatible Telegram plugin and started multiple competing pollers. Besides breaking message delivery, some orphan processes consumed nearly an entire CPU core each. I learned a good lesson fixing that scenario. The fix was to make transport ownership explicit. If a bridge already owns Telegram, the coding-agent subprocess doesn't get to import another Telegram integration. 

## The Network Architecture

The network design separates three different access paths:

- **Telegram** for agent conversations and commands through outbound HTTPS polling.
- **Tailscale** for private operator and administration access. I have it installed on my MacBook and on my Phone so that they can also access the VPS as needed.
- **Cloudflare Tunnel** for selected "public" web applications. Applications that are publicly available but that require authentication. I use Cloudflare Access (part of Cloudflare Zero Trust) for that part.

Telegram doesn't enter through Tailscale or an open inbound port. Hermes, OpenClaw, and the dedicated bridges initiate outbound connections to Telegram's Bot API, then receive messages and send replies over those established connections.

![Always-on AI coding VPS architecture showing Telegram, Tailscale, Cloudflare Tunnel, agent workers, and the Hetzner firewall](/images/blog/turning-a-hetzner-vm-into-an-ai-coding-server/architecture.webp)

### Tailscale for Private Services

[Tailscale Serve](https://tailscale.com/docs/reference/tailscale-cli/serve) gives me HTTPS endpoints that are only reachable inside my tailnet.

I use it for services such as:

- Hermes WebUI - I don't really use this now but it's available if needed
- Private agent API endpoints
- OpenClaw dashboard access
- Short-lived setup and credential handoff pages

A service can stay bound to loopback while Tailscale handles private HTTPS access:

```bash
# Illustrative example
my-service --host 127.0.0.1 --port 8787

tailscale serve --bg --https=8787 http://127.0.0.1:8787
```

At the time of writing, the VPS has four Tailscale Serve HTTPS endpoints. Tailscale is also useful for normal SSH access and local OAuth callback forwarding:

```bash
ssh -L 9090:127.0.0.1:9090 hetzner
```

That lets a browser on my laptop complete an OAuth flow for a CLI running on the VPS without publishing the temporary callback listener.

### Cloudflare Tunnel for Public Apps

[Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/) creates outbound connections from the VPS to Cloudflare. That means I don't need to point a public DNS record directly at an application port. I can setup everything in Cloudflare.

At the time of writing, the tunnel routes eight public hostnames to local services, including:

- ZenSquirrel - a large-scale project I'm working on
- Analytics
- OpenClaw chat
- File delivery
- Voice/AgentMic services I use
- The blog.codewithdan.com markdown content editor I mentioned earlier
- A Kanban/agent-board route

The configuration follows this pattern:

```yaml
ingress:
  - hostname: app.example.com
    service: http://127.0.0.1:8080

  - hostname: editor.example.com
    service: http://127.0.0.1:18793

  - service: http_status:404
```

Nginx sits in front of a few applications for host-based routing, WebSocket forwarding, and frontend/API separation. Cloudflare owns the public TLS edge, while Nginx and the applications stay on local HTTP or HTTPS listeners. That arrangement works well because Cloudflare Tunnel creates an outbound connection from the VPS. The applications don't need their own publicly accessible inbound ports.

## Controlling Access to the VPS

One of the most important parts of this setup is the Hetzner Cloud Firewall applied to the VPS. It has no rules, which sounds like it isn't configured, but that's intentional.

[Hetzner applies an implicit deny](https://docs.hetzner.com/cloud/firewalls/faq/#how-do-the-firewalls-work) to inbound traffic. With no inbound rules, unsolicited connections are dropped before they reach the VPS. With no outbound rules, the VPS can still connect to external services normally.

That gives me a simple access model:

- **Tailscale** handles private administration, SSH, dashboards, and agent APIs.
- **Cloudflare Tunnel** exposes only the web applications I deliberately want to publish and access. Each application still needs authentication appropriate to its audience and risk.
- **SSH tunnels** handle temporary local callbacks, such as OAuth flows.

I don't need to open application ports directly to the public internet. The VPS still has a public IP address, so it isn't invisible, but its services aren't directly reachable through that address. The important detail is that the Hetzner firewall must remain applied to the VPS. I also prefer binding internal services to `127.0.0.1` where possible. That provides another layer of protection if the provider firewall is ever detached or changed.

## What Else Runs on the VPS?

I started with a VPS simply to run OpenClaw in a sandbox. It didn't stay single-purpose for long.

A live audit at the time of writing showed:

- 22 running Docker containers
- Four running Hermes gateways
- One OpenClaw gateway
- K3s
- Nginx
- Cloudflare Tunnel
- Tailscale
- PostgreSQL databases running in containers
- SearXNG for local web search
- Umami analytics
- ZenSquirrel application services
- Agent board and ACP bridge services
- Content editor and voice-related services

The machine was using about 15 GiB of its 30 GiB visible memory. Storage sat at 95 GiB used out of 301 GiB available to Linux.

That disk number used to be much uglier. A cleanup pass reclaimed approximately 87 GB from coding sessions, unused Docker layers, build caches, package caches, old logs, stale binaries, and archived agent state. Persistent agents are talented hoarders when nobody gives them a storage budget.

I also use the VPS along with an AI skill I created to integrate with [Microsoft Foundry](https://ai.azure.com) and generate images for various scenarios (such as the image at the top of this post) using models like gpt-image-2.0. I can do that directly on the VPS via SSH or through one of my Telegram bots.

## Process Supervision and Restarts

An SSH disconnect and a server reboot are different failure modes, and the VPS doesn't handle every workload equally yet.

The services configured to return automatically after a reboot include:
- Hermes gateways and WebUI through enabled systemd services
- Cloudflare Tunnel, Tailscale, Nginx, Docker, and K3s through systemd
- K3s workloads, which are reconciled when K3s starts
- Docker containers that have an `always` or `unless-stopped` restart policy

Docker Compose keeps containers running after I disconnect from SSH, but Compose isn't a persistent process supervisor by itself. When I audited the server, only 6 of 23 containers had an automatic restart policy. The other containers would remain stopped after a reboot until their Compose stacks were started again.

OpenClaw runs through a user systemd service, so its reboot behavior also depends on that user's systemd configuration.

Claude's Telegram bridge runs under a dedicated unprivileged account in a tracked tmux session. That protects it from an SSH disconnect, but the tmux session won't survive a reboot and currently needs to be started again.

I avoid launching important services with `nohup ... &` (nohup is a Linux command that lets a process continue running after you disconnect from its terminal or SSH session)  and hoping future me remembers what happened. The remaining work is making every long-running workload explicitly reboot-safe and then testing that behavior with an actual reboot.

## What I'd Change If I Rebuilt It

The current server grew from an experiment, and some early shortcuts became permanent architecture. I'd make several changes if I started over:

1. **Create dedicated service users first.** Several Hermes services still run as root because the original installation and project tree live under `/root`. Retrofitting least privilege is possible, but every path and credential makes it more tedious.

2. **Put the build recipe in version control.** An agent can execute the setup, but cloud-init, configuration files, service units, and deployment scripts should remain the source of truth.

3. **Separate durable state from disposable state.** Repositories, databases, credentials, and selected agent memory need backups. Build caches, downloaded models, old sessions, and container layers should have retention limits.

4. **Test restoration, not just backup creation.** A backup that has never been restored is still a theory.

5. **Keep services private by default.** I'd add a Cloudflare hostname only when an application genuinely needs a public audience. Everything else would remain on Tailscale or loopback.

Hermes can automate much of a rebuild, but I wouldn't ask an agent to reconstruct the server from chat history and vibes. The repeatable configuration and restore test still need to exist outside the agent. That's something I haven't done yet but it's on my list. For now I have snapshots of the VM that I can use to get back to a specific state if needed.

## Was the VPS Worth It?

Absolutely! The biggest benefit is continuity. Agents keep their state, services stay online, Telegram remains available, and a task can continue after I close my laptop. The 16 ARM vCPUs and 32 GB of memory are useful, but I care more about having one dependable place where the tools, repositories, and workflows are already available.

The tradeoff is that a persistent AI server becomes infrastructure. It needs access control, updates, backups, external reachability checks, process supervision, and occasional aggressive cleaning. Once an agent can edit code and run shell commands from your phone, "it's just a bot" is no longer an acceptable security model.

If you're building something similar, I'd recommend starting small:

1. Provision one small VPS and patch it.
2. Apply and verify a provider firewall before installing agent runtimes.
3. Add Tailscale and confirm private SSH access.
4. Run one operator such as Hermes or OpenClaw with one paired Telegram bot.
5. Launch coding agents as bounded workers, not permanent assistants.
6. Add Cloudflare Tunnel only when an application needs to be publicly accessible. Lock it down if only you should be able to get to it.
7. Automate service supervision, backups, restore tests, and storage cleanup before adding more workloads.

Then add complexity only when a real workflow earns it. A VPS is excellent at collecting experiments and terrible at cleaning up after them.

## Resources

- [Hermes Agent documentation](https://hermes-agent.nousresearch.com/docs)
- [OpenClaw documentation](https://docs.openclaw.ai/)
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)
- [Claude Code](https://code.claude.com/docs/en/overview)
- [Codex CLI](https://learn.chatgpt.com/docs/codex/cli)
- [Tailscale Serve](https://tailscale.com/docs/reference/tailscale-cli/serve)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/)
- [Hetzner Cloud](https://www.hetzner.com/cloud/)
