// import OpenAI from 'openai'
// import { HttpsProxyAgent } from 'https-proxy-agent';
//
// export const openai = new OpenAI({
//   baseURL: process.env.OPENAI_BASE_URL,
//   apiKey: process.env.OPENAI_API_KEY,
//   // httpAgent: needProxy ? new HttpsProxyAgent('http://127.0.0.1:7890') : null,
//   // ...(process.env.HTTP_PROXY && { httpAgent: new HttpsProxyAgent(process.env.HTTP_PROXY) })
//   ...(process.env.HTTP_PROXY && { httpAgent: new HttpsProxyAgent(process.env.HTTP_PROXY) })
// });
export function createOpenAIClient(client) {
  return {
    async *stream({ model, messages, tools = [] }) {
      const completion = await client.chat.completions.create({
        model,
        messages,
        tools,
        stream: true,
        temperature: 0,
        max_tokens: 1024,
      })

      for await (const part of completion) {
        const delta = part.choices[0].delta
        const finishReason = part.choices[0].finish_reason

        if (delta.content) {
          yield { role: 'assistant', content: delta.content }
        }

        if (delta.tool_calls) {
          yield { role: 'assistant', tool_calls: delta.tool_calls }
        }

        if (finishReason === 'stop') break
      }
    }
  }
}
