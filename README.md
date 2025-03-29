## @collective/client
A unified streaming interface for OpenAI and Anthropic clients.

> Lightweight. Pluggable. Protocol-agnostic.
---

### ✨ Features
- ✅ Unified stream() interface for OpenAI and Anthropic
- 🧩 Pluggable: inject your own instantiated client
- 🧵 Supports streaming content and tool_calls
- ⚙️  Designed for agent frameworks or multi-LLM orchestration
- 🪶 Zero dependencies (uses your own SDK clients)
---

### 📥 Installation
```bash
npm install @collective/client
```

### 🚀 Quick Start
```javascript
import { OpenAI } from 'openai'
import { createOpenAIClient } from '@collective/client'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const client = createOpenAIClient(openai)

for await (const chunk of client.stream({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello' }],
  tools: []
})) {
  console.log(chunk)
  // { content: "..." } or { tool_calls: [...] }
}
```

### 🧠 Design Philosophy
This package focuses purely on streaming abstraction:

- You control how to instantiate the SDK (openai, anthropic, bedrock, etc.)
- You receive a unified async iterator from client.stream(...)
- Output is always normalized: { content }, { tool_calls }, etc.

### 📄 License
MIT
