import { 
  AnthropicModelProvider, 
  createZypherContext, 
  ZypherAgent 
} from "@corespeed/zypher";
import { eachValueFrom } from "rxjs-for-await";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

await load({ export: true });

//Network Interceptor, intercepts the HTTP request at the system level and patches the headers in real-time
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  if (typeof input === "string" && input.includes("anthropic.com") && init && init.body) {
    try {
      const body = JSON.parse(init.body as string);
      if (body.max_tokens && body.max_tokens > 4096) {
        body.max_tokens = 4096;
        init.body = JSON.stringify(body);
      }
    } catch (e) {}
  }
  return originalFetch(input, init);
};

//using claude haiku model due to API Key limit
async function main() {
  console.log("Initializing Agent...");

  const zypherContext = await createZypherContext(Deno.cwd());

  const agent = new ZypherAgent(
    zypherContext,
    new AnthropicModelProvider({
      apiKey: Deno.env.get("ANTHROPIC_API_KEY")!,
      model: "claude-3-haiku-20240307",
    }),
  );

  // Register Firecrawl
  await agent.mcp.registerServer({
    id: "web", 
    type: "command",
    command: {
      command: Deno.build.os === "windows" ? "npx.cmd" : "npx",
      args: ["-y", "firecrawl-mcp"],
      env: {
        FIRECRAWL_API_KEY: Deno.env.get("FIRECRAWL_API_KEY")!,
      },
    },
  });

  console.log("Agent ready.");

  // The Task for the Agent: 
  // Add strict "Tool Rules" to prevent the validation error
  const taskDescription = `
    You are a Tech Researcher.
    
    GOAL:
    Produce a "Competitive Landscape Report" on AI Agent Frameworks for late 2025.
    
    CRITICAL TOOL INSTRUCTIONS (Strict Mode):
    1. Use 'web_firecrawl_search'.
    2. ONLY pass the 'query' parameter.

    INSTRUCTIONS:
    1. **Identify Incumbents:** Search for "LangGraph 1.0 features" and "Microsoft AutoGen updates".
    2. **Identify Challengers:** Search specifically for "CoreSpeed Zypher framework features" and "Zypher vs LangChain".
    3. **Compare:** Select the top 3 frameworks (Ensure CoreSpeed Zypher is included as a 'New Challenger').
    4. **Report:** Synthesize a Markdown report comparing their key strengths.

    OUTPUT:
    Return ONLY the markdown content. Start with "# 2025 Agent Frameworks: Incumbents vs Challengers".
  `;

  const event$ = agent.runTask(taskDescription, "claude-3-haiku-20240307");

  let reportContent = "";

  try {
    for await (const event of eachValueFrom(event$)) {
      if (event.type === "text") {
        Deno.stdout.write(new TextEncoder().encode(event.content));
        reportContent += event.content;
      }
      if (event.type === "tool_call") {
        console.log(`\n[Action] Agent is calling tool: '${event.tool}'`);
      }
    }
  } catch (err) {
    console.error("\nError:", err);
  }

  // Only save if we actually got a report, check length
  if (reportContent.length > 100) {
    console.log("\n\nSaving report to '2025_AI_Trends.md'...");
    await Deno.writeTextFile("2025_AI_Trends.md", reportContent);
    console.log("Done. Check the file!");
  } else {
    console.log("\nReport generation incomplete (or tool failed).");
  }
}

if (import.meta.main) {
  main();
}