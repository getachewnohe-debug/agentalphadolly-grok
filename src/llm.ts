import fetch from 'node-fetch';

export async function generateReply(prompt: string) {
  const provider = process.env.LLM_PROVIDER || 'openai';
  const key = process.env.LLM_API_KEY!;

  if (!key) return 'Thanks — I received your message and will follow up soon.';

  if (provider === 'openai') {
    const body = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a concise, friendly assistant for social media replies.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 256
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const js = await r.json();
    return js.choices?.[0]?.message?.content?.trim() ?? 'Thanks — I received your message.';
  }

  if (provider === 'grok') {
    // Placeholder: Adapt once Grok provides a stable HTTP API. Return a fallback for now.
    return 'Thanks — I received your message and will follow up soon.';
  }

  throw new Error('Unsupported LLM provider');
}
