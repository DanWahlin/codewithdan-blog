---
title: "Using Telegram with GitHub Copilot CLI"
date: 2026-05-11
draft: true
categories:
  - "ai"
  - "github-copilot"
  - "developer-tools"
tags:
  - "github-copilot-cli"
  - "telegram"
  - "copilot-cli"
  - "ai-agents"
coverImage: "cover.webp"
---

I spend a lot of time working with [GitHub Copilot CLI](https://github.com/features/copilot/cli/). It is great when I am sitting in front of a terminal. But sometimes I am away from the machine and want to kick off a review, ask a follow-up question, or check whether an agent is still working.

That sent me down a small rabbit hole: could I use Telegram as a chat front end for Copilot CLI?

I did not want a remote terminal in Telegram. I already have SSH for that. What I wanted was closer to a normal chat experience: send a message, have Copilot work in the project, and get a response back. Simple idea. Slightly less simple setup.

In this post I will walk through how I enabled a Telegram bot for GitHub Copilot CLI using the [`examon/copilot-cli-telegram-bridge`](https://github.com/examon/copilot-cli-telegram-bridge) extension, what I checked before installing it, the exact setup steps, and a few gotchas I hit along the way.

## What I was trying to build

The goal was straightforward:

- Use Telegram to send prompts to a running Copilot CLI session
- Keep the Copilot session attached to a real project folder
- Avoid exposing API keys or bot tokens
- Avoid a raw terminal or tmux-style experience in Telegram
- Keep the setup locked down to my Telegram user

That last point matters. A Telegram bot wired into an AI coding agent is not just a chat toy. Depending on how you start Copilot CLI, it can read files, run commands, edit code, and interact with your machine. Treat it like remote developer access, because that is basically what it is.

## The first thing I rejected: remote terminal bots

Before landing on the Copilot CLI Telegram Bridge extension, I looked at remote terminal-style projects. One of them worked, but the experience was not what I wanted.

The problem was architectural. Some tools wrap a terminal session and stream ANSI/TUI output back to Telegram. That sounds useful until you see terminal escape sequences, broken formatting, and partial screen redraws show up in chat.

Things like this are a smell:

```text
[?2026h
[?2004h
```

That is terminal state leaking into a chat interface. Once I saw that pattern, I knew I did not want to keep going in that direction.

The better approach was to use something that integrates with Copilot CLI as an extension instead of pretending Telegram is a terminal emulator.

## The extension I used

The extension I ended up using was:

```text
https://github.com/examon/copilot-cli-telegram-bridge
```

The plugin description is exactly what I was looking for:

> A GitHub Copilot CLI extension that bridges Telegram messages bidirectionally with a CLI session. Send messages from Telegram, get agent responses back.

The important implementation detail: it uses `joinSession` from `@github/copilot-sdk/extension`.

That is a much better fit than a PTY-based wrapper. It joins the active Copilot CLI session and relays messages, instead of trying to screen-scrape a terminal.

## Step 1: review the extension before running it

I do not recommend installing random agent extensions and hoping for the best. That is how you accidentally give a weekend project access to your repo, shell, and secrets. Fun for about four seconds.

I cloned the repo into a temporary review folder first:

```bash
git clone https://github.com/examon/copilot-cli-telegram-bridge.git /tmp/copilot-cli-telegram-bridge-review
cd /tmp/copilot-cli-telegram-bridge-review
git rev-parse HEAD
```

The commit I reviewed was:

```text
86d15dd1a6ab0ca0b6cb6ef14e6885fcc9a8fd89
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

That was good enough for testing. Not perfect, but reasonable.

The biggest security note is token storage. The README is clear about it: bot tokens are stored in plain text in `bots.json`. The file should be mode `600`, and you should never commit it, copy it into backups, paste it into logs, or send it to an AI assistant.

## Step 2: install the plugin

Once the review looked clean, I installed the plugin:

```bash
copilot plugin install examon/copilot-cli-telegram-bridge
```

Then I verified it showed up:

```bash
copilot plugin list
```

The installed plugin list included:

```text
copilot-cli-telegram-bridge (v1.0.0)
```

The extension install flow expects the plugin to copy `extension.mjs` into Copilot's extensions directory. In my setup I also verified the file manually:

```bash
mkdir -p ~/.copilot/extensions/copilot-cli-telegram-bridge
cp /tmp/copilot-cli-telegram-bridge-review/extension.mjs \
  ~/.copilot/extensions/copilot-cli-telegram-bridge/extension.mjs
chmod 644 ~/.copilot/extensions/copilot-cli-telegram-bridge/extension.mjs
```

Then I checked the installed file:

```bash
node --check ~/.copilot/extensions/copilot-cli-telegram-bridge/extension.mjs
sha256sum ~/.copilot/extensions/copilot-cli-telegram-bridge/extension.mjs
```

The SHA-256 hash I had after install was:

```text
ac6aea2048e42c6d289b46133eaaedc1b802fd8346227ccd08096fefd0eb7094
```

That gave me a quick way to confirm the installed file matched the one I reviewed.

## Step 3: enable Copilot CLI extensions

Copilot CLI extensions are experimental, so I enabled the experimental/plugin configuration.

In my case that meant updating Copilot's settings so the bridge plugin was enabled:

```json
{
  "experimental": true,
  "enabledPlugins": {
    "copilot-cli-telegram-bridge": true
  }
}
```

The main user settings file was:

```text
~/.copilot/settings.json
```

Depending on your Copilot CLI version, you may also see generated or managed config files under `~/.copilot/`. Be careful editing those directly. I treated `settings.json` as the user-owned file and verified the result by restarting Copilot CLI and checking whether the extension loaded.

## Step 4: create a Telegram bot

Next I created a Telegram bot with [@BotFather](https://t.me/BotFather):

1. Open Telegram
2. Start a chat with `@BotFather`
3. Send `/newbot`
4. Pick a display name
5. Pick a username that ends with `bot`
6. Copy the bot token

Do not paste the real token into code, docs, GitHub issues, screenshots, or chat transcripts. If the token leaks, revoke it with BotFather and generate a new one.

I verified the bot with Telegram's `getMe` API, but I did it without printing the token:

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

## Step 5: register the bot with the extension

The extension supports a CLI flow:

```text
/telegram setup mybot
/telegram connect mybot
```

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
    "8338423547"
  ],
  "pending": {}
}
```

That user ID is my Telegram account. If you set this up yourself, use your own Telegram user ID. Do not leave this open to everyone unless you like surprise code changes from strangers. I am going to assume you do not.

## Step 6: clear webhooks before using long polling

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

## Step 7: start Copilot CLI for the project

The bridge attaches to a running Copilot CLI session, so start Copilot from the project folder you want it to work in.

For example:

```bash
cd ~/projects/ZenSquirrel

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

When it works, Copilot prints something like:

```text
Telegram bridge connected (@CopilotCLI_TG_bot).
```

At that point, messages sent to the Telegram bot flow into the Copilot CLI session, and Copilot's responses are sent back to Telegram.

## Step 8: decide how much permission to give it

This is the part to think about carefully.

The first bridge worked, but one review got stuck for hours because Copilot was waiting on a tool approval prompt that Telegram did not surface cleanly. The session looked like it was still typing forever.

The task was harmless. Copilot wanted approval for a basic command like `wc -l`. But because the approval prompt lived inside the CLI session, the Telegram bot could not handle it well.

There are two ways to deal with that.

### Safer option: approve more tools, but not everything

You can start Copilot with a more permissive but still constrained setup:

```bash
copilot \
  --experimental \
  --allow-all-tools \
  --add-dir ~/projects/ZenSquirrel \
  --allow-url github.com \
  --allow-url api.github.com \
  --deny-tool='shell(git push)' \
  --deny-tool='shell(git commit)' \
  --deny-tool='shell(git reset:*)' \
  --deny-tool='shell(rm:*)' \
  --deny-tool='shell(shred:*)' \
  --deny-tool='shell(sudo:*)' \
  --model gpt-5.5 \
  --no-remote \
  --disable-builtin-mcps \
  --disallow-temp-dir \
  --secret-env-vars=TELEGRAM_BOT_TOKEN,GITHUB_TOKEN,GH_TOKEN,OPENAI_API_KEY,ANTHROPIC_API_KEY \
  --log-level warning
```

That is the version I would recommend for most people.

It avoids silly approval hangs for basic commands, while still blocking the scarier stuff: pushing, committing, resetting, deleting, shredding, and sudo.

### Full convenience option: `--yolo`

I eventually restarted the test session with `--yolo` because I wanted to see how well the Telegram workflow behaved without approval prompts.

Copilot CLI describes it this way:

```text
--yolo
Enable all permissions, equivalent to:
--allow-all-tools --allow-all-paths --allow-all-urls
```

The launch command looked like this:

```bash
cd ~/projects/ZenSquirrel

copilot \
  --experimental \
  --yolo \
  --model gpt-5.5 \
  --no-remote \
  --disable-builtin-mcps \
  --disallow-temp-dir \
  --secret-env-vars=TELEGRAM_BOT_TOKEN,GITHUB_TOKEN,GH_TOKEN,OPENAI_API_KEY,ANTHROPIC_API_KEY \
  --log-level warning
```

Then I connected the bot again:

```text
/telegram connect copilotcli
```

This solved the approval hang problem. It also means the Telegram bot is now extremely powerful. If you use `--yolo`, treat the bot like developer access to that machine.

I would not run that mode on a shared bot, a broad group chat, or a machine with secrets spread all over the filesystem.

## Step 9: verify the bridge is running

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

## Gotcha 1: do not poll the same bot twice

This was the first real issue I hit.

Telegram long polling is exclusive. If one process is polling updates for a bot token and another process starts polling the same token, they fight. One takes over, the other gets kicked off.

The bridge reported:

```text
Telegram bridge released (another session took over). Type /telegram connect copilotcli to reclaim.
```

The fix was to stop the extra poller and reconnect:

```text
/telegram connect copilotcli
```

If you are testing with raw Telegram API calls, avoid `getUpdates` while the bridge is running. Use `getMe` for token validation because it does not consume updates or interfere with the long poller.

## Gotcha 2: background process watches can get noisy

At one point I had a background process watcher looking for the phrase `Telegram bridge`.

That was too broad. Copilot CLI redraws its TUI, so old lines like this can appear again in output:

```text
Telegram bridge connected (@CopilotCLI_TG_bot).
Telegram bridge released (another session took over).
```

The watcher saw those lines and reported them as new important events. They were not new. They were terminal redraw artifacts.

The fix was simple: restart without that broad watch pattern. Sometimes the bug is not the bridge. Sometimes it is your monitor yelling about yesterday's news.

## Gotcha 3: slash commands are awkward through Telegram

Copilot CLI slash commands like `/model` are CLI UI commands. Telegram messages are usually treated as prompts that get sent into the session.

So if you type this in Telegram:

```text
/model
```

it may not behave like typing `/model` directly into Copilot CLI.

For normal work, this is fine. Ask natural-language questions and give tasks in plain English. For CLI-level commands like changing models, connecting/disconnecting the bridge, or clearing a session, I prefer to run those in the Copilot CLI session itself.

## Gotcha 4: approval prompts can look like infinite typing

The most annoying issue was the stuck review.

From Telegram, it looked like Copilot was typing forever. In reality, the CLI session was waiting for a tool approval prompt. Telegram did not expose the approval interaction cleanly, so the session just sat there.

The options are:

- Use safer allow/deny flags so routine commands do not require approval
- Use `--yolo` for a fully trusted personal bot
- Avoid long-running review tasks from Telegram unless you can check the terminal if needed

For my personal test bot, I chose `--yolo`. For a team bot, I would not.

## My current launch command

For my personal test session, this is the current shape:

```bash
cd ~/projects/ZenSquirrel

copilot \
  --experimental \
  --yolo \
  --model gpt-5.5 \
  --no-remote \
  --disable-builtin-mcps \
  --disallow-temp-dir \
  --secret-env-vars=TELEGRAM_BOT_TOKEN,GITHUB_TOKEN,GH_TOKEN,OPENAI_API_KEY,ANTHROPIC_API_KEY,COPILOT_AGENT_FIREWORKS_API_KEY,COPILOT_AGENT_GOOGLE_API_KEY,COPILOT_AGENT_ANTHROPIC_API_KEY \
  --log-level warning
```

Then inside Copilot CLI:

```text
/telegram connect copilotcli
```

For most people, I would start with the safer allow/deny version first. Move to `--yolo` only if you understand the tradeoff.

## Final thoughts

The Copilot CLI Telegram Bridge is not a polished product yet, but the basic idea works: Telegram can become a lightweight chat front end for a real Copilot CLI session.

The important lesson for me was that architecture matters. A PTY streamed into Telegram feels like a terminal wearing a fake mustache. It technically works, but it is not the experience I wanted. An extension that joins the Copilot session is a much better direction.

Would I run this for a team today? Not without more guardrails.

Would I use it personally to check in on a project, ask Copilot a question, or kick off a focused task while away from my desk? Yes. Carefully.

If you try this yourself, start with a dedicated Telegram bot, lock the token file down, allow only your Telegram user ID, avoid multiple pollers, and be very intentional about the permission flags.

Convenience is great. Convenience wired to an AI agent with shell access deserves a little paranoia.

## Resources

- [GitHub Copilot CLI](https://github.com/features/copilot/cli/)
- [Copilot CLI Telegram Bridge](https://github.com/examon/copilot-cli-telegram-bridge)
- [Telegram BotFather](https://t.me/BotFather)
- [Telegram Bot API](https://core.telegram.org/bots/api)
