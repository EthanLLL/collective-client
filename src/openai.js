export function createOpenAIClient(client) {
  return {
    async *stream({ model, messages, tools = [], temperature = 0, max_tokens = 512 }) {
      const toolCallsBuffer = []
      const completion = await client.chat.completions.create({
        model,
        messages,
        tools,
        stream: true,
        temperature: temperature,
        max_tokens: max_tokens,
      })

      for await (const part of completion) {
        const delta = part.choices[0].delta
        const finishReason = part.choices[0].finish_reason

        if (delta.content) {
          yield { role: 'assistant', content: delta.content }
        }

        if (delta.tool_calls) {
          const { index } = delta.tool_calls[0]
          if (toolCallsBuffer[index] === undefined) {
            toolCallsBuffer[index] = delta.tool_calls[0]
          } else {
            toolCallsBuffer[index].function.arguments += delta.tool_calls[0].function.arguments
          }
        }

        if (finishReason === 'stop') break
      }
      if (toolCallsBuffer.length > 0) {
        yield { role: 'assistant', tool_calls: toolCallsBuffer }
      }
    }
  }
}
