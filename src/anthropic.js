// import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';
// import { HttpsProxyAgent } from 'https-proxy-agent';
//
//
// const client = new AnthropicBedrock({
//   awsRegion: 'us-west-2',
//   ...(process.env.HTTP_PROXY && { httpAgent: new HttpsProxyAgent(process.env.HTTP_PROXY) })
// });
//
export function createAnthropicClient(client) {
  return {
    async *stream({ model, messages }) {
      const stream = client.messages.stream({
        model,
        messages,
        max_tokens: 2048,
      })

      for await (const event of stream) {
        if (event.type === 'content_block_delta') {
          yield { role: 'assistant', content: event.delta.text }
        }
      }
    }
  }
}
