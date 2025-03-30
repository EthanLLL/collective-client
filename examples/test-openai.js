import OpenAI from 'openai'
import { createOpenAIClient } from '../src/index.js'
import { HttpsProxyAgent } from 'https-proxy-agent';

const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
  // httpAgent: needProxy ? new HttpsProxyAgent('http://127.0.0.1:7890') : null,
  ...(process.env.HTTP_PROXY && { httpAgent: new HttpsProxyAgent(process.env.HTTP_PROXY) })
});

const client = createOpenAIClient(openai)

for await (const chunk of client.stream({
  model: 'openai/gpt-4o-mini',
  // messages: [{ role: 'user', content: 'what is The age of Elon musk and Trump' }],
  messages: [{ role: 'user', content: 'Hi' }],
  tools: [{
    type: 'function',
    function: {
      name: 'webSearch',
      description: 'Use this tool to search all over the internet via Google search engine',
      strict: true,
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The summary of user query to keyword search from google in english.'
          },
        },
        required: ['query'],
        additionalProperties: false,
      },
    }
  }]
})) {
  console.log(chunk)
  // console.log(111)
  // { content: "..." } or { tool_calls: [...] }
}
