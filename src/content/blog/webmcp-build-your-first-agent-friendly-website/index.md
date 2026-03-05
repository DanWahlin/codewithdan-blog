---
title: "WebMCP: How to Make Your Website Agent-Friendly (With Real Code)"
date: 2026-02-26
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

Right now, when an AI agent needs to interact with your site, it has two bad options.

1. It can scrape the DOM and guess what everything means
2. It can use Playwright-style automation and click through your UI like a robot in a trench coat.

Both approaches are brittle. Change your button text from "Submit" to "Send" and your agent breaks.

WebMCP changes that. Instead of agents reverse-engineering your UI, *you* tell agents exactly what your site can do. You declare your tools. The agents use them. No scraping, no brittle selectors.

It's available in Chrome 146+ behind a flag as part of the Early Preview Program, and I've been playing with it. Here's what it looks like in practice.

## What WebMCP Actually Is

WebMCP is a proposed web standard (co-developed by Google and Microsoft under the [W3C Web Machine Learning Community Group](https://github.com/webmachinelearning/webmcp)) that lets websites expose structured **tools** directly to AI agents via the browser. MCP for the open web, basically, instead of desktop apps.

There are two APIs:

- **Declarative API** — you add `toolname` and `tooldescription` attributes to standard HTML forms. Minimal JavaScript. The browser reads your form markup and exposes the tools automatically.
- **Imperative API** — you register tools in JavaScript via `navigator.modelContext`. More flexible, better for things like auth flows and multi-step interactions.

Agents aren't guessing anymore. They're calling a named function with typed parameters.

Let me show you both.

## Before You Start

To use WebMCP today, you need Chrome 146+ (version 146.0.7672.0 or higher) with the Early Preview flag enabled. Pop this into your address bar:

```
chrome://flags
```

Search for **"WebMCP for testing"**, set it to **Enabled**, and restart. That's it. The `navigator.modelContext` API will now be available in JavaScript.

For testing your implementations, install the [Model Context Tool Inspector](https://chromewebstore.google.com/detail/model-context-tool-inspec/gbpdfapgefenggkahomfgkhfehlcenpd) Chrome Extension (built by Google). It lets you inspect any page to see what tools are exposed, visualize input schemas, and call tools manually. It's the equivalent of a DevTools panel for WebMCP.

## The Declarative API: Tools in HTML

The Declarative API is the low-JavaScript path. You add `toolname` and `tooldescription` attributes to a standard HTML `<form>`, and `toolparamdescription` attributes to your inputs. The browser turns your form into a tool that agents can call.

Here's a real example. Say you have a restaurant reservation page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reservations — Code With Dan Bistro</title>
</head>
<body>
  <h1>Table Reservations</h1>

  <form
    id="reservationForm"
    toolname="book_table"
    tooldescription="Creates a confirmed dining reservation. Accepts customer details, timing, and seating preferences."
    novalidate>

    <label for="name">Full Name</label>
    <input type="text" id="name" name="name"
      placeholder="e.g. Alexander Hamilton"
      required minlength="2"
      toolparamdescription="Customer's full name (min 2 chars)" />

    <label for="date">Date</label>
    <input type="date" id="date" name="date"
      required
      toolparamdescription="Reservation date (YYYY-MM-DD). Must be today or future." />

    <label for="guests">Guests</label>
    <select id="guests" name="guests" required
      toolparamdescription="Number of people dining. String value between '1' and '6'.">
      <option value="1">1 Person</option>
      <option value="2" selected>2 People</option>
      <option value="3">3 People</option>
      <option value="4">4 People</option>
    </select>

    <label for="seating">Seating Preference</label>
    <select id="seating" name="seating"
      toolparamdescription="Preferred seating area">
      <option value="Main Dining">Main Dining Room</option>
      <option value="Terrace">Terrace (Outdoor)</option>
      <option value="Private Booth">Private Booth</option>
    </select>

    <button type="submit">Request Reservation</button>
  </form>
</body>
</html>
```

When an agent is connected to the page, the browser reads those `toolname`, `tooldescription`, and `toolparamdescription` attributes and exposes a structured tool automatically. The agent sees a `book_table` tool with typed parameters derived from your form inputs. No DOM scraping needed.

Your form still works for human users exactly as before. The `toolname` attributes are invisible to regular browsers.

For handling the agent's tool call on the server side (or client side), you hook into the form's submit event. The event object gets an `agentInvoked` flag and a `respondWith()` method:

```javascript
form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Validate as usual
  const errors = validateForm();

  if (errors.length) {
    if (e.agentInvoked) {
      e.respondWith(errors); // Send validation errors back to the agent
    }
    return;
  }

  processReservation();

  if (e.agentInvoked) {
    e.respondWith({ status: 'confirmed', message: 'Reservation booked.' });
  }
});
```

## The Imperative API: Tools in JavaScript

The Declarative API covers form-based tools well. For anything more complex (authentication, streaming responses, multi-step workflows), you'll want the Imperative API.

Here's a search example done in JavaScript:

```javascript
// webmcp-init.js — load this on every page

function initWebMCP() {
  // Check if the API is available
  if (!navigator.modelContext) {
    console.log('WebMCP not available — running in standard browser mode');
    return;
  }

  // Register a search tool directly on navigator.modelContext
  navigator.modelContext.registerTool({
    name: 'search_docs',
    description: 'Search the documentation. Returns article titles, summaries, and URLs.',
    inputSchema: {
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
    execute: async ({ query, limit = 5 }) => {
      const response = await fetch(`/api/docs/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      return response.json();
    }
  });

  // Register a tool that needs auth — the execute callback has access to the user's session
  navigator.modelContext.registerTool({
    name: 'get_my_bookmarks',
    description: 'Get the current user\'s saved bookmarks. Requires the user to be logged in.',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    execute: async () => {
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

**The `execute` callback runs in the browser, with the user's session.** That means authenticated API calls work without passing tokens around. The agent can call `get_my_bookmarks` and your callback fires with `credentials: 'include'`, using whatever session cookies the user already has. If you've been wondering how to build agent features without reinventing your auth layer, this is it.

You're also not giving agents arbitrary DOM access. You're registering specific, typed functions with explicit callbacks. Want to rate-limit tool calls? Add it in the `execute` function. Want to audit tool usage? Log it. It's just JavaScript.

One more thing: `navigator.modelContext` is undefined in non-Chrome or unflagged browsers. Always check before calling anything. The `if (!navigator.modelContext)` guard means your page degrades gracefully for everyone else.

You can also unregister tools dynamically with `navigator.modelContext.unregisterTool('tool_name')`, which is useful for changing available tools based on page state or navigation.

## What Your API Endpoint Should Return

For both the Declarative and Imperative APIs, the tool response goes directly to the agent. Keep it structured and machine-readable:

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

Treat these responses like you'd treat any API: meaningful field names, consistent structure. The agent is going to parse this and reason about it, so skip the HTML.

## Testing What You Built

Once you've got tools registered, use the [Model Context Tool Inspector](https://chromewebstore.google.com/detail/model-context-tool-inspec/gbpdfapgefenggkahomfgkhfehlcenpd) Chrome Extension to verify everything works. Install it from the Chrome Web Store, then navigate to your page.

The Inspector panel shows up in DevTools. It lists every registered tool, shows you the schema, and lets you call them with test parameters. You can even invoke them via Gemini.

For automated testing, the [WebMCP Evals CLI](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/evals-cli) lets you define test cases and schemas to verify that an agent correctly calls your tools based on user inputs.

There's also a live demo you can try right now at [travel-demo.bandarra.me](https://travel-demo.bandarra.me/). Open it in Chrome 146+ with the flag enabled and the Inspector extension installed to see WebMCP tools in action.

## How This Compares to the Old Way

Is this approach better than the "old" way of getting data from a webpage? Here's a Playwright script doing what WebMCP now handles natively:

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

Every selector in there is a future bug. Rename your CSS class, move the search bar, change the input placeholder and the agent breaks.

With WebMCP, the agent doesn't touch the DOM at all. Your page registers a `search_docs` tool via `navigator.modelContext.registerTool()`, and the agent calls it through the browser. Clean structured JSON back, no selectors involved.

The contract is explicit. The agent knows what it's calling. You know what you're exposing.

## Try This Yourself

Here's the minimum viable setup to get WebMCP running on any page today:

1. **Enable the flag** in Chrome 146+: go to `chrome://flags`, search for "WebMCP for testing", enable it
2. **Add this to any page** to expose a single tool:

```html
<form toolname="get_page_summary"
  tooldescription="Returns a structured summary of this page's content.">
  <button type="submit">Get Summary</button>
</form>
```

3. **Add a submit handler** that calls your endpoint and responds to the agent via `e.respondWith()`.
4. **Test it** with the [Model Context Tool Inspector](https://chromewebstore.google.com/detail/model-context-tool-inspec/gbpdfapgefenggkahomfgkhfehlcenpd) extension

That's a working WebMCP tool in under 10 minutes. Add parameters, add more tools, add auth. Build from there.

## Where This Is Heading

WebMCP is a proposal under the W3C Web Machine Learning Community Group, and Google and Microsoft are both actively developing it. Chrome isn't the end state. When (not if) Edge, Firefox, and Safari pick it up, agent-friendly websites become the expected baseline, not a Chrome experiment. The same shift we saw with Service Workers and Web Components is coming for agent tooling.

The early preview program is the right time to experiment. If you're building a developer tool, a docs site, or anything with a REST API under it, this is worth 30 minutes of your time.

The [Chrome developer blog post](https://developer.chrome.com/blog/webmcp-epp) has the full Early Preview Program details and signup link. The [WebMCP DEV Community guide](https://dev.to/czmilo/chrome-webmcp-the-complete-2026-guide-to-ai-agent-protocol-1ae9) covers additional edge cases worth reading.

Go make your site agent-friendly.
