---
title: "Using Telegram with GitHub Copilot CLI (Yep, it works!)"
date: 2026-05-13
draft: false
categories:
  - "ai"
  - "github-copilot"
  - "developer-tools"
tags:
  - "github-copilot-cli"
  - "telegram"
  - "copilot-cli"
  - "ai-agents"
coverImage: "cover.png"
---
![Using Telegram with GitHub Copilot CLI](/images/blog/using-telegram-with-github-copilot-cli/cover.png)
I spend a lot of time working with [GitHub Copilot CLI](https://github.com/features/copilot/cli/). It's great when I'm sitting in front of a terminal, but sometimes I'm away from the machine and want to kick off a review, ask a follow-up question, or check on the status of an agent task.

I recently went on a family vacation to Spain and wanted to explore an app feature during downtime between sightseeing stops, without pulling out my iPad. While Copilot CLI's [remote feature](https://docs.github.com/copilot/how-tos/copilot-cli/use-copilot-cli/steer-remotely) works well, I prefer to use Telegram. I already use it with my OpenClaw and Hermes agents and like the general flow.

That sent me down a small rabbit hole: could I use Telegram as a chat front end for Copilot CLI?

I didn't want a remote terminal in Telegram. I already have SSH for that, and I could also use Copilot CLI's remote feature. What I wanted was closer to a normal chat experience: send a message, have Copilot CLI do work in a project, and get a response back. Simple idea, slightly less simple setup.

In this post, I'll walk through how I enabled a Telegram bot for GitHub Copilot CLI using the [`examon/copilot-cli-telegram-bridge`](https://github.com/examon/copilot-cli-telegram-bridge) extension. I'll also cover what I checked before installing it, the setup steps, and a few gotchas I hit along the way.

![Coffee with GitHub Copilot CLI and Telegram](/images/blog/using-telegram-with-github-copilot-cli/telegram-copilot-cli-coffee.jpeg)

<div style="max-width: 420px; margin: 2rem auto;">
  <video controls playsinline preload="metadata" poster="/images/blog/using-telegram-with-github-copilot-cli/telegram-copilot-poster.jpg" style="width: 100%; border-radius: 16px;">
    <source src="/images/blog/using-telegram-with-github-copilot-cli/telegram-copilot-phone-fit.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>

## What I Was Trying to Accomplish

The goal was straightforward:

- Use Telegram to send prompts to a running Copilot CLI session
- Keep the Copilot session attached to a real project folder
- Avoid exposing API keys or bot tokens
- Avoid a raw terminal or tmux-style experience in Telegram
- Keep the setup locked down to my Telegram user

That last point matters. A Telegram bot wired into an AI coding agent isn't just a chat toy. Depending on how you start Copilot CLI, it can read files, run commands, edit code, and interact with your machine. Treat it like remote developer access, because that's basically what it is.

## The First Thing I Rejected: Remote Terminal Bots

Before landing on the Copilot CLI Telegram Bridge extension, I looked at remote terminal-style projects. One of them worked with Telegram, but the experience wasn't what I wanted at all.

The problem was architectural. Some tools wrap a terminal session and stream ANSI/TUI output back to Telegram. That sounds useful until you see terminal escape sequences, broken formatting, and partial screen redraws show up in chat:

```text
[?2026h
[?2004h
```

That's terminal state leaking into a chat interface. I explored stripping some escape sequences but quickly realized I was going down the wrong path.

The better approach was to use something that integrates with Copilot CLI as an extension instead of pretending Telegram is a terminal emulator.

## The Extension I Used

The extension I ended up using was this one by Tomas Meszaros:

```text
https://github.com/examon/copilot-cli-telegram-bridge
```

The plugin description is exactly what I was looking for:

> A GitHub Copilot CLI extension that bridges Telegram messages bidirectionally with a CLI session. Send messages from Telegram, get agent responses back.

The important implementation detail: it uses `joinSession` from `@github/copilot-sdk/extension`.

That's a much better fit than a PTY-based wrapper. It joins the active Copilot CLI session and relays messages, instead of trying to screen-scrape a terminal.

Here's how I got started using it.

## Step 1: Review the Extension Before Running It

Even though the creator works at GitHub, I don't recommend installing random agent extensions, plugins, skills, or MCP servers and hoping for the best. That's how you accidentally give a weekend project access to your repo, shell, and secrets. Fun for about four seconds. I still went through a due diligence process just to double-check things.

I cloned the repo into a temporary review folder first:

```bash
git clone https://github.com/examon/copilot-cli-telegram-bridge.git /tmp/copilot-cli-telegram-bridge-review
cd /tmp/copilot-cli-telegram-bridge-review
git rev-parse HEAD
```

Then I inspected the key files:

```bash
sed -n '1,220p' README.md
sed -n '1,120p' plugin.json
sed -n '1,220p' extension.mjs
sed -n '1,180p' skills/telegram-install/SKILL.md
```

A few things I specifically checked:

```bash
# Syntax check
node --check extension.mjs

# Look for process execution or risky dynamic code patterns
grep -Ei 'child_process|spawn\(|exec\(|node-pty|eval\(|new Function' extension.mjs
```

What I found:

- No `child_process`, `spawn`, `exec`, or `node-pty`
- No `eval` or `new Function`
- No package dependencies to audit
- Telegram API calls were made with `fetch`
- The extension stores bot tokens locally in `bots.json`
- Tokens are expected to be protected with file permissions
- Access control is handled through a local `access.json` file

You can also ask Copilot CLI to review the extension, but I'd still do the basic manual checks yourself first.

The biggest security note is token storage. The README is clear about it: bot tokens are stored in plain text in `bots.json`. The file should be mode `600`, and you should never commit it, copy it into backups, paste it into logs, or send it to an AI assistant.

## Step 2: Enable Copilot CLI Extensions

Copilot CLI extensions are currently experimental, so I enabled the experimental configuration. Super easy.

```text
/experimental on
```

## Step 3: Install the Plugin

From there I installed the plugin from inside Copilot CLI:

```text
/plugin install examon/copilot-cli-telegram-bridge
```

Then I verified it showed up:

```bash
copilot plugin list
```

The installed plugin list included:

```text
copilot-cli-telegram-bridge (v1.0.0)
```

The extension README then has you restart Copilot CLI and run the following skill:

```text
/copilot-cli-telegram-bridge:telegram-install
```

Then restart Copilot CLI again. The extension loads on startup.

## Step 4: Create a Telegram Bot

Next I created a Telegram bot with [@BotFather](https://t.me/BotFather):

1. Open Telegram
2. Start a chat with `@BotFather`
3. Send `/newbot`
4. Pick a display name
5. Pick a username that ends with `bot`
6. Copy the bot token

Don't paste the real token into code, docs, GitHub issues, screenshots, or chat transcripts. If the token leaks, revoke it with BotFather and generate a new one.

After storing the token in an environment variable, I verified the bot with Telegram's `getMe` API:

```bash
curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe"
```

A successful response looks like this:

```json
{
  "ok": true,
  "result": {
    "id": 1234567890,
    "is_bot": true,
    "first_name": "Your Bot Name",
    "username": "YourBot_bot"
  }
}
```

## Step 5: Register the Telegram Bot with the Extension

The extension supports a CLI flow:

```text
/telegram setup mybot
/telegram connect mybot
```

During setup, the extension prompts for the bot token and validates it against the Telegram API. After connecting, I sent a message to the bot in Telegram. The extension printed a pairing code in Copilot CLI, and I sent that code back to the bot. Once paired, my Telegram user ID was written to `access.json`.

That pairing step matters because the bot should not accept messages from random Telegram users. A Telegram bot connected to a coding agent is not a toy unless you enjoy letting strangers remodel your filesystem.

In my case I registered the bot locally as:

```text
copilotcli
```

The extension stores its files under:

```text
~/.copilot/extensions/copilot-cli-telegram-bridge/
```

The important files are:

```text
bots.json
access.json
bots/copilotcli/state.json
bots/copilotcli/lock.json
```

`bots.json` contains the bot token, so lock it down:

```bash
chmod 600 ~/.copilot/extensions/copilot-cli-telegram-bridge/bots.json
chmod 600 ~/.copilot/extensions/copilot-cli-telegram-bridge/access.json
```

My sanitized `bots.json` looked like this:

```json
{
  "copilotcli": {
    "token": "[REDACTED]",
    "username": "CopilotCLI_TG_bot",
    "addedAt": "2026-05-11T01:33:48Z"
  }
}
```

The `access.json` file controlled who could talk to the bridge:

```json
{
  "allowedUsers": [
    "[YOUR_TELEGRAM_USER_ID]"
  ],
  "pending": {}
}
```

In my real config, this was my Telegram user ID. If you set this up yourself, use your own Telegram user ID. Don't leave this open to everyone unless you like surprise code changes from strangers.

## Step 6: Clear Webhooks Before Using Long Polling

The bridge uses Telegram long polling. Telegram only allows one active poller per bot token.

If your bot previously had a webhook, clear it first:

```bash
curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/deleteWebhook"
```

This matters more than it sounds. If another process is polling the same bot, Telegram returns conflicts or one session takes over from another. I hit that during setup.

The symptom looked like this in Copilot CLI:

```text
Telegram bridge released (another session took over). Type /telegram connect copilotcli to reclaim.
```

In my case, the culprit was a verification call that used `getUpdates` while the bridge was already polling. That was a self-inflicted wound. After that, I avoided direct `getUpdates` calls while the bridge was running.

## Step 7: Start Copilot CLI for the Project

The bridge attaches to a running Copilot CLI session, so start Copilot from the project folder you want it to work in.

For example:

```bash
cd ~/projects/[my-project]

copilot \
  --experimental \
  --model gpt-5.5 \
  --no-remote \
  --disable-builtin-mcps \
  --disallow-temp-dir \
  --secret-env-vars=TELEGRAM_BOT_TOKEN,GITHUB_TOKEN,GH_TOKEN,OPENAI_API_KEY,ANTHROPIC_API_KEY \
  --log-level warning
```

A few notes on those flags:

- `--experimental` loads extension support
- `--model gpt-5.5` starts with the model I wanted
- `--no-remote` keeps the session local
- `--disable-builtin-mcps` avoids loading extra MCP servers by default
- `--disallow-temp-dir` keeps Copilot from using temp directories unexpectedly
- `--secret-env-vars=...` marks sensitive environment variables as secrets

Once Copilot CLI is running, connect the Telegram bridge:

```text
/telegram connect copilotcli
```

Copilot prints something like:

```text
Telegram bridge connected (@CopilotCLI_TG_bot).
```

At that point, messages sent to the Telegram bot flow into the Copilot CLI session, and Copilot's responses are sent back to Telegram.

## Step 8: Decide How Much Permission to Give It

This is the part to think about carefully.

The first bridge worked, but one review got stuck for a while because Copilot was waiting on a tool approval prompt that Telegram didn't surface cleanly. The session looked like it was still typing... forever.

The task was harmless. Copilot wanted approval for a basic command like `wc -l`. But because the approval prompt lived inside the CLI session, the Telegram bot couldn't handle it well.

There are two ways to deal with that.

### Safer Option: Approve More Tools, but Not Everything

You can start Copilot with a more permissive but still constrained setup:

```bash
copilot \
  --experimental \
  --allow-all-tools \
  --add-dir ~/projects/my-project \
  --allow-url github.com \
  --allow-url api.github.com \
  --deny-tool='shell(git push)' \
  --deny-tool='shell(git commit)' \
  --deny-tool='shell(git reset)' \
  --deny-tool='shell(rm)' \
  --deny-tool='shell(shred)' \
  --deny-tool='shell(sudo)' \
  --model gpt-5.5 \
  --no-remote \
  --disable-builtin-mcps \
  --disallow-temp-dir \
  --secret-env-vars=TELEGRAM_BOT_TOKEN,GITHUB_TOKEN,GH_TOKEN \
  --log-level warning
```

That command shape should work as a safer starting point for a lot of people.

Permission syntax can change, so verify the exact allow/deny patterns for your Copilot CLI version with:

```bash
copilot help permissions
```

It avoids silly approval hangs for basic commands, while still blocking the scarier stuff: pushing, committing, resetting, deleting, shredding, and sudo.

### Full Convenience Option: `--yolo`

I eventually restarted the test session with `--yolo` because I wanted to see how well the Telegram workflow behaved without approval prompts.

Copilot CLI describes `--yolo` this way:

```text
--yolo
Enable all permissions, equivalent to:
--allow-all-tools --allow-all-paths --allow-all-urls
```

Copilot CLI also has `--allow-all`, which enables the same permission shape. `--yolo` is the memorable alias, because apparently even CLIs need a chaotic little nickname.

The launch command looked like this:

```bash
cd ~/projects/my-project

copilot \
  --experimental \
  --yolo \
  --model gpt-5.5 \
  --no-remote \
  --disable-builtin-mcps \
  --disallow-temp-dir \
  --secret-env-vars=TELEGRAM_BOT_TOKEN,GITHUB_TOKEN,GH_TOKEN \
  --log-level warning
```

Then I connected the bot again:

```text
/telegram connect copilotcli
```

This solved the approval hang problem. It also means the Telegram bot is now extremely powerful. If you use `--yolo`, treat the bot like developer access to that machine.

I wouldn't run that mode on a shared bot, a broad group chat, or a machine with secrets spread all over the filesystem. Telegram connects to Copilot CLI running on an isolated VM I run in the cloud so collateral damage is minimized in my case.

## Step 9: Verify the Bridge is Running

After connecting, I checked the process and lock file.

The lock file lives here:

```text
~/.copilot/extensions/copilot-cli-telegram-bridge/bots/copilotcli/lock.json
```

A sanitized version looked like this:

```json
{
  "pid": 2359178,
  "sessionId": "41437818-8613-458a-a663-387fa5b6a37a",
  "connectedAt": "2026-05-11T10:14:49.369Z"
}
```

I also verified the main Copilot process included the flags I expected:

```bash
ps -p 2359053 -o pid=,ppid=,stat=,etime=,cmd=
```

The command included:

```text
copilot --banner --experimental --yolo --model gpt-5.5 ...
```

That told me the bridge was connected to the right Copilot session, in the right project, with the permission mode I expected.

## Gotcha 1: Slash Commands Are Awkward Through Telegram

Copilot CLI slash commands like `/model` are CLI UI commands. Telegram messages are usually treated as prompts that get sent into the session.

So if you type this in Telegram:

```text
/model
```

it may not behave like typing `/model` directly into Copilot CLI.

For normal work, this is fine. Ask natural-language questions and give tasks in plain English. For CLI-level commands like changing models, connecting/disconnecting the bridge, or clearing a session, I prefer to run those in the Copilot CLI session itself.

## Gotcha 2: Approval Prompts Can Look Like Infinite Typing

The most annoying issue was the stuck review.

From Telegram, it looked like Copilot was typing forever. In reality, the CLI session was waiting for a tool approval prompt. Telegram didn't expose the approval interaction cleanly, so the session just sat there.

The options are:

- Use safer allow/deny flags so routine commands don't require approval
- Use `--yolo` for a fully trusted personal bot
- Avoid long-running review tasks from Telegram unless you can check the terminal if needed

For my personal test bot, I chose `--yolo`. For a team bot, I wouldn't.

## My Current Launch Command

For my personal test session, I used the `--yolo` version from Step 8, then connected the bot from inside Copilot CLI:

```text
/telegram connect copilotcli
```

For most people, I'd start with the safer allow/deny version first. Move to `--yolo` only if you understand the tradeoff.

## Final Thoughts

I used the Copilot CLI Telegram Bridge extensively over vacation in Europe. Telegram became my lightweight chat front end for a real Copilot CLI session. Since I could use it directly from my phone while waiting for the family to get ready or during other downtime, my wife didn't complain that I was "working while on vacation." Yes, I probably need to completely disconnect, but that's never been my style. 😀

![Using Telegram with Copilot CLI while traveling](/images/blog/using-telegram-with-github-copilot-cli/telegram-copilot-cli-ocean.png)

The important lesson for me was that architecture matters. A PTY streamed into Telegram feels like a terminal wearing a fake mustache. It technically works, but it's not the experience I wanted. An extension that joins the Copilot session is a much better direction.

Would I run this for a team today? No, not without more guardrails.

Would I use it personally to check in on a project, ask Copilot a question, or kick off a focused task while away from my desk? Yes. I used it to do research, compare some LLMs, and add several new features to an app.

If you try this yourself, start with a dedicated Telegram bot. Lock the token file down, allow only your Telegram user ID, avoid multiple pollers, and be intentional about permission flags. When set up properly, I've found that the extension works really well. Shoutout to Tomas Meszaros for creating it!

## Resources

- [GitHub Copilot CLI](https://github.com/features/copilot/cli/)
- [Copilot CLI Telegram Bridge](https://github.com/examon/copilot-cli-telegram-bridge)
- [Telegram BotFather](https://t.me/BotFather)
- [Telegram Bot API](https://core.telegram.org/bots/api)
