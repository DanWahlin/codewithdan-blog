---
title: "🚀 Leveling Up Your AI Agents: A Story-Driven Guide to MCP Tools, Resources, Prompts, and Logging"
date: 2025-07-21
categories: 
  - "ai"
tags: 
  - "agents"
  - "mcp"
  - "typescript"
coverImage: "mcp-capabilities-2.jpg"
---

[![](/images/blog/leveling-up-your-ai-agents-a-story-driven-guide-to-mcp-tools-resources-prompts-and-logging/mcp-capabilities-2-1024x683.webp)](https://blog.codewithdan.com/wp-content/uploads/2025/07/mcp-capabilities-2.jpg)

AI copilots are getting smarter. They can chat, reason, and even follow complex instructions. But if you want your AI to actually do something useful, like trigger a function, fetch some data, or keep a log of what happened, you need more than just prompts. You need structure and you need context. You need something like the **Model Context Protocol (MCP)**.

In this post, I’ll walk you through MCP’s four core capabilities (tools, resources, prompts, logging) using a fun story about _Contextia_, an AI copilot assisting Commander Alex on their ship. I put this together because when I first started with MCP, it wasn’t immediately obvious when to use tools versus resources, or how prompts and logging fit into the bigger picture.

If you’re working with [GitHub Copilot Agent Mode](https://code.visualstudio.com/blogs/2025/04/07/agentMode), another AI-powered assistant, or building your own agent architecture, this post will (hopefully) help clarify how and why you'd use each capability.

**_A Quick Sidebar on MCP_**

_MCP is mentioned frequently in AI conversations these days, but is it always necessary? As with any technology, it's important to choose the right tool for the right job. In some situations, a direct API call combined with insights from an LLM is enough and might be more efficient than using MCP. In other cases, MCP can be essential for exposing tools and data in a structured and secure way that enhances your AI systems. As with all technology, it's important to understand your use case, do your research, evaluate your options, and make an informed decision._ _Having said that, this post is all about MCP's core capabilities, so let's get back to it!_

## 🛠️ Tools: Executing Commands in the Engineering Bay

### Story: The Power Reactor Problem

Commander Alex is orbiting Planet Xylon when a red alert flashes. The ship’s power reactor is overheating.

“_Contextia_,” Alex says, “reroute power from the main thrusters to life support.”

Without hesitation, __Contextia__ calls the internal reroute function. Seconds later, the alert clears and oxygen levels stabilize.

Alex gives a thumbs-up. “Nice save.”

### Why This Matters

The `tools` capability lets your MCP server expose functions the model can call. These functions might send an email, deploy an app, query a database, or perform internal logic. It’s the agent’s way of saying, “Perform this action!”

_TypeScript Example_

```typescript

import { Server } from "@modelcontextprotocol/sdk/server";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema
} from "@modelcontextprotocol/sdk/types";

const server = new Server(
  { 
    name: "ship-control", 
    version: "1.0.0" 
  },
  { 
    capabilities: { 
      tools: {} 
    } 
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "reroute_power",
        description: "Reroutes ship power between systems",
        inputSchema: {
          type: "object",
          properties: {
            from: { type: "string", description: "Source system" },
            to: { type: "string", description: "Destination system" }
          },
          required: ["from", "to"]
        }
      },
      {
        name: "scan_system",
        description: "Scans a star system for threats",
        inputSchema: {
          type: "object",
          properties: {
            system_id: { type: "string", description: "System identifier" },
            scan_type: { 
              type: "string", 
              enum: ["basic", "deep", "tactical"],
              description: "Type of scan to perform"
            }
          },
          required: ["system_id"]
        }
      }
    ]
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case "reroute_power":
      const { from, to } = args as { from: string; to: string };
      // Simulate power rerouting logic
      const powerLevel = Math.floor(Math.random() * 100);
      return {
        content: [
          {
            type: "text",
            text: `Successfully rerouted ${powerLevel}% power from ${from} to ${to}. Systems stabilized.`
          }
        ]
      };

    case "scan_system":
      const { system_id, scan_type = "basic" } = args as { 
        system_id: string; 
        scan_type?: string; 
      };
      // Simulate system scan
      const threats = scan_type === "deep" ? 
        ["2 asteroid fields", "1 ion storm"] : 
        ["Clear navigation path"];
      return {
        content: [
          {
            type: "text",
            text: `${scan_type.toUpperCase()} scan of system ${system_id} complete. Detected: ${threats.join(", ")}`
          }
        ]
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});
```

## 📦 Resources: Pulling Data from the Ship’s Knowledge Bank

### Story: Navigating the Nebula

The crew spots a mysterious cloud formation ahead. Commander Alex squints at the main display.

“_Contextia_, have we seen this nebula before?”

_Contextia_ quickly searches the Galactic Survey Archive and finds a file labeled `nebula-273.json`. After reading the star chart data, _Contextia_ replies:

“It’s a Class B ionized gas cloud. Radiation levels are stable, and the density won’t affect navigation.”

Alex smiles. “Perfect. Let’s chart a course through it.”

A few moments later, another crew member chimes in. “Couldn’t we just run a tool to scan it instead?”

Alex shakes their head. “No need. The data already exists. We don’t need to scan. We just need the facts.”

### Why This Matters

MCP `resources` are all about providing context. These are files, URLs, or embedded data sources the model can referenc, but not change.

Unlike tools, which perform actions, resources provide read-only data. Use them when you want the model to _understand_ or _look something up_, rather than _do_ something.

This is great for exposing:

- JSON config files

- Markdown docs

- Vector embeddings

- Product catalogs

- Data in a database

- Read-only API data

- Anything the model should _see_, but not touch

_TypeScript Example_

```typescript
import { Server } from "@modelcontextprotocol/sdk/server";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from "@modelcontextprotocol/sdk/types";

const server = new Server(
  { 
    name: "galactic-mapper", 
    version: "1.0.0" 
  },
  { 
    capabilities: { 
      resources: {} 
    } 
  }
);

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "file:///data/nebula-273.json",
        name: "Nebula 273 Star Chart",
        description: "Detailed star chart data for nebula-273",
        mimeType: "application/json"
      },
      {
        uri: "file:///data/ship-status.log",
        name: "Ship Status Log",
        description: "Real-time ship systems status",
        mimeType: "text/plain"
      }
    ]
  };
});

// Read resource contents
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  switch (uri) {
    case "file:///data/nebula-273.json":
      try {
        const nebulaData = {
          id: "nebula-273",
          classification: "Class B ionized gas cloud",
          coordinates: { x: 2847, y: 1592, z: 394 },
          radiation_level: "stable",
          density: "low",
          navigation_safety: "safe",
          mineral_content: ["helium", "hydrogen", "trace lithium"],
          discovered: "2387.156"
        };
        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(nebulaData)
            }
          ]
        };
      } catch (error) {
        throw new Error(`Failed to read nebula data: ${error}`);
      }

    case "file:///data/ship-status.log":
      const logData = `
[2387.234] POWER: All systems nominal - 98% efficiency
[2387.234] LIFE_SUPPORT: Oxygen 21%, CO2 0.04% - OPTIMAL
[2387.235] NAVIGATION: Course locked to Nebula-273
[2387.235] SHIELDS: 100% - No threats detected
[2387.236] ENGINES: Warp core stable - Ready for jump
      `.trim();
      return {
        contents: [
          {
            uri,
            mimeType: "text/plain",
            text: logData
          }
        ]
      };

    default:
      throw new Error(`Resource not found: ${uri}`);
  }
});
```

## 📝 Prompts: Federation-Approved Communication Templates

### Story: Sending a Diplomatic Message

After landing on a peaceful planet, Alex wants to send a greeting to its leader, Chancellor Vira.

“_Contextia_, send a standard welcome message. Use our Federation protocol.”

_Contextia_ pulls up a communication template, fills in the planet and title fields, and generates a polished message that strikes the right tone. It gets transmitted moments later.

The Chancellor responds with gratitude and offers safe passage across their system.

### Why This Matters

MCP `prompts` allow you to predefine prompt templates that the AI can use in a structured way.

This keeps responses clean, on-brand, and reliable. This is especially useful if you're generating things like:

- Welcome emails

- Issue triage messages

- GitHub PR summaries

- Code review feedback

- Internal reports

It also reduces the risk of the model hallucinating random or off-brand messaging.

_TypeScript Example_

```typescript
import { Server } from "@modelcontextprotocol/sdk/server";
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema
} from "@modelcontextprotocol/sdk/types";

const PROMPTS = {
  "diplomatic-greeting": {
    name: "diplomatic-greeting",
    description: "Generate a formal diplomatic greeting message",
    arguments: [
      {
        name: "recipient_name",
        description: "Name of the diplomatic contact",
        required: true
      },
      {
        name: "planet_name", 
        description: "Name of the planet or system",
        required: true
      },
      {
        name: "purpose",
        description: "Purpose of the diplomatic contact",
        required: false
      }
    ]
  }
};

const server = new Server(
  { 
    name: "diplomatic-comms", 
    version: "1.0.0" 
  },
  { 
    capabilities: { 
      prompts: {} 
    } 
  }
);

// List available prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: Object.values(PROMPTS)
  };
});

// Get specific prompt with arguments
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const prompt = PROMPTS[name as keyof typeof PROMPTS];
  
  if (!prompt) {
    throw new Error(`Prompt not found: ${name}`);
  }

  if (name === "diplomatic-greeting") {
    const { recipient_name, planet_name, purpose } = args || {};
    
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Generate a formal diplomatic greeting message:

Recipient: ${recipient_name}
Planet/System: ${planet_name}
Purpose: ${purpose || "General diplomatic relations"}

The message should:
- Follow diplomatic protocols
- Be respectful and professional
- Establish peaceful intentions
- Offer appropriate cooperation

Please format as an official diplomatic transmission.`
          }
        }
      ]
    };
  }
  
  throw new Error(`Prompt implementation not found for: ${name}`);
});
```

## 📜 Logging: Keeping a Captain’s Log

### Story: Reviewing the Mission

Before ending their shift, Alex checks in with _Contextia_.

“Can you show me what we accomplished today?”

_Contextia_ opens the ship’s digital logbook and reads:

- 09:45 – Executed reroutePower()

- 11:30 – Read data from nebula-273.json

- 14:00 – Used diplomatic-greeting prompt to contact Chancellor Vira

- 16:20 – Logged mission status: 'Diplomatic contact successful'"

“Log it, sign it, and let’s get some rest,” Alex says.

### Why This Matters

MCP `logging` lets your agent (or MCP server) record what happened. It logs what tools were used, what files or other resources were accessed, and which prompts were triggered.

This is critical for:

- Debugging

- Auditing

- Replayability

- Traceability

You can log to the console, a file, a database, or any external telemetry service.

_TypeScript Example_

```typescript
import { Server } from "@modelcontextprotocol/sdk/server";
import { 
  ListToolsRequestSchema,
  CallToolRequestSchema 
} from "@modelcontextprotocol/sdk/types";

