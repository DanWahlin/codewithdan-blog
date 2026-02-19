---
title: "Chrome WebMCP: How to Make Your Website Agent-Friendly (With Real Code)"
date: 2026-02-19
draft: true
categories:
  - "ai"
  - "mcp"
coverImage: "cover.webp"
tags:
  - "webmcp"
  - "mcp"
  - "ai-agents"
  - "chrome"
  - "javascript"
---

You've probably spent time making your website accessible to screen readers. Now there's a new kind of visitor you need to think about: AI agents.

Right now, when an AI agent needs to interact with your site, it has two bad options. It can scrape the DOM and guess what everything means, or it can use Playwright-style automation and click through your UI like a robot in a trench coat. Both approaches are brittle. Change your button text from "Submit" to "Send" and your agent breaks.

Chrome WebMCP changes that. Instead of agents reverse-engineering your UI, *you* tell agents exactly what your site can do. You declare your tools. The agents use them. No scraping, no brittle selectors.

It shipped in Chrome 146 as an early preview about two weeks ago, and I've been playing with it. Here's what it looks like in practice.

## What WebMCP Actually Is

WebMCP is a web standard (co-developed by Google and Microsoft, heading to W3C) that lets websites expose structured **tools** directly to AI agents via the browser. Think of it as MCP, but for the open web instead of desktop apps.

There are two APIs:

- **Declarative API** — you describe your site's actions in HTML. No JavaScript required. The browser reads your markup and exposes the tools automatically.
- **Imperative API** — you register tools in JavaScript via `navigator.modelContext`. More control, more power, handles complex workflows.

Early benchmarks show roughly 67% reduction in agent interaction time compared to DOM scraping. That's because agents aren't guessing anymore. They're calling a named function with typed parameters.

Let me show you both.

## Before You Start

To use WebMCP today, you need Chrome 146 or later with the Early Preview flags enabled. Pop this into your address bar:

```
chrome://flags/#enable-webmcp
```

Set it to **Enabled** and restart. That's it. The `navigator.modelContext` API will now be available in JavaScript.

For testing your implementations, there's an open-source WebMCP test client at [github.com/webmcp/test-client](https://github.com/webmcp/test-client). It lets you point at any URL and see what tools the page exposes, then call them manually. It's the equivalent of running `mcp inspect` for web pages.

## The Declarative API: Tools in HTML

The Declarative API is the no-JavaScript path. You add a `<webmcp-tools>` element to your page with your tool definitions inside. The browser handles the rest.

Here's a real example. Say you have a documentation site and you want agents to be able to search it:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Docs — Code With Dan</title>
</head>
<body>
  <h1>Documentation</h1>

  <!-- WebMCP Declarative Tools -->
  <webmcp-tools>
    <webmcp-tool
      name="search_docs"
      description="Search the documentation for a given query. Returns matching article titles and summaries."
      action="/api/docs/search"
      method="GET">
      <webmcp-param
        name="query"
        type="string"
        description="The search term or question"
        required="true">
      </webmcp-param>
      <webmcp-param
        name="category"
        type="string"
        description="Optional category filter: 'api', 'tutorials', 'guides'"
        required="false">
      </webmcp-param>
    </webmcp-tool>

    <webmcp-tool
      name="get_article"
      description="Fetch the full content of a documentation article by its slug."
      action="/api/docs/article"
      method="GET">
      <webmcp-param
        name="slug"
        type="string"
        description="The article slug, e.g. 'getting-started-with-mcp'"
        required="true">
      </webmcp-param>
    </webmcp-tool>
  </webmcp-tools>

  <!-- Your actual page content -->
</body>
</html>
```

When an agent visits this page, it calls `navigator.modelContext.getTools()` (or the browser does it automatically for supported agent runtimes) and gets back a clean list of tools with typed parameters. The agent can then call `search_docs` with a query and get your `/api/docs/search?query=mcp` response directly, no DOM scraping needed.

The `action` attribute points to your existing API endpoint. If you already have a REST API, you're halfway there.

## The Imperative API: Tools in JavaScript

The Declarative API covers static, GET-based tools well. For anything more complex — authentication, streaming responses, multi-step workflows — you want the Imperative API.

Here's the same search example, done in JavaScript:

```javascript
// webmcp-init.js — load this on every page

