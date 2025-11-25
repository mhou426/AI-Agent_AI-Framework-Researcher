# AI Framework Researcher ("CTO Briefing Agent")

[![Deno](https://img.shields.io/badge/Deno-v2.0-black?logo=deno)](https://deno.com/)
[![Zypher](https://img.shields.io/badge/CoreSpeed-Zypher-blue)](https://corespeed.io/)
[![Claude 3 Haiku](https://img.shields.io/badge/Model-Claude%203%20Haiku-orange)](https://www.anthropic.com/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)]()

An autonomous market research agent built with **CoreSpeed Zypher** and **Claude 3 Haiku**. It acts as an automated "CTO Briefing" tool—scouting the live web for emerging infrastructure trends and synthesizing them into executive summaries.
---

## System Architecture

To ensure compatibility between the **Zypher Framework** (which defaults to high-token models) and **Claude 3 Haiku** (which is faster but has strict limits), I engineered a custom **Network Layer Interceptor**.

**The Execution Flow:**
1.  **User** runs the agent locally via Deno.
2.  **Network Interceptor** catches the outgoing API request and rewrites the header from 8192 tokens to 4096 tokens (preventing `400 Bad Request` errors).
3.  **Claude 3 Haiku** receives the optimized request and reasons about the task.
4.  **Firecrawl MCP** is triggered to search the live web for "2025 AI Frameworks."
5.  **Agent** synthesizes the search results into a Markdown report.

---

## ⚡ Key Engineering Highlights

### 1. Network Level Interception
The Zypher framework defaults to an 8k token limit, which causes errors on the faster, cost-efficient **Claude 3 Haiku** model.
* **Solution:** I implemented a low-level `globalThis.fetch` override that intercepts the SDK's outgoing requests and patches the `max_tokens` header in real-time.
* **Benefit:** Enables the use of high-speed models without modifying the core framework source code.

### 2. Strict-Schema Tooling
Smaller models often struggle with complex JSON schemas, leading to `Validation Failed` errors.
* **Solution:** I implemented a **"Strict Mode"** system prompt that enforces a simplified query structure.
* **Benefit:** Eliminates hallucinated parameters (like `scrapeOptions`), ensuring 100% reliable tool execution.

### 3. Autonomous Discovery
The agent is not hardcoded with answers. It uses **Firecrawl** to browse the web in real-time, allowing it to discover release notes (e.g., "LangGraph 1.0") that did not exist during the model's training cut-off.

---

## 🛠️ Quick Start

### Prerequisites
* [Deno](https://deno.land/) installed.
* API Keys for **Anthropic** and **Firecrawl**.

### Installation
1. **Clone the repo**
   git clone [https://github.com/YOUR_USERNAME/AI-Framework-Researcher.git](https://github.com/YOUR_USERNAME/AI-Framework-Researcher.git)
   cd AI-Framework-Researcher

2. **Setup Secrets Create a .env file in the root directory:**
ANTHROPIC_API_KEY=sk-ant-...
FIRECRAWL_API_KEY=fc-...

3. **Run the Agent by running:** deno run -A main.ts

### Output
The agent will generate a file named 2025_AI_Trends.md containing a comparative analysis of:
* **Incumbents**: Microsoft AutoGen, LangChain
* **Challengers**: CoreSpeed Zypher
