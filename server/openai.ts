import OpenAI from "openai";

// Using Replit's AI Integrations service (blueprint:javascript_openai_ai_integrations)
// This provides OpenAI-compatible API access without requiring your own API key
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

export interface MemoryForStory {
  displayName: string;
  note: string;
  photoUrl: string;
}

export async function generateMemoryStory(memories: MemoryForStory[]): Promise<{ title: string; content: string }> {
  const memoriesText = memories.map((m, idx) => 
    `Memory ${idx + 1} by ${m.displayName}: "${m.note}"`
  ).join('\n\n');

  const prompt = `You are a warm, empathetic storyteller who creates beautiful memory books from shared moments. You have been given a collection of photos and notes from a shared space called "YouSpace" where friends, family, or loved ones have contributed their memories.

Your task is to weave these individual moments into a cohesive, emotional, and beautifully written narrative - like a personal diary, travel journal, or storybook. The story should:

1. Feel warm, intimate, and heartfelt
2. Connect the different memories into a flowing narrative
3. Preserve the voices and perspectives of different contributors
4. Evoke emotion and nostalgia
5. Be written in a literary style with vivid descriptions
6. Be between 500-800 words

Here are the memories to transform into a story:

${memoriesText}

Create a beautiful memory book story with a captivating title. Format your response as JSON with two fields: "title" (a poetic, evocative title for the memory book) and "content" (the full story text with paragraph breaks using \\n\\n).`;

  // User requested gpt-4o-mini, so we'll use that instead of the latest model
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    max_tokens: 2000,
  });

  const result = JSON.parse(response.choices[0]?.message?.content || "{}");
  
  return {
    title: result.title || "Our Shared Memories",
    content: result.content || "A collection of beautiful moments shared together.",
  };
}