async function initWebMCP() {
  // Check if the API is available (Chrome 146+ with flag enabled)
  if (!navigator.modelContext) {
    console.log('WebMCP not available — running in standard browser mode');
    return;
  }

  const context = await navigator.modelContext.register({
    name: 'codewithdan-docs',
    description: 'Developer documentation and code examples for Code With Dan',
    version: '1.0.0'
  });

  // Register a search tool
  context.registerTool({
    name: 'search_docs',
    description: 'Search the documentation. Returns article titles, summaries, and URLs.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query or question'
        },
        limit: {
          type: 'number',
          description: 'Max results to return (default: 5, max: 20)'
        }
      },
      required: ['query']
    },
    handler: async ({ query, limit = 5 }) => {
      const response = await fetch(`/api/docs/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      return response.json();
    }
  });

  // Register a tool that needs auth — the handler has access to the user's session
  context.registerTool({
    name: 'get_my_bookmarks',
    description: 'Get the current user\'s saved bookmarks. Requires the user to be logged in.',
    parameters: {
      type: 'object',
      properties: {}
    },
    handler: async () => {
      // Fetch uses the browser's existing cookies/session — no token passing needed
      const response = await fetch('/api/user/bookmarks', {
        credentials: 'include'
      });
      if (response.status === 401) {
        return { error: 'User is not logged in' };
      }
      return response.json();
    }
  });
}

initWebMCP();
```

A few things worth noting here:

**The handler runs in the browser, with the user's session.** That means authenticated API calls work without passing tokens around. The agent can call `get_my_bookmarks` and your handler fires with `credentials: 'include'` — it uses whatever session cookies the user has. This is a big deal for building agent features that respect existing auth.

**You control what agents can do.** You're not giving agents arbitrary DOM access. You're registering specific, typed functions with explicit handlers. Want to rate-limit tool calls? Add it in the handler. Want to audit tool usage? Add logging. The handler is just JavaScript.

**`navigator.modelContext` is undefined in non-Chrome or unflagged browsers.** Always check before calling anything. The `if (!navigator.modelContext)` guard means your page degrades gracefully in standard browsers.

## What Your API Endpoint Should Return

For both the Declarative and Imperative APIs, the tool handler response goes directly to the agent. Keep it structured and machine-readable:

```typescript
// /api/docs/search — example Express endpoint
app.get('/api/docs/search', async (req, res) => {
  const { q, limit = 5 } = req.query;

  const results = await searchArticles(q as string, Number(limit));

  // Return structured JSON — agents read this, not humans
  res.json({
    query: q,
    results: results.map(article => ({
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      url: `https://blog.codewithdan.com/blog/${article.slug}`,
      tags: article.tags
    })),
    total: results.length
  });
});
```

Treat these responses like you'd treat any API — meaningful field names, consistent structure, no HTML. The agent is going to parse this and reason about it.

## Testing What You Built

Once you've got tools registered, point the WebMCP test client at your page:

```bash
# Install the test client
npx @webmcp/inspector

# Point it at your local dev server
webmcp-inspector http://localhost:3000
```

It'll list every registered tool, show you the schema, and let you call them with test parameters. The output looks a lot like `mcp inspect`:

```
Found 2 tools on http://localhost:3000:

  search_docs
    Search the documentation. Returns article titles, summaries, and URLs.
    Parameters:
      query (string, required) — Search query or question
      limit (number, optional) — Max results to return (default: 5, max: 20)

  get_my_bookmarks
    Get the current user's saved bookmarks. Requires the user to be logged in.
    Parameters: none
```

Call a tool directly:

```bash
webmcp-inspector http://localhost:3000 call search_docs --query "how to use MCP tools"
```

That's your feedback loop during development.

## How This Compares to the Old Way

Let me be concrete about what changes here. Here's a Playwright script doing what WebMCP now handles natively:

```typescript
// The old way: agent scrapes your site
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('https://blog.codewithdan.com');

// Hope the search box is still called "search"
await page.fill('[placeholder="Search..."]', 'MCP tools');
await page.press('[placeholder="Search..."]', 'Enter');

// Hope the results are still in a ul.search-results
const results = await page.$$eval('ul.search-results li', items =>
  items.map(item => ({
    title: item.querySelector('h3')?.textContent,
    url: item.querySelector('a')?.href
  }))
);
```

Every selector in there is a future bug. Rename your CSS class, move the search bar, change the input placeholder — the agent breaks.

With WebMCP:

```typescript
// The new way: agent calls your declared tool
const tools = await navigator.modelContext.getTools('https://blog.codewithdan.com');
const result = await tools.search_docs({ query: 'MCP tools' });
// Returns clean structured JSON — no selectors involved
```

The contract is explicit. The agent knows what it's calling. You know what you're exposing.

## Try This Yourself

Here's the minimum viable setup to get WebMCP running on any page today:

1. **Enable the flag** in Chrome 146: `chrome://flags/#enable-webmcp`
2. **Add this to any page** to expose a single tool:

```html
<webmcp-tools>
  <webmcp-tool
    name="get_page_summary"
    description="Returns a structured summary of this page's content."
    action="/api/page-summary"
    method="GET">
  </webmcp-tool>
</webmcp-tools>
```

3. **Create the endpoint** at `/api/page-summary` that returns a JSON object with title, description, and key points.
4. **Test it** with `npx @webmcp/inspector http://localhost:3000`

That's a working WebMCP tool in under 10 minutes. Add parameters, add more tools, add auth. Build from there.

## Where This Is Heading

WebMCP is heading to W3C as an open standard, so Chrome isn't the end state. When (not if) Firefox and Safari ship it, agent-friendly websites become the expected baseline, not a Chrome experiment. The same shift we saw with Service Workers and Web Components is coming for agent tooling.

The early preview program is the right time to experiment. If you're building a developer tool, a docs site, or anything with a REST API under it, this is worth 30 minutes of your time.

The [Chrome developer blog post](https://developer.chrome.com/blog/webmcp-epp) has the full Early Preview Program details and signup link. The [WebMCP DEV Community guide](https://dev.to/czmilo/chrome-webmcp-the-complete-2026-guide-to-ai-agent-protocol-1ae9) covers additional edge cases worth reading.

Go make your site agent-friendly. 🛠️