const server = new Server(
  { 
    name: "ship-captains-log", 
    version: "1.0.0" 
  },
  { 
    capabilities: { 
      tools: {},
      logging: {} // ✅ Must declare logging capability
    } 
  }
);

// Simple log helper
function log(level: string, logger: string, message: string) {
  server.sendLoggingMessage({
    level,
    logger,
    data: message
  });
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  log('debug', 'tools', 'Client requested tool list');
  
  return {
    tools: [
      {
        name: "log_mission_status",
        description: "Log the current mission status to the captain's log",
        inputSchema: {
          type: "object",
          properties: {
            status: { type: "string", description: "Mission status update" },
            location: { type: "string", description: "Current location" }
          },
          required: ["status"]
        }
      }
    ]
  };
});

// Handle tool execution with logging
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  log('info', 'tools', `Tool called: ${name}`);
  
  try {
    if (name === "log_mission_status") {
      const { status, location } = args as { status: string; location?: string };
      
      log('debug', 'tools', 'Processing mission status log');
      
      const timestamp = new Date().toISOString();
      const locationText = location ? ` at ${location}` : "";
      const logEntry = `[${timestamp}] MISSION STATUS${locationText}: ${status}`;
      
      log('info', 'mission', `Mission status logged: ${status}`);
      
      return { 
        content: [{ 
          type: "text", 
          text: `Mission status logged successfully:\n${logEntry}` 
        }] 
      };
    }
    
    throw new Error(`Unknown tool: ${name}`);
    
  } catch (error) {
    log('error', 'tools', `Tool failed: ${error.message}`);
    throw error;
  }
});
```

## Wrapping Up: Bringing Structure to Smart Agents

That’s it! Hopefully these simple stories and examples helped make MCP’s tools, resources, prompts, and logging a little more approachable. You’ve now seen how each capability plays a role in building intelligent, action-oriented agents that can leverage real-world context and control.

Let’s recap:

- Use **tools** when your AI needs to _perform_ an action.

- Use **resources** when your AI needs to _reference_ existing data.

- Use **prompts** to keep responses clean, consistent, and reusable.

- Use **logging** to capture what your MCP server does.

Together, these capabilities give your AI systems the structure they need to do real work in safe and predictable ways. Interested in learning more about MCP? Check out this free course:  
  
📖 [Model Context Protocol for Beginners](https://github.com/microsoft/mcp-for-beginners)

**Additional** **MCP Resources**

🔗 [Model Context Protocol Introduction](https://modelcontextprotocol.io/introduction)  
🛠️ [Using MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)  
🤖 [MCP Servers for VS Code agent mode](https://code.visualstudio.com/mcp)  
🦸 [Marvel MCP Server Walkthrough](https://blog.codewithdan.com/integrating-ai-with-external-apis-building-a-marvel-mcp-server/)  
  
Got questions? Reach out on [social](https://x.com/danwahlin)!
