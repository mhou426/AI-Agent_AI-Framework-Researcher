# AI Framework Researcher ("CTO Briefing Agent")

[![Deno](https://img.shields.io/badge/Deno-v2.0-black?logo=deno)](https://deno.com/)
[![Zypher](https://img.shields.io/badge/CoreSpeed-Zypher-blue)](https://corespeed.io/)
[![Claude 3 Haiku](https://img.shields.io/badge/Model-Claude%203%20Haiku-orange)](https://www.anthropic.com/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)]()

An autonomous market research agent built with **CoreSpeed Zypher** and **Claude 3 Haiku**. It acts as an automated "CTO Briefing" tool—scouting the live web for emerging infrastructure trends and synthesizing them into executive summaries.
---

## System Architecture

The agent uses a **Strict-Schema Tooling** pattern to interface with the Firecrawl MCP. To ensure compatibility between the **Zypher Framework** (which defaults to high-token models) and **Claude 3 Haiku** (which is faster but has strict limits), I engineered a custom **Network Layer Interceptor**.

```mermaid
graph TD
    User[User] -->|Run main.ts| Agent[Zypher Agent]
    
    subgraph "Network Interceptor Layer"
        Agent -->|Request (8192 tokens)| Interceptor[Custom Fetch Patch]
        Interceptor -->|Rewritten Request (4096 tokens)| API[Anthropic API]
    end
    
    API -->|Reasoning| Claude[Claude 3 Haiku]
    Claude -->|MCP Protocol| Firecrawl[Firecrawl Search Tool]
    Firecrawl -->|Live Search| Web[Internet]
    Web -->|Real-Time Data| Firecrawl
    Firecrawl -->|Results| Agent
    Agent -->|Markdown Report| File[2025_AI_Trends.md]
